import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Send, Sparkles, User, ExternalLink, RefreshCw } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { aiApi, type AskSource } from '@/lib/api'

export const Route = createFileRoute('/assistant')({
  component: AssistantPage,
})

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: AskSource[]
}

export function AssistantPage() {
  const { t, i18n } = useTranslation()
  const isHindi = i18n.language?.startsWith('hi')

  const initialGreeting = isHindi
    ? `🙏 **नमस्ते! मैं अधिकार एआई सहायक हूँ।**\n\nमैं आपकी निम्नलिखित में सहायता कर सकता हूँ:\n- आपके परिवार के लिए सरकारी योजनाओं की खोज\n- पात्रता नियमों की जांच (आयु, आय, भूमि सीमा, जाति श्रेणी)\n- आवश्यक दस्तावेज़ों की सूची एवं आवेदन प्रक्रिया\n- केंद्र एवं राजस्थान राज्य योजनाओं के सीधे आधिकारिक पोर्टल लिंक\n\nआप हिंदी, अंग्रेजी या हिंग्लिश में कोई भी प्रश्न पूछ सकते हैं।`
    : `👋 **Namaste! I am Adhikar AI Copilot.**\n\nI can help you with:\n- Discovering government welfare schemes for your family\n- Verifying eligibility criteria (age, income ceiling, land, caste category)\n- Understanding document checklists & step-by-step application procedures\n- Direct official portal links (.gov.in) for Central and State benefits\n\nWhat scheme or benefit would you like to explore today?`

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: initialGreeting,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isWarmingUp, setIsWarmingUp] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => { if (d.status === 'degraded' || !d.ai) setIsWarmingUp(true) })
      .catch(() => setIsWarmingUp(true))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const suggestedQuestions = isHindi
    ? [
        'क्या मैं पीएम किसान योजना के लिए पात्र हूँ?',
        'राजस्थान में कॉलेज छात्रों के लिए छात्रवृत्ति योजनाएं',
        'आयुष्मान भारत कार्ड के लिए कौन से दस्तावेज़ चाहिए?',
        'पालनहार योजना में बच्चों को क्या लाभ मिलता है?',
      ]
    : [
        'Am I eligible for PM-KISAN Samman Nidhi?',
        'Scholarships for college students in Rajasthan',
        'What documents are required for Ayushman Bharat?',
        'How does Palanhar Yojana benefit children in Rajasthan?',
      ]

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim()
    if (!textToSend || isLoading) return

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend,
    }

    const recentHistory = messages
      .filter((m) => m.id !== 'welcome')
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }))

    setMessages((prev) => [...prev, userMessage])
    if (!queryText) setInput('')
    setIsLoading(true)

    try {
      const res = await aiApi.ask(textToSend, recentHistory)
      const assistantMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: res.answer,
        sources: res.sources,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: isHindi
            ? 'सर्वर से संपर्क करने में समस्या आई। कृपया अपना प्रश्न दोबारा पूछें या किसी योजना का नाम लिखें जैसे *"पीएम किसान के नियम क्या हैं?"*'
            : 'Encountered a temporary connection delay. Please try rephrasing or asking directly about a scheme like *"What are the eligibility criteria for PM-KISAN?"*',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: initialGreeting,
      },
    ])
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#111827] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#EAE6DF] bg-white py-5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-[#FF5B00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-[#111827]">{t('assistant.title')}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4EC] text-[#D9480F] border border-[#FFE2D1]">
                  Gemini + Grounded RAG
                </span>
              </div>
              <p className="text-xs text-neutral-500">{t('assistant.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-600 hover:text-[#111827] hover:bg-[#FAF7F2] border border-[#EAE6DF] transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isHindi ? 'नई बातचीत' : 'New Chat'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Chat Window */}
        <div className="flex-1 flex flex-col rounded-3xl border border-[#EAE6DF] bg-white shadow-xs overflow-hidden h-[75vh]">
          
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-white shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-[#FF5B00]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-4 text-xs md:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0A0A0A] text-white rounded-br-none'
                      : 'bg-[#FDFBF7] text-[#111827] border border-[#EAE6DF] rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#EAE6DF] flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase text-neutral-500 w-full">
                        {isHindi ? 'सत्यापित स्रोत:' : 'Verified Sources:'}
                      </span>
                      {msg.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.sourceUrl || `https://myscheme.gov.in`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white border border-[#EAE6DF] text-[#FF5B00] hover:bg-[#FFF4EC] transition"
                        >
                          <span>{s.schemeName}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-400" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#FF5B00] flex items-center justify-center text-white shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-4 h-4 text-[#FF5B00]" />
                </div>
                <div className="rounded-3xl rounded-bl-none border border-[#EAE6DF] bg-[#FDFBF7] p-4 text-xs flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF5B00] animate-ping" />
                  <span className="text-neutral-600 font-medium">
                    {isWarmingUp ? t('assistant.server_warming') : (isHindi ? 'सरकारी डेटाबेस से उत्तर तैयार हो रहा है...' : 'Synthesizing verified welfare response...')}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat input box */}
          <div className="p-4 border-t border-[#EAE6DF] bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('assistant.placeholder')}
                disabled={isLoading}
                className="flex-1 bg-[#FAF7F2] border border-[#EAE6DF] rounded-full px-5 py-3 text-xs md:text-sm text-[#111827] placeholder:text-neutral-400 focus:outline-none focus:border-[#FF5B00]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-pill-dark px-6 py-3 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>{t('assistant.send')}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Queries */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <div className="rounded-3xl border border-[#EAE6DF] bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EAE6DF]">
              <Sparkles className="w-4 h-4 text-[#FF5B00]" />
              <h3 className="text-xs font-bold text-[#111827]">
                {isHindi ? 'सुझाए गए प्रश्न' : 'Suggested Questions'}
              </h3>
            </div>

            <div className="mt-3 space-y-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE6DF] hover:border-[#FF5B00]/50 hover:bg-[#FFF4EC] text-xs font-semibold text-neutral-800 transition flex items-center justify-between gap-2"
                >
                  <span className="line-clamp-2">{q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FF5B00] shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#FFF6EF] border border-[#FFE2D1] p-5 text-xs text-[#9A3412] space-y-1.5">
            <p className="font-bold">{isHindi ? '🌐 द्विभाषी एआई सहायता' : '🌐 Bilingual Welfare AI'}</p>
            <p className="leading-relaxed">
              {isHindi
                ? 'आप हिंदी, हिंग्लिश या अंग्रेजी में किसी भी योजना के नियम, पैसे, और आवश्यक दस्तावेज़ों के बारे में बेझिझक पूछ सकते हैं।'
                : 'You can freely ask questions in English, Hindi, or Hinglish with accurate rule citations and document checklists.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
