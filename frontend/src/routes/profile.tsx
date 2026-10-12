import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ApiError, profileApi, type ProfilePayload } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { statesAndDistricts } from '@/lib/statesDistricts'
import { ChevronRight, Loader2, User, Settings, ShieldAlert, CheckCircle2, Save, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

const INDIAN_STATES = Object.keys(statesAndDistricts)
const EDUCATION_LEVELS = [
  'Primary School',
  'Class 10 (Secondary)',
  'Class 12 (Higher Secondary)',
  'Diploma / ITI',
  'Graduate (B.A / B.Sc / B.Com / B.Tech)',
  'Post Graduate (M.A / M.Sc / M.Tech)',
  'Doctorate / PhD',
]

function emptyProfile(): ProfilePayload {
  return { age: undefined, dob: '', state: '', education: '', income: undefined, occupation: '' }
}

function ProfilePage() {
  const { user, login } = useAuth()

  // Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile')

  // Profile Form
  const [profileForm, setProfileForm] = useState<ProfilePayload>(emptyProfile())

  // Account Form
  const [accountForm, setAccountForm] = useState({ name: '', email: '' })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return

    setAccountForm({
      name: user.name || '',
      email: user.email || '',
    })

    profileApi
      .get()
      .then((res) => {
        if (res.profile) {
          setProfileForm({
            age: res.profile.age,
            dob: (res.profile as any).dob || '',
            state: res.profile.state || '',
            education: res.profile.education || '',
            income: res.profile.income,
            occupation: res.profile.occupation || '',
          })
        }
      })
      .catch((err) => {
        console.error('Failed to load profile:', err)
      })
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
      }
      const updatedUser = await profileApi.updateAccount(payload)
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
    if (
      !confirm(
        'WARNING: Are you sure you want to delete your account? This action cannot be undone and permanently deletes your linked applications and document locker.',
      )
    )
      return

    try {
      await profileApi.deleteAccount()
      localStorage.removeItem('token')
      window.location.href = '/'
    } catch {
      alert('Failed to delete account')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24 text-blue-600">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          Dashboard
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Citizen Profile</span>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/50 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Household Welfare Profile
          </span>
          <span className="text-[11px] font-semibold text-slate-400">Deterministic Match Key</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Profile & Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          These attributes are matched in real time against 25+ central and state scheme eligibility rule matrices.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/80 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5 gap-1.5">
          <button
            onClick={() => {
              setActiveTab('profile')
              setError(null)
              setSaved(false)
            }}
            className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              activeTab === 'profile' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Citizen Attributes
          </button>
          <button
            onClick={() => {
              setActiveTab('account')
              setError(null)
              setSaved(false)
            }}
            className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              activeTab === 'account' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" /> Security & Account
          </button>
        </div>

        <div className="p-7 md:p-10">
          {error && (
            <div className="mb-6 bg-rose-50 text-rose-700 p-3.5 rounded-2xl text-xs font-semibold border border-rose-200">
              {error}
            </div>
          )}
          {saved && (
            <div className="mb-6 bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl text-xs font-semibold border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Attributes saved successfully! Matching schemes have been updated.</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                  <input
                    type="number"
                    value={profileForm.age ?? ''}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, age: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                    placeholder="e.g. 28"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={profileForm.dob ?? ''}
                    onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Domicile State</label>
                  <select
                    value={profileForm.state ?? ''}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Highest Education</label>
                  <select
                    value={profileForm.education ?? ''}
                    onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  >
                    <option value="">Select Education Level</option>
                    {EDUCATION_LEVELS.map((ed) => (
                      <option key={ed} value={ed}>
                        {ed}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Occupation</label>
                  <input
                    type="text"
                    value={profileForm.occupation ?? ''}
                    onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                    placeholder="e.g. Farmer, Student, Artisan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Annual Household Income (₹)</label>
                  <input
                    type="number"
                    value={profileForm.income ?? ''}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, income: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                    placeholder="e.g. 150000"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-xs hover:from-blue-700 hover:to-indigo-700 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Attributes</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'account' && (
            <div className="space-y-8">
              <form onSubmit={handleAccountSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={accountForm.name}
                    onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-xs hover:from-blue-700 hover:to-indigo-700 transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Update Account</span>
                  </button>
                </div>
              </form>

              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Danger Zone</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Deleting your account permanently destroys your profile, application history, and document locker.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition shadow-xs"
                >
                  Delete Account Permanently
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
