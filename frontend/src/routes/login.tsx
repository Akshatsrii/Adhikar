import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, authApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { CheckCircle2, ChevronRight, Loader2, Smartphone, Mail } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Tabs for Auth Method
  const [authMethod, setAuthMethod] = useState<'otp' | 'email'>('otp')

  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone') // For OTP flow
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

  async function handleSendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (phone.length !== 10) return setError('Please enter a valid 10-digit mobile number')
    
    setError(null)
    setIsSubmitting(true)

    try {
      await authApi.sendOtp(phone)
      setStep('otp')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (otp.length !== 6) return setError('OTP must be exactly 6 digits')
    
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await authApi.verifyOtp({ phone, otp })
      login(res.user, res.token)
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid OTP')
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

        {/* Auth Method Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => { setAuthMethod('otp'); setStep('phone'); setError(null) }}
            className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition ${authMethod === 'otp' ? 'bg-white shadow-sm text-[#00428a]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Smartphone className="w-4 h-4" /> Mobile OTP
          </button>
          <button
            onClick={() => { setAuthMethod('email'); setError(null) }}
            className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition ${authMethod === 'email' ? 'bg-white shadow-sm text-[#00428a]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Mail className="w-4 h-4" /> Email & Password
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        {/* OTP Flow */}
        {authMethod === 'otp' && step === 'phone' && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-bold sm:text-sm">
                  +91
                </span>
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-lg focus:ring-[#00428a] focus:border-[#00428a] sm:text-sm border-gray-300"
                  placeholder="Enter 10-digit number"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || phone.length !== 10}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#00428a] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00428a] transition disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get OTP'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy. New users will be registered automatically.
            </p>
          </form>
        )}

        {authMethod === 'otp' && step === 'otp' && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Enter the 6-digit OTP sent to</p>
              <p className="font-bold text-gray-900">+91 {phone} <button type="button" onClick={() => setStep('phone')} className="text-[#00428a] text-xs underline ml-2">Edit</button></p>
              <p className="text-[10px] text-gray-400 mt-1">(Hint: Use 123456 for demo)</p>
            </div>
            <div>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="appearance-none block w-full px-3 py-3 text-center tracking-[0.5em] text-2xl border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                placeholder="------"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#00428a] hover:bg-blue-800 focus:outline-none transition disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
            </button>
          </form>
        )}

        {/* Email Flow */}
        {authMethod === 'email' && (
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
                  placeholder="Citizen Email"
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
                <a href="#" className="font-bold text-[#00428a] hover:text-blue-800">
                  Forgot your password?
                </a>
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
              <span className="text-gray-500">Don't have an email account?</span>{' '}
              <Link to="/register" className="font-bold text-[#00428a] hover:text-blue-800">
                Register here
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
