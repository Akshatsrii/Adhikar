import { Router } from 'express'
import { z } from 'zod'
import { UserModel } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'
import { aiFetch } from '../utils/aiClient.js'

export const aiRouter = Router()

aiRouter.use(requireAuth)

const askSchema = z.object({
  query: z.string().trim().min(1, 'Please enter a message'),
  topK: z.number().int().min(1).max(10).optional(),
})

aiRouter.post('/ask', async (req, res, next) => {
  try {
    const { query, topK } = askSchema.parse(req.body)

    const user = await UserModel.findById(req.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    let data: { answer: string; sources: any[] } | null = null

    // 1. Try remote AI microservice with timeout & safety catch
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 6000) // 6s timeout

      const aiResponse = await aiFetch(`/ai/ask`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          top_k: topK ?? 5,
          profile: user.profile
            ? {
                state: user.profile.state,
                age: user.profile.age,
                income: user.profile.income,
                occupation: user.profile.occupation,
                education: user.profile.education,
              }
            : null,
        }),
      })

      clearTimeout(timeoutId)

      if (aiResponse.ok) {
        data = (await aiResponse.json()) as { answer: string; sources: any[] }
      } else {
        console.warn(`AI Service returned status ${aiResponse.status}, triggering Gemini fallback`)
      }
    } catch (fetchErr) {
      console.warn('AI Service network error or timeout, triggering Gemini fallback:', fetchErr)
    }

    // 2. Direct Gemini Fallback if Python service is down or slow
    if (!data) {
      console.log('Using direct Gemini 3.8 Flash copilot fallback...')
      if (!env.geminiApiKey) {
        throw new AppError('AI service offline and no fallback Gemini Key found', 502)
      }

      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(env.geminiApiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' })

      const prompt = `You are Adhikar AI, an expert, warm, and highly knowledgeable welfare scheme copilot for Indian citizens.
User profile context: ${JSON.stringify(user.profile || {})}
User message/question: ${query}

Guidelines:
- If the user sends a greeting (like "Hi", "Hello", "Namaste"), greet them warmly and offer to help find schemes (scholarships, pensions, housing, healthcare like PM-KISAN, Ayushman Bharat).
- Answer questions clearly using markdown.
- Mention eligibility criteria and benefits accurately.`

      const result = await model.generateContent(prompt)
      data = {
        answer: result.response.text(),
        sources: [],
      }
    }

    res.status(200).json(data)
  } catch (err) {
    console.error('AI Route Error:', err)
    next(err)
  }
})
