import { Router } from 'express'
import { z } from 'zod'
import { LifeEventModel } from '../models/LifeEvent.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'

export const lifeEventsRouter = Router()

lifeEventsRouter.use(requireAuth)

const classifySchema = z.object({
  text: z.string().trim().min(3, 'Tell us a bit more about what happened'),
})

const EVENT_TYPES = [
  'MARRIAGE',
  'CHILDBIRTH',
  'GRADUATION',
  'JOB_LOSS',
  'NEW_JOB',
  'RETIREMENT',
  'RELOCATION',
  'UNKNOWN',
] as const

const classificationSchema = z.object({
  event_type: z.enum(EVENT_TYPES),
  confidence: z.number(),
  suggested_categories: z.array(z.string()),
})

lifeEventsRouter.post('/', async (req, res, next) => {
  try {
    const { text } = classifySchema.parse(req.body)

    const aiResponse = await fetch(`${env.aiServiceUrl}/life-events/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!aiResponse.ok) {
      const detail = await aiResponse.text().catch(() => '')
      throw new AppError(`Life event classifier error: ${detail || aiResponse.statusText}`, 502)
    }

    const classification = classificationSchema.parse(await aiResponse.json())

    const event = await LifeEventModel.create({
      userId: req.userId,
      rawText: text,
      eventType: classification.event_type,
      confidence: classification.confidence,
      suggestedCategories: classification.suggested_categories,
    })

    res.status(201).json({ event })
  } catch (err) {
    next(err)
  }
})

lifeEventsRouter.get('/', async (req, res, next) => {
  try {
    const events = await LifeEventModel.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.status(200).json({ events })
  } catch (err) {
    next(err)
  }
})
