import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Send, Bot, Sparkles, User, ExternalLink, RefreshCw, LogIn } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
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

function AssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "👋 **Namaste! I am Adhikar AI Copilot.**\n\nI can help you with:\n- Discovering welfare schemes for your household\n- Verifying eligibility criteria (age, income, land, caste category)\n- Understanding document checklists & application procedures\n- Direct official portal links for central & state benefits\n\nWhat would you like to explore today?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim()
    if (!textToSend || isLoading) return

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend,
    }

    // Build history of recent turns for multi-turn conversational context
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
          content:
            'I encountered a temporary connection issue. Please try rephrasing your question or ask about a specific scheme like *"What are the eligibility criteria for PM-KISAN?"*',
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
        content:
          "👋 **Namaste! I am Adhikar AI Copilot.**\n\nChat history reset. How can I assist you with government welfare benefits today?",
      },
    ])
  }

  const suggestedQuestions = [
    'What is PM-KISAN scheme and who qualifies?',
    'Ayushman Bharat ₹5 Lakh health cover details',
    'How do I apply for Pradhan Mantri Awas Yojana (PMAY)?',
    'Pensions available for senior citizens above 60',
    'Post-Matric scholarship eligibility for students',
    'What schemes exist for women entrepreneurs in India?',
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700">AI Copilot</span>
        </div>

        {messages.length > 1 && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Guest Notice Banner if unauthenticated */}
      {!user && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">You are browsing as a Guest</p>
              <p className="text-[11px] text-slate-500">
                Sign in to let Adhikar AI personalize answers with your verified age, state, and income.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Chat Interface */}
        <div className="flex-1 flex flex-col h-[750px]">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/50 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Grounded Gemini 3.8 Flash RAG
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Hybrid Knowledge Base Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Adhikar Welfare Copilot</h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Verified answers with direct scheme citations, eligibility rules, and official application portals.
            </p>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40 flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`animate-fade-in-up flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex max-w-[85%] flex-col gap-2 md:max-w-[78%]">
                    <div className={`whitespace-pre-wrap rounded-2xl px-5 py-3.5 text-xs leading-relaxed md:text-sm ${
                      msg.role === 'user'
                        ? 'rounded-tr-none bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-md shadow-blue-500/10'
                        : 'rounded-tl-none border border-slate-200/80 bg-white font-normal text-slate-800 shadow-sm'
                    }`}>
                      {msg.content}
                    </div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Sources:</span>
                        {msg.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={src.benefit || src.schemeName}
                            className="inline-flex items-center gap-1 rounded-full border border-blue-200/60 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            {src.schemeName} <ExternalLink className="w-3 h-3 text-blue-400" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-slate-200/80 bg-white px-5 py-3.5 shadow-sm">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span className="ml-1 text-xs font-medium text-slate-500">Searching welfare database…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-slate-100 bg-white p-4">
              <div className="relative mx-auto flex max-w-4xl items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                  placeholder="Ask in English or Hinglish…"
                  className="w-full rounded-full border border-slate-200 py-3.5 pl-5 pr-14 text-xs font-medium shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 disabled:opacity-50 md:text-sm"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5 -ml-0.5" />
                </button>
              </div>
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                <Sparkles className="w-3 h-3 text-blue-500" />
                Answers grounded in Government of India gazettes &amp; MyScheme portal data
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Suggested Prompts */}
        <div className="w-full lg:w-80 shrink-0 mt-4 lg:mt-[4.5rem]">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Suggested Queries
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Click to ask instantly</p>
            </div>

            <div className="flex flex-col gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSend(q)}
                  className="text-left w-full p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 transition text-xs font-semibold text-slate-700 leading-snug group flex items-start justify-between gap-2"
                >
                  <span>{q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0 mt-0.5" />
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Multilingual AI</span>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                You can ask questions in English or Hinglish (e.g. <em>"Kisan yojana me ₹6,000 kab milta hai?"</em>).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
