import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { UserModel } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'
import { aiFetch } from '../utils/aiClient.js'

export const simulatorRouter = Router()

simulatorRouter.use(requireAuth)

const simulateSchema = z.object({
  hypotheticalIncome: z.number().optional(),
  hypotheticalAge: z.number().optional(),
  hypotheticalState: z.string().optional(),
})

simulatorRouter.post('/simulate', async (req, res, next) => {
  try {
    const data = simulateSchema.parse(req.body)

    const user = await UserModel.findById(req.userId)
    if (!user) throw new AppError('User not found', 404)

    const baseProfile = user.profile || {}
    
    // Create the hypothetical profile by overriding base profile values
    const hypotheticalProfile = {
      ...baseProfile,
      income: data.hypotheticalIncome !== undefined ? data.hypotheticalIncome : baseProfile.income,
      age: data.hypotheticalAge !== undefined ? data.hypotheticalAge : baseProfile.age,
      state: data.hypotheticalState !== undefined ? data.hypotheticalState : baseProfile.state,
    }

    const aiResponse = await aiFetch(`/simulator/simulate`, {
      method: 'POST',
      headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_profile: baseProfile,
        hypothetical_profile: hypotheticalProfile,
      }),
    })

    if (!aiResponse.ok) {
      const detail = await aiResponse.text().catch(() => '')
      throw new AppError(`Simulator error: ${detail || aiResponse.statusText}`, 502)
    }

    const result = await aiResponse.json()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})
