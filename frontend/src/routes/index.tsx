import { FALLBACK_SCHEMES } from '@/data/fallbackSchemes'
import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import {
  Search, ArrowRight, Users,
  Sparkles, ExternalLink, CheckCircle2, ShieldCheck, ChevronRight,
  Star, Layers, Building,
  FileText, Target, MapPin
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const CITIZEN_ARCHETYPES = [
  {
    title: 'Farmers',
    category: 'Agriculture',
    cardImg: '/archetypes/card-farmer.png',
  },
  {
    title: 'Students',
    category: 'Education',
    cardImg: '/archetypes/card-student.png',
  },
  {
    title: 'Women',
    category: 'Women',
    cardImg: '/archetypes/card-woman.png',
  },
  {
    title: 'Senior Citizens',
    category: 'Social Welfare',
    cardImg: '/archetypes/card-senior.png',
  },
  {
    title: 'Entrepreneurs',
    category: 'Employment',
    cardImg: '/archetypes/card-entrepreneur.png',
  },
  {
    title: 'Labourers',
    category: 'Employment',
    cardImg: '/archetypes/card-labourer.png',
  },
]

const STAT_METRICS = [
  {
    num: '500+',
    label: 'Government Schemes',
    icon: <Layers className="w-4 h-4 text-[#FF5500]" />,
  },
  {
    num: '36+',
    label: 'Central Ministries',
    icon: <Users className="w-4 h-4 text-[#FF5500]" />,
  },
  {
    num: 'All States & UTs',
    label: 'Coverage',
    icon: <MapPin className="w-4 h-4 text-[#FF5500]" />,
  },
  {
    num: '100% Verified',
    label: 'Official .gov.in Links',
    icon: <ShieldCheck className="w-4 h-4 text-[#FF5500]" />,
  },
  {
    num: 'AI-Powered',
    label: 'Personalized Recommendations',
    icon: <Sparkles className="w-4 h-4 text-[#FF5500]" />,
  },
]

const HOW_IT_WORKS_STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'Find relevant schemes',
    icon: <Search className="w-4 h-4 text-[#FF5500]" />,
  },
  {
    num: '02',
    title: 'Check Eligibility',
    desc: 'Verify with transparent rules',
    icon: <ShieldCheck className="w-4 h-4 text-[#FF5500]" />,
  },
  {
    num: '03',
    title: 'Verify Documents',
    desc: 'Get required document list',
    icon: <FileText className="w-4 h-4 text-[#FF5500]" />,
  },
  {
    num: '04',
    title: 'Apply Officially',
    desc: 'Go to the verified .gov.in portal',
    icon: <ExternalLink className="w-4 h-4 text-[#FF5500]" />,
  },
]

const CAT_COLORS: Record<string, string> = {
  Agriculture: 'from-[#FF5500] to-[#EA4C00]',
  Employment: 'from-neutral-800 to-black',
  Housing: 'from-[#FF7729] to-[#FF5500]',
  Healthcare: 'from-[#FF5500] to-[#CC3E00]',
  Education: 'from-[#F59E0B] to-[#D97706]',
  'Social Welfare': 'from-neutral-700 to-black',
  Women: 'from-[#EA580C] to-[#C2410C]',
  Disability: 'from-neutral-800 to-black',
}

