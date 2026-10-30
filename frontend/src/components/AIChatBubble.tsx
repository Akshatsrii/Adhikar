import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Bot, User, ChevronDown, Minimize2, ExternalLink, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { aiApi, type AskSource } from '@/lib/api'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  loading?: boolean
  sources?: AskSource[]
}

export function AIChatBubble() {
  const { i18n } = useTranslation()
  const isHindi = i18n.language?.startsWith('hi')

  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: isHindi
        ? "नमस्ते! 🙏 मैं अधिकार एआई सहायक हूँ। मुझसे किसी भी सरकारी योजना, पात्रता नियमों या आवेदन प्रक्रिया के बारे में पूछें।"
        : "Namaste! 🙏 I'm Adhikar AI Copilot. Ask me anything about government welfare schemes, eligibility rules, or how to apply.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestedQuestions = isHindi
    ? [
        'पीएम किसान योजना के नियम क्या हैं?',
        'आयुष्मान भारत कार्ड की पात्रता',
        'राजस्थान पालनहार योजना के लाभ',
        'छात्रवृत्ति योजनाएं',
      ]
    : [
        'What schemes am I eligible for?',
        'How to apply for PM-KISAN?',
        'Ayushman Bharat eligibility',
        'Scholarships for students',
      ]

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
                text: res.answer || (isHindi ? 'विशिष्ट उत्तर नहीं मिल सका। कृपया अपना प्रश्न दोबारा पूछें।' : 'Could not find a specific answer. Please try rephrasing your question.'),
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
                text: isHindi
                  ? 'अस्थाई समस्या आई। कृपया दोबारा प्रयास करें।'
                  : 'Temporary connection delay. Please try again with a specific scheme like PM-KISAN or Ayushman.',
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
        id: 0,
        role: 'assistant',
        text: isHindi
          ? "नमस्ते! 🙏 मैं अधिकार एआई सहायक हूँ। मुझसे किसी भी सरकारी योजना के बारे में पूछें।"
          : "Namaste! 🙏 I'm Adhikar AI Copilot. Ask me anything about government welfare schemes.",
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
          className="fixed bottom-6 right-6 z-50 group cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full animate-ping bg-[#FF5B00] opacity-25 scale-110" />
            <div className="relative w-14 h-14 rounded-full bg-[#0A0A0A] flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-200 border border-neutral-700">
              <Sparkles className="w-6 h-6 text-[#FF5B00]" />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-16 right-0 bg-[#0A0A0A] text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-neutral-800">
              {isHindi ? 'एआई सहायक से पूछें' : 'Ask AI Copilot ✨'}
            </div>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl shadow-2xl border border-[#EAE6DF] bg-[#FDFBF7] flex flex-col overflow-hidden transition-all duration-300 ${
            minimized ? 'h-14' : 'h-[540px]'
          }`}
          style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}
        >
          {/* Header */}
          <div className="bg-[#18181B] px-4 py-3 flex items-center gap-3 shrink-0 text-white">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FF5B00]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-bold leading-tight">
                {isHindi ? 'अधिकार एआई सहायक' : 'Adhikar AI Copilot'}
              </div>
              <div className="text-neutral-400 text-[10px] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#FF5B00] rounded-full inline-block animate-pulse" />
                <span>{isHindi ? 'सक्रिय • सत्यापित नियम' : 'Online • Grounded RAG'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1 rounded-lg text-neutral-400 hover:text-white transition"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMinimized((p) => !p)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white transition"
                title={minimized ? 'Expand' : 'Minimize'}
              >
                {minimized ? <ChevronDown className="w-4 h-4 rotate-180" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#FDFBF7]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        msg.role === 'assistant'
                          ? 'bg-[#0A0A0A] text-white'
                          : 'bg-[#FF5B00] text-white'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <Bot className="w-3.5 h-3.5 text-[#FF5B00]" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 max-w-[82%]">
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#0A0A0A] text-white rounded-tr-none'
                            : 'bg-white text-[#111827] border border-[#EAE6DF] rounded-tl-none shadow-xs'
                        }`}
                      >
                        {msg.loading ? (
                          <div className="flex items-center gap-1.5 py-1 text-neutral-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B00] animate-ping" />
                            <span>{isHindi ? 'सोच रहा हूँ...' : 'Thinking...'}</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        )}
                      </div>

                      {/* Grounded sources pills */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1 px-1">
                          {msg.sources.slice(0, 2).map((s, idx) => (
                            <a
                              key={idx}
                              href={s.sourceUrl || 'https://myscheme.gov.in'}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-[#FF5B00] bg-white border border-[#EAE6DF] rounded-full px-2 py-0.5 hover:bg-[#FFF4EC] transition"
                            >
                              <span className="truncate max-w-[120px]">{s.schemeName}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 bg-white border-t border-[#EAE6DF] flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] font-semibold text-neutral-700 bg-[#FAF7F2] hover:bg-[#FFF4EC] hover:text-[#FF5B00] border border-[#EAE6DF] rounded-full px-2.5 py-1 transition text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Box */}
              <div className="p-3 bg-white border-t border-[#EAE6DF] flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isHindi ? 'हिंदी या अंग्रेजी में पूछें...' : 'Ask about any scheme...'}
                  className="flex-1 bg-[#FAF7F2] border border-[#EAE6DF] rounded-full px-3.5 py-2 text-xs text-[#111827] placeholder:text-neutral-400 focus:outline-none focus:border-[#FF5B00]"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-full bg-[#0A0A0A] hover:bg-neutral-800 disabled:opacity-30 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#FF5B00]" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
