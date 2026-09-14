import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, aiApi, type AskSource } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/assistant')({
  component: AssistantPage,
})

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: AskSource[]
  isError?: boolean
}

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          isUser
            ? 'max-w-[80%] rounded-2xl rounded-br-sm bg-[var(--color-saffron)] px-4 py-2.5 text-[15px] text-white'
            : `max-w-[80%] rounded-2xl rounded-bl-sm border px-4 py-2.5 text-[15px] ${
                message.isError
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-[var(--color-line)] bg-white text-[var(--color-ink)]'
              }`
        }
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 space-y-1 border-t border-[var(--color-line)] pt-2">
            <p className="text-xs font-medium text-[var(--color-ink-soft)]">Sources</p>
            {message.sources.map((s) => (
              <a
                key={s.schemeSlug}
                href={s.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-xs text-[var(--color-saffron-deep)] hover:underline"
              >
                {s.schemeName} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AssistantPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Ask me about government schemes — for example, \"What scholarships are available for B.Tech students in Rajasthan?\" I'll answer using verified scheme data and always show my sources.",
    },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isAuthLoading, user, navigate])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = input.trim()
    if (!query || isSending) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: query }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsSending(true)

    try {
      const res = await aiApi.ask(query)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: res.answer, sources: res.sources },
      ])
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Couldn't reach the assistant. Please try again."
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: message, isError: true },
      ])
    } finally {
      setIsSending(false)
    }
  }

  if (isAuthLoading) {
    return <p className="text-sm text-[var(--color-ink-soft)]">Loading…</p>
  }

  if (!user) return null

  return (
    <div className="mx-auto flex h-[70vh] max-w-2xl flex-col">
      <div>
        <h1 className="text-3xl text-[var(--color-ink)]">Ask Adhikar</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Answers are grounded in verified scheme data, not guesses.
        </p>
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-parchment-dim)]/40 p-4">
        {messages.map((m) => (
          <ChatMessageBubble key={m.id} message={m} />
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm text-[var(--color-ink-soft)]">
              Thinking…
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="field"
          placeholder="Ask about a scheme…"
          disabled={isSending}
        />
        <button type="submit" disabled={isSending || !input.trim()} className="btn-primary">
          Send
        </button>
      </form>
    </div>
  )
}
