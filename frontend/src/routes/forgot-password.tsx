import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, authApi } from '@/lib/api'
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const res = await authApi.forgotPassword(email)
      setSuccess(res.message)
      setStep('otp')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    
    if (newPassword.length < 8) return setError('Password must be at least 8 characters')
    if (otp.length !== 6) return setError('OTP must be exactly 6 digits')

    setIsSubmitting(true)

    try {
      const res = await authApi.resetPassword({ email, otp, newPassword })
      setSuccess(res.message)
      setTimeout(() => {
        navigate({ to: '/login' })
      }, 2000)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to reset password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#00428a]">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">Recover access to your Adhikar account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium text-center border border-green-100 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {success}
          </div>
        )}

        {step === 'email' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
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
            
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#00428a] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00428a] transition mt-6 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset OTP'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleReset}>
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg text-center tracking-widest text-lg focus:outline-none focus:ring-[#00428a] focus:border-[#00428a] sm:text-sm"
                placeholder="------"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-[#00428a] focus:border-[#00428a] sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !otp || !newPassword}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#00428a] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00428a] transition mt-6 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="text-center text-sm pt-4">
          <Link to="/login" className="font-bold text-[#00428a] hover:text-blue-800 flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  )
}
