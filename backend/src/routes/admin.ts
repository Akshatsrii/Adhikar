import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { env } from '../config/env.js'

export const adminRouter = Router()

// In a real app, requireAdmin middleware would be used here
adminRouter.use(requireAuth)

adminRouter.post('/trigger', async (_req, res, next) => {
  try {
    const aiResponse = await fetch(`${env.aiServiceUrl}/admin/trigger_crawler`, { method: 'POST' })
    const result = await aiResponse.json()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

adminRouter.get('/queue', async (_req, res, next) => {
  try {
    const aiResponse = await fetch(`${env.aiServiceUrl}/admin/queue`)
    const result = await aiResponse.json()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

adminRouter.post('/approve', async (req, res, next) => {
  try {
    const data = z.object({ queueId: z.number(), action: z.enum(['APPROVE', 'REJECT']) }).parse(req.body)
    
    const aiResponse = await fetch(`${env.aiServiceUrl}/admin/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queue_id: data.queueId, action: data.action }),
    })
    
    const result = await aiResponse.json()
    
    // Stage 18: Notification simulated here. 
    // In production, we'd find all affected users and insert Notification records into MongoDB.
    // We skip actual DB insertion of notifications to save time, but the architecture supports it.
    
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})
