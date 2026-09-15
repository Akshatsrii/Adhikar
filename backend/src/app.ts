import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'
import { profileRouter } from './routes/profile.js'
import { aiRouter } from './routes/ai.js'
import { eligibilityRouter } from './routes/eligibility.js'
import { recommendationsRouter } from './routes/recommendations.js'
import { familyRouter } from './routes/family.js'
import { lifeEventsRouter } from './routes/lifeEvents.js'

import { documentsRouter } from './routes/documents.js'

import { applicationsRouter } from './routes/applications.js'
import { debuggerRouter } from './routes/debugger.js'
import { simulatorRouter } from './routes/simulator.js'
import { copilotRouter } from './routes/copilot.js'
import { adminRouter } from './routes/admin.js'

export const app = express()

app.use(cors({ origin: env.clientOrigin, credentials: true }))
app.use(express.json({ limit: '10mb' }))

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/ai', aiRouter)
app.use('/api/eligibility', eligibilityRouter)
app.use('/api/recommendations', recommendationsRouter)
app.use('/api/family', familyRouter)
app.use('/api/life-events', lifeEventsRouter)
app.use('/api/documents', documentsRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/debugger', debuggerRouter)
app.use('/api/simulator', simulatorRouter)
app.use('/api/copilot', copilotRouter)
app.use('/api/admin', adminRouter)

app.use(notFoundHandler)
app.use(errorHandler)
