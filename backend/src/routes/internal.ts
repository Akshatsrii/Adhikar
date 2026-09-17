import { Router } from 'express'
import { UserModel } from '../models/User.js'
import { requireInternalKey } from '../middleware/requireInternalKey.js'

export const internalRouter = Router()

internalRouter.use(requireInternalKey)

internalRouter.get('/profiles', async (_req, res, next) => {
  try {
    // Stage 15 impact analysis requires dumping all citizen profiles to evaluate
    // them against the new rules. This endpoint is strictly internal.
    // In a real multi-million user system, this would be a paginated stream or
    // map-reduce job, but for Adhikar we return the array directly.
    const users = await UserModel.find({ role: 'citizen' }).select('profile')
    
    // Convert to array of { user_id: string, profile: Record<string, any> }
    const profiles = users.map(u => ({
      user_id: u._id.toString(),
      profile: u.profile,
    }))

    res.status(200).json(profiles)
  } catch (err) {
    next(err)
  }
})
