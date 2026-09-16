import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { UserModel } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'
import { aiFetch } from '../utils/aiClient.js'

export const copilotRouter = Router()

copilotRouter.use(requireAuth)

copilotRouter.post('/ask', async (req, res, next) => {
  try {
    const data = z.object({ schemeSlug: z.string(), question: z.string() }).parse(req.body)
    const aiResponse = await aiFetch(`/copilot/ask`, {
      method: 'POST',
      headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheme_slug: data.schemeSlug, question: data.question }),
    })
    if (!aiResponse.ok) throw new AppError('Copilot failed', 502)
    const result = await aiResponse.json()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

copilotRouter.get('/deadlines', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId)
    if (!user) throw new AppError('User not found', 404)

    const aiResponse = await aiFetch(`/copilot/deadlines`, {
      method: 'POST',
      headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(user.profile || {}),
    })
    if (!aiResponse.ok) throw new AppError('Deadlines check failed', 502)
    const result = await aiResponse.json()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})
