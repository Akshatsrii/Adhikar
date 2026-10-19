import { Router } from 'express'
import { z } from 'zod'
import { UserModel } from '../models/User.js'
import { SchemeModel, type IScheme } from '../models/Scheme.js'
import { optionalAuth } from '../middleware/optionalAuth.js'
import { env } from '../config/env.js'
import { aiFetch } from '../utils/aiClient.js'

export const aiRouter = Router()

// Use optionalAuth so both authenticated citizens and guest visitors can ask AI
aiRouter.use(optionalAuth)

const askSchema = z.object({
  query: z.string().trim().min(1, 'Please enter a message'),
  topK: z.number().int().min(1).max(10).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
})

interface RetrievedSource {
  scheme_slug: string
  scheme_name: string
  source_url: string
  category: string
  benefit: string
  chunk_type?: string
}

/**
 * Intelligent hybrid keyword and category retrieval against MongoDB Scheme collection.
 * Ranks schemes based on match count in name, category, description, and profile alignment.
 */
async function retrieveRelevantSchemes(
  query: string,
  userProfile?: { state?: string; occupation?: string; income?: number; age?: number } | null,
  limit = 5
): Promise<IScheme[]> {
  const lowerQuery = query.toLowerCase()
  const rawTokens = lowerQuery
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)

  // Common stop words to exclude
  const stopWords = new Set([
    'what', 'which', 'where', 'when', 'how', 'who', 'the', 'is', 'are', 'was',
    'for', 'and', 'with', 'from', 'about', 'can', 'get', 'give', 'tell', 'want',
    'need', 'eligible', 'scheme', 'yojana', 'please', 'help', 'details', 'know'
  ])
  const searchTokens = rawTokens.filter((t) => !stopWords.has(t))

  // Build keyword regex list
  const regexConditions: Array<Record<string, unknown>> = []

  // Add specific scheme-related keywords if found
  for (const token of searchTokens) {
    const rx = new RegExp(token, 'i')
    regexConditions.push({ name: rx })
    regexConditions.push({ category: rx })
    regexConditions.push({ description: rx })
    regexConditions.push({ benefit: rx })
  }

  // Also match profile state if available
  if (userProfile?.state) {
    regexConditions.push({ state: new RegExp(userProfile.state, 'i') })
  }
  if (userProfile?.occupation) {
    const occRx = new RegExp(userProfile.occupation, 'i')
    regexConditions.push({ category: occRx })
    regexConditions.push({ description: occRx })
  }

  let candidates: IScheme[] = []

  if (regexConditions.length > 0) {
    candidates = await SchemeModel.find({ $or: regexConditions }).limit(25)
  }

  // If query didn't match specific keywords, fetch top flagship central schemes
  if (candidates.length === 0) {
    candidates = await SchemeModel.find({}).limit(15)
  }

  // Score each candidate by relevance to query & profile
  const scored = candidates.map((scheme) => {
    let score = 0
    const nameLower = scheme.name.toLowerCase()
    const descLower = scheme.description.toLowerCase()
    const catLower = scheme.category.toLowerCase()
    const benefitLower = scheme.benefit.toLowerCase()

    // Query tokens
    for (const token of searchTokens) {
      if (nameLower.includes(token)) score += 10
      if (catLower.includes(token)) score += 6
      if (descLower.includes(token)) score += 3
      if (benefitLower.includes(token)) score += 4
    }

    // Direct whole query match
    if (nameLower.includes(lowerQuery)) score += 15
    if (catLower.includes(lowerQuery)) score += 8

    // Profile alignment boost
    if (userProfile?.state && scheme.state?.toLowerCase() === userProfile.state.toLowerCase()) {
      score += 4
    }
    if (scheme.level?.toLowerCase() === 'central') {
      score += 2 // central schemes apply to all
    }
    if (userProfile?.occupation && (catLower.includes(userProfile.occupation.toLowerCase()) || descLower.includes(userProfile.occupation.toLowerCase()))) {
      score += 5
    }

    return { scheme, score }
  })

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((s) => s.scheme)
}

