import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Phone, Mail, MapPin, ChevronDown, CheckCircle2, MessageSquare, Loader2, FileText, ChevronUp } from 'lucide-react'
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
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  // Grievance State
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [gForm, setGForm] = useState({ subject: '', category: 'Scheme Application', description: '' })

  const faqs = [
    { q: "How can I check my eligibility?", a: "You can click on 'Check Eligibility' from the Home page. Answer a few questions or login to use your profile data to get an AI-curated list of eligible schemes." },
    { q: "What documents are required?", a: "Documents vary by scheme. Generally, Aadhaar Card, Income Certificate, and Residence Proof are required. You can check the specific scheme details page for exact requirements." },
    { q: "How to apply for a scheme?", a: "Find your scheme on the Adhikar portal, click 'Apply Now', fill the smart stepper application form to track it locally, and then we will redirect you to the official government portal to submit it." },
    { q: "Is there any application fee?", a: "Most government schemes are free to apply. Adhikar itself is a 100% free platform designed for citizens." },
    { q: "How do I track my application?", a: "Go to the 'Track Your Application' section from the top navigation or your dashboard to view real-time status of your saved applications." },
  ]

  const guides = [
    { title: 'Getting Started with Adhikar', desc: 'Learn how to create an account, set up your profile, and discover schemes matching your life events.' },
    { title: 'Uploading & Managing Documents', desc: 'A step-by-step guide to secure document upload, categorization, and verification.' },
    { title: 'Using the AI Assistant', desc: 'How to ask the right questions to our AI to get accurate information about any scheme.' }
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
    if (!user) return alert('Please login to submit a grievance.')
    
    setIsSubmitting(true)
    try {
      await grievancesApi.create(gForm)
      setGForm({ subject: '', category: 'Scheme Application', description: '' })
      await loadGrievances()
      alert('Grievance submitted successfully. We will look into it shortly.')
    } catch (err) {
      alert('Failed to submit grievance.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa] min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-[#00428a] hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Help & Support</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#00428a] mb-2">Help & Support</h1>
        <p className="text-sm text-gray-600">Get assistance for government schemes and services.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex overflow-x-auto scrollbar-hide mb-8">
        {[
          { id: 'faq', label: 'Frequently Asked Questions' },
          { id: 'guides', label: 'User Guides' },
          { id: 'grievance', label: 'Grievance Redressal' },
          { id: 'contact', label: 'Contact Us' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[150px] py-3 text-sm font-bold rounded transition-all ${
              activeTab === tab.id 
                ? 'bg-[#00428a] text-white shadow' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
              {faqs.map((faq, i) => (
                <div key={i} className="w-full text-left">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition group"
                  >
                    <span className={`text-sm font-bold ${openFaq === i ? 'text-[#00428a]' : 'text-gray-800 group-hover:text-[#00428a]'}`}>
                      {faq.q}
                    </span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#00428a]" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#00428a]" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed bg-blue-50/20">
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
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 bg-blue-50 text-[#00428a] rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{guide.desc}</p>
                  <button className="text-[#00428a] text-xs font-bold hover:underline">Read Guide →</button>
                </div>
              ))}
            </div>
          )}

          {/* Grievance Tab */}
          {activeTab === 'grievance' && (
            <div className="space-y-8">
              {!user ? (
                <div className="bg-white border border-gray-200 p-8 rounded-xl text-center shadow-sm">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Login Required</h3>
                  <p className="text-sm text-gray-500 mb-4">Please login to submit or view your grievances.</p>
                  <Link to="/login" className="bg-[#00428a] text-white px-6 py-2 rounded font-bold text-sm">Login Now</Link>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Submit a Grievance</h3>
                    <p className="text-xs text-gray-500 mb-6">Facing issues? Let us know and we will resolve it.</p>
                    
                    <form onSubmit={submitGrievance} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
                          <select value={gForm.category} onChange={e=>setGForm({...gForm, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                            <option>Scheme Application</option>
                            <option>Portal Issue</option>
                            <option>Document Verification</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Subject</label>
                          <input type="text" required value={gForm.subject} onChange={e=>setGForm({...gForm, subject: e.target.value})} placeholder="Brief issue title" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                        <textarea required value={gForm.description} onChange={e=>setGForm({...gForm, description: e.target.value})} rows={4} placeholder="Describe your issue in detail..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]"></textarea>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="submit" disabled={isSubmitting} className="bg-[#00428a] text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-800 transition disabled:opacity-70 flex items-center gap-2">
                          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin"/>} Submit Ticket
                        </button>
                      </div>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Past Grievances</h3>
                    {isLoading ? (
                      <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-[#00428a] animate-spin" /></div>
                    ) : grievances.length === 0 ? (
                      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 shadow-sm">
                        No past grievances found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {grievances.map(g => (
                          <div key={g._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-900 text-sm">{g.subject}</h4>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                g.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                                g.status === 'Open' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                              }`}>{g.status}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">{g.description}</p>
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                              <span>{g.category}</span>
                              <span>•</span>
                              <span>{new Date(g.createdAt).toLocaleDateString()}</span>
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

          {/* Contact Tab (Same as Right Sidebar but full width if selected) */}
          {activeTab === 'contact' && (
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-2xl">
             <h3 className="text-xl font-bold text-gray-900 mb-2">Reach Out to Us</h3>
             <p className="text-sm text-gray-500 mb-8 leading-relaxed">Need direct assistance? Contact our official support channels.</p>
             
             <div className="space-y-8">
               <div className="flex gap-5 items-center">
                 <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                   <Phone className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="text-sm font-semibold text-gray-500 mb-1">Toll Free Number</h4>
                   <p className="text-lg font-black text-gray-900">1800-123-4567</p>
                   <p className="text-xs text-gray-400">(Mon - Sat, 9:00 AM to 6:00 PM)</p>
                 </div>
               </div>
 
               <div className="flex gap-5 items-center">
                 <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100">
                   <Mail className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="text-sm font-semibold text-gray-500 mb-1">Email Support</h4>
                   <a href="mailto:support@adhikar.gov.in" className="text-lg font-black text-[#00428a] hover:underline">support@adhikar.gov.in</a>
                 </div>
               </div>
 
               <div className="flex gap-5 items-center">
                 <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                   <MapPin className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="text-sm font-semibold text-gray-500 mb-1">Head Office Address</h4>
                   <p className="text-sm text-gray-800 leading-relaxed font-bold">Ministry of Electronics & Information Technology,<br/>Government of India, New Delhi - 110001</p>
                 </div>
               </div>
             </div>
           </div>
          )}

        </div>

        {/* Right Side - Quick Contact Card (Only show if not on Contact tab) */}
        {activeTab !== 'contact' && (
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need Immediate Help?</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">Reach out to our helpline for instant support.</p>
              
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Helpline</h4>
                    <p className="text-sm font-bold text-gray-900">1800-123-4567</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Email</h4>
                    <a href="mailto:support@adhikar.gov.in" className="text-sm font-bold text-[#00428a] hover:underline">support@adhikar.gov.in</a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3 text-center">Prefer talking to our AI?</p>
                <Link to="/assistant" className="w-full py-2.5 rounded-lg border-2 border-[#00428a] text-[#00428a] text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition">
                  <MessageSquare className="w-4 h-4" /> Chat with Assistant
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
