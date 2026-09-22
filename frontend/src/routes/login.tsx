import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, authApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tab, setTab] = useState<'citizen' | 'org'>('citizen')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await authApi.login({ email, password })
      login(res.user, res.token)
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not log you in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 flex bg-[#f5f6fa] p-4 md:p-8 justify-center items-center">
      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden w-full max-w-5xl flex flex-col md:flex-row min-h-[550px]">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-1">Login to your Adhikar account</p>
          </div>

          <div className="flex border-b border-gray-200 mb-8 max-w-md mx-auto w-full">
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

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto w-full">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Mobile Number / Email <span className="text-red-500">*</span></label>
              <div className="flex">
                <select className="border border-gray-300 border-r-0 rounded-l px-2 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none">
                  <option>+91</option>
                </select>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-r px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
                  placeholder="Enter mobile number or email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
                placeholder="••••••••"
              />
              <div className="text-right mt-2">
                 <button type="button" className="text-xs font-bold text-[#00428a] hover:underline">Forgot Password?</button>
              </div>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-bold text-red-600">{error}</p>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#00428a] text-white font-bold py-3 rounded hover:bg-blue-800 transition shadow-sm mt-2">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account? <Link to="/register" className="font-bold text-[#00428a] hover:underline">Register</Link>
          </p>
        </div>

        {/* Right Side - Benefits */}
        <div className="w-full md:w-[45%] relative bg-blue-50 hidden md:block">
           <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Parliament_House_of_India_New_Delhi.jpg/1280px-Parliament_House_of_India_New_Delhi.jpg')] bg-cover bg-center opacity-[0.15]"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent"></div>
           
           <div className="relative z-10 p-12 flex flex-col justify-center h-full">
             <h2 className="text-xl font-bold text-[#00428a] mb-6">Benefits of Logging in</h2>
             <ul className="space-y-6">
                {[
                  "Personalized scheme matches",
                  "Save and track applications",
                  "Manage family profiles",
                  "Get deadline reminders"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#00428a]">
                       <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{benefit}</span>
                  </li>
                ))}
             </ul>
           </div>
        </div>

      </div>
    </div>
  )
}
