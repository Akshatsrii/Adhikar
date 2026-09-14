import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { familyApi, type FamilyMember, type FamilyOptimizeResult, ApiError } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/family')({
  component: FamilyPage,
})

function FamilyPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [members, setMembers] = useState<FamilyMember[]>([])
  const [optimization, setOptimization] = useState<FamilyOptimizeResult | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [relation, setRelation] = useState<'spouse' | 'child' | 'parent' | 'sibling' | 'other'>('child')
  const [age, setAge] = useState('')
  const [income, setIncome] = useState('')

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isAuthLoading, user, navigate])

  useEffect(() => {
    if (!user) return
    loadMembers()
  }, [user])

  async function loadMembers() {
    try {
      const data = await familyApi.list()
      setMembers(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load family members')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setError(null)
    try {
      await familyApi.add({
        name,
        relation,
        profile: {
          age: age ? parseInt(age, 10) : undefined,
          income: income ? parseInt(income, 10) : undefined,
        },
      })
      setName('')
      setAge('')
      setIncome('')
      await loadMembers()
      setOptimization(null) // reset optimization on change
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add family member')
    }
  }

  async function handleRemove(id: string) {
    if (!confirm('Remove this family member?')) return
    setError(null)
    try {
      await familyApi.remove(id)
      await loadMembers()
      setOptimization(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to remove member')
    }
  }

  async function handleOptimize() {
    setIsOptimizing(true)
    setError(null)
    try {
      const result = await familyApi.optimize()
      setOptimization(result)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Optimization failed')
    } finally {
      setIsOptimizing(false)
    }
  }

  if (isAuthLoading || isLoading) {
    return <p className="text-sm text-[var(--color-ink-soft)]">Loading...</p>
  }

  return (
    <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">Family Members</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Add your family members to see if you can claim schemes together.
        </p>

        {error && <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleAdd} className="mt-6 rounded-lg border border-[var(--color-line)] p-4">
          <h2 className="text-sm font-medium text-[var(--color-ink)] mb-4">Add new member</h2>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-[var(--color-ink-soft)]">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-[var(--color-line)] p-2 text-sm"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm text-[var(--color-ink-soft)]">Relation</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value as any)}
                className="w-full rounded border border-[var(--color-line)] p-2 text-sm"
              >
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-[var(--color-ink-soft)]">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded border border-[var(--color-line)] p-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--color-ink-soft)]">Income (₹)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full rounded border border-[var(--color-line)] p-2 text-sm"
                />
              </div>
            </div>

            <button type="submit" className="w-full rounded bg-[var(--color-ink)] py-2 text-sm font-medium text-white hover:bg-gray-800">
              Add Member
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-3">
          {members.map((m) => (
            <div key={m._id} className="flex items-center justify-between rounded-lg border border-[var(--color-line)] p-3">
              <div>
                <p className="font-medium text-[var(--color-ink)]">{m.name} <span className="text-xs text-[var(--color-ink-soft)]">({m.relation})</span></p>
                <p className="text-xs text-[var(--color-ink-soft)]">
                  Age: {m.profile.age || 'N/A'}, Income: {m.profile.income || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => handleRemove(m._id)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--color-ink)]">Family Optimizer</h2>
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="btn-primary"
          >
            {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </button>
        </div>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Check for overlapping benefits or rules that restrict applications to one-per-family.
        </p>

        {optimization && (
          <div className="mt-6 space-y-6">
            {optimization.conflicts.length > 0 ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="font-medium text-red-800">Conflicts Detected</h3>
                <ul className="mt-3 space-y-3">
                  {optimization.conflicts.map((c, i) => (
                    <li key={i} className="text-sm">
                      <span className="text-red-700">⚠️ {c.message}</span>
                      {c.recommended_resolution && (
                        <p className="mt-1 font-medium text-green-700 bg-green-50 p-1.5 rounded">{c.recommended_resolution}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">✅ No family conflicts detected!</p>
              </div>
            )}

            <div>
              <h3 className="font-medium text-[var(--color-ink)]">Eligible Schemes per Member</h3>
              <div className="mt-3 space-y-4">
                {optimization.members.map((m) => (
                  <div key={m.member_id} className="card">
                    <p className="font-medium text-[var(--color-ink)]">{m.member_name}</p>
                    {m.eligible_schemes.length === 0 ? (
                      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">No eligible schemes.</p>
                    ) : (
                      <ul className="mt-2 list-inside list-disc text-sm text-[var(--color-ink-soft)]">
                        {m.eligible_schemes.map((s) => (
                          <li key={s.slug}>{s.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
