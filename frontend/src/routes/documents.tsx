import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { documentsApi, type DocumentExtraction, ApiError } from '@/lib/api'

export const Route = createFileRoute('/documents')({
  component: DocumentsPage,
})

function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [result, setResult] = useState<DocumentExtraction | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setResult(null)
    setError(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(selected)
  }

  async function handleExtract() {
    if (!file || !preview) return
    
    setIsExtracting(true)
    setError(null)
    setResult(null)
    
    try {
      // preview string format is: data:image/jpeg;base64,/9j/4AAQSk...
      const base64Data = preview.split(',')[1]
      
      const extraction = await documentsApi.extract(
        file.name,
        file.type,
        base64Data
      )
      
      setResult(extraction)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Extraction failed')
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-[var(--color-ink)]">Document Intelligence</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Upload an Income Certificate or Aadhaar to automatically extract details using AI Vision.
      </p>

      {error && <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 space-y-4">
        <input 
          type="file" 
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-[var(--color-ink-soft)] file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-[var(--color-ink)] hover:file:bg-gray-200"
        />

        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            {file?.type.startsWith('image/') ? (
              <img src={preview} alt="Preview" className="max-h-64 rounded border border-[var(--color-line)] object-contain" />
            ) : (
              <p className="text-sm italic">PDF selected. Preview not available.</p>
            )}
          </div>
        )}

        <button 
          onClick={handleExtract}
          disabled={!file || isExtracting}
          className="btn-primary mt-4"
        >
          {isExtracting ? 'Extracting with AI...' : 'Auto-Extract Fields'}
        </button>
      </div>

      {result && (
        <div className="mt-8 rounded-lg border border-[var(--color-line)] p-6">
          <h2 className="text-lg font-bold text-[var(--color-ink)] mb-4">Extracted Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--color-ink-soft)]">Document Type</p>
              <p className="font-medium">{result.document_type}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-ink-soft)]">Confidence</p>
              <p className="font-medium">{(result.confidence * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-ink-soft)]">Name</p>
              <p className="font-medium">{result.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-ink-soft)]">Income</p>
              <p className="font-medium">{result.income ? `₹${result.income}` : '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-ink-soft)]">Issue Date</p>
              <p className="font-medium">{result.issue_date || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-ink-soft)]">Expiry Date</p>
              <p className="font-medium">{result.expiry_date || '-'}</p>
            </div>
          </div>
          
          {result.is_expired === true && (
            <div className="mt-4 rounded bg-red-50 p-3 text-sm font-medium text-red-800">
              ⚠️ Warning: This document appears to be expired.
            </div>
          )}
          {result.is_expired === false && (
            <div className="mt-4 rounded bg-green-50 p-3 text-sm font-medium text-green-800">
              ✅ Document is currently valid.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