aiRouter.post('/ask', async (req, res, next) => {
  try {
    const { query, topK, history } = askSchema.parse(req.body)

    let userProfile: any = null
    if (req.userId) {
      const user = await UserModel.findById(req.userId)
      if (user?.profile) {
        userProfile = {
          state: user.profile.state,
          age: user.profile.age,
          income: user.profile.income,
          occupation: user.profile.occupation,
          education: user.profile.education,
        }
      }
    }

    let data: { answer: string; sources: RetrievedSource[] } | null = null

    // 1. Try remote AI microservice with timeout & safety catch
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1800) // 1.8s timeout

      const aiResponse = await aiFetch(`/ai/ask`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'x-internal-key': env.internalAiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          top_k: topK ?? 5,
          profile: userProfile,
        }),
      })

      clearTimeout(timeoutId)

      if (aiResponse.ok) {
        const rawJson = (await aiResponse.json()) as any
        data = {
          answer: rawJson.answer,
          sources: (rawJson.sources || []).map((s: any) => ({
            scheme_slug: s.scheme_slug,
            scheme_name: s.scheme_name,
            source_url: s.source_url || '',
            category: s.category || '',
            benefit: s.benefit || '',
            chunk_type: s.chunk_type || 'overview',
          })),
        }
      } else {
        console.warn(`AI Service returned status ${aiResponse.status}, triggering local RAG engine`)
      }
    } catch (fetchErr) {
      console.warn('AI microservice network error or timeout, triggering local RAG engine')
    }

    // 2. High-Fidelity Local Hybrid RAG Engine (MongoDB + Gemini 3.8 Flash)
    if (!data) {
      console.log('Running grounded Hybrid RAG engine with MongoDB + Gemini 3.8 Flash...')

      if (!env.geminiApiKey) {
        throw new Error('GEMINI_API_KEY is not configured in backend environment')
      }

      // Step A: Retrieve top matching schemes from database
      const relevantSchemes = await retrieveRelevantSchemes(query, userProfile, topK ?? 5)

      // Step B: Build rich context blocks for Gemini
      const contextBlocks = relevantSchemes.map((s) => {
        const rulesStr = Array.isArray(s.eligibility_rules) && s.eligibility_rules.length > 0
          ? s.eligibility_rules.map((r: any) => `${r.field} ${r.operator} ${r.value}`).join('; ')
          : 'Standard central criteria apply'

        const docsStr = Array.isArray(s.documents_required) && s.documents_required.length > 0
          ? s.documents_required.map((d: any) => d.name || d).join(', ')
          : 'Aadhaar Card, Bank Account Details, Income/Caste Certificate'

        return `### Scheme: ${s.name} (Slug: ${s.slug})
- **Category**: ${s.category} | **Level**: ${s.level} | **State**: ${s.state || 'All India (Central)'}
- **Benefit**: ${s.benefit}
- **Description**: ${s.description}
- **Eligibility Rules**: ${rulesStr}
- **Documents Required**: ${docsStr}
- **Official Portal**: ${s.source_url || s.application_url || 'https://myscheme.gov.in'}
`
      })

      const contextText = contextBlocks.length > 0
        ? contextBlocks.join('\n---\n\n')
        : 'No specific scheme matches found in current catalog. Provide guidance on standard national welfare portals.'

      // Step C: Prepare Conversation History
      const historyContext = history && history.length > 0
        ? history
            .slice(-4)
            .map((m) => `${m.role === 'user' ? 'Citizen' : 'Adhikar Copilot'}: ${m.content}`)
            .join('\n')
        : ''

      // Step D: Construct prompt with grounded instructions
      const systemInstruction = `You are Adhikar Copilot, an official, warm, empathetic, and highly accurate welfare intelligence assistant for Indian citizens.

Core Directives:
1. Ground your answer in the provided Scheme Context below. Whenever quoting amounts (₹), eligibility conditions (age, income, land limit), or documents, quote accurately from the context.
2. If the user writes in Hindi or Hinglish, respond warmly in the same language. If English, respond in English.
3. Structure your response cleanly with markdown:
   - Use bold titles and bullet points.
   - Mention the exact benefit amount (e.g. ₹6,000/year, ₹5 Lakh health cover).
   - List key eligibility criteria and necessary documents.
   - Include the official application link or portal if mentioned in the context.
4. If the user asks whether they qualify and a citizen profile is provided, evaluate against the rules transparently, but clarify that final verification happens on the official portal.
5. If the context does not contain the answer, politely state what is known and guide them to the appropriate portal (e.g., myscheme.gov.in or pmkisan.gov.in).`

      const fullPrompt = `${systemInstruction}

${userProfile ? `Citizen Profile:\nState: ${userProfile.state || 'Unknown'}, Age: ${userProfile.age || 'Unknown'}, Income: ₹${userProfile.income || 'Unknown'}/year, Occupation: ${userProfile.occupation || 'Unknown'}, Education: ${userProfile.education || 'Unknown'}\n\n` : ''}${historyContext ? `Recent Conversation History:\n${historyContext}\n\n` : ''}Scheme Context (Verified Government Knowledge Base):
${contextText}

Citizen's Question:
${query}

Your Helpful, Grounded Response:`

      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(env.geminiApiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' })

      const result = await model.generateContent(fullPrompt)
      const answerText = result.response.text()

      // Step E: Prepare structured sources
      const sources: RetrievedSource[] = relevantSchemes.map((s) => ({
        scheme_slug: s.slug,
        scheme_name: s.name,
        source_url: s.source_url || s.application_url || 'https://myscheme.gov.in',
        category: s.category,
        benefit: s.benefit,
        chunk_type: 'scheme_overview',
      }))

      data = {
        answer: answerText,
        sources,
      }
    }

    res.status(200).json(data)
  } catch (err) {
    console.error('AI Route Error:', err)
    next(err)
  }
})
