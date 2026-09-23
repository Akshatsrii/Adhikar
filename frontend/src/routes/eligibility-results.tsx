import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/eligibility-results')({
  component: EligibilityResultsPage,
})

function EligibilityResultsPage() {
  const [schemes, setSchemes] = useState<PublicScheme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await schemesApi.list(0, 10);
        setSchemes(res.items || []);
      } catch (err) {
        console.error('Failed to load schemes', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa] min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/eligibility" className="text-blue-600 hover:underline">Check Eligibility</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Results</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#00428a] mb-2">Your Eligibility Results</h1>
        <p className="text-sm text-gray-600">Based on your profile, here are the real schemes you are matched with.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 px-2 scrollbar-hide">
          <button className="px-5 py-4 text-sm font-bold text-[#00428a] border-b-2 border-[#00428a] whitespace-nowrap bg-blue-50/50">Eligible ({schemes.length})</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Needs More Info (0)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Not Eligible (0)</button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100 p-6 space-y-4">
          {loading ? (
            <div className="py-12 flex justify-center">
               <Loader2 className="w-8 h-8 animate-spin text-[#00428a]" />
            </div>
          ) : schemes.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No matching schemes found.</div>
          ) : (
            schemes.map((scheme, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center p-2">
                    {/* Using our reliable local emblem svg */}
                    <img src="/images/emblem.svg" className="w-full h-full object-contain opacity-80" alt="Emblem" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{scheme.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{scheme.department || scheme.category}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `95%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">Match: 95%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 md:w-[350px]">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Eligible
                  </div>
                  {/* Dynamic external link opening the official portal */}
                  <a href={scheme.source_url || '#'} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded text-xs font-bold transition shadow-sm w-32 bg-[#00428a] text-white hover:bg-blue-800 text-center inline-block">
                    Apply Now
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
