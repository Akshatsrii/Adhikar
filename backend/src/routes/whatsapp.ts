import { Router } from 'express'
import { z } from 'zod'
import { env } from '../config/env.js'
import { aiFetch } from '../utils/aiClient.js'

export const whatsappRouter = Router()

// Simple schema for Twilio-style incoming WhatsApp webhook
const whatsappMessageSchema = z.object({
  From: z.string(), // "whatsapp:+919876543210"
  Body: z.string(), // "Hi, are there any schemes for B.Tech students?"
})

// Webhook endpoint: /api/whatsapp/webhook
whatsappRouter.post('/webhook', async (req, res) => {
  try {
    const { From, Body } = whatsappMessageSchema.parse(req.body)

    console.log(`[WhatsApp Bot] Received message from ${From}: "${Body}"`)

    // In a real app, we would look up the user profile by phone number (From)
    // For now, we pass a blank profile to the AI service
    const aiResponse = await aiFetch(`/ai/ask`, {
      method: 'POST',
      headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: Body,
        top_k: 3,
        profile: null, // No profile known yet, could extract from CRM
      }),
    })

    if (!aiResponse.ok) {
      throw new Error(`AI Service Failed`)
    }

    const data = (await aiResponse.json()) as { answer?: string }
    const answer = data.answer || "I couldn't process that."

    // In a real app, we would use twilioClient.messages.create(...)
    console.log(`[WhatsApp Bot] Replying to ${From}: "${answer}"`)

    // Respond back to webhook provider (e.g. Twilio TwiML)
    res.setHeader('Content-Type', 'text/xml')
    res.send(`
      <Response>
        <Message>${answer}</Message>
      </Response>
    `)
  } catch (err) {
    console.error('[WhatsApp Bot] Error:', err)
    res.setHeader('Content-Type', 'text/xml')
    res.send(`
      <Response>
        <Message>Sorry, Adhikar Bot is currently down for maintenance.</Message>
      </Response>
    `)
  }
})
