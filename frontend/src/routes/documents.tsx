import { createFileRoute, Navigate } from '@tanstack/react-router'
import { ChevronRight, FileText, CheckCircle2, Clock, Upload, Trash2, Loader2, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { documentsApi } from '@/lib/api'
import type { DocumentRecord } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/documents')({
  component: DocumentsPage,
})

function DocumentsPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      loadDocuments()
    }
  }, [user])

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const res = await documentsApi.list()
      setDocuments(res)
    } catch (err: any) {
      setError(err.message || 'Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError('')
      await documentsApi.upload(file)
      await loadDocuments()
    } catch (err: any) {
      setError(err.message || 'Failed to upload document')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document from your locker?')) return
    try {
      await documentsApi.remove(id)
      await loadDocuments()
    } catch (err: any) {
      alert('Failed to delete document: ' + err.message)
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Smart Document Locker</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/50 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> DigiLocker Encrypted Vault
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Zero-Knowledge Storage</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Citizen Document Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Securely store, organize, and auto-verify mandatory certificates required for 1-click government scheme approvals.
          </p>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept=".pdf,.png,.jpg,.jpeg" />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-md shadow-blue-500/20 flex items-center gap-2 text-xs disabled:opacity-70"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{isUploading ? 'Verifying & Encrypting...' : 'Upload Document'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl flex items-center gap-2.5 mb-6 border border-rose-200 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Promo Strip */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4" /> Automatic OCR & Validity Tracking
          </div>
          <h3 className="text-base font-bold text-white">Upload Aadhaar, Income or Domicile Certificates</h3>
          <p className="text-xs text-slate-300 font-normal">
            Documents are automatically analyzed by our AI engine to check validity dates and match eligibility criteria.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-xl bg-white text-blue-900 text-xs font-bold hover:bg-slate-100 transition shrink-0 shadow-xs"
        >
          Select File (.PDF, .JPG)
        </button>
      </div>

      {/* Documents Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-5 md:col-span-4">Document Details</div>
          <div className="col-span-4 md:col-span-3">Classification</div>
          <div className="col-span-3 md:col-span-2 text-center">e-KYC Status</div>
          <div className="hidden md:block col-span-2 text-center">Issuance Date</div>
          <div className="hidden md:block col-span-1 text-center">Manage</div>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs text-slate-400">Loading your verified certificates...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <p className="text-xs font-medium text-slate-600">No documents stored in your vault yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Upload your Aadhaar or Income certificate to auto-fill scheme applications.</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition"
              >
                Upload First Certificate
              </button>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/60 transition">
                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs md:text-sm truncate">{doc.originalFilename}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{doc.idNumber || 'Auto-Verified'}</p>
                  </div>
                </div>

                <div className="col-span-4 md:col-span-3">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg truncate max-w-full">
                    {doc.documentType}
                  </span>
                </div>

                <div className="col-span-3 md:col-span-2 flex justify-center">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      !doc.isExpired ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {!doc.isExpired ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{!doc.isExpired ? 'Verified' : 'Expired'}</span>
                  </div>
                </div>

                <div className="hidden md:flex col-span-2 justify-center text-xs font-medium text-slate-500">
                  {doc.issueDate ? new Date(doc.issueDate).toLocaleDateString() : 'Active'}
                </div>

                <div className="hidden md:flex col-span-1 justify-center gap-2">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove from locker"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
