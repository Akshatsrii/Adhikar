import { Router } from 'express'
import { UserModel } from '../models/User.js'
import { SchemeModel } from '../models/Scheme.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'
import { aiFetch } from '../utils/aiClient.js'

export const recommendationsRouter = Router()

recommendationsRouter.use(requireAuth)

recommendationsRouter.get('/', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    // 1. Try remote AI microservice
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1800)

      const aiResponse = await aiFetch(`/recommendations`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            age: user.profile?.age,
            state: user.profile?.state,
            education: user.profile?.education,
            income: user.profile?.income,
            occupation: user.profile?.occupation,
          },
        }),
      })

      clearTimeout(timeoutId)

      if (aiResponse.ok) {
        const data = await aiResponse.json()
        return res.status(200).json(data)
      }
    } catch {
      console.warn('AI recommendations service failed, falling back to deterministic profile matching')
    }

    // 2. Intelligent Deterministic Matching Fallback
    const profile = user.profile || {}
    const schemes = await SchemeModel.find({}).limit(50).lean()

    const scoredSchemes = schemes.map((s) => {
      let score = 50
      const reasons: string[] = []

      // State matching
      if (s.state && profile.state) {
        if (s.state.toLowerCase() === profile.state.toLowerCase()) {
          score += 25
          reasons.push(`Tailored for residents of ${s.state}`)
        } else if (s.level?.toLowerCase() !== 'central') {
          score -= 30 // Other state scheme
        }
      } else if (s.level?.toLowerCase() === 'central') {
        score += 15
        reasons.push('Nationwide Central Government scheme')
      }

      // Occupation alignment
      if (profile.occupation) {
        const occLower = profile.occupation.toLowerCase()
        const descLower = (s.description || '').toLowerCase()
        const catLower = (s.category || '').toLowerCase()

        if (catLower.includes(occLower) || descLower.includes(occLower)) {
          score += 20
          reasons.push(`Directly benefits ${profile.occupation} households`)
        }
      }

      // Income limit check
      if (profile.income && Array.isArray(s.eligibility_rules)) {
        const incomeRule = s.eligibility_rules.find((r: any) => r.field === 'income')
        if (incomeRule) {
          const limitVal = parseFloat(incomeRule.value)
          if (!isNaN(limitVal)) {
            if (profile.income <= limitVal) {
              score += 15
              reasons.push(`Income under ceiling limit of ₹${limitVal.toLocaleString('en-IN')}`)
            } else {
              score -= 40
            }
          }
        }
      }

      // Final bounded score
      const finalScore = Math.min(Math.max(score, 45), 98)
      const primaryReason = reasons.length > 0
        ? reasons.join('. ') + '.'
        : 'Aligns with your citizen profile and household demographic.'

      return {
        slug: s.slug,
        name: s.name,
        category: s.category,
        benefit: s.benefit,
        match_score: finalScore,
        reason: primaryReason,
      }
    })

    // Sort by highest score
    scoredSchemes.sort((a, b) => b.match_score - a.match_score)

    res.status(200).json({ recommendations: scoredSchemes.slice(0, 6) })
  } catch (err) {
    next(err)
  }
})
