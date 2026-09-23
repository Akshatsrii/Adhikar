import { createFileRoute, Navigate } from '@tanstack/react-router'
import { ChevronRight, Plus, FileText, CheckCircle2, Clock, MoreVertical, Eye, Upload, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { documentsApi, DocumentRecord } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/documents')({
  component: DocumentsPage,
})

function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user])

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const res = await documentsApi.list();
      setDocuments(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      await documentsApi.upload(file);
      await loadDocuments();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await documentsApi.remove(id);
      await loadDocuments();
    } catch (err: any) {
      alert('Failed to delete document: ' + err.message);
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">My Documents</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00428a] mb-2">My Documents</h1>
          <p className="text-sm text-gray-600">Upload, manage and verify your documents for government scheme applications</p>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleUpload}
          accept=".pdf,.png,.jpg,.jpeg" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-[#00428a] text-white px-5 py-2.5 rounded font-bold hover:bg-blue-800 transition shadow-sm flex items-center gap-2 text-sm disabled:opacity-70"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {isUploading ? 'Uploading...' : 'Upload New Document'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center gap-2 mb-6 border border-red-200">
           <AlertCircle className="w-5 h-5" />
           <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-5 md:col-span-4">Document Name</div>
          <div className="col-span-4 md:col-span-3">Type</div>
          <div className="col-span-3 md:col-span-2 text-center">Status</div>
          <div className="hidden md:block col-span-2 text-center">Issue Date</div>
          <div className="hidden md:block col-span-1 text-center">Actions</div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#00428a]" />
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center text-gray-500 flex flex-col items-center">
              <FileText className="w-12 h-12 text-gray-300 mb-3" />
              <p>No documents uploaded yet.</p>
              <button onClick={() => fileInputRef.current?.click()} className="mt-4 text-[#00428a] font-bold hover:underline">Upload your first document</button>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-blue-50/30 transition">
                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 text-[#00428a]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{doc.originalFilename}</p>
                    <p className="text-[10px] text-gray-500 truncate">{doc.idNumber || 'No ID Extracted'}</p>
                  </div>
                </div>
                
                <div className="col-span-4 md:col-span-3">
                  <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded truncate max-w-full">
                    {doc.documentType}
                  </span>
                </div>
                
                <div className="col-span-3 md:col-span-2 flex justify-center">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                    !doc.isExpired ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {!doc.isExpired ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{!doc.isExpired ? 'Valid' : 'Expired'}</span>
                  </div>
                </div>

                <div className="hidden md:flex col-span-2 justify-center text-sm font-medium text-gray-600">
                  {doc.issueDate ? new Date(doc.issueDate).toLocaleDateString() : '-'}
                </div>
                
                <div className="hidden md:flex col-span-1 justify-center gap-2">
                  <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete">
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
