import { Router } from 'express'
import { z } from 'zod'
import { UserModel } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'

export const profileRouter = Router()

profileRouter.use(requireAuth)

const profileSchema = z.object({
  age: z.number().int().min(0).max(120).optional(),
  state: z.string().trim().min(2).optional(),
  education: z.string().trim().min(2).optional(),
  income: z.number().min(0).optional(),
  occupation: z.string().trim().min(2).optional(),
})

profileRouter.get('/', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({ profile: user.profile ?? {} })
  } catch (err) {
    next(err)
  }
})

profileRouter.put('/', async (req, res, next) => {
  try {
    const updates = profileSchema.parse(req.body)

    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { $set: { profile: updates } },
      { new: true, runValidators: true },
    )

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({ profile: user.profile ?? {} })
  } catch (err) {
    next(err)
  }
})

profileRouter.delete('/', async (req, res, next) => {
  try {
    // DPDP Act - Right to erasure cascade delete
    const { NotificationModel } = await import('../models/Notification.js')
    const { DocumentModel } = await import('../models/Document.js')
    const { FamilyMemberModel } = await import('../models/FamilyMember.js')
    const { LifeEventModel } = await import('../models/LifeEvent.js')
    
    await NotificationModel.deleteMany({ userId: req.userId })
    await DocumentModel.deleteMany({ userId: req.userId })
    await FamilyMemberModel.deleteMany({ userId: req.userId })
    await LifeEventModel.deleteMany({ userId: req.userId })
    const user = await UserModel.findByIdAndDelete(req.userId)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({ message: 'Account deleted permanently' })
  } catch (err) {
    next(err)
  }
})
