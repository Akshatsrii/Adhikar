import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ChevronRight, Sparkles, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { statesAndDistricts } from '@/lib/statesDistricts'

export const Route = createFileRoute('/eligibility')({
  component: EligibilityPage,
})

function EligibilityPage() {
  const navigate = useNavigate()
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [category, setCategory] = useState('')
  const [age, setAge] = useState('')
  const [occupation, setOccupation] = useState('')
  const [income, setIncome] = useState('')

  const states = Object.keys(statesAndDistricts)
  const districts = selectedState ? statesAndDistricts[selectedState] : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/eligibility-results' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Check Eligibility</span>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/50 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Deterministic Rule Matcher
          </span>
          <span className="text-[11px] font-semibold text-slate-400">100% Free Verification</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Verify Scheme Eligibility</h1>
        <p className="text-xs text-slate-500 mt-1">
          Input your demographic attributes to find 100% matched central and state entitlements.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Form */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 p-7 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Demographic & Economic Profile</h3>
              <p className="text-xs text-slate-400 mt-0.5">Used strictly for localized rule matching. We never store raw data without consent.</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Domicile State <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setSelectedDistrict('')
                  }}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">District</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium disabled:opacity-50"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Social Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Castes)</option>
                  <option value="ST">ST (Scheduled Tribes)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Age (in years)</label>
                <input
                  type="number"
                  placeholder="e.g. 26"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Primary Occupation</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                >
                  <option value="">Select Occupation</option>
                  <option value="Farmer">Farmer / Agriculture Worker</option>
                  <option value="Student">Student / Scholar</option>
                  <option value="Self-Employed">Artisan / Small Business / Self-Employed</option>
                  <option value="Daily Wage">Daily Wage / Construction Labour</option>
                  <option value="Salaried">Salaried Employee</option>
                  <option value="Unemployed">Seeking Employment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Annual Household Income (₹)</label>
                <select
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                >
                  <option value="">Select Income Bracket</option>
                  <option value="Below 1 Lakh">Below ₹1,00,000 (BPL / Antyodaya)</option>
                  <option value="1 - 2.5 Lakhs">₹1,00,000 - ₹2,50,000</option>
                  <option value="2.5 - 5 Lakhs">₹2,50,000 - ₹5,00,000</option>
                  <option value="Above 5 Lakhs">Above ₹5,00,000</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 text-xs md:text-sm"
              >
                <span>Find Eligible Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - How it works */}
        <div className="w-full lg:w-[350px] shrink-0 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-6 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" /> How Matching Works
            </h3>

            <div className="relative border-l-2 border-blue-100 pl-6 space-y-8 py-1 ml-3">
              <div className="relative">
                <div className="absolute -left-[33px] top-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-4 ring-white">
                  1
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">Attribute Parsing</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your state, age, and economic bracket are extracted into structured filters.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[33px] top-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-4 ring-white">
                  2
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">Deterministic Rules</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Every scheme rule is verified deterministically without hallucinations.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[33px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-4 ring-white">
                  3
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">1-Click Direct Application</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Open official portals with guidance on necessary documents.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Privacy Preserved</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              Adhikar does not sell or share citizen profile data with private marketing aggregators.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
