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

// Categories definition
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
  const [schemes, setSchemes] = useState<PublicScheme[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#111827] overflow-x-hidden">

      {/* Hero Section — Warm Modern Aesthetic inspired by Khilao design */}
      <section className="relative mesh-warm min-h-[85vh] flex items-center pt-8 pb-16 overflow-hidden border-b border-[#EAE6DF]/70">
        
        {/* Subtle Ambient Warm Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-[#FF5B00]/8 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-[#FFB347]/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column — Typography & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Warm Pill Badge with Orange Dot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF4EC] text-[#D9480F] border border-[#FFE2D1] text-xs font-semibold shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#FF5B00] animate-pulse shrink-0" />
                <span>{t('hero.badge')}</span>
                <span className="text-[#D9480F]/40">•</span>
                <span className="text-[#D9480F]/80 font-normal">{t('hero.badge_sub')}</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111827] leading-[1.04]">
                <span>{t('hero.title1')}</span>
                <span className="text-[#FF5B00] block mt-1">{t('hero.title2')}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl">
                {t('hero.desc')}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/eligibility"
                  className="btn-pill-dark px-8 py-3.5 text-sm font-semibold shadow-sm flex items-center gap-2"
                >
                  <span>{t('hero.cta_primary')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/assistant"
                  className="btn-pill-light px-7 py-3.5 text-sm font-semibold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FF5B00]" />
                  <span>{t('hero.cta_secondary')}</span>
                </Link>
              </div>

              {/* Search Bar */}
              <form onSubmit={onSearch} className="pt-4 max-w-xl">
                <div className={`flex items-center gap-2 p-1.5 rounded-2xl bg-white border transition-all duration-200 ${focused ? 'border-[#FF5B00] shadow-[0_4px_24px_rgba(255,91,0,0.12)] ring-2 ring-[#FF5B00]/10' : 'border-[#EAE6DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'}`}>
                  <div className="flex flex-1 items-center gap-3 pl-3">
                    <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder={t('hero.search_placeholder')}
                      className="w-full bg-transparent py-2.5 text-sm text-[#111827] placeholder:text-neutral-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-pill-dark px-6 py-2.5 text-xs font-semibold shrink-0"
                  >
                    {t('hero.search_btn')}
                  </button>
                </div>
                <p className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5B00]" />
                  <span>{isHindi ? '42+ सत्यापित सरकारी योजनाएं (केंद्र एवं राजस्थान) • प्रति सप्ताह अपडेट' : '42+ verified Central & Rajasthan schemes • updated weekly'}</span>
                </p>
              </form>
            </div>

            {/* Right Column — Showcase Welfare Card Container */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-white border border-[#EAE6DF] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 overflow-hidden">
                
                {/* Decorative subtle header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-white">
                      <ShieldCheck className="w-4 h-4 text-[#FF5B00]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111827]">{isHindi ? 'राष्ट्रीय कल्याण गेटवे' : 'Official Welfare Gateway'}</p>
                      <p className="text-[10px] text-neutral-500 font-medium">Govt. of India & Rajasthan</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFF4EC] text-[#D9480F] border border-[#FFE2D1]">
                    Verified .gov.in
                  </span>
                </div>

                {/* Scheme Highlights Carousel / Cards */}
                <div className="space-y-3 pt-4">
                  
                  {/* Scheme 1: PM-KISAN */}
                  <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EAE6DF] hover:border-[#FF5B00]/40 transition group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Agriculture
                        </span>
                        <h4 className="text-sm font-bold text-[#111827] mt-1 group-hover:text-[#FF5B00] transition">
                          PM-KISAN Samman Nidhi
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 font-mono">₹6,000 / yr</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                      Direct cash transfer in 3 four-monthly installments of ₹2,000 each.
                    </p>
                  </div>

                  {/* Scheme 2: Ayushman Bharat */}
                  <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EAE6DF] hover:border-[#FF5B00]/40 transition group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          Healthcare
                        </span>
                        <h4 className="text-sm font-bold text-[#111827] mt-1 group-hover:text-[#FF5B00] transition">
                          Ayushman Bharat (PM-JAY)
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-rose-700 font-mono">₹5 Lakh cover</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                      Cashless secondary and tertiary hospitalization across empanelled hospitals.
                    </p>
                  </div>

                  {/* Scheme 3: Rajasthan Palanhar */}
                  <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EAE6DF] hover:border-[#FF5B00]/40 transition group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9480F] bg-[#FFF4EC] px-2 py-0.5 rounded-md">
                          Rajasthan State
                        </span>
                        <h4 className="text-sm font-bold text-[#111827] mt-1 group-hover:text-[#FF5B00] transition">
                          Palanhar Yojana
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-[#D9480F] font-mono">₹1,500 - ₹2,500/mo</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                      Monthly educational and nutritional assistance for eligible children in Rajasthan.
                    </p>
                  </div>
                </div>

                {/* Bottom Verification Banner */}
                <div className="mt-4 pt-3.5 border-t border-[#EAE6DF] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5B00]" />
                    <span>{isHindi ? '100% सटीक नियम इंजन' : 'Deterministic Rule Engine'}</span>
                  </div>
                  <Link to="/eligibility" className="text-xs font-bold text-[#FF5B00] hover:underline flex items-center gap-1">
                    <span>{isHindi ? 'पात्रता जांचें' : 'Check Matches'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

          {/* Metric Cards Row — Styled exactly like the screenshot's warm peach & soft blue cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Warm Peach Card (like the 100% card in screenshot) */}
            <div className="rounded-3xl bg-[#FFF6EF] border border-[#FFE2D1] p-6 text-left transition hover:shadow-md">
              <span className="text-3xl md:text-4xl font-black text-[#FF5B00]">100%</span>
              <h4 className="text-sm font-bold text-neutral-900 mt-2">{t('hero.stat_accuracy')}</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {t('hero.stat_accuracy_desc')}
              </p>
            </div>

            {/* Card 2: Soft Blue Card (like the Foodie card in screenshot) */}
            <div className="rounded-3xl bg-[#F2F7FF] border border-[#DCE8FC] p-6 text-left transition hover:shadow-md">
              <span className="text-3xl md:text-4xl font-black text-[#2563EB]">500+</span>
              <h4 className="text-sm font-bold text-neutral-900 mt-2">{t('hero.stat_schemes')}</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {t('hero.stat_schemes_desc')}
              </p>
            </div>

            {/* Card 3: Crisp Warm White Card */}
            <div className="rounded-3xl bg-white border border-[#EAE6DF] p-6 text-left transition hover:shadow-md">
              <span className="text-3xl md:text-4xl font-black text-[#111827]">₹50,000+ Cr</span>
              <h4 className="text-sm font-bold text-neutral-900 mt-2">{t('hero.stat_benefits')}</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {t('hero.stat_benefits_desc')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Scrolling trust marquee */}
      <div className="relative overflow-hidden border-b border-[#EAE6DF] bg-white py-3">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="animate-ticker flex w-max gap-8 whitespace-nowrap">
          {TRUST_BADGES.map((name, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 text-xs font-semibold text-neutral-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5B00]" />
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
                <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5B00]">
                  <Zap className="w-3 h-3" /> {isHindi ? 'योजना श्रेणियां' : 'Welfare Sectors'}
                </span>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">{t('categories.heading')}</h2>
                <p className="mt-1 text-sm text-neutral-500">{t('categories.subheading')}</p>
              </div>
              <Link to="/schemes" className="group flex items-center gap-1 text-xs font-bold text-[#FF5B00] hover:text-[#EA4C00]">
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
                    className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border border-[#EAE6DF] bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#FF5B00]/40"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF4EC] text-[#FF5B00] flex items-center justify-center transition-transform group-hover:scale-110">
                      {cat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827]">{title}</p>
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
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">
                  {isHindi ? 'उच्च-प्रभाव सरकारी योजनाएं' : 'High-Impact Welfare Schemes'}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {isHindi ? 'सत्यापित राष्ट्रीय एवं राज्य पोर्टलों से सीधे लाभ' : 'Direct benefit transfer from verified official portals'}
                </p>
              </div>
              <Link to="/schemes" className="group flex items-center gap-1 text-xs font-bold text-[#FF5B00] hover:text-[#EA4C00]">
                <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {schemes.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-3xl border border-[#EAE6DF] bg-white p-6 space-y-3">
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
                    <div key={i} className="group flex flex-col overflow-hidden rounded-3xl border border-[#EAE6DF] bg-white transition-all duration-200 hover:shadow-lg hover:border-[#FF5B00]/40">
                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <span className={`rounded-full bg-gradient-to-r ${grad} px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white`}>
                            {s.category}
                          </span>
                          <span className="rounded-full border border-[#EAE6DF] bg-[#FAF7F2] px-2.5 py-1 text-[10px] font-semibold text-neutral-500">
                            {s.level || 'Central'}
                          </span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-sm font-bold text-[#111827] group-hover:text-[#FF5B00] transition-colors">
                          {s.name}
                        </h3>
                        <p className="mb-5 line-clamp-2 flex-1 text-xs leading-relaxed text-neutral-500">
                          {s.description}
                        </p>
                        <div className="mb-5 flex items-center gap-2 border-b border-[#EAE6DF] pb-4">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF4EC] text-xs font-bold text-[#FF5B00]">₹</span>
                          <span className="truncate text-xs font-bold text-neutral-800">{s.benefit || 'Direct Benefit Transfer'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <Link to="/scheme/$slug" params={{ slug: s.slug }} className="rounded-full border border-[#EAE6DF] py-2.5 text-center text-xs font-bold text-neutral-700 transition hover:bg-[#FAF7F2]">
                            {isHindi ? 'विवरण' : 'Details'}
                          </Link>
                          <a href={s.application_url || s.source_url || '#'} target="_blank" rel="noopener noreferrer" className="btn-pill-dark py-2.5 text-center text-xs font-bold flex items-center justify-center gap-1.5">
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

          {/* How It Works Process */}
          <div className="rounded-3xl border border-[#EAE6DF] bg-white p-8 shadow-xs">
            <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5B00]">
              <Award className="w-3.5 h-3.5" /> {isHindi ? 'कार्यप्रणाली' : 'Architecture'}
            </span>
            <h2 className="mb-1 text-2xl font-black text-[#111827] tracking-tight">
              {isHindi ? 'अधिकार कैसे कार्य करता है?' : 'How Adhikar Works'}
            </h2>
            <p className="mb-8 text-sm text-neutral-500">
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
                  <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-white flex items-center justify-center font-black text-sm">
                    {step.num}
                  </div>
                  <p className="text-sm font-bold text-[#111827]">{step.title}</p>
                  <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#EAE6DF] flex flex-wrap gap-3">
              <Link to="/eligibility" className="btn-pill-dark px-7 py-3 text-xs font-semibold">
                {t('hero.cta_primary')}
              </Link>
              <Link to="/assistant" className="btn-pill-light px-6 py-3 text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5B00]" />
                <span>{t('hero.cta_secondary')}</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Quick Eligibility Card */}
          <div className="rounded-3xl border border-[#EAE6DF] bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-white">
                <CheckCircle2 className="w-4 h-4 text-[#FF5B00]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111827]">{isHindi ? 'त्वरित पात्रता जांच' : 'Instant Eligibility'}</h3>
                <p className="text-[11px] text-neutral-500">{isHindi ? 'कुछ सेकंड में अपनी योजनाएं जानें' : 'Find matching schemes in seconds'}</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-neutral-700">{isHindi ? 'राज्य' : 'State'}</label>
                <select className="w-full rounded-2xl border border-[#EAE6DF] bg-[#FAF7F2] px-3.5 py-2.5 text-xs font-medium text-neutral-700 focus:outline-none focus:border-[#FF5B00]">
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
                className="btn-pill-dark w-full py-3 text-xs font-semibold mt-2"
              >
                {isHindi ? 'मेरी योजनाएं देखें' : 'Check My Matches'}
              </button>
            </div>
          </div>

          {/* Trust Official Portals Card */}
          <div className="rounded-3xl bg-[#0A0A0A] p-6 text-white shadow-md">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF8533]">
              <ShieldCheck className="w-3 h-3 text-[#FF5B00]" /> {isHindi ? '100% आधिकारिक स्रोत' : '100% Verified Sources'}
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
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5B00] shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
            <Link to="/schemes" className="text-xs font-bold text-[#FF8533] hover:underline flex items-center gap-1">
              <span>{isHindi ? 'सभी योजनाएं देखें' : 'Browse All Schemes'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
