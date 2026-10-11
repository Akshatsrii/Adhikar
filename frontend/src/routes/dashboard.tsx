import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { CheckCircle2, ChevronRight, Search, UploadCloud, FileEdit, FileSignature, AlertCircle, Loader2, Sparkles, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'Citizen'

  // Dynamic Profile Completion
  let filledFields = 0
  const totalFields = 6
  if (user?.profile) {
    if (user.profile.age) filledFields++
    if ((user.profile as any).dob) filledFields++
    if (user.profile.state) filledFields++
    if (user.profile.education) filledFields++
    if (user.profile.income) filledFields++
    if (user.profile.occupation) filledFields++
  }
  const completionPercentage = Math.round((filledFields / totalFields) * 100)
  const strokeDasharray = `${completionPercentage}, 100`

  const [recentSchemes, setRecentSchemes] = useState<PublicScheme[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    schemesApi.list(0, 4).then(res => {
      setRecentSchemes(res.items)
    }).catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      
      {/* Modern Greeting Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Welcome back, {firstName}!
            </h1>
          </div>
          <p className="text-xs md:text-sm text-blue-200/80 font-normal">
            Your centralized citizen dashboard for schemes, AI recommendations, and verified applications.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <Link 
            to="/assistant" 
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition backdrop-blur-md flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask AI Copilot</span>
          </Link>
          <Link 
            to="/eligibility" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/30 flex items-center gap-1.5"
          >
            <span>Check Matches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Profile Completion Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-6 flex items-center justify-between">
              <span>Profile Health</span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{completionPercentage}% Completed</span>
            </h3>
            
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-blue-600" strokeWidth="3.5" strokeDasharray={strokeDasharray} stroke="currentColor" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-base font-black text-slate-900">{completionPercentage}%</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Complete your profile attributes to unlock higher match precision across state schemes.
                </p>
                <Link 
                  to="/profile" 
                  className="inline-flex items-center gap-1 text-blue-600 font-bold text-xs hover:text-blue-700 hover:underline"
                >
                  <span>Update Profile</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Link 
              to="/eligibility" 
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 text-center">Eligibility</span>
              <span className="text-[10px] text-slate-400 font-medium">Verify rules</span>
            </Link>

            <Link 
              to="/schemes" 
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <FileEdit className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 text-center">All Schemes</span>
              <span className="text-[10px] text-slate-400 font-medium">Search database</span>
            </Link>

            <Link 
              to="/assistant" 
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-violet-200 hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 text-center">AI Copilot</span>
              <span className="text-[10px] text-slate-400 font-medium">Ask questions</span>
            </Link>

            <Link 
              to="/documents" 
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-emerald-200 hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 text-center">Documents</span>
              <span className="text-[10px] text-slate-400 font-medium">Smart Locker</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Matched Schemes</p>
            <h3 className="text-2xl font-black text-slate-900">10 Verified</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Pending Documents</p>
            <h3 className="text-2xl font-black text-slate-900">2 In Review</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Disbursements</p>
            <h3 className="text-2xl font-black text-slate-900">₹6,000 / yr</h3>
          </div>
        </div>
      </div>

      {/* Recommended Schemes For You */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="px-7 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Top Schemes Matched For Your Profile</h3>
            <p className="text-xs text-slate-500">Based on your age, location, and economic tier</p>
          </div>
          <Link to="/eligibility" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            View All Matches <ChevronRight className="w-3 h-3"/>
          </Link>
        </div>
        
        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : (
            recentSchemes.map((scheme, idx) => (
              <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/60 transition">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    {scheme.category?.[0] || 'S'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{scheme.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-blue-600">{scheme.category}</span>
                      <span>·</span>
                      <span className="text-slate-400">{scheme.benefit || 'Direct Benefits'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-3 md:w-[350px]">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                    <CheckCircle2 className="w-3 h-3" /> Eligible
                  </div>
                  
                  <Link 
                    to="/scheme/$slug" 
                    params={{ slug: scheme.slug }} 
                    className="px-4 py-2 rounded-xl text-xs font-bold transition border border-slate-200 text-slate-700 hover:bg-slate-100 text-center"
                  >
                    Details
                  </Link>
                  
                  <a 
                    href={scheme.application_url || scheme.source_url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs bg-blue-600 text-white hover:bg-blue-700 text-center flex items-center gap-1"
                  >
                    <span>Apply</span>
                    <ExternalLink className="w-3 h-3" />
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
