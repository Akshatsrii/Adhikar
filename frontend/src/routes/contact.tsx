import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Phone, Mail, MapPin, ChevronDown, MessageSquare, Loader2, FileText, ChevronUp, Sparkles, CheckCircle2, ShieldCheck, Clock } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { grievancesApi } from '@/lib/api'
import type { GrievanceRecord } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'faq' | 'guides' | 'grievance' | 'contact'>('faq')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Grievance State
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [gForm, setGForm] = useState({ subject: '', category: 'Scheme Application', description: '' })
  const [submittedSuccess, setSubmittedSuccess] = useState(false)

  const faqs = [
    {
      q: 'How does Adhikar match me with welfare schemes?',
      a: 'Adhikar runs a dual-layer intelligence engine: first, deterministic demographic filters parse your age, state, and category against official scheme rules. Second, our Gemini AI Copilot helps contextualize eligibility without hallucinations.',
    },
    {
      q: 'Does Adhikar charge any fee for application submission?',
      a: 'No. Adhikar is a 100% free, public civic-tech platform for Indian citizens. When you click "Apply", you are redirected directly to official government portals (.gov.in / .nic.in).',
    },
    {
      q: 'What mandatory documents are required across most schemes?',
      a: 'Most DBT schemes require an Aadhaar Card, an active Aadhaar-seeded Bank Account, an Income Certificate (issued by the competent state authority), and a Domicile/Residence proof.',
    },
    {
      q: 'How do I resolve a rejected or stalled scheme application?',
      a: 'You can use the Grievance Redressal tab to file an internal query, or consult the Adhikar AI Copilot for step-by-step guidance on how to submit a formal appeal on CPGRAMS (Centralized Public Grievance Redress and Monitoring System).',
    },
    {
      q: 'Can I apply for schemes belonging to other states?',
      a: 'Central Sector schemes (like PM-KISAN, Ayushman Bharat, PMAY) are open to citizens across all states. State-specific schemes (like Chiranjeevi in Rajasthan) require a valid domicile certificate of that state.',
    },
  ]

  const guides = [
    {
      title: 'Citizen Onboarding & Profile Setup',
      desc: 'How to build your welfare profile to unlock automated match alerts for schemes as soon as notifications are gazetted.',
    },
    {
      title: 'Smart Document Locker & Aadhaar Verification',
      desc: 'A complete walkthrough on uploading, verifying, and linking required certificates before filing government applications.',
    },
    {
      title: 'Interacting with the Gemini AI Copilot',
      desc: 'Best practices for asking complex eligibility questions in English, Hindi, or Hinglish with accurate rule citations.',
    },
  ]

  useEffect(() => {
    if (activeTab === 'grievance' && user) {
      loadGrievances()
    }
  }, [activeTab, user])

  const loadGrievances = async () => {
    setIsLoading(true)
    try {
      const data = await grievancesApi.list()
      setGrievances(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const submitGrievance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      await grievancesApi.create(gForm)
      setGForm({ subject: '', category: 'Scheme Application', description: '' })
      setSubmittedSuccess(true)
      await loadGrievances()
      setTimeout(() => setSubmittedSuccess(false), 4000)
    } catch {
      alert('Failed to submit grievance. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Citizen Helpdesk & Grievance</span>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/50 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Citizen Support Hub
          </span>
          <span className="text-[11px] font-semibold text-slate-400">24/7 Redressal</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Help, Support & Redressal</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore FAQs, read application guides, or file a formal grievance regarding scheme disbursement issues.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-1.5 flex overflow-x-auto scrollbar-hide mb-8 gap-1.5">
        {[
          { id: 'faq', label: 'Frequently Asked Questions' },
          { id: 'guides', label: 'User Guides' },
          { id: 'grievance', label: 'Grievance Redressal' },
          { id: 'contact', label: 'National Helplines' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[160px] py-2.5 px-4 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100">
              {faqs.map((faq, i) => (
                <div key={i} className="w-full text-left">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-7 py-5 flex items-center justify-between hover:bg-slate-50/50 transition group"
                  >
                    <span className={`text-xs md:text-sm font-bold ${openFaq === i ? 'text-blue-600' : 'text-slate-800'}`}>
                      {faq.q}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-7 pb-5 text-xs text-slate-600 leading-relaxed bg-blue-50/20 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* User Guides Tab */}
          {activeTab === 'guides' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {guides.map((guide, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mb-2">{guide.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">{guide.desc}</p>
                  </div>
                  <Link to="/assistant" className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
                    <span>Ask Copilot for Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Grievance Tab */}
          {activeTab === 'grievance' && (
            <div className="space-y-8">
              {!user ? (
                <div className="bg-white border border-slate-200/80 p-10 rounded-3xl text-center shadow-xs">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">Citizen Login Required</h3>
                  <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
                    Please log in to your account to file, track, and receive official notifications regarding your grievance.
                  </p>
                  <Link to="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition">
                    Sign In to Continue
                  </Link>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-7 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Submit a Citizen Grievance</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Report delays in DBT disbursement, application rejections, or portal errors.</p>
                      </div>
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>

                    {submittedSuccess && (
                      <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Your grievance ticket has been logged and assigned to the nodal coordinator.</span>
                      </div>
                    )}

                    <form onSubmit={submitGrievance} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Issue Category</label>
                          <select
                            value={gForm.category}
                            onChange={(e) => setGForm({ ...gForm, category: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 font-medium"
                          >
                            <option>Scheme Application</option>
                            <option>Portal / Technical Issue</option>
                            <option>Document Verification Delay</option>
                            <option>DBT Installment Not Received</option>
                            <option>Other Civic Query</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                          <input
                            type="text"
                            required
                            value={gForm.subject}
                            onChange={(e) => setGForm({ ...gForm, subject: e.target.value })}
                            placeholder="e.g. 17th Installment pending for PM-KISAN"
                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 font-medium placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description</label>
                        <textarea
                          required
                          value={gForm.description}
                          onChange={(e) => setGForm({ ...gForm, description: e.target.value })}
                          rows={4}
                          placeholder="Provide application reference number, registration date, and specific issue encountered..."
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 font-medium placeholder:text-slate-400"
                        ></textarea>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>Submit Grievance Ticket</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Your Past Tickets</h3>
                    {isLoading ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      </div>
                    ) : grievances.length === 0 ? (
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 text-xs shadow-xs">
                        No previous tickets filed. All your past grievances will appear here.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {grievances.map((g) => (
                          <div key={g._id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-slate-900 text-xs md:text-sm">{g.subject}</h4>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  g.status === 'Resolved'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {g.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-3">{g.description}</p>
                            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                              <span>{g.category}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Under Review
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Contact Us Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">National Citizen Toll-Free Helpline</h4>
                <p className="text-xs text-slate-500">Accessible 24x7 from any network within India.</p>
                <div className="text-lg font-mono font-black text-blue-600">1800-11-0000</div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Direct Citizen Redressal Email</h4>
                <p className="text-xs text-slate-500">Expected response time within 2 business days.</p>
                <div className="text-sm font-mono font-bold text-slate-900">support@adhikar-platform.in</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Info Card */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
              Escalation Matrix
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              If your grievance is not resolved within 7 business days, it is automatically escalated to the District Welfare Officer
              and mirrored to national CPGRAMS.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Central Coordination Office</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Department of Administrative Reforms & Public Grievances, New Delhi - 110001
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
