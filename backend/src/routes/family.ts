import { Router } from 'express'
import { z } from 'zod'
import { FamilyMemberModel } from '../models/FamilyMember.js'
import { UserModel } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'

export const familyRouter = Router()

familyRouter.use(requireAuth)

const profileSchema = z.object({
  age: z.number().int().min(0).max(120).optional(),
  state: z.string().trim().min(2).optional(),
  education: z.string().trim().min(2).optional(),
  income: z.number().min(0).optional(),
  occupation: z.string().trim().min(2).optional(),
})

const memberSchema = z.object({
  name: z.string().trim().min(2),
  relation: z.enum(['spouse', 'child', 'parent', 'sibling', 'other']),
  profile: profileSchema.optional(),
})

familyRouter.get('/', async (req, res, next) => {
  try {
    const members = await FamilyMemberModel.find({ userId: req.userId }).sort({ createdAt: 1 })
    res.status(200).json({ members })
  } catch (err) {
    next(err)
  }
})

familyRouter.post('/', async (req, res, next) => {
  try {
    const data = memberSchema.parse(req.body)
    const member = await FamilyMemberModel.create({ ...data, userId: req.userId })
    res.status(201).json({ member })
  } catch (err) {
    next(err)
  }
})

familyRouter.put('/:id', async (req, res, next) => {
  try {
    const data = memberSchema.partial().parse(req.body)

    const member = await FamilyMemberModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: data },
      { new: true, runValidators: true },
    )

    if (!member) {
      throw new AppError('Family member not found', 404)
    }

    res.status(200).json({ member })
  } catch (err) {
    next(err)
  }
})

familyRouter.delete('/:id', async (req, res, next) => {
  try {
    const member = await FamilyMemberModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!member) {
      throw new AppError('Family member not found', 404)
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

familyRouter.post('/optimize', async (req, res, next) => {
  try {
    const [user, familyMembers] = await Promise.all([
      UserModel.findById(req.userId),
      FamilyMemberModel.find({ userId: req.userId }),
    ])

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const members = [
      {
        member_id: 'self',
        name: user.name,
        profile: {
          age: user.profile?.age,
          state: user.profile?.state,
          education: user.profile?.education,
          income: user.profile?.income,
          occupation: user.profile?.occupation,
        },
      },
      ...familyMembers.map((m) => ({
        member_id: String(m._id),
        name: m.name,
        profile: {
          age: m.profile?.age,
          state: m.profile?.state,
          education: m.profile?.education,
          income: m.profile?.income,
          occupation: m.profile?.occupation,
        },
      })),
    ]

    const aiResponse = await fetch(`${env.aiServiceUrl}/family/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members }),
    })

    if (!aiResponse.ok) {
      const detail = await aiResponse.text().catch(() => '')
      throw new AppError(`Family optimizer error: ${detail || aiResponse.statusText}`, 502)
    }

    const data = await aiResponse.json()
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})
