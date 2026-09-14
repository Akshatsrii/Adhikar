import { Router } from 'express'
import { UserModel } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'

export const recommendationsRouter = Router()

recommendationsRouter.use(requireAuth)

recommendationsRouter.get('/', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    const aiResponse = await fetch(`${env.aiServiceUrl}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    if (!aiResponse.ok) {
      const detail = await aiResponse.text().catch(() => '')
      throw new AppError(`Recommendations service error: ${detail || aiResponse.statusText}`, 502)
    }

    const data = await aiResponse.json()
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})
