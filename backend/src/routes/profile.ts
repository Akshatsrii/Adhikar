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


const accountSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional().or(z.literal('')),
  phone: z.string().trim().regex(/^[0-9]{10}$/).optional().or(z.literal('')),
})

profileRouter.put('/account', async (req, res, next) => {
  try {
    const updates = accountSchema.parse(req.body)
    
    // Check uniqueness if email/phone provided
    if (updates.email) {
      const existing = await UserModel.findOne({ email: updates.email, _id: { $ne: req.userId } })
      if (existing) throw new AppError('Email already in use', 409)
    }
    if (updates.phone) {
      const existing = await UserModel.findOne({ phone: updates.phone, _id: { $ne: req.userId } })
      if (existing) throw new AppError('Phone number already in use', 409)
    }

    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { $set: { 
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.email !== undefined ? { email: updates.email || undefined } : {}),
        ...(updates.phone !== undefined ? { phone: updates.phone || undefined } : {})
      }},
      { new: true, runValidators: true }
    )

    if (!user) throw new AppError('User not found', 404)
    
    res.status(200).json({ 
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile: user.profile
    })
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
