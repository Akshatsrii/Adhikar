import { FALLBACK_SCHEMES } from '@/data/fallbackSchemes'
import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import {
  Search, ArrowRight, Building2, Briefcase, Leaf, Users, HeartPulse,
  Accessibility, MoreHorizontal, Sparkles, ExternalLink, CheckCircle2,
  Zap, ShieldCheck, ChevronRight, Star, Award
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const CATEGORIES = [
  { icon: <Leaf className="w-5 h-5" />,          key: 'agriculture', defaultTitle: 'Agriculture',    color: 'from-emerald-500 to-green-600' },
  { icon: <Briefcase className="w-5 h-5" />,      key: 'employment',  defaultTitle: 'Employment',     color: 'from-blue-500 to-blue-600' },
  { icon: <Building2 className="w-5 h-5" />,      key: 'education',   defaultTitle: 'Education',      color: 'from-amber-500 to-orange-600' },
  { icon: <HeartPulse className="w-5 h-5" />,     key: 'healthcare',  defaultTitle: 'Healthcare',     color: 'from-rose-500 to-red-600' },
  { icon: <Accessibility className="w-5 h-5" />,  key: 'disability',  defaultTitle: 'Disability',     color: 'from-purple-500 to-violet-600' },
  { icon: <Users className="w-5 h-5" />,          key: 'women',       defaultTitle: 'Women',          color: 'from-pink-500 to-rose-500' },
  { icon: <CheckCircle2 className="w-5 h-5" />,   key: 'housing',     defaultTitle: 'Housing',        color: 'from-orange-500 to-amber-600' },
  { icon: <MoreHorizontal className="w-5 h-5" />, key: 'social',      defaultTitle: 'Social Welfare', color: 'from-neutral-500 to-neutral-700' },
]

const CAT_COLORS: Record<string, string> = {
  Agriculture:    'from-emerald-500 to-green-600',
  Employment:     'from-blue-500 to-blue-700',
  Housing:        'from-amber-500 to-orange-500',
  Healthcare:     'from-rose-500 to-red-600',
  Education:      'from-amber-500 to-orange-600',
  'Social Welfare':'from-neutral-600 to-neutral-800',
  Women:          'from-pink-500 to-rose-500',
  Disability:     'from-purple-500 to-violet-600',
}

const TRUST_BADGES = [
  'PM-KISAN', 'Ayushman Bharat', 'PMAY Housing', 'NSP Scholarships', 'e-Shram',
  'Rajasthan Chiranjeevi/MAA', 'Palanhar Yojana', 'PM Vishwakarma', 'MGNREGA', 'Jan Dhan',
  'PM-KISAN', 'Ayushman Bharat', 'PMAY Housing', 'NSP Scholarships', 'e-Shram',
  'Rajasthan Chiranjeevi/MAA', 'Palanhar Yojana', 'PM Vishwakarma', 'MGNREGA', 'Jan Dhan',
]

function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const [schemes, setSchemes] = useState<PublicScheme[]>(() => FALLBACK_SCHEMES.slice(0, 6))
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const c: Record<string, number> = {}
    FALLBACK_SCHEMES.forEach(s => { c[s.category] = (c[s.category] || 0) + 1 })
    return c
  })
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const isHindi = i18n.language?.startsWith('hi')

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
    <div className="min-h-screen bg-[#FAF8F5] text-black overflow-x-hidden font-sans">

      {/* Main Hero Container — High-Trust Citizen Welfare Gateway with Warm Ivory & Orange Theme */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-14">
        
        {/* Top Hero Grid: Left Card + Right Column (Emblem Card + Bottom Two Stat Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Block — Clean Enclosed Rounded Card with Warm Glow, Badge, Massive Heading & Dual Pills */}
          <div className="lg:col-span-7 rounded-[36px] bg-white border border-[#EAE6DF] p-8 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between space-y-8">
            
            {/* Top-Right Soft Amber/Orange Ambient Glow */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 rounded-full bg-gradient-to-br from-[#FFE8D6]/80 via-[#FFF4EB]/30 to-transparent blur-2xl -z-0" />

            <div className="relative z-10 space-y-6">
              {/* Official DBT Badge with Orange Dot */}
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF2E8] border border-[#FFD6BA] text-[#EA580C] text-xs font-bold shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-[#FF5500] shrink-0" />
                  <span>{isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT) एवं आधिकारिक सरकारी पोर्टल' : 'Direct Benefit Transfer (DBT) & Official Portals'}</span>
                </span>
              </div>

              {/* Massive Bold Heading with Vibrant Orange Line */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight leading-[1.04]">
                {isHindi ? 'आपका नागरिक अधिकार।' : 'Your Citizen Rights.'}<br />
                <span className="text-[#FF5500] block mt-1">
                  {isHindi ? 'हर सरकारी योजना।' : 'Every Welfare Scheme.'}
                </span>
              </h1>

              {/* Crisp, Relaxed Subtitle */}
              <p className="text-base sm:text-lg text-[#52525B] leading-relaxed max-w-xl font-normal">
                {isHindi
                  ? 'भारतीय नागरिकों के लिए सरकारी योजनाओं को खोजने, 100% सटीक पात्रता जांचने और बिना किसी बिचौलिये के सीधे .gov.in पोर्टलों पर आवेदन करने का सबसे आधुनिक एवं विश्वसनीय मंच।'
                  : 'A high-trust national intelligence platform to discover government schemes, verify deterministic eligibility with zero AI hallucinations, and apply directly on verified .gov.in endpoints.'}
              </p>

              {/* Dual Pill Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {/* Black Pill: Explore Schemes */}
                <Link
                  to="/schemes"
                  className="bg-black hover:bg-neutral-800 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all hover:scale-[1.02] shadow-sm flex items-center gap-2"
                >
                  <span>{isHindi ? 'योजनाएं देखें' : 'Explore Schemes'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* White Pill with Sparkle Icon: Ask AI Copilot */}
                <Link
                  to="/assistant"
                  className="bg-white hover:bg-neutral-50 text-black border border-[#EAE6DF] font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:scale-[1.02] shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FF5500]" />
                  <span>{isHindi ? 'एआई सहायक से पूछें' : 'Ask AI Copilot'}</span>
                </Link>
              </div>
            </div>

            {/* Integrated Search Bar inside Card */}
            <form onSubmit={onSearch} className="relative z-10 pt-4 w-full">
              <div className={`flex items-center gap-2 p-1.5 rounded-2xl bg-white border transition-all duration-200 ${focused ? 'border-[#FF5500] shadow-[0_4px_24px_rgba(255,85,0,0.12)] ring-2 ring-[#FF5500]/10' : 'border-[#EAE6DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'}`}>
                <div className="flex flex-1 items-center gap-3 pl-3">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={isHindi ? 'योजना खोजें — पीएम किसान, आयुष्मान, आवास, छात्रवृत्ति...' : 'Search schemes — PM-KISAN, Ayushman, Housing, Scholarships...'}
                    className="w-full bg-transparent py-2.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white font-bold px-6 py-2.5 text-xs rounded-full shrink-0 transition"
                >
                  {isHindi ? 'खोजें' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column — Red Fort with Indian Flag Card on Top + Two Stat Cards at the Bottom */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Top: Red Fort with Indian National Flag */}
            <div className="rounded-[36px] overflow-hidden border border-[#EAE6DF] relative shadow-xs flex-1 min-h-[340px] group bg-neutral-900">
              <img
                src="/red-fort-flag.jpg"
                alt="Red Fort New Delhi with Indian National Flag"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              
              {/* Subtle Gradient Overlay for High Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Verified Badge on Top Left */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-white/40 rounded-full px-3 py-1 shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-wide">
                  {isHindi ? 'सत्यमेव जयते' : 'Satyameva Jayate'}
                </span>
              </div>

              {/* Top Right Portals Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 shadow-md text-white text-[10px] font-semibold">
                🇮🇳 {isHindi ? 'भारत सरकार' : 'Govt of India'}
              </div>

              {/* Bottom Caption Pill over Image */}
              <div className="absolute bottom-4 inset-x-4">
                <div className="bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold leading-tight">
                        {isHindi ? 'लाल किला, नई दिल्ली' : 'Red Fort, New Delhi'}
                      </p>
                      <p className="text-[10px] text-neutral-300">
                        {isHindi ? 'मेरी सरकार, मेरा अधिकार · प्रत्यक्ष लाभ अंतरण' : 'Citizen Welfare & Constitutional Rights Gateway'}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF8533] bg-white/10 px-2.5 py-1 rounded-full border border-white/10 shrink-0">
                      DBT Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: 2 Small Stat Cards (100% Peach + Sky Blue) */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              
              {/* Left Card: 100% Peach Card */}
              <div className="rounded-[32px] bg-[#FFF7ED] border border-[#FFEDD5] p-6 text-left transition hover:shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#FF5500] tracking-tight">100%</span>
                  <h4 className="text-sm font-bold text-black mt-2">
                    {isHindi ? 'सटीक नियम इंजन' : 'Deterministic Engine'}
                  </h4>
                </div>
                <p className="text-[11px] text-[#71717A] mt-1 leading-relaxed">
                  {isHindi
                    ? '500+ सत्यापित सरकारी नियम व जीरो एआई भ्रम'
                    : 'Zero hallucinations with 500+ verified gazette rules'}
                </p>
              </div>

              {/* Right Card: Sky Blue Card */}
              <div className="rounded-[32px] bg-[#EFF6FF] border border-[#DBEAFE] p-6 text-left transition hover:shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#1A56DB] tracking-tight">
                    {isHindi ? '₹5 लाख+' : '₹5 Lakh+'}
                  </span>
                  <h4 className="text-sm font-bold text-black mt-2">
                    {isHindi ? 'मुफ्त स्वास्थ्य सुरक्षा' : 'Cashless Healthcare'}
                  </h4>
                </div>
                <p className="text-[11px] text-[#71717A] mt-1 leading-relaxed">
                  {isHindi
                    ? 'आयुष्मान भारत के तहत 100% कैशलेस अस्पताल इलाज'
                    : 'Secondary & tertiary hospital cover under Ayushman Bharat'}
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Scrolling trust marquee */}
      <div className="relative overflow-hidden border-y border-[#EAE6DF] bg-white py-3">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="animate-ticker flex w-max gap-8 whitespace-nowrap">
          {TRUST_BADGES.map((name, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 text-xs font-semibold text-neutral-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500]" />
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Categories & Main Explorer */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-12">

          {/* Categories Grid */}
          <div>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
                  <Zap className="w-3 h-3" /> {isHindi ? 'योजना श्रेणियां' : 'Welfare Sectors'}
                </span>
                <h2 className="text-2xl font-black text-black tracking-tight">{t('categories.heading')}</h2>
                <p className="mt-1 text-sm text-[#52525B]">{t('categories.subheading')}</p>
              </div>
              <Link to="/schemes" className="group flex items-center gap-1 text-xs font-bold text-[#FF5500] hover:text-[#EA4C00]">
                <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CATEGORIES.map(cat => {
                const title = t(`categories.${cat.key}`) || cat.defaultTitle
                return (
                  <Link
                    key={cat.key}
                    to="/schemes"
                    search={{ category: cat.defaultTitle } as any}
                    className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-[24px] border border-[#EAE6DF] bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#FF5500]/40"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF2E8] text-[#FF5500] flex items-center justify-center transition-transform group-hover:scale-110">
                      {cat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">{title}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-neutral-400">{counts[cat.defaultTitle] || 0} {isHindi ? 'योजनाएं' : 'Schemes'}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Featured Schemes */}
          <div>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                  <Star className="w-3 h-3" /> {isHindi ? 'विशेष योजनाएं' : 'Flagship Programs'}
                </span>
                <h2 className="text-2xl font-black text-black tracking-tight">
                  {isHindi ? 'उच्च-प्रभाव सरकारी योजनाएं' : 'High-Impact Welfare Schemes'}
                </h2>
                <p className="mt-1 text-sm text-[#52525B]">
                  {isHindi ? 'सत्यापित राष्ट्रीय एवं राज्य पोर्टलों से सीधे लाभ' : 'Direct benefit transfer from verified official portals'}
                </p>
              </div>
              <Link to="/schemes" className="group flex items-center gap-1 text-xs font-bold text-[#FF5500] hover:text-[#EA4C00]">
                <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {schemes.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-[24px] border border-[#EAE6DF] bg-white p-6 space-y-3">
                    <div className="skeleton h-4 w-1/3" />
                    <div className="skeleton h-5 w-full" />
                    <div className="skeleton h-4 w-4/5" />
                    <div className="skeleton mt-4 h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {schemes.map((s, i) => {
                  const grad = CAT_COLORS[s.category] || 'from-neutral-800 to-black'
                  return (
                    <div key={i} className="group flex flex-col overflow-hidden rounded-[28px] border border-[#EAE6DF] bg-white transition-all duration-200 hover:shadow-lg hover:border-[#FF5500]/40">
                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <span className={`rounded-full bg-gradient-to-r ${grad} px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white`}>
                            {s.category}
                          </span>
                          <span className="rounded-full border border-[#EAE6DF] bg-[#FAF8F5] px-2.5 py-1 text-[10px] font-semibold text-neutral-500">
                            {s.level || 'Central'}
                          </span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-sm font-bold text-black group-hover:text-[#FF5500] transition-colors">
                          {s.name}
                        </h3>
                        <p className="mb-5 line-clamp-2 flex-1 text-xs leading-relaxed text-[#52525B]">
                          {s.description}
                        </p>
                        <div className="mb-5 flex items-center gap-2 border-b border-[#EAE6DF] pb-4">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF2E8] text-xs font-bold text-[#FF5500]">₹</span>
                          <span className="truncate text-xs font-bold text-neutral-800">{s.benefit || 'Direct Benefit Transfer'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <Link to="/scheme/$slug" params={{ slug: s.slug }} className="rounded-full border border-[#EAE6DF] py-2.5 text-center text-xs font-bold text-neutral-700 transition hover:bg-[#FAF8F5]">
                            {isHindi ? 'विवरण' : 'Details'}
                          </Link>
                          <a href={s.application_url || s.source_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-neutral-800 text-white font-bold py-2.5 rounded-full text-center text-xs flex items-center justify-center gap-1.5 transition">
                            <span>{isHindi ? 'आवेदन करें' : 'Apply'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Process Section */}
          <div className="rounded-[32px] border border-[#EAE6DF] bg-white p-8 shadow-xs">
            <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
              <Award className="w-3.5 h-3.5" /> {isHindi ? 'कार्यप्रणाली' : 'Architecture'}
            </span>
            <h2 className="mb-1 text-2xl font-black text-black tracking-tight">
              {isHindi ? 'अधिकार कैसे कार्य करता है?' : 'How Adhikar Works'}
            </h2>
            <p className="mb-8 text-sm text-[#52525B]">
              {isHindi ? 'पात्रता जांच से लेकर आधिकारिक सरकारी आवेदन तक केवल 4 चरणों में' : 'From eligibility verification to official disbursement in 4 simple steps'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                { num: '01', title: isHindi ? 'प्रोफ़ाइल दर्ज करें' : 'Profile Setup', desc: isHindi ? 'आयु, राज्य, वार्षिक आय एवं श्रेणी चुनें।' : 'Input age, state, income and category.' },
                { num: '02', title: isHindi ? 'सटीक नियम मिलान' : 'Rule Matching', desc: isHindi ? '500+ सरकारी पात्रता नियमों से 100% सटीक जांच।' : 'Engine matches verified official eligibility rules.' },
                { num: '03', title: isHindi ? 'एआई मार्गदर्शन' : 'AI Guidance', desc: isHindi ? 'दस्तावेज़ एवं आवेदन प्रक्रिया की तत्काल जानकारी।' : 'Instant guidance on required gazettes & forms.' },
                { num: '04', title: isHindi ? 'सीधा सरकारी आवेदन' : 'Direct Apply', desc: isHindi ? 'बिना बिचौलियों के आधिकारिक .gov.in पोर्टल पर जाएं।' : 'Opens official .gov.in portal for direct submission.' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-sm">
                    {step.num}
                  </div>
                  <p className="text-sm font-bold text-black">{step.title}</p>
                  <p className="text-xs text-[#52525B] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#EAE6DF] flex flex-wrap gap-3">
              <Link to="/eligibility" className="bg-black hover:bg-neutral-800 text-white font-bold px-7 py-3 rounded-full text-xs shadow-sm transition">
                {t('hero.cta_primary')}
              </Link>
              <Link to="/assistant" className="bg-white hover:bg-neutral-50 text-[#1A56DB] border border-[#E5E7EB] font-bold px-6 py-3 rounded-full text-xs flex items-center gap-2 transition">
                <Sparkles className="w-3.5 h-3.5 text-[#1A56DB]" />
                <span>{t('hero.cta_secondary')}</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Quick Eligibility Card */}
          <div className="rounded-[32px] border border-[#EAE6DF] bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white">
                <CheckCircle2 className="w-4 h-4 text-[#FF5500]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black">{isHindi ? 'त्वरित पात्रता जांच' : 'Instant Eligibility'}</h3>
                <p className="text-[11px] text-[#52525B]">{isHindi ? 'कुछ सेकंड में अपनी योजनाएं जानें' : 'Find matching schemes in seconds'}</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-neutral-700">{isHindi ? 'राज्य' : 'State'}</label>
                <select className="w-full rounded-2xl border border-[#EAE6DF] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-medium text-neutral-700 focus:outline-none focus:border-[#FF5500]">
                  {['All States', 'Rajasthan', 'Uttar Pradesh', 'Maharashtra', 'Bihar', 'Delhi', 'Madhya Pradesh'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-neutral-700">{isHindi ? 'आयु' : 'Age'}</label>
                <input type="number" placeholder="e.g. 28" className="field text-xs py-2" />
              </div>

              <button
                type="button"
                onClick={() => navigate({ to: '/eligibility-results' })}
                className="bg-black hover:bg-neutral-800 text-white font-bold w-full py-3 rounded-full text-xs mt-2 transition"
              >
                {isHindi ? 'मेरी योजनाएं देखें' : 'Check My Matches'}
              </button>
            </div>
          </div>

          {/* Trust Official Portals Card */}
          <div className="rounded-[32px] bg-black p-6 text-white shadow-md">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FFA45B]">
              <ShieldCheck className="w-3 h-3 text-[#FF5500]" /> {isHindi ? '100% आधिकारिक स्रोत' : '100% Verified Sources'}
            </span>
            <h4 className="text-base font-bold text-white mb-2">
              {isHindi ? 'सीधे सरकारी आवेदन' : 'Direct Government Portals'}
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {isHindi ? 'प्रत्येक आवेदन आधिकारिक .gov.in या .nic.in डोमेन से सीधे जुड़ा है। कोई शुल्क नहीं, कोई बिचौलिया नहीं।' : 'Every application links directly to verified .gov.in domains with zero intermediaries.'}
            </p>
            <div className="space-y-2 mb-4">
              {['pmkisan.gov.in', 'pmjay.gov.in', 'sso.rajasthan.gov.in', 'scholarships.gov.in'].map(d => (
                <div key={d} className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
            <Link to="/schemes" className="text-xs font-bold text-[#FFA45B] hover:underline flex items-center gap-1">
              <span>{isHindi ? 'सभी योजनाएं देखें' : 'Browse All Schemes'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
