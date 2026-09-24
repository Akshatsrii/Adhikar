import { createFileRoute, Navigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Clock, CheckCircle2, FileText, Loader2, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { applicationsApi } from '@/lib/api'
import type { ApplicationRecord } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/track')({
  component: TrackPage,
})

function TrackPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<ApplicationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      applicationsApi.list()
        .then(res => setApps(res))
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [user])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa] min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Track Your Application</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#00428a] mb-2">Track Your Application</h1>
        <p className="text-sm text-gray-600">View real-time status of your government scheme applications.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#00428a]" />
          </div>
        ) : apps.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-500 max-w-md text-sm mb-6">You haven't tracked any applications yet. When you apply for a scheme, it will appear here.</p>
            <Link to="/schemes" className="px-6 py-2 bg-[#00428a] text-white font-bold rounded hover:bg-blue-800 transition">Browse Schemes</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 p-6 space-y-4">
            {apps.map((app, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border border-gray-100 rounded-lg hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-[#00428a]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{app.schemeName}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span>ID: {app.applicationId}</span>
                      <span>•</span>
                      <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                    app.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                    app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {app.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {app.status}
                  </div>
                  <Link to="/scheme/$slug" params={{ slug: app.schemeId }} className="text-[#00428a] text-sm font-bold hover:underline">
                    View Scheme
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
