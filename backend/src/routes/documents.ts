import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'

export const documentsRouter = Router()

documentsRouter.use(requireAuth)

// We receive max 10MB of base64 data. Express JSON limit needs to be increased for this.
// We will parse it in the request.
const uploadSchema = z.object({
  filename: z.string(),
  mimeType: z.string(),
  base64Data: z.string(),
})

documentsRouter.post('/extract', async (req, res, next) => {
  try {
    const data = uploadSchema.parse(req.body)

    const aiResponse = await fetch(`${env.aiServiceUrl}/documents/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: data.filename,
        mime_type: data.mimeType,
        base64_data: data.base64Data,
      }),
    })

    if (!aiResponse.ok) {
      const detail = await aiResponse.text().catch(() => '')
      throw new AppError(`Document extraction error: ${detail || aiResponse.statusText}`, 502)
    }

    const result = await aiResponse.json()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})
