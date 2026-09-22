import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, authApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tab, setTab] = useState<'citizen' | 'org'>('citizen')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await authApi.register({ name, email, password })
      login(res.user, res.token)
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 flex bg-[#f5f6fa] p-4 md:p-8 justify-center items-center">
      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-[55%] p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          </div>

          <div className="flex border-b border-gray-200 mb-6 max-w-md mx-auto w-full">
            <button 
              onClick={() => setTab('citizen')}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${tab === 'citizen' ? 'text-[#00428a] border-[#00428a]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              Citizen
            </button>
            <button 
              onClick={() => setTab('org')}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${tab === 'org' ? 'text-[#00428a] border-[#00428a]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              Organization
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto w-full">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
              <div className="flex">
                <select className="border border-gray-300 border-r-0 rounded-l px-2 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none">
                  <option>+91</option>
                </select>
                <input
                  type="text"
                  required
                  className="flex-1 border border-gray-300 rounded-r px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Create Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" required className="rounded border-gray-300 text-[#00428a] focus:ring-[#00428a]" />
              <span className="text-[10px] text-gray-600">I agree to the <a href="#" className="text-[#00428a] font-bold">Terms & Conditions</a> and <a href="#" className="text-[#00428a] font-bold">Privacy Policy</a></span>
            </label>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-bold text-red-600 mt-2">{error}</p>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#00428a] text-white font-bold py-2.5 rounded hover:bg-blue-800 transition shadow-sm mt-4">
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6 border-t border-gray-100 pt-4 max-w-md mx-auto w-full">
            Already have an account? <Link to="/login" className="font-bold text-[#00428a] hover:underline">Login</Link>
          </p>
        </div>

        {/* Right Side - Benefits */}
        <div className="w-full md:w-[45%] relative bg-orange-50 hidden md:block">
           <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/800px-India_Gate_in_New_Delhi_03-2016.jpg')] bg-cover bg-center opacity-20"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent"></div>
           
           <div className="relative z-10 p-12 flex flex-col justify-center h-full">
             <h2 className="text-xl font-bold text-[#00428a] mb-6">Why Register?</h2>
             <ul className="space-y-6">
                {[
                  "Get personalized scheme recommendations",
                  "Track your applications",
                  "Manage your documents",
                  "Receive important updates"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-4 bg-white/60 backdrop-blur p-3 rounded-lg border border-white/50 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-orange-500 shrink-0">
                       <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{benefit}</span>
                  </li>
                ))}
             </ul>
           </div>
        </div>

      </div>
    </div>
  )
}
