import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Share2, Building2, Banknote, Users, CheckCircle2, Monitor, Calendar, Loader2, ExternalLink, Sparkles, ShieldCheck, FileText, Bookmark, Scale } from 'lucide-react'
import { useState, useEffect } from 'react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'
import { AudioNarrator } from '@/components/AudioNarrator'

export const Route = createFileRoute('/scheme/$slug')({
  component: SchemeDetailPage,
})

function SchemeDetailPage() {
  const { slug } = Route.useParams()
  const [scheme, setScheme] = useState<PublicScheme | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'process' | 'documents'>('overview')
  const [copied, setCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('adhikar_saved_schemes')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.some((i: any) => i.slug === slug)) {
          setIsSaved(true)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [slug])

  const handleToggleSave = () => {
    if (!scheme) return
    try {
      const raw = localStorage.getItem('adhikar_saved_schemes')
      let list = raw ? JSON.parse(raw) : []
      if (!Array.isArray(list)) list = []
      if (isSaved) {
        list = list.filter((i: any) => i.slug !== scheme.slug)
        setIsSaved(false)
      } else {
        list.unshift({
          slug: scheme.slug,
          name: scheme.name,
          category: scheme.category,
          benefit: scheme.benefit || 'Direct government assistance',
          status: 'bookmarked',
          note: 'Saved from scheme details page.',
          savedAt: new Date().toLocaleDateString('en-IN'),
        })
        setIsSaved(true)
      }
      localStorage.setItem('adhikar_saved_schemes', JSON.stringify(list))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    schemesApi
      .get(slug)
      .then((res) => {
        setScheme(res)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [slug])

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-32 w-full flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-xs text-slate-400 font-medium">Fetching verified scheme particulars...</p>
      </div>
    )
  }

  if (!scheme) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-32 w-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Scheme particulars not found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested scheme might have expired or been relocated.</p>
        <Link to="/schemes" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition">
          Return to Schemes Directory
        </Link>
      </div>
    )
  }

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
        <span className="text-slate-700 truncate max-w-xs">{scheme.name}</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        {/* Header Hero */}
        <div className="p-7 md:p-10 flex flex-col md:flex-row gap-8 items-start border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Verified Entitlement
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {scheme.category}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {scheme.level || 'Central'} {scheme.state ? `(${scheme.state})` : ''}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{scheme.name}</h1>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-3xl font-normal">{scheme.description}</p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{scheme.department || 'Government of India'}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 w-full md:w-60 shrink-0">
            <a
              href={scheme.application_url || scheme.source_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl text-xs font-bold transition shadow-md shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-center flex items-center justify-center gap-2"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
              <button
                onClick={handleToggleSave}
                className={`flex-1 border py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-amber-500' : 'text-slate-500'}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <Link
                to="/compare"
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 flex items-center justify-center gap-1.5 transition text-center"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Compare</span>
              </Link>
              <Link
                to="/assistant"
                className="flex-1 bg-blue-50 border border-blue-200/60 text-blue-700 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Ask AI</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Multilingual Voice Narrator */}
        <div className="px-7 md:px-10 py-5 bg-slate-50/50 border-b border-slate-100">
          <AudioNarrator
            schemeName={scheme.name}
            benefitText={scheme.benefit || 'Direct government assistance'}
            descriptionText={scheme.description}
          />
        </div>

        {/* Content Section & Sidebar */}
        <div className="flex flex-col lg:flex-row">
          {/* Main Details */}
          <div className="flex-1 p-7 md:p-10 lg:border-r border-slate-100">
            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto border-b border-slate-100 pb-3 mb-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'eligibility', label: 'Eligibility Rules' },
                { id: 'process', label: 'Application Steps' },
                { id: 'documents', label: 'Required Documents' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-600" /> Financial & Social Benefits
                    </h3>
                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5">
                      <p className="text-xs md:text-sm text-emerald-950 font-semibold leading-relaxed">
                        {scheme.benefit || 'Direct financial assistance or subsidy per central guidelines.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" /> Nodal Department & Objective
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Administered by {scheme.department || 'the concerned Ministry'}. The mission aims to eliminate socioeconomic
                      barriers through direct benefit transfers (DBT) deposited directly into Aadhaar-seeded bank accounts without middlemen.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'eligibility' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" /> Qualifying Criteria
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">Must be a bona fide citizen of India.</span>
                    </div>
                    {scheme.state && (
                      <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 font-medium">
                          Permanent domicile of {scheme.state} required for state quotas.
                        </span>
                      </div>
                    )}
                    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">
                        Must possess an active Aadhaar card linked to a valid bank savings account (DBT enabled).
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">
                        Must satisfy socioeconomic conditions designated for {scheme.category} category beneficiaries.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'process' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-600" /> 4-Step Application Procedure
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Step 01</span>
                      <h4 className="font-bold text-xs text-slate-900">Visit Official Portal</h4>
                      <p className="text-[11px] text-slate-500">Access the authentic portal link verified above.</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Step 02</span>
                      <h4 className="font-bold text-xs text-slate-900">Authenticate via Aadhaar</h4>
                      <p className="text-[11px] text-slate-500">Complete OTP e-KYC using registered mobile number.</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Step 03</span>
                      <h4 className="font-bold text-xs text-slate-900">Submit Application Form</h4>
                      <p className="text-[11px] text-slate-500">Input demographic and income particulars accurately.</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Step 04</span>
                      <h4 className="font-bold text-xs text-slate-900">Track Direct Benefit</h4>
                      <p className="text-[11px] text-slate-500">Receive application reference number for PFMS tracking.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" /> Mandatory Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Aadhaar Card (UIDAI Verified)',
                      'Bank Passbook / Cancelled Cheque (DBT Enabled)',
                      'Income Certificate (Issued by Tehsildar / Competent Authority)',
                      'Caste / Category Certificate (if applicable)',
                      'Domicile / Residence Certificate',
                      'Passport Size Photograph & Mobile Number',
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Key Highlights */}
          <div className="w-full lg:w-80 p-7 md:p-10 bg-slate-50/50 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-200">
              Key Highlights
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Administrative Level</p>
                <p className="font-bold text-slate-900 text-sm capitalize mt-0.5">
                  {scheme.level || 'Central'} {scheme.state ? `(${scheme.state})` : ''}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Beneficiary Sector</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{scheme.category}</p>
              </div>

              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Application Window</p>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{scheme.deadline || 'Active Year-Round'}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Official Web Portal</p>
                <a
                  href={scheme.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline break-all block mt-0.5"
                >
                  {scheme.source_url}
                </a>
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-2.5 shadow-md shadow-blue-500/10">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-100 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Need Help Applying?
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed font-normal">
                Ask Adhikar AI any question regarding documentation or eligibility for this specific scheme.
              </p>
              <Link
                to="/assistant"
                className="inline-block px-4 py-2 bg-white text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-50 transition shadow-xs mt-1"
              >
                Chat with Copilot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
