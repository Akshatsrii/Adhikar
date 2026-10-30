import crypto from 'node:crypto'
import { Router, type Request } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { env } from '../config/env.js'
import { aiFetch } from '../utils/aiClient.js'

export const whatsappRouter = Router()

whatsappRouter.use(rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true }))

const bodySchema = z.object({ From: z.string().max(40), Body: z.string().min(1).max(1000) })

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

// Twilio: base64(HMAC-SHA1(authToken, url + sorted(key+value)))
function validTwilioSignature(req: Request): boolean {
  if (!env.twilioAuthToken || !env.publicBaseUrl) return env.nodeEnv !== 'production'
  const url = `${env.publicBaseUrl}/api/whatsapp/webhook`
  const data = Object.keys(req.body).sort().reduce((acc, k) => acc + k + req.body[k], url)
  const expected = crypto.createHmac('sha1', env.twilioAuthToken).update(data).digest('base64')
  const got = String(req.header('x-twilio-signature') ?? '')
  const a = Buffer.from(expected)
  const b = Buffer.from(got)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

const twiml = (msg: string) => `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(msg)}</Message></Response>`

whatsappRouter.post('/webhook', async (req, res) => {
  res.type('text/xml')
  if (!validTwilioSignature(req)) return res.status(403).send(twiml('Forbidden'))
  try {
    const { Body } = bodySchema.parse(req.body)
    const aiResponse = await aiFetch('/ai/ask', {
      method: 'POST',
      headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: Body, top_k: 3, profile: null }),
    })
    if (!aiResponse.ok) throw new Error('AI service failed')
    const data = (await aiResponse.json()) as { answer?: string }
    res.send(twiml((data.answer ?? "I couldn't process that.").slice(0, 1500)))
  } catch (err) {
    console.error('[WhatsApp] error:', (err as Error).message) // phone/message log nahi
    res.send(twiml('Sorry, Adhikar is unavailable right now. Please try again later.'))
  }
})
