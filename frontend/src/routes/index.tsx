import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import { Search, ArrowRight, Home, Building2, Briefcase, Leaf, Users, HeartPulse, Accessibility, MoreHorizontal, Sparkles, ExternalLink, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [featuredSchemes, setFeaturedSchemes] = useState<PublicScheme[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    schemesApi.list(0, 100).then(res => {
      const counts: Record<string, number> = {}
      res.items.forEach(s => {
        counts[s.category] = (counts[s.category] || 0) + 1
      })
      setCategoryCounts(counts)
      setFeaturedSchemes(res.items.slice(0, 4))
    }).catch(console.error)
  }, [])

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const baseCategories = [
    { icon: <Leaf className="w-5 h-5 text-emerald-600" />, title: 'Agriculture', color: 'bg-emerald-50 border-emerald-100/80 text-emerald-700' },
    { icon: <Briefcase className="w-5 h-5 text-blue-600" />, title: 'Employment', color: 'bg-blue-50 border-blue-100/80 text-blue-700' },
    { icon: <Home className="w-5 h-5 text-amber-600" />, title: 'Housing', color: 'bg-amber-50 border-amber-100/80 text-amber-700' },
    { icon: <Accessibility className="w-5 h-5 text-violet-600" />, title: 'Disability', color: 'bg-violet-50 border-violet-100/80 text-violet-700' },
    { icon: <Users className="w-5 h-5 text-pink-600" />, title: 'Women', color: 'bg-pink-50 border-pink-100/80 text-pink-700' },
    { icon: <HeartPulse className="w-5 h-5 text-rose-600" />, title: 'Healthcare', color: 'bg-rose-50 border-rose-100/80 text-rose-700' },
    { icon: <Building2 className="w-5 h-5 text-indigo-600" />, title: 'Education', color: 'bg-indigo-50 border-indigo-100/80 text-indigo-700' },
    { icon: <MoreHorizontal className="w-5 h-5 text-slate-600" />, title: 'Social Welfare', color: 'bg-slate-50 border-slate-200 text-slate-700' },
  ]

  const categoryCards = baseCategories.map(cat => ({
    ...cat,
    count: `${categoryCounts[cat.title] || 0} Schemes`
  }))

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ to: '/schemes', search: { category: searchQuery.trim() } })
    } else {
      navigate({ to: '/schemes' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800">
      
      {/* 1. HERO SECTION - MODERN CIVIC-TECH */}
      <section className="relative w-full overflow-hidden bg-slate-950 pt-16 pb-20 md:py-24 text-white">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-purple-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next-Gen Welfare Intelligence Engine</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 font-normal">v1.0 Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Every Citizen Entitlement.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                One Intelligent Click.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              Bridging India's welfare gap with Gemini AI & deterministic rule engines. Discover your exact benefits, check eligibility, and apply directly to official government portals.
            </p>
            
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/20 hover:border-white/30 transition-all focus-within:ring-4 focus-within:ring-blue-500/20">
                <div className="flex-1 flex items-center pl-4 gap-3">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search schemes (e.g. PM-KISAN, Student, Healthcare)..." 
                    className="w-full py-3 bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-slate-400 font-medium" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl transition-all font-bold text-xs shadow-md shadow-blue-500/25 shrink-0 flex items-center gap-1.5"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-left border-t border-white/10">
              <div>
                <div className="text-xl md:text-2xl font-black text-white">₹50K+ Cr</div>
                <div className="text-[11px] text-slate-400 font-medium">Benefits Unlocked</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-white">500+</div>
                <div className="text-[11px] text-slate-400 font-medium">Schemes Indexed</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-white">100%</div>
                <div className="text-[11px] text-slate-400 font-medium">Official Portals</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. MAIN BODY CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        
        <div className="space-y-10">
          
          {/* Categories Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Browse by Category</h3>
                <p className="text-xs text-slate-500 mt-0.5">Explore initiatives tailored for different sectors and demographics</p>
              </div>
              <Link to="/schemes" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categoryCards.map((cat, i) => (
                <Link 
                  key={i} 
                  to="/schemes" 
                  search={{ category: cat.title }} 
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-2.5 hover:-translate-y-1 hover:shadow-lg hover:border-blue-100 hover:bg-white transition-all duration-300 cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-xl ${cat.color} border flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{cat.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{cat.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Schemes */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Featured Indian Welfare Schemes</h3>
                <p className="text-xs text-slate-500 mt-0.5">High-impact national and state initiatives with direct DBT benefits</p>
              </div>
              <Link to="/schemes" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                All Schemes <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredSchemes.length === 0 ? (
                 <div className="col-span-2 text-center text-slate-400 py-12 text-sm font-medium">Loading verified schemes...</div>
              ) : (
                featuredSchemes.map((s, i) => (
                  <div key={i} className="border border-slate-200/80 bg-white rounded-2xl flex flex-col overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
                    <div className="p-6 flex flex-col flex-1 relative">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50">
                          {s.level || 'Central'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {s.category}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2 h-10 group-hover:text-blue-700 transition">
                        {s.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-5 line-clamp-2 leading-relaxed">
                        {s.description}
                      </p>
                      
                      <div className="mt-auto space-y-2 mb-5 pt-3 border-t border-slate-100">
                        <div className="flex items-center text-xs font-semibold text-slate-700 gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">₹</span>
                          <span className="truncate">{s.benefit || 'Direct Benefit Transfer'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 mt-auto">
                        <Link 
                          to="/scheme/$slug" 
                          params={{ slug: s.slug }} 
                          className="border border-slate-200 text-center text-slate-700 text-xs font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-all"
                        >
                          Details
                        </Link>
                        {/* Direct External Official Application Link */}
                        <a 
                          href={s.application_url || s.source_url || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-blue-600 text-center text-white text-xs font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-1 shadow-xs"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* How Adhikar Works */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">How Adhikar Works</h3>
            <p className="text-xs text-slate-500 mb-8">From eligibility verification to official disbursement in 4 simple steps</p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
               {[
                 { num: 1, title: 'Profile Setup', desc: 'Input basic age, state, and income criteria.', color: 'bg-blue-600 shadow-blue-200' },
                 { num: 2, title: 'AI Match', desc: 'Deterministic engine matches 100% verified rules.', color: 'bg-indigo-600 shadow-indigo-200' },
                 { num: 3, title: 'Smart Copilot', desc: 'Gemini AI assistant guides documentation.', color: 'bg-emerald-600 shadow-emerald-200' },
                 { num: 4, title: 'Direct Apply', desc: 'Redirect straight to the government portal.', color: 'bg-violet-600 shadow-violet-200' },
               ].map((step, i) => (
                 <div key={i} className="flex flex-col space-y-2">
                    <div className={`w-9 h-9 rounded-xl ${step.color} shadow-md text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                      {step.num}
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
        
        {/* Right Side: Quick Eligibility Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Instant Eligibility</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">Filter schemes for your personal and household criteria</p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
                <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition-all font-medium">
                  <option>All States</option>
                  <option>Rajasthan</option>
                  <option>Delhi</option>
                  <option>Maharashtra</option>
                  <option>Uttar Pradesh</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition-all font-medium">
                  <option>All Categories</option>
                  <option>Agriculture</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Housing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                <input 
                  type="number" 
                  placeholder="e.g. 28" 
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition-all font-medium placeholder:text-slate-400" 
                />
              </div>
              
              <button 
                type="button" 
                onClick={() => navigate({ to: '/eligibility-results' })} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl mt-4 shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 text-xs"
              >
                <span>Check Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Official Integration Badge */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/15">
                Official Portals
              </span>
              <h4 className="font-bold text-sm text-white">Direct Government Applications</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Every application redirects directly to authentic government domains (.gov.in / .nic.in). No middlemen, zero commissions.
              </p>
              <div className="pt-2">
                <Link to="/schemes" className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1.5">
                  Browse All Schemes <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
