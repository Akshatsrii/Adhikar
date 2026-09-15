import { Router } from 'express'
import multer from 'multer'
import { z } from 'zod'
import { DocumentModel } from '../models/Document.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'

export const documentsRouter = Router()

documentsRouter.use(requireAuth)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB, mirrors the AI service's limit
})

const extractionSchema = z.object({
  document_type: z.string(),
  full_name: z.string().nullable(),
  issue_date: z.string().nullable(),
  income_amount: z.number().nullable(),
  id_number: z.string().nullable(),
  issuing_authority: z.string().nullable(),
  is_expired: z.boolean().nullable(),
  ocr_text_preview: z.string(),
})

documentsRouter.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 422)
    }

    const form = new FormData()
    form.append(
      'file',
      new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype }),
      req.file.originalname,
    )

    const aiResponse = await fetch(`${env.aiServiceUrl}/documents/extract`, {
      method: 'POST',
      body: form,
    })

    if (!aiResponse.ok) {
      const detail = await aiResponse.text().catch(() => '')
      throw new AppError(`Document extraction failed: ${detail || aiResponse.statusText}`, 422)
    }

    const extracted = extractionSchema.parse(await aiResponse.json())

    const document = await DocumentModel.create({
      userId: req.userId,
      originalFilename: req.file.originalname,
      documentType: extracted.document_type,
      fullName: extracted.full_name,
      issueDate: extracted.issue_date,
      incomeAmount: extracted.income_amount,
      idNumber: extracted.id_number,
      issuingAuthority: extracted.issuing_authority,
      isExpired: extracted.is_expired,
      ocrTextPreview: extracted.ocr_text_preview,
    })

    res.status(201).json({ document })
  } catch (err) {
    next(err)
  }
})

documentsRouter.get('/', async (req, res, next) => {
  try {
    const documents = await DocumentModel.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.status(200).json({ documents })
  } catch (err) {
    next(err)
  }
})

documentsRouter.delete('/:id', async (req, res, next) => {
  try {
    const document = await DocumentModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!document) {
      throw new AppError('Document not found', 404)
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})
