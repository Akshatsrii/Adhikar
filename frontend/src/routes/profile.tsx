import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { ApiError, profileApi, type ProfilePayload } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { statesAndDistricts } from '@/lib/statesDistricts'
import { ChevronRight, Loader2, User, Phone, Mail, Settings, ShieldAlert } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

const INDIAN_STATES = Object.keys(statesAndDistricts)
const EDUCATION_LEVELS = ['Class 10', 'Class 12', 'Diploma', 'B.Tech', 'B.A / B.Sc / B.Com', 'M.Tech', 'M.A / M.Sc / M.Com', 'PhD']

function emptyProfile(): ProfilePayload {
  return { age: undefined, dob: '', state: '', education: '', income: undefined, occupation: '' }
}

function ProfilePage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  // Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile')

  // Profile Form
  const [profileForm, setProfileForm] = useState<ProfilePayload>(emptyProfile())
  
  // Account Form
  const [accountForm, setAccountForm] = useState({ name: '', email: '', phone: '' })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    // Load existing basic auth user data
    setAccountForm({ name: user.name, email: user.email || '', phone: user.phone || '' })

    // Load rich profile
    profileApi.get()
      .then((res) => {
        setProfileForm({
          age: res.profile.age,
          dob: (res.profile as any).dob ?? '',
          state: res.profile.state ?? '',
          education: res.profile.education ?? '',
          income: res.profile.income,
          occupation: res.profile.occupation ?? '',
        })
      })
      .catch(() => setError('Could not load your profile.'))
      .finally(() => setIsLoading(false))
  }, [user])

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    setIsSaving(true)

    try {
      const payload: ProfilePayload = {
        ...(profileForm.age ? { age: profileForm.age } : {}),
        ...(profileForm.dob ? { dob: profileForm.dob } : {}),
        ...(profileForm.state ? { state: profileForm.state } : {}),
        ...(profileForm.education ? { education: profileForm.education } : {}),
        ...(profileForm.income !== undefined ? { income: profileForm.income } : {}),
        ...(profileForm.occupation ? { occupation: profileForm.occupation } : {}),
      }
      await profileApi.update(payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save profile.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    setIsSaving(true)

    try {
      const payload = {
        name: accountForm.name,
        email: accountForm.email,
        phone: accountForm.phone
      }
      const updatedUser = await profileApi.updateAccount(payload)
      // Update the AuthContext token/user? The token remains valid. We can just update user state directly if `login` allows it without token.
      // Assuming `login(updatedUser, currentToken)`
      login(updatedUser, localStorage.getItem('token') || '')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save account details.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('WARNING: Are you sure you want to delete your account? This action cannot be undone and deletes all linked applications and documents.')) return

    try {
      await profileApi.deleteAccount()
      localStorage.removeItem('token')
      window.location.href = '/'
    } catch (err) {
      alert('Failed to delete account')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-[#00428a]">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa] min-h-screen">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-[#00428a] hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/dashboard" className="text-[#00428a] hover:underline">Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">My Profile</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#00428a]">Profile & Account</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your citizen profile, contact details, and account settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => { setActiveTab('profile'); setError(null); setSaved(false); }} 
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'text-[#00428a] border-b-2 border-[#00428a] bg-blue-50/30' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <User className="w-4 h-4" /> Citizen Profile
          </button>
          <button 
            onClick={() => { setActiveTab('account'); setError(null); setSaved(false); }} 
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'account' ? 'text-[#00428a] border-b-2 border-[#00428a] bg-blue-50/30' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <Settings className="w-4 h-4" /> Account Settings
          </button>
        </div>

        <div className="p-6 md:p-8">
          {error && <div className="mb-6 bg-red-50 text-red-600 p-3 rounded text-sm font-bold border border-red-100">{error}</div>}
          {saved && <div className="mb-6 bg-green-50 text-green-700 p-3 rounded text-sm font-bold border border-green-200 flex items-center gap-2">Changes saved successfully</div>}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={profileForm.age ?? ''}
                    onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value ? Number(e.target.value) : undefined })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                    placeholder="e.g. 30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={profileForm.dob ?? ''}
                    onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                  <select
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Education Level</label>
                  <select
                    value={profileForm.education}
                    onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                  >
                    <option value="">Select Education</option>
                    {EDUCATION_LEVELS.map((ed) => (
                      <option key={ed} value={ed}>{ed}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Annual Income (₹)</label>
                  <input
                    type="number"
                    value={profileForm.income ?? ''}
                    onChange={(e) => setProfileForm({ ...profileForm, income: e.target.value ? Number(e.target.value) : undefined })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                    placeholder="e.g. 500000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={profileForm.occupation}
                    onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                    placeholder="e.g. Farmer, Student, IT Professional"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#00428a] text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {activeTab === 'account' && (
            <div className="space-y-8">
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={accountForm.name}
                        onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={10}
                        value={accountForm.phone}
                        onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value.replace(/\D/g, '') })}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-[#00428a] focus:border-[#00428a]"
                        placeholder="Optional, required for OTP Login"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#00428a] text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Account Settings
                  </button>
                </div>
              </form>

              <div className="bg-red-50 border border-red-100 rounded-xl p-6 mt-12">
                <h3 className="text-red-800 font-bold flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-sm text-red-600 mb-4">Deleting your account is permanent. All associated documents, scheme applications, and profile data will be erased under DPDP regulations.</p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold shadow hover:bg-red-700 transition"
                >
                  Permanently Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
