import { Router } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import { GrievanceModel } from '../models/Grievance.js'
import { verifyToken } from '../utils/tokens.js'

export const grievancesRouter = Router()

// Helper to extract optional auth user
function getOptionalUserId(req: any): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    const token = authHeader.slice(7)
    const payload = verifyToken(token)
    return payload.userId
  } catch {
    return null
  }
}

const createSchema = z.object({
  subject: z.string().min(3),
  description: z.string().min(5),
  category: z.enum(['Scheme Application', 'Portal Issue', 'Document Verification', 'Other']).default('Other'),
})

// List grievances for user or public lookup
grievancesRouter.get('/', async (req, res, next) => {
  try {
    const userId = getOptionalUserId(req)
    const ref = typeof req.query.ref === 'string' ? req.query.ref.trim() : null

    if (ref) {
      const item = await GrievanceModel.findOne({ referenceNumber: ref })
      return res.json({ items: item ? [item] : [] })
    }

    if (!userId) {
      return res.json({ items: [] })
    }

    const items = await GrievanceModel.find({ user: userId }).sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

// Create grievance
grievancesRouter.post('/', async (req, res, next) => {
  try {
    const userId = getOptionalUserId(req)
    const data = createSchema.parse(req.body)

    const objectId = new mongoose.Types.ObjectId()
    const referenceNumber = `CPGRAM-${new Date().getFullYear()}-${objectId.toString().slice(-6).toUpperCase()}`

    const grievance = await GrievanceModel.create({
      _id: objectId,
      user: userId || undefined,
      referenceNumber,
      subject: data.subject,
      description: data.description,
      category: data.category,
      status: 'Open',
    })

    res.status(201).json(grievance)
  } catch (err) {
    next(err)
  }
})
