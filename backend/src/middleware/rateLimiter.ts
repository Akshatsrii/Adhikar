import rateLimit from 'express-rate-limit'

// Strict rate limit for authentication endpoints to prevent brute-force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per window
  message: { message: 'Too many authentication attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limit for AI endpoints to protect Gemini API quota
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 AI requests per minute
  message: { message: 'Too many requests to AI services, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Strict rate limit for OTP generation to prevent SMS bombing
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 OTPs per hour per IP
  message: { message: 'Too many OTP requests, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
})
