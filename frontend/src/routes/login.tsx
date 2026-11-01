import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, authApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Loader2, ArrowRight, Lock, Mail } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await authApi.login({ email, password })
      login(res.user, res.token)
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid credentials. Please verify your email and password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAE6DF]">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto shadow-md border border-neutral-800">
            <img src="/adhikar-badge-dark.png" alt="Adhikar Official Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight">Citizen Sign In</h2>
          <p className="text-xs text-[#52525B] font-normal">Access your verified welfare dashboard and tracked applications</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3.5 rounded-2xl text-xs font-semibold text-center border border-rose-200">
            {error}
          </div>
        )}

        {/* Email Flow */}
        <form className="mt-6 space-y-5" onSubmit={handleEmailLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">Email address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#EAE6DF] rounded-2xl text-xs text-black bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition placeholder:text-neutral-400"
                  placeholder="citizen@example.com"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-neutral-800">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-[#FF5500] hover:underline font-bold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#EAE6DF] rounded-2xl text-xs text-black bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition placeholder:text-neutral-400"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl shadow-md shadow-blue-500/20 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <div className="text-center text-xs text-[#52525B] pt-2 border-t border-[#EAE6DF]">
            <span>Don't have an account?</span>{' '}
            <Link to="/register" className="font-bold text-[#FF5500] hover:underline font-bold">
              Create free account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
