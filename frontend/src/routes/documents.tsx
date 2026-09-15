import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, documentsApi, type DocumentRecord } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/documents')({
  component: DocumentsPage,
})

function DocumentCard({ doc, onRemove }: { doc: DocumentRecord; onRemove: () => void }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[var(--color-ink)]">{doc.documentType}</h3>
          <p className="text-xs text-[var(--color-ink-soft)]">{doc.originalFilename}</p>
        </div>
        <div className="flex items-center gap-2">
          {doc.isExpired === true && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
              ⚠️ Expired
            </span>
          )}
          {doc.isExpired === false && (
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-[var(--color-govgreen)]">
              ✅ Valid
            </span>
          )}
          <button onClick={onRemove} className="text-xs text-red-600 hover:underline">
            Remove
          </button>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {doc.fullName && (
          <>
            <dt className="text-[var(--color-ink-soft)]">Name</dt>
            <dd className="text-[var(--color-ink)]">{doc.fullName}</dd>
          </>
        )}
        {doc.issueDate && (
          <>
            <dt className="text-[var(--color-ink-soft)]">Issue date</dt>
            <dd className="text-[var(--color-ink)]">{doc.issueDate}</dd>
          </>
        )}
        {doc.incomeAmount != null && (
          <>
            <dt className="text-[var(--color-ink-soft)]">Income</dt>
            <dd className="text-[var(--color-ink)]">₹{doc.incomeAmount.toLocaleString('en-IN')}</dd>
          </>
        )}
        {doc.idNumber && (
          <>
            <dt className="text-[var(--color-ink-soft)]">ID / Certificate No.</dt>
            <dd className="text-[var(--color-ink)]">{doc.idNumber}</dd>
          </>
        )}
        {doc.issuingAuthority && (
          <>
            <dt className="text-[var(--color-ink-soft)]">Issued by</dt>
            <dd className="text-[var(--color-ink)]">{doc.issuingAuthority}</dd>
          </>
        )}
      </dl>
    </div>
  )
}

function DocumentsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isAuthLoading, user, navigate])

  useEffect(() => {
    if (!user) return
    documentsApi
      .list()
      .then(setDocuments)
      .finally(() => setIsLoading(false))
  }, [user])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      const doc = await documentsApi.upload(file)
      setDocuments((prev) => [doc, ...prev])
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not read this document. Try a clearer photo or scan.',
      )
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleRemove(id: string) {
    await documentsApi.remove(id)
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  if (isAuthLoading) {
    return <p className="text-sm text-[var(--color-ink-soft)]">Loading…</p>
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl text-[var(--color-ink)]">Your documents</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Upload a photo or scan — we'll read the details automatically and flag anything
        that's expired.
      </p>

      <div className="mt-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          id="doc-upload"
        />
        <label
          htmlFor="doc-upload"
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-line)] bg-white px-6 py-10 text-center hover:border-[var(--color-saffron)] ${
            isUploading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <span className="text-3xl">📄</span>
          <span className="mt-2 text-sm font-medium text-[var(--color-ink)]">
            {isUploading ? 'Reading document…' : 'Click to upload a document'}
          </span>
          <span className="mt-1 text-xs text-[var(--color-ink-soft)]">
            JPEG, PNG, or WEBP — up to 8MB
          </span>
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {!isLoading && documents.length > 0 && (
        <div className="mt-8 space-y-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onRemove={() => handleRemove(doc.id)} />
          ))}
        </div>
      )}

      {!isLoading && documents.length === 0 && (
        <p className="mt-8 text-sm text-[var(--color-ink-soft)]">
          No documents uploaded yet.
        </p>
      )}
    </div>
  )
}
