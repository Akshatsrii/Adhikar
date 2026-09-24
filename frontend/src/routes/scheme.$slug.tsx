import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Share2, Printer, MapPin, Building2, Banknote, Users, CheckCircle2, Monitor, Calendar, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { schemesApi } from '@/lib/api'; import type { PublicScheme } from '@/lib/api';

export const Route = createFileRoute('/scheme/$slug')({
  component: SchemeDetailPage,
})

function SchemeDetailPage() {
  const { slug } = Route.useParams()
  const [scheme, setScheme] = useState<PublicScheme | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    schemesApi.get(slug).then(res => {
      setScheme(res)
    }).catch(console.error)
      .finally(() => setIsLoading(false))
  }, [slug])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-32 w-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#00428a]" />
      </div>
    )
  }

  if (!scheme) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-32 w-full flex items-center justify-center text-gray-500">
        Scheme not found.
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/schemes" className="text-blue-600 hover:underline">Government Schemes</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">{scheme.name}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start border-b border-gray-200 relative">
           <div className="flex-1">
             <div className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-3">
               {scheme.category}
             </div>
             <h1 className="text-2xl font-bold text-gray-900 mb-3">{scheme.name}</h1>
             <p className="text-sm text-gray-600 mb-5 leading-relaxed max-w-3xl">
               {scheme.description}
             </p>
             <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-gray-400" /> {scheme.department}</div>
                <div className="flex items-center gap-1.5 capitalize"><MapPin className="w-4 h-4 text-gray-400" /> {scheme.level} {scheme.state ? `(${scheme.state})` : ''}</div>
             </div>
           </div>
           
           <div className="flex flex-col gap-3 w-full md:w-56 shrink-0 md:text-right">
             <Link to="/apply/$slug" params={{ slug: scheme.slug }} className="bg-[#00428a] text-white px-6 py-3 rounded text-sm font-bold shadow-sm hover:bg-blue-800 transition text-center flex items-center justify-center gap-2">
               Apply Online <ChevronRight className="w-4 h-4" />
             </Link>
             <div className="flex gap-2">
               <button className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
                 <Share2 className="w-3.5 h-3.5" /> Share
               </button>
               <button className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
                 <Printer className="w-3.5 h-3.5" /> Print
               </button>
             </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-8 border-r border-gray-100">
            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200 mb-8">
              <button className="pb-3 text-sm font-bold text-[#00428a] border-b-2 border-[#00428a]">Overview</button>
              <button className="pb-3 text-sm font-semibold text-gray-500 hover:text-gray-800">Eligibility</button>
              <button className="pb-3 text-sm font-semibold text-gray-500 hover:text-gray-800">Benefits</button>
              <button className="pb-3 text-sm font-semibold text-gray-500 hover:text-gray-800">Documents Required</button>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-[#00428a]" /> Scheme Benefit
                </h3>
                <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                  <p className="text-sm text-green-800 font-medium">
                    {scheme.benefit}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#00428a]" /> Eligibility Criteria
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Must be a resident of the specified state (if state level)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Follows guidelines set by {scheme.department}</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-[#00428a]" /> Application Process
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">The application for this scheme can be submitted online through the portal or by visiting your nearest e-Mitra/CSC center.</p>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                    <li>Register or Login to the portal.</li>
                    <li>Fill out the application form with correct details.</li>
                    <li>Upload the mandatory documents.</li>
                    <li>Submit and track your application status online.</li>
                  </ol>
                </div>
              </section>
            </div>
          </div>

          {/* Right Sidebar - Quick Info */}
          <div className="w-full md:w-80 p-6 md:p-8 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Key Highlights</h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">State / Level</p>
                <p className="text-sm font-bold text-gray-900 capitalize">{scheme.level} {scheme.state ? `(${scheme.state})` : ''}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sector</p>
                <p className="text-sm font-bold text-gray-900">{scheme.category}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Official Website</p>
                <a href={scheme.source_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline break-words">
                  {scheme.source_url}
                </a>
              </div>
            </div>

            <div className="mt-8 bg-white border border-orange-200 rounded-lg p-5">
              <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" /> Important Dates
              </h4>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-medium">Application Start</span>
                  <span className="font-bold text-gray-900">Always Open</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
