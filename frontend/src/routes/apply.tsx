import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { applicationsApi, ApiError, copilotApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/apply')({
  component: ApplyPage,
})

function ApplyPage() {
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsValidating(true)
    setError(null)
    setWarnings([])
    setSuccess(false)

    try {
      const result = await applicationsApi.validate({
        schemeId: 'dummy-scheme-123',
        nameOnApplication: name,
        dobOnApplication: dob || undefined,
      })

      if (!result.isValid) {
        setWarnings(result.warnings)
      } else {
        setSuccess(true)
        // Proceed with actual application submission here
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Validation failed')
    } finally {
      setIsValidating(false)
    }
  }

  const [copilotQuestion, setCopilotQuestion] = useState('')
  const [copilotAnswer, setCopilotAnswer] = useState('')
  const [isAsking, setIsAsking] = useState(false)

  async function askCopilot() {
    if (!copilotQuestion.trim()) return
    setIsAsking(true)
    setCopilotAnswer('')
    try {
      const res = await copilotApi.ask('pm-kisan', copilotQuestion)
      setCopilotAnswer(res.answer)
    } catch (err) {
      setCopilotAnswer('Error reaching copilot.')
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-ink)]">Submit Application</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Applying for <span className="font-medium text-[var(--color-ink)]">PM-KISAN Samman Nidhi</span>
        </p>

        {error && <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        
        {success && (
          <div className="mt-4 rounded bg-green-50 p-3 text-sm font-medium text-green-800">
            ✅ Looks perfect! No mismatches found. Application submitted successfully!
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="font-bold text-red-800 mb-2">⚠️  DBT Mismatch Warnings</h3>
            <p className="text-sm text-red-700 mb-3">
              Your application might be rejected or Direct Benefit Transfer (DBT) could fail due to the following reasons:
            </p>
            <ul className="list-inside list-disc space-y-1">
              {warnings.map((w, idx) => (
                <li key={idx} className="text-sm font-medium text-red-700">{w}</li>
              ))}
            </ul>
            <div className="mt-4 flex gap-3">
              <button className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200">
                Edit Application
              </button>
              <button className="rounded px-3 py-1.5 text-sm font-medium text-[var(--color-ink-soft)] hover:bg-gray-200">
                Submit anyway
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="rounded border border-[var(--color-line)] p-4 bg-gray-50">
            <p className="text-xs font-medium text-[var(--color-ink-soft)] uppercase tracking-wider mb-2">Official Profile Reference</p>
            <p className="text-sm text-[var(--color-ink)]">Aadhaar Name: <strong>{user?.name || 'Loading...'}</strong></p>
            <p className="text-sm text-[var(--color-ink)]">Aadhaar DOB: <strong>1990-01-01</strong></p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">Name on Application Form</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Akshat S."
              className="w-full rounded-md border border-[var(--color-line)] p-2.5 text-sm"
            />
            <p className="mt-1 text-xs text-[var(--color-ink-soft)]">Enter your name exactly as it appears on your bank account.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">Date of Birth (Optional)</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-md border border-[var(--color-line)] p-2.5 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isValidating}
            className="btn-primary w-full mt-4"
          >
            {isValidating ? 'Validating DBT Readiness...' : 'Submit Application'}
          </button>
        </form>
      </div>
      
      {/* Copilot Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 h-fit mt-8 md:mt-0">
        <h2 className="font-bold text-blue-900 mb-2">🤖 Application Copilot</h2>
        <p className="text-sm text-blue-800 mb-4">Stuck on a field? Ask me anything about filling this specific PM-KISAN form.</p>
        
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="What does 'domicile' mean here?"
            value={copilotQuestion}
            onChange={(e) => setCopilotQuestion(e.target.value)}
            className="w-full rounded border border-blue-200 p-2 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && askCopilot()}
          />
          <button 
            onClick={askCopilot}
            disabled={isAsking || !copilotQuestion.trim()}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isAsking ? 'Thinking...' : 'Ask Copilot'}
          </button>
        </div>

        {copilotAnswer && (
          <div className="mt-6 rounded bg-white p-4 border border-blue-100 shadow-sm">
            <p className="text-sm text-blue-900">{copilotAnswer}</p>
          </div>
        )}
      </div>
    </div>
  )
}
