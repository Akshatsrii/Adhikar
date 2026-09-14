import { Router } from 'express'
import { z } from 'zod'
import { UserModel } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'

export const aiRouter = Router()

aiRouter.use(requireAuth)

const askSchema = z.object({
  query: z.string().trim().min(3, 'Ask a more specific question'),
  topK: z.number().int().min(1).max(10).optional(),
})

aiRouter.post('/ask', async (req, res, next) => {
  try {
    const { query, topK } = askSchema.parse(req.body)

    const user = await UserModel.findById(req.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    const aiResponse = await fetch(`${env.aiServiceUrl}/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    if (!aiResponse.ok) {
      const detail = await aiResponse.text().catch(() => '')
      throw new AppError(`AI service error: ${detail || aiResponse.statusText}`, 502)
    }

    const data = await aiResponse.json()
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})
