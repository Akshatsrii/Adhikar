import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, authApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

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
      setError(err instanceof ApiError ? err.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#00428a]">Meri Sarkar, Mera Adhikar</h2>
          <p className="mt-2 text-sm text-gray-600">Access your personalized citizen services dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Email Flow */}
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#00428a] focus:border-[#00428a] sm:text-sm"
                placeholder="citizen@india.gov.in"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#00428a] focus:border-[#00428a] sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-bold text-[#00428a] hover:text-blue-800">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#00428a] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00428a] transition disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In securely'}
          </button>
          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account?</span>{' '}
            <Link to="/register" className="font-bold text-[#00428a] hover:text-blue-800">
              Register here
            </Link>
          </div>
        </form>

      </div>
    </div>
  )
}
