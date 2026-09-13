import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { z } from 'zod'
import { UserModel } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { signToken } from '../utils/tokens.js'

export const authRouter = Router()

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

function toPublicUser(user: {
  _id: unknown
  name: string
  email: string
  profile?: unknown
}) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    profile: user.profile,
  }
}

authRouter.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)

    const existing = await UserModel.findOne({ email })
    if (existing) {
      throw new AppError('An account with this email already exists', 409)
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await UserModel.create({ name, email, passwordHash })

    const token = signToken({ userId: user.id })
    res.status(201).json({ token, user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await UserModel.findOne({ email }).select('+passwordHash')
    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      throw new AppError('Invalid email or password', 401)
    }

    const token = signToken({ userId: user.id })
    res.status(200).json({ token, user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
})

authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({ user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
})
