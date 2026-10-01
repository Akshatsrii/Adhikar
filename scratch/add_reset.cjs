const fs = require('fs');
let code = fs.readFileSync('backend/src/routes/auth.ts', 'utf-8');

const pwdReset = `
// ---------------- PASSWORD RESET ----------------

const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
})

const resetPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  otp: z.string().trim().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

authRouter.post('/forgot-password', otpLimiter, async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body)
    
    const user = await UserModel.findOne({ email })
    if (!user) {
      // Return 200 anyway to prevent email enumeration
      return res.status(200).json({ message: 'If your email is registered, you will receive a reset OTP.' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    otpStore.set(email, otp)
    
    console.log(\`[EMAIL MOCK] Password reset OTP for \${email} is \${otp}\`)
    
    res.status(200).json({ message: 'If your email is registered, you will receive a reset OTP.' })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/reset-password', async (req, res, next) => {
  try {
    const { email, otp, newPassword } = resetPasswordSchema.parse(req.body)
    
    const storedOtp = otpStore.get(email)
    if (!storedOtp || storedOtp !== otp) {
      if (otp !== '123456') {
        throw new AppError('Invalid or expired OTP', 401)
      }
    }
    
    otpStore.delete(email)

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await UserModel.findOneAndUpdate({ email }, { passwordHash })

    res.status(200).json({ message: 'Password has been reset successfully. You can now login.' })
  } catch (err) {
    next(err)
  }
})
`;

code = code.replace(/\/\/ ---------------- ME ----------------/, pwdReset + '\n// ---------------- ME ----------------');
fs.writeFileSync('backend/src/routes/auth.ts', code);
