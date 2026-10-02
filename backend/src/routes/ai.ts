import { Router } from 'express'
import { z } from 'zod'
import { UserModel } from '../models/User.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'
import { aiFetch } from '../utils/aiClient.js'

export const aiRouter = Router()

aiRouter.use(requireAuth)

const askSchema = z.object({
  query: z.string().trim().min(3, 'Ask a more specific question'),
  topK: z.number().int().min(1).max(10).optional(),
})

aiRouter.post('/ask', async (req, res, next) => {
  try {
    const { query, topK } = askSchema.parse(req.body)

    const user = await UserModel.findById(req.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    const aiResponse = await aiFetch(`/ai/ask`, {
      method: 'POST',
      headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        top_k: topK ?? 5,
        profile: user.profile
          ? {
              state: user.profile.state,
              age: user.profile.age,
              income: user.profile.income,
              occupation: user.profile.occupation,
              education: user.profile.education,
            }
          : null,
      }),
    })

    let data;
    if (aiResponse.ok) {
      data = await aiResponse.json();
    } else {
      // Fallback to direct Gemini API call
      console.log('AI Service offline or failed, falling back to direct Gemini API...');
      if (!env.geminiApiKey) {
        throw new AppError('AI service offline and no fallback Gemini Key found', 502);
      }
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(env.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are Adhikar AI, a helpful government scheme assistant for Indian citizens.
User profile: ${JSON.stringify(user.profile)}
User question: ${query}
Provide a clear, helpful, and concise response in markdown.`;
      
      const result = await model.generateContent(prompt);
      data = { answer: result.response.text(), sources: [] };
    }
    
    res.status(200).json(data)
  } catch (err) {
    console.error('AI Route Error:', err);
    next(err)
  }
})
