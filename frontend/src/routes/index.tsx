import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import {
  Search, ArrowRight, Building2, Briefcase, Leaf, Users, HeartPulse,
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

// Static data — defined outside component so they are not recreated on every render
const CATEGORIES = [
  { icon: <Leaf className="w-5 h-5" />,         title: 'Agriculture',   color: 'from-emerald-500 to-green-600' },
  { icon: <Briefcase className="w-5 h-5" />,     title: 'Employment',    color: 'from-blue-500 to-blue-600' },
  { icon: <Building2 className="w-5 h-5" />,     title: 'Education',     color: 'from-indigo-500 to-blue-700' },
  { icon: <HeartPulse className="w-5 h-5" />,    title: 'Healthcare',    color: 'from-rose-500 to-red-600' },
  { icon: <Accessibility className="w-5 h-5" />, title: 'Disability',    color: 'from-violet-500 to-purple-600' },
  { icon: <Users className="w-5 h-5" />,         title: 'Women',         color: 'from-pink-500 to-rose-500' },
  { icon: <CheckCircle2 className="w-5 h-5" />,  title: 'Housing',       color: 'from-amber-500 to-orange-600' },
  { icon: <MoreHorizontal className="w-5 h-5" />,title: 'Social Welfare',color: 'from-slate-500 to-slate-600' },
]

const CAT_COLORS: Record<string, string> = {
  Agriculture:    'from-emerald-500 to-green-600',
  Employment:     'from-blue-500 to-blue-700',
  Housing:        'from-amber-500 to-orange-500',
  Healthcare:     'from-rose-500 to-red-600',
  Education:      'from-indigo-500 to-blue-700',
  'Social Welfare':'from-violet-500 to-purple-600',
  Women:          'from-pink-500 to-rose-500',
  Disability:     'from-purple-500 to-violet-600',
}

// Duplicated to fill the marquee without JS
const TRUST_BADGES = [
  'PM-KISAN','Ayushman Bharat','PMAY','NSP Scholarships','e-Shram',
  'PM Vishwakarma','MGNREGA','Jan Dhan','Sukanya Samriddhi','Atal Pension',
  'PM-KISAN','Ayushman Bharat','PMAY','NSP Scholarships','e-Shram',
  'PM Vishwakarma','MGNREGA','Jan Dhan','Sukanya Samriddhi','Atal Pension',
]

const HOW_STEPS = [
  { num: '01', title: 'Profile Setup',   desc: 'Input age, state, income and category.',             color: 'from-blue-500 to-blue-600' },
  { num: '02', title: 'AI Matching',     desc: 'Engine matches 500+ verified eligibility rules.',    color: 'from-indigo-500 to-indigo-600' },
  { num: '03', title: 'Gemini Copilot',  desc: 'AI guides you through document requirements.',      color: 'from-violet-500 to-violet-600' },
  { num: '04', title: 'Direct Apply',    desc: 'Opens official .gov.in portal for direct application.',color: 'from-emerald-500 to-emerald-600' },
]

// Scroll-triggered visibility hook
function useVisible(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function StatCard({ value, label }: { value: string; label: string }) {
  const { ref, visible } = useVisible()
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      <p className="text-2xl md:text-3xl font-black text-white">{value}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
    </div>
  )
}

function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [schemes, setSchemes] = useState<PublicScheme[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    schemesApi.list(0, 100)
      .then(res => {
        const c: Record<string, number> = {}
        res.items.forEach(s => { c[s.category] = (c[s.category] || 0) + 1 })
        setCounts(c)
        setSchemes(res.items.slice(0, 6))
      })
      .catch(console.error)
  }, [])

  if (user) return <Navigate to="/dashboard" replace />

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/schemes', search: { category: query.trim() || undefined } as any })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">

      {/* Hero */}
      <section className="relative mesh-bg min-h-[88vh] flex items-center overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-breathe" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[90px] animate-breathe" style={{ animationDelay: '2s' }} />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">

            {/* Live badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-xs font-semibold text-blue-200 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-sm absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Welfare Intelligence &middot; Powered by Gemini AI</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/80">v2.0</span>
            </div>

            <h1 className="mb-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white">
              <span className="animate-fade-in-up block">Every Citizen</span>
              <span className="animate-fade-in-up-1 block">
                Entitlement.{' '}
                <span className="text-gradient-hero">One Click.</span>
              </span>
            </h1>

            <p className="animate-fade-in-up-2 mb-10 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Bridging India's welfare gap with AI &amp; deterministic eligibility engines.
              Discover benefits, verify eligibility, and apply directly to official government portals.
            </p>

            {/* Search */}
            <form onSubmit={onSearch} className="animate-fade-in-up-3 max-w-2xl mx-auto mb-10">
              <div className={`flex items-center gap-2 p-2 rounded-2xl transition-all duration-300 glass-dark ${focused ? 'shadow-[0_0_0_2px_rgba(99,102,241,.5),0_20px_60px_rgba(0,0,0,.4)]' : 'shadow-[0_8px_40px_rgba(0,0,0,.3)]'}`}>
                <div className="flex flex-1 items-center gap-3 pl-3">
                  <Search className="w-5 h-5 shrink-0 text-slate-400" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Search schemes — PM-KISAN, Ayushman, Housing…"
                    className="w-full bg-transparent py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
                <button type="submit" className="btn-shimmer flex shrink-0 items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[.98]">
                  Explore <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2.5 text-center text-xs text-slate-500">500+ verified government schemes &middot; updated weekly</p>
            </form>

            {/* Stats */}
            <div className="animate-fade-in-up-4 grid grid-cols-3 gap-6 max-w-xl mx-auto border-t border-white/10 pt-8">
              <StatCard value="50K+ Cr" label="Benefits Unlocked" />
              <StatCard value="500+"    label="Schemes Indexed" />
              <StatCard value="100%"    label="Official Portals" />
            </div>
          </div>
        </div>

        {/* Bottom fade into light bg */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Scrolling trust marquee */}
      <div className="relative overflow-hidden border-y border-slate-200 bg-white py-3.5">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="animate-ticker flex w-max gap-8 whitespace-nowrap">
          {TRUST_BADGES.map((name, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 text-xs font-semibold text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Body: categories + schemes + sidebar */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-12">

          {/* Categories */}
          <div>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                  <Zap className="w-3 h-3" /> Categories
                </span>
                <h2 className="text-2xl font-black tracking-tight">Find Schemes by Sector</h2>
                <p className="mt-1 text-sm text-slate-500">Welfare initiatives for every demographic</p>
              </div>
              <Link to="/schemes" className="group flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                All Schemes <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.title}
                  to="/schemes"
                  search={{ category: cat.title } as any}
                  className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{cat.title}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{counts[cat.title] || 0} Schemes</p>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                </Link>
              ))}
            </div>
          </div>

          {/* Featured schemes */}
          <div>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                  <Star className="w-3 h-3" /> Featured
                </span>
                <h2 className="text-2xl font-black tracking-tight">High-Impact Welfare Schemes</h2>
                <p className="mt-1 text-sm text-slate-500">DBT benefits from verified national portals</p>
              </div>
              <Link to="/schemes" className="group flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                All Schemes <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {schemes.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-slate-100">
                    <div className="skeleton h-1.5 w-full" />
                    <div className="space-y-3 p-6">
                      <div className="skeleton h-4 w-1/3" />
                      <div className="skeleton h-5 w-full" />
                      <div className="skeleton h-4 w-4/5" />
                      <div className="skeleton mt-4 h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {schemes.map((s, i) => {
                  const grad = CAT_COLORS[s.category] || 'from-blue-500 to-indigo-600'
                  return (
                    <div key={i} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:shadow-blue-500/8">
                      <div className={`h-1.5 bg-gradient-to-r ${grad}`} />
                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <span className={`rounded-full bg-gradient-to-r ${grad} px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white`}>
                            {s.category}
                          </span>
                          <span className="rounded-full border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-400">
                            {s.level || 'Central'}
                          </span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-sm font-black leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
                          {s.name}
                        </h3>
                        <p className="mb-5 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">
                          {s.description}
                        </p>
                        <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-xs font-bold text-emerald-700">₹</span>
                          <span className="truncate text-xs font-bold text-slate-700">{s.benefit || 'Direct Benefit Transfer'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <Link to="/scheme/$slug" params={{ slug: s.slug }} className="rounded-xl border border-slate-200 py-2.5 text-center text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                            Details
                          </Link>
                          <a href={s.application_url || s.source_url || '#'} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${grad} py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:opacity-90`}>
                            Apply <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600">
              <Award className="w-3 h-3" /> Process
            </span>
            <h2 className="mb-1 text-2xl font-black tracking-tight">How Adhikar Works</h2>
            <p className="mb-10 text-sm text-slate-500">From eligibility check to official disbursement in 4 steps</p>

            <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-4">
              <div className="absolute top-7 left-[12.5%] right-[12.5%] hidden h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200 sm:block" />
              {HOW_STEPS.map((step, i) => (
                <div key={i} className="group z-10 flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-lg font-black text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    {step.num}
                  </div>
                  <p className="text-sm font-black text-slate-900">{step.title}</p>
                  <p className="text-xs leading-relaxed text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/eligibility" className="btn-shimmer flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[.98]">
                Check My Eligibility <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/assistant" className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
                <Sparkles className="w-4 h-4" /> Talk to AI Copilot
              </Link>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Quick eligibility form */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Instant Eligibility</h3>
                <p className="text-[11px] text-slate-500">Check matching schemes in seconds</p>
              </div>
            </div>
            <div className="space-y-3.5">
              {[
                { label: 'State', opts: ['All States','Uttar Pradesh','Maharashtra','Rajasthan','Bihar','Delhi','MP'] },
                { label: 'Category', opts: ['All Categories','Agriculture','Healthcare','Education','Housing','Employment'] },
              ].map(f => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">{f.label}</label>
                  <select className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-medium text-slate-700 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/20">
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Age</label>
                <input type="number" placeholder="e.g. 28" className="field text-xs py-2.5" />
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: '/eligibility-results' })}
                className="btn-shimmer mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-transform hover:scale-[1.01] active:scale-[.99]"
              >
                <Zap className="w-4 h-4" /> Check My Matches
              </button>
              <p className="text-center text-[11px] text-slate-400">
                Or <Link to="/register" className="font-bold text-indigo-600 hover:underline">create an account</Link> for personalized tracking
              </p>
            </div>
          </div>

          {/* Trust card */}
          <div className="relative overflow-hidden rounded-3xl mesh-bg p-7 text-white">
            <div className="relative z-10">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-200">
                <ShieldCheck className="w-3 h-3" /> 100% Verified Sources
              </span>
              <h4 className="mb-2 text-base font-black">Direct Government Applications</h4>
              <p className="mb-5 text-xs leading-relaxed text-slate-300">
                Every application links to authentic government domains (.gov.in / .nic.in). No middlemen, no fees.
              </p>
              <div className="mb-5 space-y-2">
                {['pmkisan.gov.in','pmjay.gov.in','pmaymis.gov.in','scholarships.gov.in'].map(d => (
                  <div key={d} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span className="font-mono">{d}</span>
                  </div>
                ))}
              </div>
              <Link to="/schemes" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 transition hover:text-white">
                Browse All Schemes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Platform stats */}
          <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-black text-slate-900">Platform Stats</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Schemes Indexed',  value: '500+',   dot: 'bg-blue-500' },
                { label: 'States Covered',   value: '36/36',  dot: 'bg-emerald-500' },
                { label: 'Eligibility Rules',value: '1,200+', dot: 'bg-violet-500' },
                { label: 'Official Sources', value: '100%',   dot: 'bg-amber-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                    <span className="text-xs font-medium text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI CTA */}
          <Link to="/assistant" className="group block rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/30">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 animate-breathe">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-sm font-black">Gemini AI Copilot</p>
                <p className="text-[11px] text-indigo-200">Ask anything about welfare schemes</p>
              </div>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-indigo-200">
              "Which schemes am I eligible for as a farmer in UP with ₹1L annual income?"
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2.5">
              <Globe className="w-3.5 h-3.5" /> Ask AI now <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}