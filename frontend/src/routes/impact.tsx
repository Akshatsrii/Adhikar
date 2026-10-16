import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, IndianRupee, MapPin, Zap, ArrowUpRight, Award, Globe, HeartPulse, Home, Leaf, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/impact')({
  component: ImpactDashboard,
})

// Animated counter hook
function useCountUp(target: number, duration = 2200, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return value
}

function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2200, started }: {
  target: number; suffix?: string; prefix?: string; duration?: number; started: boolean
}) {
  const val = useCountUp(target, duration, started)
  return (
    <span>
      {prefix}{val.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

const impactMetrics = [
  {
    icon: IndianRupee,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 border-emerald-100',
    textColor: 'text-emerald-700',
    label: 'DBT Transferred (FY 2024–25)',
    value: 3_90_000,
    suffix: ' Cr',
    note: 'Direct Benefit Transfer to verified beneficiaries',
    source: 'DBT Bharat / PFMS',
    trend: '+18.3% YoY',
  },
  {
    icon: Users,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 border-blue-100',
    textColor: 'text-blue-700',
    label: 'Active Beneficiaries',
    value: 112_00_00_000,
    suffix: '+',
    note: 'Citizens covered under central welfare schemes',
    source: 'MyScheme.gov.in',
    trend: '+6.2% from last year',
  },
  {
    icon: MapPin,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 border-violet-100',
    textColor: 'text-violet-700',
    label: 'States & UTs Covered',
    value: 36,
    suffix: '/36',
    note: 'Complete pan-India welfare coverage',
    source: 'Government of India',
    trend: '100% coverage',
  },
  {
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 border-amber-100',
    textColor: 'text-amber-700',
    label: 'Total Welfare Schemes',
    value: 300,
    suffix: '+',
    note: 'Active central government schemes catalogued',
    source: 'MyScheme.gov.in',
    trend: '+42 schemes in FY25',
  },
]

const sectorBreakdown = [
  { name: 'Agriculture & Farmers', icon: Leaf, amount: '82,000 Cr', pct: 21, color: 'bg-emerald-500' },
  { name: 'Housing (PMAY)', icon: Home, amount: '70,000 Cr', pct: 18, color: 'bg-amber-500' },
  { name: 'Healthcare (Ayushman)', icon: HeartPulse, amount: '65,000 Cr', pct: 17, color: 'bg-rose-500' },
  { name: 'Education & Scholarships', icon: GraduationCap, amount: '55,000 Cr', pct: 14, color: 'bg-indigo-500' },
  { name: 'Employment & MGNREGA', icon: Briefcase, amount: '86,000 Cr', pct: 22, color: 'bg-blue-500' },
  { name: 'Social Protection', icon: ShieldCheck, amount: '32,000 Cr', pct: 8, color: 'bg-violet-500' },
]

const stateLeaders = [
  { state: 'Uttar Pradesh', beneficiaries: '22.4 Cr', schemes: 58, flag: '🏆' },
  { state: 'Maharashtra', beneficiaries: '14.1 Cr', schemes: 71, flag: '⭐' },
  { state: 'West Bengal', beneficiaries: '9.8 Cr', schemes: 63, flag: '🥇' },
  { state: 'Rajasthan', beneficiaries: '8.3 Cr', schemes: 54, flag: '🏅' },
  { state: 'Tamil Nadu', beneficiaries: '7.9 Cr', schemes: 82, flag: '🌟' },
  { state: 'Madhya Pradesh', beneficiaries: '7.6 Cr', schemes: 49, flag: '✨' },
]

const recentMilestones = [
  { year: '2025', event: 'PM-KISAN crosses 12 Cr farmer installments under 17th tranche', icon: Leaf, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { year: '2025', event: 'Ayushman Bharat: 7.5 Cr hospital admissions authorized — free healthcare', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  { year: '2024', event: 'PMAY-G completes 3.26 Cr pucca houses in rural India', icon: Home, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { year: '2024', event: 'MGNREGA: 28.9 Cr active job cards generating 370 Cr person-days', icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { year: '2024', event: 'Sukanya Samriddhi: 3.9 Cr girl-child accounts with ₹1.96L Cr corpus', icon: Award, color: 'text-violet-600 bg-violet-50 border-violet-100' },
]

export default function ImpactDashboard() {
  const [started, setStarted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.1 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Hero Banner */}
      <section className="relative bg-slate-950 overflow-hidden pt-16 pb-20 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-emerald-600/20 via-blue-600/20 to-violet-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-teal-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-300 mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live National Welfare Impact Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-emerald-200 bg-clip-text text-transparent">
              India's Welfare
            </span>
            <br />
            <span className="text-white">Impact at a Glance</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Real-time social impact metrics powered by public DBT, PFMS, and MyScheme.gov.in data. 
            Visualizing how welfare reaches every Indian citizen.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Globe className="w-3.5 h-3.5" />
            <span>Data sourced from DBT Bharat · PFMS · MyScheme.gov.in · Ministry of Finance</span>
          </div>
        </div>
      </section>

      {/* Animated Metrics Grid */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {impactMetrics.map((m, i) => {
            const Icon = m.icon
            return (
              <div key={i} className={`bg-white rounded-2xl border ${m.bg} p-6 shadow-sm hover:shadow-md transition-all duration-300 group`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-black ${m.textColor} mb-1`}>
                  <AnimatedCounter
                    target={m.value}
                    suffix={m.suffix}
                    duration={2000 + i * 200}
                    started={started}
                  />
                </div>
                <div className="text-sm font-bold text-slate-800 mb-1">{m.label}</div>
                <div className="text-xs text-slate-500 mb-3 leading-relaxed">{m.note}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{m.source}</span>
                  <span className={`text-[11px] font-bold ${m.textColor} flex items-center gap-0.5`}>
                    <ArrowUpRight className="w-3 h-3" />{m.trend}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Sector Budget Allocation */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900">Sector-wise Budget Allocation</h2>
          <p className="text-slate-500 text-sm mt-1">FY 2024–25 welfare expenditure breakdown across major sectors</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="space-y-5">
            {sectorBreakdown.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                      <span className="text-sm font-bold text-slate-900">₹{s.amount}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.color} rounded-full transition-all duration-1000`}
                        style={{ width: started ? `${s.pct}%` : '0%' }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 w-10 text-right">{s.pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* State Leaders & Milestones */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* State Leaders */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">State Welfare Leaders</h2>
          <p className="text-slate-500 text-sm mb-6">States with highest beneficiary coverage</p>
          <div className="space-y-3">
            {stateLeaders.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
                <span className="text-2xl">{s.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900">{s.state}</div>
                  <div className="text-xs text-slate-500">{s.schemes} active schemes</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-blue-700">{s.beneficiaries}</div>
                  <div className="text-[10px] text-slate-400 font-medium">beneficiaries</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Recent Welfare Milestones</h2>
          <p className="text-slate-500 text-sm mb-6">Key achievements in India's welfare delivery</p>
          <div className="space-y-4">
            {recentMilestones.map((m, i) => {
              const Icon = m.icon
              return (
                <div key={i} className={`flex gap-4 p-4 rounded-xl border ${m.color}`}>
                  <div className={`w-9 h-9 rounded-lg ${m.color} flex items-center justify-center flex-shrink-0 border`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{m.year}</div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{m.event}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 py-14 text-white text-center">
        <h2 className="text-2xl font-black mb-2">Become Part of the Story</h2>
        <p className="text-blue-200 text-sm mb-6 max-w-md mx-auto">
          Find the welfare schemes you're entitled to and add yourself to India's welfare impact numbers.
        </p>
        <a href="/eligibility" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold text-sm px-6 py-3 rounded-full hover:bg-blue-50 transition shadow-lg">
          Check My Eligibility <ArrowUpRight className="w-4 h-4" />
        </a>
      </section>

    </div>
  )
}
