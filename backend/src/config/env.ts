import 'dotenv/config'

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

const nodeEnv = process.env.NODE_ENV ?? 'development'
const isProd = nodeEnv === 'production'

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required('MONGO_URI', isProd ? undefined : 'mongodb://localhost:27017/adhikar'),
  jwtSecret: process.env.JWT_SECRET || 'adhikar-jwt-secret-production-fallback-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  clientOrigins: (process.env.CLIENT_ORIGINS ?? process.env.CLIENT_ORIGIN ?? 'http://localhost:5173,https://adhikar-seven.vercel.app')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  nodeEnv,
  aiServiceUrl: process.env.AI_SERVICE_URL || 'https://adhikar-pk7d.onrender.com',
  internalAiKey: process.env.INTERNAL_AI_KEY || 'dev-only-internal-key',
  geminiApiKey: process.env.GEMINI_API_KEY,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? '',
}
