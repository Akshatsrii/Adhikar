import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ShieldCheck, ChevronRight, AlertTriangle, ArrowRight, Sparkles, Check } from 'lucide-react'

export const Route = createFileRoute('/readiness')({
  component: WelfareReadinessPage,
})

interface ReadinessQuestion {
  id: string
  title: string
  desc: string
  category: 'identity' | 'banking' | 'income' | 'household' | 'digital'
  points: number
  remedy: string
  actionUrl?: string
}

const QUESTIONS: ReadinessQuestion[] = [
  {
    id: 'aadhaar_mobile',
    title: 'Aadhaar Linked with Active Mobile Number',
    desc: 'Required for receiving OTP e-KYC authentication during scheme applications.',
    category: 'identity',
    points: 20,
    remedy: 'Visit nearest Aadhaar Seva Kendra or post office to update your active mobile number.',
    actionUrl: 'https://myaadhaar.uidai.gov.in',
  },
  {
    id: 'bank_npci_dbt',
    title: 'Bank Account Seeded with NPCI for DBT',
    desc: 'Mandatory for Direct Benefit Transfer (PM-KISAN, scholarships, gas subsidies) directly via PFMS.',
    category: 'banking',
    points: 25,
    remedy: 'Submit the NPCI Aadhaar Linking Mandate Form at your bank branch or via mobile banking.',
  },
  {
    id: 'income_cert',
    title: 'Valid Income Certificate (< 1 Year Old)',
    desc: 'Determines eligibility for EWS/LIG reservations, fee waivers, and PMAY subsidies.',
    category: 'income',
    points: 20,
    remedy: 'Apply online on your state e-District portal or via CSC center for a fresh Tehsildar certificate.',
  },
  {
    id: 'ration_card',
    title: 'Active Family Ration Card with Updated Member Names',
    desc: 'Verifies household poverty index and unlocks NFSA food security & Ayushman Bharat cards.',
    category: 'household',
    points: 20,
    remedy: 'Check RC details on your state Food & Civil Supplies portal and ensure all family members are listed.',
  },
  {
    id: 'digilocker_vault',
    title: 'DigiLocker Digital Document Repository',
    desc: 'Enables instant paperless e-verification without requiring physical attested photocopies.',
    category: 'digital',
    points: 15,
    remedy: 'Link your Aadhaar on DigiLocker to fetch verified digital copies of Marksheets and Domicile.',
    actionUrl: 'https://digilocker.gov.in',
  },
]

function WelfareReadinessPage() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({
    aadhaar_mobile: true,
    bank_npci_dbt: true,
    income_cert: false,
    ration_card: true,
    digilocker_vault: false,
  })

  const toggleAnswer = (id: string) => {
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Calculate score
  const totalScore = QUESTIONS.reduce((sum, q) => {
    return sum + (answers[q.id] ? q.points : 0)
  }, 0)

  const strokeDash = `${totalScore}, 100`

  const getStatusVerdict = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Optimal Welfare Readiness',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        summary: 'Your citizen documentation profile is in prime standing. High probability of immediate DBT approvals.',
      }
    }
    if (score >= 50) {
      return {
        label: 'Moderate Readiness - KYC Gaps Present',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        summary: 'You qualify for central DBT schemes, but missing state documentation may delay approvals.',
      }
    }
    return {
      label: 'High Risk of Application Rejection',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      summary: 'Critical documentation missing. Resolve foundational identity and banking linkages immediately.',
    }
  }

  const verdict = getStatusVerdict(totalScore)
  const missingItems = QUESTIONS.filter(q => !answers[q.id])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Citizen Welfare Readiness Audit</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-blue-200 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            100-Point Pre-Application Diagnostic
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Citizen Documentation Readiness Audit
          </h1>
          <p className="text-xs md:text-sm text-blue-200/80 leading-relaxed">
            Over 38% of welfare scheme applications in India are rejected due to mismatched Aadhaar names, missing NPCI mandates, or expired certificates. Audit your profile before applying.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Audit Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">5-Pillar Entitlement Audit</h3>
            <p className="text-xs text-slate-500 mt-0.5">Toggle each item to reflect your current personal documentation status.</p>
          </div>

          <div className="space-y-3.5">
            {QUESTIONS.map(q => {
              const isChecked = !!answers[q.id]
              return (
                <div
                  key={q.id}
                  onClick={() => toggleAnswer(q.id)}
                  className={`p-4 md:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                    isChecked
                      ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isChecked ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-snug">{q.title}</h4>
                      <span className="text-[10px] font-bold text-blue-600 font-mono shrink-0">+{q.points} pts</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{q.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Readiness Score & Action Plan (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Score Gauge Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-center space-y-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Readiness Audit Score
            </div>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={totalScore >= 80 ? 'text-emerald-600' : totalScore >= 50 ? 'text-amber-500' : 'text-rose-500'}
                  strokeWidth="3.2"
                  strokeDasharray={strokeDash}
                  stroke="currentColor"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900">{totalScore}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">out of 100</span>
              </div>
            </div>

            {/* Verdict Badge */}
            <div className={`p-3 rounded-2xl border text-xs font-bold ${verdict.color}`}>
              {verdict.label}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {verdict.summary}
            </p>
          </div>

          {/* Action Remedial Steps */}
          {missingItems.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Fix to Achieve 100% Score ({missingItems.length})</span>
              </div>

              <div className="space-y-3">
                {missingItems.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{item.remedy}</p>
                    {item.actionUrl && (
                      <a
                        href={item.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline mt-1"
                      >
                        <span>Fix Online</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-2.5 shadow-md shadow-blue-500/20">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Need Help Fixing KYC?
            </div>
            <p className="text-xs text-blue-100/90 leading-relaxed font-normal">
              Ask Adhikar AI Copilot for step-by-step guidance on updating your Aadhaar or seeding NPCI with your bank.
            </p>
            <Link
              to="/assistant"
              className="inline-block px-4 py-2 bg-white text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-50 transition shadow-xs mt-1"
            >
              Consult AI Copilot
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
