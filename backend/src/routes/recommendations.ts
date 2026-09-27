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

    try {
      const aiResponse = await aiFetch(`/recommendations`, {
        method: 'POST',
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

      if (aiResponse.ok) {
        const data = await aiResponse.json()
        return res.status(200).json(data)
      }
    } catch (err) {
      console.warn("AI recommendations service failed, falling back to heuristic DB query")
    }

    // Heuristic Fallback using Mongoose
    const filter: any = {}
    if (user.profile?.state) {
      filter.$or = [{ state: user.profile.state }, { level: 'Central' }]
    }
    
    // Very basic keyword matching for occupation/education
    const keywords = [user.profile?.occupation, user.profile?.education].filter(Boolean)
    if (keywords.length > 0) {
      filter.$or = filter.$or || []
      keywords.forEach(kw => {
        filter.$or.push({ category: new RegExp(kw as string, 'i') })
        filter.$or.push({ description: new RegExp(kw as string, 'i') })
      })
    }

    const schemes = await SchemeModel.find(filter)
      .limit(6)
      .lean()

    // Format like AI service
    const recommendations = schemes.map(s => ({
      slug: s.slug,
      name: s.name,
      match_score: 85, // Fake score for fallback
      reason: "Based on your state and profile details.",
      benefit: s.benefit
    }))

    res.status(200).json({ recommendations })
  } catch (err) {
    next(err)
  }
})
