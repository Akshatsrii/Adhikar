import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { CheckCircle2, ChevronRight, Search, UploadCloud, FileEdit, FileSignature, AlertCircle, Loader2, Sparkles, ExternalLink, MessageSquareWarning, Newspaper, TrendingUp, Zap, Sun, Sunset, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'Citizen'

  // Time-of-day greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const GreetIcon = hour < 12 ? Sun : hour < 17 ? Sunset : Moon

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

  // SVG ring calculation
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference

  const [recentSchemes, setRecentSchemes] = useState<PublicScheme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ringAnimated, setRingAnimated] = useState(false)

  useEffect(() => {
    schemesApi.list(0, 4).then(res => {
      setRecentSchemes(res.items)
    }).catch(console.error)
      .finally(() => setIsLoading(false))
    // Trigger ring animation after mount
    const t = setTimeout(() => setRingAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      
      {/* Header & Quick stats */}
      <div className="mb-8 relative overflow-hidden rounded-3xl mesh-bg text-white p-8 shadow-2xl">
        {/* Ambient glows */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="animate-fade-in-up space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-blue-300 font-semibold mb-1">
              <GreetIcon className="w-4 h-4" />
              <span>{greeting}, {firstName}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Your Welfare Dashboard
            </h1>
            <p className="text-sm text-blue-200/70 font-normal max-w-md">
              Personalized scheme discovery, eligibility tracking, and AI-powered assistance — all in one place.
            </p>
          </div>

          {/* SVG Circular Progress Ring */}
          <div className="animate-scale-in flex-shrink-0 flex flex-col items-center gap-2">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 90 90">
                {/* Track */}
                <circle cx="45" cy="45" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                {/* Progress */}
                <circle
                  cx="45" cy="45" r={radius} fill="none"
                  stroke="url(#ringGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={ringAnimated ? strokeDashoffset : circumference}
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.4s' }}
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{completionPercentage}%</span>
                <span className="text-[9px] text-blue-300 font-bold uppercase tracking-wider">Profile</span>
              </div>
            </div>
            <span className="text-[11px] text-blue-200 font-medium">Readiness Score</span>
          </div>
        </div>

        {/* Quick Actions row */}
        <div className="relative z-10 flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
          <Link to="/assistant" className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-4 py-2 rounded-xl text-xs font-bold transition backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Ask AI Copilot
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
                  <path className="text-blue-600" strokeWidth="3.5" strokeDasharray={`${completionPercentage}, 100`} stroke="currentColor" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Matched Schemes</p>
            <h3 className="text-2xl font-black text-slate-900">{recentSchemes.length > 0 ? `${recentSchemes.length}+` : '–'}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Pending Actions</p>
            <h3 className="text-2xl font-black text-slate-900">{completionPercentage < 100 ? `${totalFields - filledFields} Items` : 'Complete'}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Potential Benefits</p>
            <h3 className="text-2xl font-black text-slate-900">₹6K+/yr</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Readiness Score</p>
            <h3 className="text-2xl font-black text-slate-900">{completionPercentage}%</h3>
          </div>
        </div>
      </div>

      {/* Readiness + News Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Scheme Readiness Score Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-7 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheme Readiness Score</span>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black text-white">{completionPercentage}</span>
              <span className="text-2xl font-black text-slate-400 mb-1">/ 100</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 mb-5">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-700"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              {completionPercentage < 40
                ? 'Your readiness is low. Complete your profile to unlock all scheme matches.'
                : completionPercentage < 80
                ? 'Good start! Fill remaining fields to maximize scheme eligibility precision.'
                : 'Excellent profile! You are ready for near-perfect scheme matching.'}
            </p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Age & DOB', done: !!(user?.profile?.age) },
                { label: 'State', done: !!(user?.profile?.state) },
                { label: 'Income', done: !!(user?.profile?.income) },
                { label: 'Education', done: !!(user?.profile?.education) },
                { label: 'Occupation', done: !!(user?.profile?.occupation) },
                { label: 'Category', done: filledFields >= 5 },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-1.5 text-[11px] font-semibold ${item.done ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-3 h-3 ${item.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                  {item.label}
                </div>
              ))}
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              <span>Complete Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Welfare Updates */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Latest Welfare Updates</h3>
            </div>
            <Link to="/news" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { tag: 'Agriculture', text: 'PM-KISAN 18th installment released — ₹2,000 to 9.8 Cr farmers', date: 'Oct 5', color: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
              { tag: 'Healthcare', text: 'Ayushman Bharat 2.0: 10 Cr additional families now eligible', date: 'Oct 10', color: 'bg-rose-100 text-rose-800', dot: 'bg-rose-500' },
              { tag: 'Housing', text: 'PMAY-U 2.0 final deadline: Nov 30, 2026 — 22L pending applications', date: 'Oct 12', color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
              { tag: 'Education', text: 'National Scholarship Portal 2026–27 opens for ₹3,200 Cr disbursement', date: 'Oct 8', color: 'bg-indigo-100 text-indigo-800', dot: 'bg-indigo-500' },
            ].map((item, i) => (
              <Link key={i} to="/news" className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition group">
                <div className={`w-1.5 h-1.5 rounded-full ${item.dot} mt-1.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color}`}>{item.tag}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 line-clamp-2 group-hover:text-blue-700 transition leading-snug">{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              to="/grievance"
              className="flex items-center gap-2.5 p-3 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 transition group"
            >
              <MessageSquareWarning className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-rose-700">File a Grievance</p>
                <p className="text-[11px] text-rose-500 font-medium">Benefit not received? Report to CPGRAMS</p>
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-rose-400 group-hover:text-rose-600 transition" />
            </Link>
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
