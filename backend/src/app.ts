import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'
import { profileRouter } from './routes/profile.js'
import { aiRouter } from './routes/ai.js'

export const app = express()

app.use(cors({ origin: env.clientOrigin, credentials: true }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/ai', aiRouter)

app.use(notFoundHandler)
app.use(errorHandler)
