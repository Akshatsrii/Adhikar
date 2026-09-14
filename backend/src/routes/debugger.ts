import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { UserModel } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'

export const debuggerRouter = Router()

debuggerRouter.use(requireAuth)

const debugSchema = z.object({
  schemeSlug: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  base64Data: z.string(),
})

debuggerRouter.post('/debug', async (req, res, next) => {
  try {
    const data = debugSchema.parse(req.body)

    const user = await UserModel.findById(req.userId)
    if (!user) throw new AppError('User not found', 404)

    const aiResponse = await fetch(`${env.aiServiceUrl}/debugger/debug`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheme_slug: data.schemeSlug,
        profile: user.profile || {},
        filename: data.filename,
        mime_type: data.mimeType,
        base64_data: data.base64Data,
      }),
    })

    if (!aiResponse.ok) {
      const detail = await aiResponse.text().catch(() => '')
      throw new AppError(`Debugger error: ${detail || aiResponse.statusText}`, 502)
    }

    const result = await aiResponse.json()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})
