import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { debuggerApi, type DebuggerResult, ApiError } from '@/lib/api'

export const Route = createFileRoute('/debugger')({
  component: DebuggerPage,
})

function DebuggerPage() {
  const [schemeSlug, setSchemeSlug] = useState('pm-kisan')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDebugging, setIsDebugging] = useState(false)
  const [result, setResult] = useState<DebuggerResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setResult(null)
    setError(null)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(selected)
  }

  async function handleDebug() {
    if (!file || !preview) return
    
    setIsDebugging(true)
    setError(null)
    setResult(null)
    
    try {
      const base64Data = preview.split(',')[1]
      
      const debugResult = await debuggerApi.debug(
        schemeSlug,
        file.name,
        file.type,
        base64Data
      )
      
      setResult(debugResult)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Debugging failed')
    } finally {
      setIsDebugging(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-[var(--color-ink)]">Rejection Debugger</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Upload your application rejection letter. AI will cross-reference it with the scheme rules and your profile to explain exactly what went wrong.
      </p>

      {error && <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Which scheme rejected you?</label>
          <select 
            value={schemeSlug} 
            onChange={(e) => setSchemeSlug(e.target.value)}
            className="w-full rounded-md border border-[var(--color-line)] p-2 text-sm"
          >
            <option value="pm-kisan">PM-KISAN Samman Nidhi</option>
            <option value="ayushman-bharat">Ayushman Bharat</option>
            <option value="pm-awas">PM Awas Yojana</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Rejection Letter or Screenshot</label>
          <input 
            type="file" 
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-[var(--color-ink-soft)] file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-[var(--color-ink)] hover:file:bg-gray-200"
          />
        </div>

        {preview && (
          <div className="mt-4">
            {file?.type.startsWith('image/') ? (
              <img src={preview} alt="Preview" className="max-h-48 rounded border border-[var(--color-line)] object-contain" />
            ) : (
              <p className="text-sm italic">PDF selected.</p>
            )}
          </div>
        )}

        <button 
          onClick={handleDebug}
          disabled={!file || isDebugging}
          className="btn-primary mt-4 w-full"
        >
          {isDebugging ? 'Analyzing Rules & Profile...' : 'Debug Rejection'}
        </button>
      </div>

      {result && (
        <div className="mt-8 rounded-lg border border-[var(--color-line)] p-6 bg-white shadow-sm">
          <h2 className="text-xl font-bold text-red-700 mb-4">Root Cause Found</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-[var(--color-ink)]">Explanation:</p>
              <p className="text-sm text-[var(--color-ink)] mt-1">{result.root_cause}</p>
            </div>

            {result.missing_evidence && (
              <div className="rounded bg-yellow-50 p-3 border border-yellow-200">
                <p className="text-sm font-bold text-yellow-800">Missing Evidence:</p>
                <p className="text-sm text-yellow-800 mt-1">{result.missing_evidence}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-bold text-[var(--color-ink)]">Official Rule Citation:</p>
              <blockquote className="border-l-4 border-gray-300 pl-3 mt-1 text-sm italic text-[var(--color-ink-soft)]">
                "{result.citation}"
              </blockquote>
            </div>

            {result.next_steps && result.next_steps.length > 0 && (
              <div>
                <p className="text-sm font-bold text-[var(--color-ink)]">How to Fix This:</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {result.next_steps.map((step, idx) => (
                    <li key={idx} className="text-sm text-[var(--color-ink)]">{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
