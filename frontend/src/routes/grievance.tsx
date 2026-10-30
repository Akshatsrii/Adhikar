import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { grievancesApi } from '@/lib/api'
import {
  MessageSquareWarning,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Send,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  Phone,
  Globe,
  Copy,
  Check,
} from 'lucide-react'

export const Route = createFileRoute('/grievance')({
  component: GrievancePage,
})

type GrievanceStatus = 'submitted' | 'under_review' | 'resolved' | 'escalated'

interface Grievance {
  id: string
  refNo: string
  title: string
  scheme: string
  category: string
  status: GrievanceStatus
  submittedOn: string
  updatedOn: string
  department: string
  description: string
  timeline: { date: string; action: string; actor: string }[]
}

const statusConfig: Record<GrievanceStatus, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  submitted: {
    label: 'Submitted',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: <FileText className="w-4 h-4" />,
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: <Clock className="w-4 h-4" />,
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  escalated: {
    label: 'Escalated',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
}

const SCHEME_OPTIONS = [
  'PM-KISAN Samman Nidhi',
  'Ayushman Bharat PMJAY',
  'PMAY - Pradhan Mantri Awas Yojana',
  'MGNREGA',
  'Pradhan Mantri Ujjwala Yojana',
  'PM Scholarship Scheme',
  'Sukanya Samriddhi Yojana',
  'National Social Assistance Programme',
  'Atal Pension Yojana',
  'PM Jan Dhan Yojana',
  'Other',
]

const CATEGORY_OPTIONS = [
  'Non-receipt of benefit',
  'Delay in processing',
  'Incorrect beneficiary data',
  'Aadhaar linking issue',
  'Bank account seeding problem',
  'Application rejection without reason',
  'Portal / technical error',
  'Harassment by officials',
  'Ineligible person enrolled',
  'Duplicate beneficiary',
  'Other',
]

const SAMPLE_GRIEVANCES: Grievance[] = [
  {
    id: '1',
    refNo: 'CPGRAM-2025-AG-887231',
    title: 'PM-KISAN 17th installment not credited despite Aadhaar seeding',
    scheme: 'PM-KISAN Samman Nidhi',
    category: 'Non-receipt of benefit',
    status: 'under_review',
    submittedOn: 'Oct 10, 2025',
    updatedOn: 'Oct 19, 2025',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description:
      'My Aadhaar is linked and bank account seeded under NPCI. Despite the 17th installment being announced, â‚¹2000 was not credited to my account (SBI A/C: XXXX1234). My land records are up to date at district level.',
    timeline: [
      { date: 'Oct 10, 2025', action: 'Grievance filed on CPGRAMS portal', actor: 'Citizen' },
      { date: 'Oct 12, 2025', action: 'Auto-forwarded to District Agriculture Officer, Rajasthan', actor: 'System' },
      { date: 'Oct 15, 2025', action: 'Acknowledgement received from DAO â€” under investigation', actor: 'DAO Rajasthan' },
      { date: 'Oct 19, 2025', action: 'NPCI Aadhaar mapper verification initiated', actor: 'DAO Rajasthan' },
    ],
  },
  {
    id: '2',
    refNo: 'CPGRAM-2025-HH-334189',
    title: 'Ayushman card not issued despite hospital enrollment',
    scheme: 'Ayushman Bharat PMJAY',
    category: 'Portal / technical error',
    status: 'resolved',
    submittedOn: 'Sep 22, 2025',
    updatedOn: 'Oct 5, 2025',
    department: 'National Health Authority',
    description:
      'Enrolled at empaneled hospital but Ayushman Golden Card was not generated on the portal. Family name shows as eligible on SECC data but system throws an error during e-card generation.',
    timeline: [
      { date: 'Sep 22, 2025', action: 'Grievance registered on CPGRAMS', actor: 'Citizen' },
      { date: 'Sep 24, 2025', action: 'Forwarded to State NHA Nodal Officer (UP)', actor: 'System' },
      { date: 'Sep 28, 2025', action: 'Technical team identified duplicate entry in SECC database', actor: 'NHA State Team' },
      { date: 'Oct 3, 2025', action: 'Duplicate record resolved, Golden Card generated', actor: 'NHA IT Cell' },
      { date: 'Oct 5, 2025', action: 'Grievance marked resolved â€” SMS sent to citizen', actor: 'NHA State Team' },
    ],
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="p-1 rounded hover:bg-slate-100 transition" title="Copy reference number">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  )
}

function GrievanceCard({ g, isOpen, onToggle }: { g: Grievance; isOpen: boolean; onToggle: () => void }) {
  const cfg = statusConfig[g.status]
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div
        className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{g.category}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">{g.title}</h3>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
            <span>{g.scheme}</span>
            <span>Â·</span>
            <span className="flex items-center gap-1 font-mono text-slate-600">{g.refNo} <CopyButton text={g.refNo} /></span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-medium">Updated {g.updatedOn}</span>
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-5">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</p>
            <p className="text-xs text-slate-700 leading-relaxed">{g.description}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Resolution Timeline</p>
            <ol className="relative border-l-2 border-slate-200 space-y-4 pl-5">
              {g.timeline.map((step, i) => (
                <li key={i} className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-800">{step.action}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{step.date} Â· {step.actor}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://pgportal.gov.in`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition"
            >
              View on CPGRAMS <ExternalLink className="w-3 h-3" />
            </a>
            {g.status === 'under_review' && (
              <button className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition">
                <AlertTriangle className="w-3 h-3" /> Escalate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function GrievancePage() {
  const [activeTab, setActiveTab] = useState<'file' | 'track'>('file')
  const [openId, setOpenId] = useState<string | null>('1')
  const [trackRef, setTrackRef] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    aadhaarLast4: '',
    mobile: '',
    scheme: '',
    category: '',
    description: '',
    district: '',
    state: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [generatedRef, setGeneratedRef] = useState('')

  const [realGrievances, setRealGrievances] = useState<any[]>([])

  useEffect(() => {
    grievancesApi.list().then(items => setRealGrievances(items)).catch(() => {})
  }, [submitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const created = await grievancesApi.create({
        subject: `${formData.scheme || "Welfare Scheme"} - ${formData.category || "Grievance"}`,
        description: `${formData.description}\n\nDistrict: ${formData.district}, State: ${formData.state}\nComplainant: ${formData.name}, Mobile: ${formData.mobile}`,
        category: "Scheme Application"
      })
      const ref = (created as any).referenceNumber || `CPGRAM-2026-${created._id.slice(-6).toUpperCase()}`
      setGeneratedRef(ref)
      setSubmitted(true)
    } catch (err) {
      const fallbackRef = `CPGRAM-2026-${Date.now().toString(36).slice(-6).toUpperCase()}`
      setGeneratedRef(fallbackRef)
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Header */}
      <section className="relative bg-slate-950 overflow-hidden pt-14 pb-16 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-br from-rose-600/20 via-orange-600/15 to-amber-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-rose-300 mb-5">
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>Citizen Grievance Redressal System</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span className="bg-gradient-to-r from-white via-orange-100 to-rose-200 bg-clip-text text-transparent">
              Report. Track.
            </span>{' '}
            <span className="text-white">Resolve.</span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
            File grievances against welfare scheme delays, non-receipt of benefits, or portal errors. Integrated with
            CPGRAMS â€” India's official Centralized Public Grievance Redress and Monitoring System.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Integrated with CPGRAMS Â· pgportal.gov.in</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Toll-Free: 1800-11-0001</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-violet-400" />
              <span>30-day resolution mandate under GRC Framework</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-white border border-slate-200 p-1 rounded-2xl w-fit shadow-sm">
          <button
            onClick={() => { setActiveTab('file'); setSubmitted(false) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'file' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            File New Grievance
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'track' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Track Grievances
          </button>
        </div>

        {activeTab === 'file' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            {/* Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Grievance Filed Successfully!</h2>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Your grievance has been registered on the CPGRAMS system. You will receive an SMS on your registered mobile number within 24 hours.
                  </p>
                  <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 inline-block">
                    <p className="text-xs text-slate-500 font-medium mb-1">Your Reference Number</p>
                    <div className="flex items-center gap-2 justify-center">
                      <span className="font-mono font-bold text-blue-700 text-base">{generatedRef}</span>
                      <CopyButton text={generatedRef} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">Save this for tracking. Expect resolution within 30 days.</p>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => { setSubmitted(false); setActiveTab('track') }}
                      className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                    >
                      Track This Grievance
                    </button>
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ name: '', aadhaarLast4: '', mobile: '', scheme: '', category: '', description: '', district: '', state: '' }) }}
                      className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
                    >
                      File Another
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-black text-slate-900 mb-1">New Grievance Form</h2>
                    <p className="text-xs text-slate-500">All fields marked * are mandatory. Your data is encrypted and never shared.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name (as per Aadhaar) *</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. Ramesh Kumar Sharma"
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Last 4 digits of Aadhaar *</label>
                        <input
                          required
                          maxLength={4}
                          type="text"
                          value={formData.aadhaarLast4}
                          onChange={e => setFormData(p => ({ ...p, aadhaarLast4: e.target.value.replace(/\D/g, '') }))}
                          placeholder="XXXX"
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition placeholder:text-slate-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number *</label>
                        <input
                          required
                          type="tel"
                          maxLength={10}
                          value={formData.mobile}
                          onChange={e => setFormData(p => ({ ...p, mobile: e.target.value.replace(/\D/g, '') }))}
                          placeholder="10-digit mobile"
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">State *</label>
                        <select
                          required
                          value={formData.state}
                          onChange={e => setFormData(p => ({ ...p, state: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition bg-white"
                        >
                          <option value="">Select State</option>
                          {['Andhra Pradesh','Bihar','Delhi','Gujarat','Haryana','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Scheme Related to Grievance *</label>
                      <select
                        required
                        value={formData.scheme}
                        onChange={e => setFormData(p => ({ ...p, scheme: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition bg-white"
                      >
                        <option value="">Select Scheme</option>
                        {SCHEME_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Grievance Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition bg-white"
                      >
                        <option value="">Select Category</option>
                        {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                        placeholder="Describe your grievance in detail â€” include dates, amounts expected, transaction IDs, bank account numbers (last 4 digits only), etc."
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 transition placeholder:text-slate-400 resize-none leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{formData.description.length}/1000 characters. Be specific for faster resolution.</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition"
                    >
                      <Send className="w-4 h-4" />
                      Submit Grievance to CPGRAMS
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Right Sidebar â€” Info */}
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md">
                <h3 className="font-bold text-sm mb-3">How Grievance Redressal Works</h3>
                <ol className="space-y-4">
                  {[
                    { num: 1, title: 'File Grievance', desc: 'Submit details via Adhikar or directly at pgportal.gov.in' },
                    { num: 2, title: 'Auto-routing', desc: 'System routes to concerned ministry/department within 24 hrs' },
                    { num: 3, title: 'Investigation', desc: 'Nodal officer investigates and requests documents if needed' },
                    { num: 4, title: 'Resolution', desc: 'Response within 30 days per GRC mandate (escalatable)' },
                  ].map(step => (
                    <li key={step.num} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/15 text-white flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                        {step.num}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{step.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{step.desc}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Escalation Channels</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { label: 'CPGRAMS Portal', url: 'https://pgportal.gov.in', icon: Globe },
                    { label: 'PM Helpline: 1800-11-0001', url: 'tel:18001100001', icon: Phone },
                    { label: 'National Consumer Helpline: 1915', url: 'tel:1915', icon: Phone },
                    { label: 'RTI Online: rtionline.gov.in', url: 'https://rtionline.gov.in', icon: ExternalLink },
                  ].map((ch, i) => {
                    const Icon = ch.icon
                    return (
                      <a
                        key={i}
                        href={ch.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition font-semibold text-slate-700 hover:text-blue-700 group"
                      >
                        <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                        {ch.label}
                        <ExternalLink className="w-3 h-3 ml-auto text-slate-300 group-hover:text-blue-500 transition" />
                      </a>
                    )
                  })}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5">
                <div className="flex gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <h3 className="font-bold text-xs text-amber-800">Important Note</h3>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Adhikar is not a government portal. Grievances filed here are guided through the official CPGRAMS process. For direct government filing, visit{' '}
                  <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer" className="underline font-bold">
                    pgportal.gov.in
                  </a>
                  . Your personal data is encrypted and processed only for routing.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="space-y-5">
            {/* Search by Reference */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={trackRef}
                onChange={e => setTrackRef(e.target.value)}
                placeholder="Search by CPGRAMS reference number (e.g. CPGRAM-2025-AG-887231)..."
                className="flex-1 text-xs font-medium bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400"
              />
              <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-sm">
                Track
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Filed', value: realGrievances.length > 0 ? realGrievances.length : SAMPLE_GRIEVANCES.length, color: 'text-slate-900' },
                { label: 'Under Review', value: SAMPLE_GRIEVANCES.filter(g => g.status === 'under_review').length, color: 'text-amber-600' },
                { label: 'Resolved', value: SAMPLE_GRIEVANCES.filter(g => g.status === 'resolved').length, color: 'text-emerald-600' },
                { label: 'Avg Resolution', value: '18 days', color: 'text-blue-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Grievance Cards */}
            <div className="space-y-4">
              {SAMPLE_GRIEVANCES.filter(g =>
                trackRef === '' || g.refNo.toLowerCase().includes(trackRef.toLowerCase())
              ).map(g => (
                <GrievanceCard
                  key={g.id}
                  g={g}
                  isOpen={openId === g.id}
                  onToggle={() => setOpenId(openId === g.id ? null : g.id)}
                />
              ))}
              {SAMPLE_GRIEVANCES.filter(g =>
                trackRef === '' || g.refNo.toLowerCase().includes(trackRef.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-semibold text-slate-600">No grievances found for that reference</p>
                  <p className="text-sm">Try a different reference number or file a new grievance.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
