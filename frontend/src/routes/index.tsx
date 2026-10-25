import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import {
  Search, ArrowRight, Home, Building2, Briefcase, Leaf, Users, HeartPulse,
  Accessibility, MoreHorizontal, Sparkles, ExternalLink, CheckCircle2,
  Zap, ShieldCheck, TrendingUp, Globe, ChevronRight, Star, Award
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{value}</div>
      <div className="text-[11px] text-slate-400 font-medium mt-0.5">{label}</div>
    </div>
  )
}

function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [featuredSchemes, setFeaturedSchemes] = useState<PublicScheme[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    schemesApi.list(0, 100).then(res => {
      const counts: Record<string, number> = {}
      res.items.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1 })
      setCategoryCounts(counts)
      setFeaturedSchemes(res.items.slice(0, 6))
    }).catch(console.error)
  }, [])

  if (user) return <Navigate to="/dashboard" replace />

  const baseCategories = [
    { icon: <Leaf className="w-5 h-5" />, title: 'Agriculture', color: 'from-emerald-500 to-green-600' },
    { icon: <Briefcase className="w-5 h-5" />, title: 'Employment', color: 'from-blue-500 to-blue-600' },
    { icon: <Home className="w-5 h-5" />, title: 'Housing', color: 'from-amber-500 to-orange-600' },
    { icon: <Accessibility className="w-5 h-5" />, title: 'Disability', color: 'from-violet-500 to-purple-600' },
    { icon: <Users className="w-5 h-5" />, title: 'Women', color: 'from-pink-500 to-rose-500' },
    { icon: <HeartPulse className="w-5 h-5" />, title: 'Healthcare', color: 'from-rose-500 to-red-600' },
    { icon: <Building2 className="w-5 h-5" />, title: 'Education', color: 'from-indigo-500 to-blue-700' },
    { icon: <MoreHorizontal className="w-5 h-5" />, title: 'Social Welfare', color: 'from-slate-500 to-slate-600' },
  ]

  const categoryCards = baseCategories.map(cat => ({
    ...cat,
    count: `${categoryCounts[cat.title] || 0} Schemes`
  }))

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/schemes', search: { category: searchQuery.trim() || undefined } as any })
  }

  const trustBadges = [
    'PM-KISAN', 'Ayushman Bharat', 'PMAY', 'NSP Scholarships', 'e-Shram',
    'PM Vishwakarma', 'MGNREGA', 'Jan Dhan', 'Sukanya Samriddhi', 'Atal Pension',
    'PM-KISAN', 'Ayushman Bharat', 'PMAY', 'NSP Scholarships', 'e-Shram',
    'PM Vishwakarma', 'MGNREGA', 'Jan Dhan', 'Sukanya Samriddhi', 'Atal Pension',
  ]

  const catColors: Record<string, string> = {
    Agriculture: 'from-emerald-500 to-green-600',
    Employment: 'from-blue-500 to-blue-700',
    Housing: 'from-amber-500 to-orange-500',
    Healthcare: 'from-rose-500 to-red-600',
    Education: 'from-indigo-500 to-blue-700',
    'Social Welfare': 'from-violet-500 to-purple-600',
    Women: 'from-pink-500 to-rose-500',
    Disability: 'from-purple-500 to-violet-600',
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">

      {/* HERO */}
      <section className="relative w-full overflow-hidden mesh-bg min-h-[88vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-breathe" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-xs font-semibold text-blue-200 mb-8 mx-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-sm absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next-Gen Welfare Intelligence &middot; Powered by Gemini AI</span>
              <span className="bg-white/15 text-white/80 text-[10px] px-2 py-0.5 rounded-full font-normal">v2.0 Live</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white mb-6">
              <span className="animate-fade-in-up block">Every Citizen</span>
              <span className="animate-fade-in-up-1 block">
                Entitlement.{' '}
                <span className="text-gradient-hero">One Click.</span>
              </span>
            </h1>

            <p className="animate-fade-in-up-2 text-lg md:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto mb-10">
              Bridging India's welfare gap with Gemini AI &amp; deterministic rule engines.
              Discover exact benefits, verify eligibility instantly, and apply to official government portals.
            </p>

            <form onSubmit={handleSearchSubmit} className="animate-fade-in-up-3 max-w-2xl mx-auto mb-10">
              <div className={`relative flex items-center gap-2 p-2 rounded-2xl transition-all duration-300 ${searchFocused ? 'glass-dark shadow-[0_0_0_2px_rgba(99,102,241,0.5),0_20px_60px_rgba(0,0,0,0.4)]' : 'glass-dark shadow-[0_8px_40px_rgba(0,0,0,0.3)]'}`}>
                <div className="flex-1 flex items-center pl-3 gap-3">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search schemes - PM-KISAN, Ayushman, Housing, Student..."
                    className="w-full py-3.5 bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-slate-500 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-shimmer text-white px-7 py-3.5 rounded-xl font-bold text-sm shrink-0 flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2.5 text-center">500+ verified government schemes indexed &amp; updated weekly</p>
            </form>

            <div className="animate-fade-in-up-4 grid grid-cols-3 gap-6 max-w-xl mx-auto pt-8 border-t border-white/10">
              <AnimatedStat value="50K+ Cr" label="Benefits Unlocked" />
              <AnimatedStat value="500+" label="Schemes Indexed" />
              <AnimatedStat value="100%" label="Official Portals" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      </section>

      {/* TRUST TICKER */}
      <div className="bg-white border-y border-slate-200 py-4 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="animate-ticker flex whitespace-nowrap gap-8 w-max">
          {trustBadges.map((name, i) => (
            <div key={i} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 px-4">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-12">

          {/* Categories */}
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                  <Zap className="w-3 h-3" /> Browse Categories
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Find Schemes by Sector</h2>
                <p className="text-sm text-slate-500 mt-1">Initiatives tailored for every demographic and sector</p>
              </div>
              <Link to="/schemes" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                All Schemes <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categoryCards.map((cat, i) => (
                <Link
                  key={i}
                  to="/schemes"
                  search={{ category: cat.title } as any}
                  className="group relative p-5 rounded-2xl border border-slate-100 bg-white flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-slate-900 transition">{cat.title}</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{cat.count}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Schemes */}
          <div className="animate-fade-in-up-1">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1.5">
                  <Star className="w-3 h-3" /> Featured
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">High-Impact Welfare Schemes</h2>
                <p className="text-sm text-slate-500 mt-1">Direct DBT benefits from verified national portals</p>
              </div>
              <Link to="/schemes" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                All Schemes <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {featuredSchemes.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="skeleton h-2 w-full" />
                    <div className="p-6 space-y-3">
                      <div className="skeleton h-4 w-1/3" />
                      <div className="skeleton h-5 w-full" />
                      <div className="skeleton h-4 w-4/5" />
                      <div className="skeleton h-10 w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {featuredSchemes.map((s, i) => {
                  const gradient = catColors[s.category] || 'from-blue-500 to-indigo-600'
                  return (
                    <div key={i} className="group border border-slate-200/80 bg-white rounded-2xl flex flex-col overflow-hidden hover:border-transparent hover:shadow-2xl hover:shadow-blue-500/8 transition-all duration-300">
                      <div className={`h-1.5 bg-gradient-to-r ${gradient} w-full`} />
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r ${gradient} text-white`}>
                            {s.category}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                            {s.level || 'Central'}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
                          {s.name}
                        </h3>
                        <p className="text-xs text-slate-500 mb-5 line-clamp-2 leading-relaxed flex-1">{s.description}</p>
                        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                          <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold border border-emerald-100">Rs</div>
                          <span className="text-xs font-bold text-slate-700 truncate">{s.benefit || 'Direct Benefit Transfer'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <Link to="/scheme/$slug" params={{ slug: s.slug }} className="text-center text-slate-700 text-xs font-bold py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                            Details
                          </Link>
                          <a href={s.application_url || s.source_url || '#'} target="_blank" rel="noopener noreferrer" className={`bg-gradient-to-r ${gradient} text-center text-white text-xs font-bold py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm`}>
                            Apply Now <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="animate-fade-in-up-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 uppercase tracking-wider mb-2">
              <Award className="w-3 h-3" /> Process
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">How Adhikar Works</h2>
            <p className="text-sm text-slate-500 mb-10">From eligibility to official disbursement in 4 steps</p>
            <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="hidden sm:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200" />
              {[
                { num: '01', title: 'Profile Setup', desc: 'Input age, state, income, and category.', color: 'from-blue-500 to-blue-600' },
                { num: '02', title: 'AI Matching', desc: 'Deterministic engine matches 500+ verified rules.', color: 'from-indigo-500 to-indigo-600' },
                { num: '03', title: 'Gemini Copilot', desc: 'AI guides documentation requirements.', color: 'from-violet-500 to-violet-600' },
                { num: '04', title: 'Direct Apply', desc: 'Redirects to official .gov.in portals.', color: 'from-emerald-500 to-emerald-600' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 group">
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg text-white flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform duration-300 z-10`}>
                    {step.num}
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link to="/eligibility" className="btn-shimmer text-white font-bold text-sm px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                Check My Eligibility <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/assistant" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-sm hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all">
                <Sparkles className="w-4 h-4" /> Talk to AI Copilot
              </Link>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* Instant Eligibility */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">Instant Eligibility</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 ml-10">Check schemes matching your profile in seconds</p>
            <form className="space-y-4">
              {[
                { label: 'State', opts: ['All States', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan', 'Bihar', 'Delhi', 'Madhya Pradesh'] },
                { label: 'Category', opts: ['All Categories', 'Agriculture', 'Healthcare', 'Education', 'Housing', 'Employment'] },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{f.label}</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-400/15 transition-all font-medium appearance-none cursor-pointer">
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                <input type="number" placeholder="e.g. 28" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-400/15 transition-all font-medium placeholder:text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: '/eligibility-results' })}
                className="w-full btn-shimmer text-white font-bold py-3.5 rounded-xl mt-2 flex items-center justify-center gap-2 text-sm hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-lg shadow-indigo-500/20"
              >
                <Zap className="w-4 h-4" /> Check My Matches
              </button>
              <p className="text-center text-[11px] text-slate-400 font-medium">
                Or <Link to="/register" className="text-indigo-600 font-bold hover:underline">create a free account</Link> for personalized tracking
              </p>
            </form>
          </div>

          {/* Official Portals */}
          <div className="relative overflow-hidden rounded-3xl p-7 mesh-bg text-white">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-blue-200 border border-white/15 mb-4">
                <ShieldCheck className="w-3 h-3" /> 100% Verified
              </div>
              <h4 className="font-black text-base text-white mb-2">Direct Government Applications</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                Every application links directly to authentic government domains (.gov.in / .nic.in). Zero middlemen, zero commissions.
              </p>
              <div className="space-y-2.5 mb-5">
                {['pmkisan.gov.in', 'pmjay.gov.in', 'pmaymis.gov.in', 'scholarships.gov.in'].map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-mono">{d}</span>
                  </div>
                ))}
              </div>
              <Link to="/schemes" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white transition">
                Browse All Schemes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="font-black text-sm text-slate-900">Platform Impact</h4>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Schemes Indexed', value: '500+', color: 'bg-blue-500' },
                { label: 'States Covered', value: '36/36', color: 'bg-emerald-500' },
                { label: 'Eligibility Rules', value: '1,200+', color: 'bg-violet-500' },
                { label: 'Official Sources', value: '100%', color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI CTA */}
          <Link to="/assistant" className="group block bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-breathe">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="font-black text-sm">Gemini AI Copilot</div>
                <div className="text-[11px] text-indigo-200">Ask anything about welfare schemes</div>
              </div>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed mb-4">
              "Which schemes am I eligible for as a farmer in Uttar Pradesh with Rs 1L annual income?"
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:gap-2.5 transition-all">
              <Globe className="w-3.5 h-3.5" /> Ask AI now <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}