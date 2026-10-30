import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { optionalAuth } from '../middleware/optionalAuth.js'
import { UserModel } from '../models/User.js'
import { SchemeModel } from '../models/Scheme.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'
import { aiFetch } from '../utils/aiClient.js'

export const copilotRouter = Router()

const copilotAskSchema = z.object({
  schemeSlug: z.string().min(1),
  question: z.string().min(1),
})

copilotRouter.post('/ask', optionalAuth, async (req, res, next) => {
  try {
    const data = copilotAskSchema.parse(req.body)

    let userProfile: any = null
    if (req.userId) {
      const user = await UserModel.findById(req.userId)
      userProfile = user?.profile || null
    }

    // 1. Try remote AI microservice
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1800)

      const aiResponse = await aiFetch(`/copilot/ask`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheme_slug: data.schemeSlug, question: data.question }),
      })

      clearTimeout(timeoutId)

      if (aiResponse.ok) {
        const result = await aiResponse.json()
        return res.status(200).json(result)
      }
    } catch {
      console.warn('AI microservice copilot/ask unavailable, executing local Gemini copilot fallback')
    }

    // 2. Local Gemini 3.8 Flash Fallback with full scheme database grounding
    const scheme = await SchemeModel.findOne({ slug: data.schemeSlug })
    if (!scheme) {
      throw new AppError(`Scheme not found: ${data.schemeSlug}`, 404)
    }

    const rulesStr = Array.isArray(scheme.eligibility_rules) && scheme.eligibility_rules.length > 0
      ? scheme.eligibility_rules.map((r: any) => `- ${r.field}: must be ${r.operator} ${r.value}`).join('\n')
      : 'Standard central guidelines apply'

    const docsStr = Array.isArray(scheme.documents_required) && scheme.documents_required.length > 0
      ? scheme.documents_required.map((d: any) => `- ${d.name || d} (${d.is_mandatory ? 'Mandatory' : 'Optional'})`).join('\n')
      : '- Aadhaar Card\n- Bank Account Details'

    const prompt = `You are the specialized Adhikar Scheme Copilot for "${scheme.name}".
You must answer the citizen's specific question strictly using the verified government scheme information below:

### Verified Scheme Metadata:
- Name: ${scheme.name}
- Department: ${scheme.department}
- Category: ${scheme.category}
- Jurisdiction: ${scheme.state || 'All-India Central Scheme'}
- Key Benefit: ${scheme.benefit}
- Official Portal: ${scheme.source_url || 'https://myscheme.gov.in'}
- Application Link: ${scheme.application_url || scheme.source_url || 'https://myscheme.gov.in'}
- Deadline: ${scheme.deadline || 'Ongoing / No immediate cutoff announced'}

### Stated Eligibility Criteria:
${rulesStr}

### Required Documents:
${docsStr}

### Overview & Description:
${scheme.description}

${userProfile ? `### Inquiring Citizen Context:
- State: ${userProfile.state || 'Not specified'}
- Age: ${userProfile.age || 'Not specified'}
- Income: ₹${userProfile.income || 'Not specified'}/year
- Occupation: ${userProfile.occupation || 'Not specified'}
` : ''}

Citizen's Question:
"${data.question}"

Instructions:
- Give a direct, step-by-step, actionable answer.
- Highlight specific numbers (amounts, age limits, income ceilings).
- If the question relates to eligibility, evaluate based on the criteria above.
- If asked how to apply, give step-by-step instructions and reference the official application portal.
- Respond in Hindi/Hinglish if asked in Hindi/Hinglish; otherwise in English. Use clear markdown.`

    let answer = ''

    if (env.geminiApiKey) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(env.geminiApiKey)
        let result
        try {
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
          result = await model.generateContent(prompt)
        } catch {
          const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
          result = await model.generateContent(prompt)
        }
        if (result?.response) {
          answer = result.response.text()
        }
      } catch (err: any) {
        console.warn('Copilot Gemini error:', err?.message)
      }
    }

    if (!answer) {
      const isHindi = /[\u0900-\u097F]|kisan|yojana|kaise|milega|chahiye|paisa|patrata|documents|kya|hai|batao/i.test(data.question)
      answer = isHindi
        ? `### ${scheme.name}\n\n**मुख्य लाभ:** ${scheme.benefit}\n\n**विवरण:** ${scheme.description}\n\n**पात्रता शर्तें:**\n${rulesStr}\n\n**आवश्यक दस्तावेज़:**\n${docsStr}\n\n🔗 **आधिकारिक पोर्टल:** [${scheme.source_url || 'https://myscheme.gov.in'}](${scheme.source_url || 'https://myscheme.gov.in'})`
        : `### ${scheme.name}\n\n**Key Benefit:** ${scheme.benefit}\n\n**Overview:** ${scheme.description}\n\n**Eligibility:**\n${rulesStr}\n\n**Documents Required:**\n${docsStr}\n\n🔗 **Official Portal:** [${scheme.source_url || 'https://myscheme.gov.in'}](${scheme.source_url || 'https://myscheme.gov.in'})`
    }

    res.status(200).json({
      answer,
      scheme_slug: scheme.slug,
      scheme_name: scheme.name,
      source_url: scheme.source_url || scheme.application_url,
    })
  } catch (err) {
    next(err)
  }
})

copilotRouter.get('/deadlines', requireAuth, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId)
    if (!user) throw new AppError('User not found', 404)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1800)

      const aiResponse = await aiFetch(`/copilot/deadlines`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(user.profile || {}),
      })

      clearTimeout(timeoutId)

      if (aiResponse.ok) {
        const result = await aiResponse.json()
        return res.status(200).json(result)
      }
    } catch {
      console.warn('AI microservice copilot/deadlines failed, falling back to database deadlines')
    }

    // Database deadline query fallback
    const upcomingSchemes = await SchemeModel.find({
      deadline: { $exists: true, $ne: '' },
    })
      .limit(6)
      .select('slug name category benefit deadline source_url')

    const deadlines = upcomingSchemes.map((s) => ({
      scheme_slug: s.slug,
      scheme_name: s.name,
      deadline: s.deadline,
      urgency: 'approaching',
      action: `Verify documents and submit on ${s.source_url || 'official portal'}`,
    }))

    res.status(200).json({ deadlines })
  } catch (err) {
    next(err)
  }
})