function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { i18n } = useTranslation()
  const [schemes, setSchemes] = useState<PublicScheme[]>(() => FALLBACK_SCHEMES.slice(0, 6))
  const [copilotPrompt, setCopilotPrompt] = useState('')

  const isHindi = i18n.language?.startsWith('hi')

  useEffect(() => {
    schemesApi.list(0, 100)
      .then(res => {
        setSchemes(res.items.slice(0, 6))
      })
      .catch(console.error)
  }, [])

  if (user) return <Navigate to="/dashboard" replace />

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = copilotPrompt.trim() || 'I am a college student, what benefits can I get?'
    navigate({ to: '/assistant', search: { q } as any })
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-black overflow-x-hidden font-sans pb-16">

      {/* 1. HERO SECTION — Full-Screen Edge-to-Edge Panoramic Cover */}
      <section className="w-full relative bg-cover bg-center min-h-[560px] lg:min-h-[640px] flex items-center pt-8 pb-20 overflow-hidden"
        style={{ backgroundImage: "url('/hero-parliament-flag-bg.jpg')" }}
      >
        {/* Subtle Dark Gradient Overlay across the left side to ensure high contrast against the green map */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent lg:from-black/75 lg:via-black/35 lg:to-transparent -z-0" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* DBT Badge */}
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#0B3B24] border border-white/60 text-xs font-bold shadow-sm">
                  <Building className="w-3.5 h-3.5 text-[#0B3B24]" />
                  <span>{isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT) एवं आधिकारिक सरकारी पोर्टल' : 'Direct Benefit Transfer (DBT) & Official Portals'}</span>
                </span>
              </div>

              {/* Bold Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.06] drop-shadow-md">
                {isHindi ? 'आपका अधिकार। आपका लाभ।' : 'Your Rights. Your Benefits.'}
                <span className="text-[#FF7729] block mt-1.5 drop-shadow-md">
                  {isHindi ? 'हर सरकारी योजना, एक विश्वसनीय मंच।' : 'Every Welfare Scheme, One Trusted Platform.'}
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed max-w-xl font-normal drop-shadow-xs">
                {isHindi
                  ? 'पारदर्शी नियम-आधारित जांच के साथ सरकारी कल्याणकारी योजनाओं को खोजें, अपनी पात्रता सत्यापित करें, और सीधे सत्यापित .gov.in पोर्टलों पर आवेदन करें — अब एआई द्वारा संचालित।'
                  : 'Discover government welfare schemes, verify your eligibility with transparent rule-based checks, and apply directly on verified .gov.in portals — now powered by AI.'}
              </p>

              {/* Dual Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  to="/schemes"
                  className="bg-[#FF5500] hover:bg-[#EA4C00] text-white font-extrabold px-8 py-3.5 rounded-full text-sm flex items-center gap-2.5 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
                >
                  <span>{isHindi ? 'योजनाएं देखें' : 'Explore Schemes'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/assistant"
                  className="bg-white hover:bg-neutral-100 text-black border border-white/80 font-extrabold px-8 py-3.5 rounded-full text-sm transition-all hover:scale-[1.02] shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FF5500]" />
                  <span>{isHindi ? 'एआई सहायक से पूछें' : 'Ask AI Copilot'}</span>
                </Link>
              </div>

              {/* Micro Trust Indicators (3 Checkmarks) */}
              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-bold text-white/95 drop-shadow-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF7729]" />
                  <span>{isHindi ? 'सरकारी सत्यापित' : 'Govt. Verified'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF7729]" />
                  <span>{isHindi ? 'रीयल-टाइम पात्रता' : 'Real-time Eligibility'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF7729]" />
                  <span>{isHindi ? 'सुरक्षित एवं पारदर्शी' : 'Secure & Transparent'}</span>
                </div>
              </div>

            </div>

            {/* Right Side: Floating Ask Adhikar AI Glass Card */}
            <div className="lg:col-span-5 flex flex-col justify-end items-end min-h-[220px] sm:min-h-[280px] lg:min-h-[340px]">
              <Link
                to="/assistant"
                className="rounded-[28px] p-4 sm:p-5 pr-6 text-white border border-white/25 shadow-2xl backdrop-blur-md bg-black/40 hover:bg-black/50 transition-all flex items-center gap-4 group max-w-md w-full ml-auto card-lift"
              >
                {/* Robot Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative flex items-center justify-center">
                  <img
                    src="/adhikar-bot-avatar.png"
                    alt="Adhikar AI Bot"
                    className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform"
                  />
                </div>
                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base sm:text-lg font-black text-white tracking-tight">Ask Adhikar AI</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full">
                      Beta
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200/90 leading-snug font-normal">
                    Get personalized scheme recommendations, check eligibility, and complete your application step-by-step.
                  </p>
                </div>
                {/* Circular Action Arrow */}
                <div className="w-9 h-9 rounded-full bg-white text-[#FF5500] flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:bg-[#FF5500] group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FLOATING STAT STRIP (5-Metric Wide Pill with Negative Margin) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 sm:-mt-12 relative z-20 mb-14">
        <div className="rounded-[28px] bg-white border border-[#EAE6DF] shadow-[0_12px_36px_rgba(0,0,0,0.08)] py-4 px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#EAE6DF]">
            {STAT_METRICS.map((stat, i) => (
              <div key={i} className={`flex items-center gap-3.5 ${i > 0 ? 'pt-3 md:pt-0 md:pl-4' : ''}`}>
                <div className="w-10 h-10 rounded-2xl bg-[#FFF2E8] border border-[#FFD6BA] flex items-center justify-center shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-black tracking-tight">{stat.num}</h4>
                  <p className="text-[11px] font-medium text-neutral-500 leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SCHEMES FOR EVERY CITIZEN (Beneficiary Archetypes Grid) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {isHindi ? 'हर नागरिक के लिए ' : 'Schemes for '}
              <span className="text-[#FF5500]">{isHindi ? 'कल्याणकारी योजनाएं' : 'Every Citizen'}</span>
            </h2>
          </div>
          <Link
            to="/schemes"
            className="group flex items-center gap-1 text-xs sm:text-sm font-bold text-[#FF5500] hover:text-[#EA4C00] transition"
          >
            <span>{isHindi ? 'सभी श्रेणियां देखें' : 'Explore All Categories'}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Citizen Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {CITIZEN_ARCHETYPES.map((cat) => (
            <Link
              key={cat.title}
              to="/schemes"
              search={{ category: cat.category } as any}
              className="rounded-[22px] overflow-hidden card-lift hover:scale-[1.03] transition-all duration-300 shadow-xs hover:shadow-lg border border-[#EAE6DF] hover:border-[#FF5500]/50 block bg-white"
            >
              <img
                src={cat.cardImg}
                alt={cat.title}
                className="w-full h-auto object-contain block"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* 3.1 BOTTOM FEATURE BANNER — Find the Right Scheme for You */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
        <div className="rounded-[28px] bg-gradient-to-r from-[#FFF8F2] via-[#FFFBF8] to-[#FFF5ED] border border-[#FFD8BE] p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden card-lift">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE4D3] border border-[#FFC8A8] flex items-center justify-center shrink-0 text-[#FF5500] shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-black tracking-tight">
                {isHindi ? 'अपने लिए सही योजना खोजें' : 'Find the Right Scheme for You'}
              </h3>
              <p className="text-xs text-neutral-600 font-normal mt-0.5">
                {isHindi
                  ? 'कुछ सरल प्रश्नों के उत्तर दें और तुरंत व्यक्तिगत योजना सिफारिशें प्राप्त करें।'
                  : 'Answer a few simple questions and get personalized scheme recommendations instantly.'}
              </p>
            </div>
          </div>

          <Link
            to="/eligibility"
            className="bg-[#0B3B24] hover:bg-[#072718] text-white font-bold px-7 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-[1.02] transition shrink-0 relative z-10"
          >
            <Sparkles className="w-4 h-4 text-[#4ADE80]" />
            <span>{isHindi ? 'व्यक्तिगत सिफारिशें प्राप्त करें' : 'Get Personalized Recommendations'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. BOTTOM DUAL SECTION: AI Welfare Copilot Card + How Adhikar Works */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Card: AI Welfare Copilot Interactive Card (col-span-7) */}
          <div 
            className="lg:col-span-7 rounded-[32px] border border-[#164E33]/50 p-6 sm:p-7 text-white relative overflow-hidden flex flex-col justify-between shadow-xl card-lift bg-cover bg-center"
            style={{ backgroundImage: "url('/copilot-banner-clean-bg.jpg')" }}
          >
            {/* Subtle Gradient Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20 -z-0" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
              
              {/* Adhikar Shield Emblem & Divider on the left */}
              <div className="shrink-0 flex items-center gap-3.5 sm:gap-4 pt-1">
                <div className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center">
                  <img
                    src="/adhikar-emblem.png"
                    alt="Adhikar Official Shield"
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
                <div className="w-[1.5px] h-14 bg-white/20 hidden sm:block shrink-0" />
              </div>

              {/* Text & Search Container */}
              <div className="flex-1 space-y-2.5 text-center sm:text-left min-w-0 w-full">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#164E33]/90 border border-[#22C55E]/40 text-[#86EFAC] text-[10px] font-bold backdrop-blur-xs">
                  <Sparkles className="w-3 h-3 text-[#4ADE80]" />
                  <span>AI Welfare Copilot</span>
                </span>
                
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  {isHindi ? 'अपने लिए सही सरकारी योजना ' : 'Find the Right Scheme '}
                  <span className="text-[#FF7729]">{isHindi ? 'खोजें' : 'for You'}</span>
                </h3>
                
                <p className="text-xs text-neutral-200/90 font-normal leading-relaxed">
                  {isHindi
                    ? 'अपनी भाषा में पूछें और व्यक्तिगत, 100% सत्यापित योजना सिफारिशें प्राप्त करें।'
                    : 'Ask in natural language and get personalized, verified scheme recommendations.'}
                </p>

                {/* Interactive Search / Prompt Input */}
                <form onSubmit={handleCopilotSubmit} className="pt-1.5">
                  <div className="flex items-center gap-2 bg-white rounded-full p-1 pl-4 shadow-lg border border-white/20">
                    <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      value={copilotPrompt}
                      onChange={(e) => setCopilotPrompt(e.target.value)}
                      placeholder={isHindi ? 'उदा. मैं एक कॉलेज छात्र हूँ, मुझे क्या लाभ मिल सकते हैं?' : 'e.g. I am a college student, what benefits can I get?'}
                      className="w-full bg-transparent text-xs text-black placeholder:text-neutral-400 focus:outline-none font-medium py-2"
                    />
                    <button
                      type="submit"
                      className="w-8 h-8 rounded-full bg-[#FF5500] hover:bg-[#EA4C00] text-white flex items-center justify-center font-bold shrink-0 transition hover:scale-105 shadow-xs"
                      title="Ask AI Copilot"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

            </div>

          </div>

          {/* Right Card: How Adhikar Works? (col-span-5) */}
          <div className="lg:col-span-5 rounded-[32px] bg-white border border-[#EAE6DF] p-6 sm:p-8 shadow-xs flex flex-col justify-center card-lift">
            <h3 className="text-lg font-black text-black tracking-tight mb-6">
              How <span className="text-[#FF5500]">Adhikar</span> Works?
            </h3>

            {/* 4 Steps Horizontal Flow with Connecting Arrows */}
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              {HOW_IT_WORKS_STEPS.map((step, idx) => (
                <div key={idx} className="contents">
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFF2E8] border border-[#FFD6BA] flex items-center justify-center mb-2 shadow-xs">
                      {step.icon}
                    </div>
                    <h5 className="text-[11px] sm:text-xs font-black text-black leading-tight">{step.title}</h5>
                    <p className="text-[9px] text-neutral-500 mt-0.5 leading-tight">{step.desc}</p>
                  </div>
                  {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                    <div className="text-neutral-400 text-xs px-1 shrink-0 pb-6">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. VERIFIED HIGH-IMPACT WELFARE SCHEMES CATALOG */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Star className="w-3.5 h-3.5" /> {isHindi ? 'विशेष योजनाएं' : 'Flagship Programs'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {isHindi ? 'उच्च-प्रभाव सरकारी योजनाएं' : 'High-Impact Welfare Schemes'}
            </h2>
            <p className="mt-1 text-sm text-[#52525B]">
              {isHindi ? 'सत्यापित राष्ट्रीय एवं राज्य पोर्टलों से सीधे लाभ' : 'Direct benefit transfer from verified official gazette portals'}
            </p>
          </div>
          <Link to="/schemes" className="group flex items-center gap-1.5 text-xs font-bold text-[#FF5500] hover:text-[#EA4C00] transition-colors">
            <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((s, i) => {
            const grad = CAT_COLORS[s.category] || 'from-neutral-800 to-black'
            return (
              <div key={i} className="group flex flex-col overflow-hidden rounded-[28px] border border-[#EAE6DF] bg-white card-lift hover:border-[#FF5500]/50 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] transition-all">
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="mb-3.5 flex items-start justify-between gap-2">
                    <span className={`rounded-full bg-gradient-to-r ${grad} px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs`}>
                      {s.category}
                    </span>
                    <span className="rounded-full border border-[#EAE6DF] bg-[#FAF8F5] px-2.5 py-1 text-[10px] font-bold text-neutral-600">
                      {s.level || 'Central'}
                    </span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-base font-black text-black group-hover:text-[#FF5500] transition-colors leading-snug">
                    {s.name}
                  </h3>
                  <p className="mb-5 line-clamp-2 flex-1 text-xs leading-relaxed text-[#52525B]">
                    {s.description}
                  </p>
                  <div className="mb-5 flex items-center gap-2.5 border-b border-[#EAE6DF] pb-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF2E8] text-xs font-black text-[#FF5500] shrink-0">₹</span>
                    <span className="truncate text-xs font-bold text-neutral-900">{s.benefit || 'Direct Benefit Transfer (DBT)'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/scheme/$slug" params={{ slug: s.slug }} className="rounded-full border border-[#EAE6DF] py-2.5 text-center text-xs font-bold text-neutral-800 transition hover:bg-[#FAF8F5] hover:border-neutral-300">
                      {isHindi ? 'पूर्ण विवरण' : 'View Details'}
                    </Link>
                    <a href={s.application_url || s.source_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-neutral-800 text-white font-bold py-2.5 rounded-full text-center text-xs flex items-center justify-center gap-1.5 transition shadow-xs hover:scale-[1.02]">
                      <span>{isHindi ? 'सीधा आवेदन' : 'Apply Now'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}
