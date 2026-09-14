import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { simulatorApi, type SimulatorResult } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/simulator')({
  component: SimulatorPage,
})

function SimulatorPage() {
  const { user } = useAuth()
  const baseIncome = user?.profile?.income || 500000
  const baseAge = user?.profile?.age || 30

  const [hypoIncome, setHypoIncome] = useState(baseIncome)
  const [hypoAge, setHypoAge] = useState(baseAge)
  
  const [isSimulating, setIsSimulating] = useState(false)
  const [result, setResult] = useState<SimulatorResult | null>(null)

  useEffect(() => {
    // Basic debounce for simulator
    const timer = setTimeout(() => {
      runSimulation()
    }, 500)
    return () => clearTimeout(timer)
  }, [hypoIncome, hypoAge])

  async function runSimulation() {
    setIsSimulating(true)
    try {
      const data = await simulatorApi.simulate({
        hypotheticalIncome: hypoIncome,
        hypotheticalAge: hypoAge
      })
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSimulating(false)
    }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-[var(--color-ink)]">Eligibility Simulator</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        See how changes in your life affect your eligibility for government schemes. Move the sliders to test "What If" scenarios!
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-[var(--color-line)] p-6 bg-white shadow-sm">
          <h2 className="font-bold text-[var(--color-ink)] border-b pb-2">Hypothetical Profile</h2>
          
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-medium text-[var(--color-ink-soft)]">Annual Income</label>
              <span className="font-bold text-[var(--color-ink)]">{formatCurrency(hypoIncome)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2000000" 
              step="10000"
              value={hypoIncome}
              onChange={(e) => setHypoIncome(parseInt(e.target.value))}
              className="w-full accent-[var(--color-saffron)]"
            />
            <p className="text-xs text-gray-400 mt-1">Base: {formatCurrency(baseIncome)}</p>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-medium text-[var(--color-ink-soft)]">Age</label>
              <span className="font-bold text-[var(--color-ink)]">{hypoAge} years</span>
            </div>
            <input 
              type="range" 
              min="18" 
              max="80" 
              step="1"
              value={hypoAge}
              onChange={(e) => setHypoAge(parseInt(e.target.value))}
              className="w-full accent-[var(--color-saffron)]"
            />
            <p className="text-xs text-gray-400 mt-1">Base: {baseAge} years</p>
          </div>
          
          {isSimulating && <p className="text-xs text-gray-400 italic">Calculating impact...</p>}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-bold text-green-800">✅ Newly Unlocked Schemes</h3>
            <p className="text-sm text-green-700 mb-3 mt-1">
              {result ? `You would unlock ${result.unlocked_schemes.length} new schemes:` : 'Waiting for changes...'}
            </p>
            {result && result.unlocked_schemes.length > 0 && (
              <ul className="space-y-2">
                {result.unlocked_schemes.map(s => (
                  <li key={s.slug} className="text-sm font-medium text-green-900 bg-green-100/50 p-2 rounded">
                    + {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="font-bold text-red-800">❌ Lost Schemes</h3>
            <p className="text-sm text-red-700 mb-3 mt-1">
              {result ? `You would lose eligibility for ${result.lost_schemes.length} schemes:` : 'Waiting for changes...'}
            </p>
            {result && result.lost_schemes.length > 0 && (
              <ul className="space-y-2">
                {result.lost_schemes.map(s => (
                  <li key={s.slug} className="text-sm font-medium text-red-900 bg-red-100/50 p-2 rounded">
                    - {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
