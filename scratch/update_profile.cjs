const fs = require('fs');
let code = fs.readFileSync('backend/src/routes/profile.ts', 'utf-8');

const newRoute = `
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
`;

code = code.replace(/profileRouter.delete/, newRoute + '\nprofileRouter.delete');
fs.writeFileSync('backend/src/routes/profile.ts', code);
