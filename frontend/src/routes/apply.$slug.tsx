import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { ChevronRight, ArrowRight, ArrowLeft, Loader2, Info } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { schemesApi, applicationsApi, PublicScheme } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/apply/$slug')({
  component: ApplyPage,
})

const getCategoryImg = (cat: string) => {
  switch (cat?.toLowerCase()) {
    case 'education': return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop'
    case 'agriculture': return 'https://images.unsplash.com/photo-1592982537447-6f23342d2bf5?q=80&w=400&auto=format&fit=crop'
    case 'housing': return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop'
    case 'healthcare': return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop'
    case 'employment': return 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=400&auto=format&fit=crop'
    case 'women': return 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=400&auto=format&fit=crop'
    default: return 'https://images.unsplash.com/photo-1571260899304-4250708f069f?q=80&w=400&auto=format&fit=crop'
  }
}

function ApplyPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [scheme, setScheme] = useState<PublicScheme | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Pre-fill form from user profile
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    dob: user?.profile?.dob || '',
    mobile: '',
    email: '',
    gender: 'Male'
  })

  useEffect(() => {
    schemesApi.get(slug).then(res => {
      setScheme(res)
    }).catch(console.error)
      .finally(() => setIsLoading(false))
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheme) return
    
    try {
      setIsSubmitting(true)
      // Call application tracker API
      await applicationsApi.track({
        schemeId: scheme.slug,
        schemeName: scheme.name
      })
      alert('Application tracked successfully! You will now be redirected to the official portal.')
      window.open(scheme.source_url || '#', '_blank')
      navigate({ to: '/track' })
    } catch (err) {
      alert('Failed to track application. Continuing to portal anyway.')
      window.open(scheme.source_url || '#', '_blank')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#00428a]" />
      </div>
    )
  }

  if (!scheme) {
    return (
      <div className="text-center py-20">Scheme not found.</div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa] min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-[#00428a] hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/schemes" className="text-[#00428a] hover:underline">Schemes</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Apply</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#00428a] mb-2 tracking-tight">Apply for Government Scheme</h1>
        <p className="text-sm text-gray-600 font-medium">Complete your application with step-by-step guidance</p>
      </div>

      {/* Stepper with Unique Modern Look */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 scrollbar-hide">
          
          <div className="flex flex-col items-center gap-2 text-sm font-bold text-[#00428a] shrink-0">
            <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs shadow-md">✓</span>
            <span className="text-green-600">Select Scheme</span>
          </div>
          
          <div className="h-[2px] bg-green-500 flex-1 mx-4 min-w-[30px] rounded-full"></div>
          
          <div className="flex flex-col items-center gap-2 text-sm font-bold text-[#00428a] shrink-0 relative">
            <span className="w-8 h-8 rounded-full bg-[#00428a] text-white flex items-center justify-center text-xs shadow-lg ring-4 ring-blue-50 relative z-10">2</span>
            <span>Fill Application</span>
          </div>
          
          <div className="h-[2px] bg-gray-100 flex-1 mx-4 min-w-[30px] rounded-full"></div>
          
          <div className="flex flex-col items-center gap-2 text-sm font-bold text-gray-400 shrink-0">
            <span className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-xs">3</span>
            <span>Upload Docs</span>
          </div>

          <div className="h-[2px] bg-gray-100 flex-1 mx-4 min-w-[30px] rounded-full"></div>
          
          <div className="flex flex-col items-center gap-2 text-sm font-bold text-gray-400 shrink-0">
            <span className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-xs">4</span>
            <span>Submit</span>
          </div>
        </div>

        {/* Selected Scheme Card */}
        <div className="mb-10 bg-gray-50/50 border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row gap-0 md:gap-4 shadow-sm hover:shadow-md transition">
          <div className="h-40 md:h-auto md:w-56 bg-gray-200 shrink-0 relative">
            <img src={getCategoryImg(scheme.category)} onError={(e) => e.currentTarget.src='/images/emblem.svg'} alt={scheme.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
          </div>
          <div className="p-5 flex flex-col justify-center flex-1">
            <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2">{scheme.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-[#00428a] bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-100">{scheme.category}</span>
              <span className="text-[10px] font-bold text-gray-600 bg-white px-2.5 py-1 rounded-md border border-gray-200 uppercase tracking-wider">{scheme.level}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{scheme.description}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-gray-700 bg-white inline-flex p-2.5 rounded-lg border border-gray-100">
              <span className="flex items-center gap-1.5 text-emerald-600"><span className="bg-emerald-100 w-5 h-5 rounded-full flex items-center justify-center">₹</span> {scheme.benefit || 'Variable Support'}</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1.5"><Info className="w-4 h-4 text-gray-400"/> {scheme.department || 'Govt. Dept'}</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#00428a] mb-6 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#00428a] rounded-full inline-block"></span>
          Personal Information
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name (as per documents) <span className="text-red-500">*</span></label>
              <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a] transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Date of Birth <span className="text-red-500">*</span></label>
              <input type="date" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a] transition" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Mobile Number <span className="text-red-500">*</span></label>
              <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 focus-within:border-[#00428a] focus-within:ring-1 focus-within:ring-[#00428a] transition">
                <div className="bg-gray-100 px-3 py-3 border-r border-gray-200 text-sm font-bold text-gray-600 flex items-center">
                  +91
                </div>
                <input type="tel" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="Enter 10 digit number" className="flex-1 bg-gray-50 px-4 py-3 text-sm text-gray-900 font-medium focus:bg-white focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Email ID</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Enter email address" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a] transition" />
            </div>
          </div>
          
          <div className="mb-6 bg-blue-50/50 p-5 rounded-xl border border-blue-100/50">
            <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Gender <span className="text-red-500">*</span></label>
            <div className="flex gap-8">
              {['Male', 'Female', 'Other'].map(g => (
                <label key={g} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="radio" name="gender" checked={formData.gender === g} onChange={() => setFormData({...formData, gender: g})} className="w-4 h-4 text-[#00428a] focus:ring-[#00428a] border-gray-300" />
                  <span className="text-sm text-gray-800 font-bold group-hover:text-[#00428a] transition">{g}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <button type="button" onClick={() => navigate({ to: '/scheme/$slug', params: { slug } })} className="w-full sm:w-auto text-gray-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-[#00428a] text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(0,66,138,0.39)] hover:shadow-[0_6px_20px_rgba(0,66,138,0.23)] disabled:opacity-70">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
              Save & Apply on Portal <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
