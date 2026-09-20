import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { UserModel } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { isFuzzyMatch } from '../utils/fuzzyMatch.js'

export const applicationsRouter = Router()

applicationsRouter.use(requireAuth)

const validateSchema = z.object({
  schemeId: z.string(),
  nameOnApplication: z.string().min(1),
  dobOnApplication: z.string().optional(),
})

applicationsRouter.post('/validate', async (req, res, next) => {
  try {
    const data = validateSchema.parse(req.body)
    
    const user = await UserModel.findById(req.userId)
    if (!user) throw new AppError('User not found', 404)

    const warnings: string[] = []

    // 1. Name Match (Fuzzy)
    // Check against the user's official name stored in profile
    const officialName = user.name
    if (!isFuzzyMatch(officialName, data.nameOnApplication)) {
      warnings.push(`Name mismatch detected: Application has "${data.nameOnApplication}" but your profile says "${officialName}". This can cause DBT (Direct Benefit Transfer) failures.`)
    }

    // 2. DOB Match (Exact)
    // Assuming dob might be saved in user.profile. If not available, we can't check.
    const officialDob = (user.profile as any)?.dob
    if (officialDob && data.dobOnApplication && data.dobOnApplication !== officialDob) {
      warnings.push(`DOB mismatch: Application has ${data.dobOnApplication}, but official records indicate ${officialDob}. Applications are often rejected for this.`)
    }

    res.status(200).json({
      isValid: warnings.length === 0,
      warnings
    })
  } catch (err) {
    next(err)
  }
})
