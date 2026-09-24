import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { GrievanceModel } from '../models/Grievance.js'

export const grievancesRouter = Router()

grievancesRouter.use(requireAuth)

const createSchema = z.object({
  subject: z.string().min(5),
  description: z.string().min(10),
  category: z.enum(['Scheme Application', 'Portal Issue', 'Document Verification', 'Other']),
})

// List grievances
grievancesRouter.get('/', async (req, res, next) => {
  try {
    const items = await GrievanceModel.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

// Create grievance
grievancesRouter.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)
    const grievance = await GrievanceModel.create({
      user: req.userId,
      ...data,
      status: 'Open'
    })
    res.status(201).json(grievance)
  } catch (err) {
    next(err)
  }
})
