import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { CheckCircle2, ChevronRight, Sparkles, Building2, ExternalLink, Plus, X, ArrowRight, Scale } from 'lucide-react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/compare')({
  component: SchemeComparisonPage,
})

export function SchemeComparisonPage() {
  const [allSchemes, setAllSchemes] = useState<PublicScheme[]>([])
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    'pradhan-mantri-jan-arogya-yojana-pm-jay',
    'pradhan-mantri-suraksha-bima-yojana-pmsby',
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    schemesApi.list(0, 100).then(res => {
      setAllSchemes(res.items)
      // Pick first two if preset slugs are not in items
      if (res.items.length >= 2) {
        const availableSlugs = res.items.map(s => s.slug)
        const validSelected = selectedSlugs.filter(s => availableSlugs.includes(s))
        if (validSelected.length < 2) {
          setSelectedSlugs([res.items[0].slug, res.items[1].slug])
        }
      }
    }).catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const selectedSchemes = selectedSlugs
    .map(slug => allSchemes.find(s => s.slug === slug))
    .filter(Boolean) as PublicScheme[]

  const handleRemoveScheme = (slug: string) => {
    if (selectedSlugs.length <= 1) return
    setSelectedSlugs(prev => prev.filter(s => s !== slug))
  }

  const handleAddScheme = (slug: string) => {
    if (selectedSlugs.includes(slug) || selectedSlugs.length >= 3) return
    setSelectedSlugs(prev => [...prev, slug])
  }

  const presets = [
    {
      title: 'Healthcare & Life Insurance',
      slugs: ['pradhan-mantri-jan-arogya-yojana-pm-jay', 'pradhan-mantri-suraksha-bima-yojana-pmsby'],
    },
    {
      title: 'Agriculture & Livelihood',
      slugs: ['pm-kisan-samman-nidhi', 'pradhan-mantri-fasal-bima-yojana-pmfby'],
    },
    {
      title: 'Housing & Urban Infrastructure',
      slugs: ['pm-awas-yojana-urban', 'pradhan-mantri-mudra-yojana-pmmy'],
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/schemes" className="text-blue-600 hover:underline">
          Schemes
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Scheme Comparison Matrix</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-indigo-200 border border-white/20">
            <Scale className="w-3.5 h-3.5 text-indigo-300" />
            Decision Intelligence Matrix
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Side-by-Side Scheme Comparator
          </h1>
          <p className="text-xs md:text-sm text-indigo-200/80 leading-relaxed">
            Eliminate confusion between welfare entitlements. Compare financial benefit caps, target demographics, document prerequisites, and application channels across 2 or 3 schemes simultaneously.
          </p>
        </div>
      </div>

      {/* Preset Quick Comparisons */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Popular Comparisons:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              const valid = preset.slugs.filter(s => allSchemes.some(scheme => scheme.slug === s))
              if (valid.length > 0) setSelectedSlugs(valid)
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200/80 text-slate-700 hover:border-blue-500 hover:text-blue-600 shadow-xs transition"
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Scheme Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Add Scheme to Comparison</div>
            <div className="text-[11px] text-slate-400">Comparing {selectedSchemes.length} of 3 maximum schemes</div>
          </div>
        </div>

        <div className="w-full md:w-80">
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddScheme(e.target.value)
                e.target.value = ''
              }
            }}
            disabled={selectedSlugs.length >= 3}
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50 cursor-pointer"
          >
            <option value="">+ Choose scheme to add...</option>
            {allSchemes
              .filter(s => !selectedSlugs.includes(s.slug))
              .map(s => (
                <option key={s.slug} value={s.slug}>
                  {s.name} ({s.category})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      {isLoading ? (
        <div className="p-20 text-center text-xs text-slate-400 font-medium">
          Loading comparison particulars...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {selectedSchemes.map((scheme) => (
            <div
              key={scheme.slug}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between relative group hover:border-blue-300 transition-all duration-200"
            >
              {/* Remove Button */}
              {selectedSchemes.length > 1 && (
                <button
                  onClick={() => handleRemoveScheme(scheme.slug)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="space-y-5">
                {/* Header Tag */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/50">
                    {scheme.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {scheme.level || 'Central'}
                  </span>
                </div>

                {/* Scheme Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                    {scheme.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="truncate">{scheme.department || 'Government of India'}</span>
                  </div>
                </div>

                {/* Financial Benefit Box */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Direct Financial Benefit</div>
                  <div className="text-xs md:text-sm font-bold text-emerald-950 leading-relaxed">
                    {scheme.benefit || 'Direct government assistance per guidelines.'}
                  </div>
                </div>

                {/* Target Demographics */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Beneficiary</div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {scheme.description}
                  </p>
                </div>

                {/* Core Eligibility Points */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Criteria Checklist</div>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Indian National with Aadhaar authentication</span>
                    </div>
                    {scheme.state && (
                      <div className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>State Resident of {scheme.state}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Aadhaar-seeded active bank account (DBT enabled)</span>
                    </div>
                  </div>
                </div>

                {/* Required Documents Checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Required KYC Proofs</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Aadhaar Card', 'Bank Passbook', 'Income Cert', 'Domicile'].map((doc, dIdx) => (
                      <span key={dIdx} className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 space-y-2 mt-6">
                <Link
                  to="/scheme/$slug"
                  params={{ slug: scheme.slug }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 text-center flex items-center justify-center gap-1.5 transition"
                >
                  <span>Read Full Scheme Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={scheme.application_url || scheme.source_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-center flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assistant Help Banner */}
      <div className="mt-12 bg-blue-50 border border-blue-200/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Need AI help deciding which scheme suits your family?</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Adhikar Copilot evaluates your age, caste, and annual household income to calculate the highest financial return.
            </p>
          </div>
        </div>
        <Link
          to="/assistant"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm shrink-0 flex items-center gap-1.5"
        >
          <span>Ask AI Copilot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
