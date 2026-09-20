import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, profileApi, type ProfilePayload } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

const INDIAN_STATES = [
  'Rajasthan',
  'Delhi',
  'Maharashtra',
  'Uttar Pradesh',
  'Gujarat',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Bihar',
  'West Bengal',
]

const EDUCATION_LEVELS = [
  'Class 10',
  'Class 12',
  'Diploma',
  'B.Tech',
  'B.A / B.Sc / B.Com',
  'M.Tech',
  'M.A / M.Sc / M.Com',
  'PhD',
]

function emptyForm(): ProfilePayload {
  return { age: undefined, dob: '', state: '', education: '', income: undefined, occupation: '' }
}

function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState<ProfilePayload>(emptyForm())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isAuthLoading, user, navigate])

  useEffect(() => {
    if (!user) return

    profileApi
      .get()
      .then((res) =>
        setForm({
          age: res.profile.age,
          dob: (res.profile as any).dob ?? '',
          state: res.profile.state ?? '',
          education: res.profile.education ?? '',
          income: res.profile.income,
          occupation: res.profile.occupation ?? '',
        }),
      )
      .catch(() => setError('Could not load your profile.'))
      .finally(() => setIsLoading(false))
  }, [user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    setIsSaving(true)

    try {
      const payload: ProfilePayload = {
        ...(form.age ? { age: form.age } : {}),
        ...(form.dob ? { dob: form.dob } : {}),
        ...(form.state ? { state: form.state } : {}),
        ...(form.education ? { education: form.education } : {}),
        ...(form.income !== undefined ? { income: form.income } : {}),
        ...(form.occupation ? { occupation: form.occupation } : {}),
      }
      await profileApi.update(payload)
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your profile.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isAuthLoading || isLoading) {
    return <p className="text-sm text-[var(--color-ink-soft)]">Loading your profile…</p>
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-3xl text-[var(--color-ink)]">Your profile</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        This is what Adhikar uses to match you against scheme eligibility rules. Nothing
        here is shared outside your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="dob" className="mb-1.5 block text-sm text-[var(--color-ink-soft)]">
              Date of Birth (Official)
            </label>
            <input
              id="dob"
              type="date"
              value={form.dob ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="age" className="mb-1.5 block text-sm text-[var(--color-ink-soft)]">
              Age
            </label>
            <input
              id="age"
              type="number"
              min={0}
              max={120}
              value={form.age ?? ''}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  age: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="field"
              placeholder="21"
            />
          </div>

          <div>
            <label
              htmlFor="income"
              className="mb-1.5 block text-sm text-[var(--color-ink-soft)]"
            >
              Annual family income (₹)
            </label>
            <input
              id="income"
              type="number"
              min={0}
              value={form.income ?? ''}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  income: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="field"
              placeholder="250000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="state" className="mb-1.5 block text-sm text-[var(--color-ink-soft)]">
            State
          </label>
          <select
            id="state"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            className="field"
          >
            <option value="">Select your state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="education"
            className="mb-1.5 block text-sm text-[var(--color-ink-soft)]"
          >
            Highest education level
          </label>
          <select
            id="education"
            value={form.education}
            onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))}
            className="field"
          >
            <option value="">Select education level</option>
            {EDUCATION_LEVELS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="occupation"
            className="mb-1.5 block text-sm text-[var(--color-ink-soft)]"
          >
            Occupation
          </label>
          <input
            id="occupation"
            type="text"
            value={form.occupation}
            onChange={(e) => setForm((f) => ({ ...f, occupation: e.target.value }))}
            className="field"
            placeholder="Student, Farmer, Salaried, Self-employed…"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {saved && (
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-[var(--color-govgreen)]">
            Profile saved.
          </p>
        )}

        <button type="submit" disabled={isSaving} className="btn-primary w-full">
          {isSaving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
      
      <div className="mt-12 border-t border-[var(--color-ink-soft)] pt-8">
        <h2 className="text-xl text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-[var(--color-ink-soft)] mb-4">
          Permanently delete your account and all associated data in accordance with the DPDP Act.
        </p>
        <button 
          type="button" 
          className="rounded border border-red-200 text-red-600 px-4 py-2 hover:bg-red-50 text-sm font-medium"
          onClick={async () => {
            if (confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) {
              try {
                await profileApi.delete()
                window.location.href = '/'
              } catch (err) {
                alert('Failed to delete account')
              }
            }
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
