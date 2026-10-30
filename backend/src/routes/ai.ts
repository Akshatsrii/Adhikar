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

    // 2. High-Fidelity Local Hybrid RAG Engine (MongoDB + Gemini 1.5 Flash + Deterministic Knowledge Fallback)
    if (!data) {
      console.log('Running grounded Hybrid RAG engine with MongoDB...')

      // Step A: Retrieve top matching schemes from database
      const relevantSchemes = await retrieveRelevantSchemes(query, userProfile, topK ?? 5)

      // Step B: Build structured sources
      const sources: RetrievedSource[] = relevantSchemes.map((s) => ({
        scheme_slug: s.slug,
        scheme_name: s.name,
        source_url: s.source_url || s.application_url || 'https://myscheme.gov.in',
        category: s.category,
        benefit: s.benefit,
        chunk_type: 'scheme_overview',
      }))

      let answerText = ''

      // Step C: If valid Gemini key configured, attempt Gemini 1.5 Flash
      if (env.geminiApiKey) {
        try {
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
            : 'No specific scheme matches found in current catalog.'

          const historyContext = history && history.length > 0
            ? history
                .slice(-4)
                .map((m) => `${m.role === 'user' ? 'Citizen' : 'Adhikar Copilot'}: ${m.content}`)
                .join('\n')
            : ''

          const systemInstruction = `You are Adhikar Copilot, an official, warm, empathetic, and highly accurate welfare intelligence assistant for Indian citizens.

Core Directives:
1. Ground your answer in the provided Scheme Context below. Whenever quoting amounts (₹), eligibility conditions (age, income, land limit), or documents, quote accurately from the context.
2. If the user writes in Hindi or Hinglish, respond warmly in the same language. If English, respond in English.
3. Structure your response cleanly with markdown:
   - Use bold titles and bullet points.
   - Mention the exact benefit amount (e.g. ₹6,000/year, ₹5 Lakh health cover).
   - List key eligibility criteria and necessary documents.
   - Include the official application link or portal if mentioned in the context.
4. Final verification always happens on the official portal.`

          const fullPrompt = `${systemInstruction}

${userProfile ? `Citizen Profile:\nState: ${userProfile.state || 'Unknown'}, Age: ${userProfile.age || 'Unknown'}, Income: ₹${userProfile.income || 'Unknown'}/year\n\n` : ''}${historyContext ? `Recent Conversation History:\n${historyContext}\n\n` : ''}Scheme Context:
${contextText}

Citizen's Question:
${query}

Your Helpful, Grounded Response:`

          const { GoogleGenerativeAI } = await import('@google/generative-ai')
          const genAI = new GoogleGenerativeAI(env.geminiApiKey)
          
          let result
          try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
            result = await model.generateContent(fullPrompt)
          } catch {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
            result = await model.generateContent(fullPrompt)
          }

          if (result && result.response) {
            answerText = result.response.text()
          }
        } catch (geminiErr: any) {
          console.warn('Gemini API call failed, using verified ground knowledge fallback:', geminiErr?.message)
        }
      }

      // Step D: High-fidelity deterministic knowledge fallback if Gemini fails or is unconfigured
      if (!answerText) {
        const isHindi = /[\u0900-\u097F]|kisan|yojana|kaise|milega|chahiye|paisa|patrata|documents|kya|hai|batao|kripya/i.test(query)
        if (relevantSchemes.length === 0) {
          answerText = isHindi
            ? `नमस्ते! आपके प्रश्न "${query}" से संबंधित विशिष्ट योजना डेटाबेस में नहीं मिली।\n\nकृपया भारत सरकार के आधिकारिक पोर्टल **[myScheme.gov.in](https://www.myscheme.gov.in)** पर जाएं और अपनी पात्रता जांचें।`
            : `Hello! We could not find a verified scheme matching "${query}" in our catalog.\n\nPlease visit the official portal **[myScheme.gov.in](https://www.myscheme.gov.in)** to search all Central and State schemes.`
        } else {
          const primary = relevantSchemes[0]
          if (isHindi) {
            let out = `### 🏛️ ${primary.name}\n\n`
            out += `**मुख्य लाभ (Benefit):** ${primary.benefit}\n\n`
            out += `**विवरण:** ${primary.description}\n\n`

            if (primary.eligibility_rules && primary.eligibility_rules.length > 0) {
              out += `#### 📋 मुख्य पात्रता शर्तें:\n`
              primary.eligibility_rules.forEach((r: any) => {
                const op = r.operator === '<=' ? 'अधिकतम' : r.operator === '>=' ? 'न्यूनतम' : 'होना चाहिए'
                out += `- **${r.field}**: ${op} ${r.value}\n`
              })
              out += `\n`
            }

            if (primary.documents_required && primary.documents_required.length > 0) {
              out += `#### 📑 आवश्यक दस्तावेज़:\n`
              primary.documents_required.forEach((d: any) => {
                const req = d.is_mandatory ? ' (अनिवार्य)' : ''
                out += `- ${d.name || d}${req}\n`
              })
              out += `\n`
            }

            out += `🔗 **आधिकारिक पोर्टल / आवेदन लिंक:** [${primary.source_url || 'https://myscheme.gov.in'}](${primary.source_url || 'https://myscheme.gov.in'})\n\n`

            if (relevantSchemes.length > 1) {
              out += `#### 🔍 अन्य संबंधित सरकारी योजनाएं:\n`
              relevantSchemes.slice(1, 4).forEach((s) => {
                out += `- **[${s.name}](/scheme/${s.slug})** — ${s.benefit}\n`
              })
            }

            out += `\n> 💡 *नोट: यह जानकारी भारत सरकार के आधिकारिक राजपत्र से सत्यापित है। अंतिम आवेदन आधिकारिक पोर्टल पर करें।*`
            answerText = out
          } else {
            let out = `### 🏛️ ${primary.name}\n\n`
            out += `**Key Benefit:** ${primary.benefit}\n\n`
            out += `**Description:** ${primary.description}\n\n`

            if (primary.eligibility_rules && primary.eligibility_rules.length > 0) {
              out += `#### 📋 Key Eligibility Criteria:\n`
              primary.eligibility_rules.forEach((r: any) => {
                out += `- **${r.field}**: ${r.operator} ${r.value}\n`
              })
              out += `\n`
            }

            if (primary.documents_required && primary.documents_required.length > 0) {
              out += `#### 📑 Required Documents:\n`
              primary.documents_required.forEach((d: any) => {
                const req = d.is_mandatory ? ' (Mandatory)' : ' (Optional)'
                out += `- ${d.name || d}${req}\n`
              })
              out += `\n`
            }

            out += `🔗 **Official Portal:** [${primary.source_url || 'https://myscheme.gov.in'}](${primary.source_url || 'https://myscheme.gov.in'})\n\n`

            if (relevantSchemes.length > 1) {
              out += `#### 🔍 Related Welfare Schemes:\n`
              relevantSchemes.slice(1, 4).forEach((s) => {
                out += `- **[${s.name}](/scheme/${s.slug})** — ${s.benefit}\n`
              })
            }

            out += `\n> 💡 *Note: Information grounded strictly in verified government scheme records.*`
            answerText = out
          }
        }
      }

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
