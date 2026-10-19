import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Bot, User, Loader2, ChevronDown, Minimize2, ExternalLink, RotateCcw } from 'lucide-react'
import { aiApi, type AskSource } from '@/lib/api'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  loading?: boolean
  sources?: AskSource[]
}

const SUGGESTED = [
  'What schemes am I eligible for?',
  'How to apply for PM-KISAN?',
  'Ayushman Bharat eligibility',
  'Scholarship for SC/ST students',
]

export function AIChatBubble() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: "Namaste! 🙏 I'm Adhikar AI Copilot. Ask me anything about government welfare schemes, eligibility rules, or how to apply.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, minimized, messages])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { id: Date.now(), role: 'user', text: trimmed }
    const loadingMsg: Message = { id: Date.now() + 1, role: 'assistant', text: '', loading: true }

    // Build multi-turn conversational history
    const recentHistory = messages
      .filter((m) => m.id !== 0 && !m.loading)
      .slice(-4)
      .map((m) => ({ role: m.role, content: m.text }))

    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await aiApi.ask(trimmed, recentHistory)
      setMessages((prev) =>
        prev.map((m) =>
          m.loading
            ? {
                ...m,
                text: res.answer || 'I could not find a specific answer. Please try rephrasing your question.',
                sources: res.sources,
                loading: false,
              }
            : m
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.loading
            ? {
                ...m,
                text: 'Sorry, I am temporarily unavailable. Please try again with a specific scheme like PM-KISAN or PMAY.',
                loading: false,
              }
            : m
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        text: "Namaste! 🙏 Chat history cleared. How can I help you find government benefits today?",
      },
    ])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* Floating Bubble Button */}
      {!open && (
        <button
          onClick={() => {
            setOpen(true)
            setMinimized(false)
          }}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            {/* Pulsating rings */}
            <span className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-20 scale-110" />
            <span className="absolute inset-0 rounded-full animate-pulse bg-indigo-400 opacity-10 scale-125" />
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/30 hover:scale-110 transition-transform duration-200 border-2 border-white/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-16 right-0 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Ask AI Copilot
            </div>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border border-slate-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${
            minimized ? 'h-14' : 'h-[540px]'
          }`}
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(99,102,241,0.12)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-black leading-tight">Adhikar AI Copilot</div>
              <div className="text-blue-200 text-[10px] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                Online · Grounded RAG
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMinimized((p) => !p)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                title={minimized ? 'Expand' : 'Minimize'}
              >
                {minimized ? <ChevronDown className="w-4 h-4 rotate-180" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/60">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'assistant'
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          : 'bg-gradient-to-br from-slate-600 to-slate-700'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <Bot className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 max-w-[82%]">
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-sm shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-xs'
                        }`}
                      >
                        {msg.loading ? (
                          <div className="flex items-center gap-2 text-slate-500">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Retrieving verified scheme data…</span>
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>

                      {/* Source Pills if provided */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {msg.sources.slice(0, 3).map((src, i) => (
                            <a
                              key={i}
                              href={src.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full transition"
                            >
                              <span className="truncate max-w-[140px]">{src.schemeName}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-3 pb-3 pt-2 border-t border-slate-200 flex items-center gap-2 bg-white">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about any scheme in English or Hindi…"
                  disabled={loading}
                  className="flex-1 text-xs px-3 py-2.5 bg-slate-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 placeholder:text-slate-400"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 shadow-sm flex-shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
