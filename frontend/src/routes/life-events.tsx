import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ChevronRight, GraduationCap, Briefcase, Heart, Baby, Home, Tractor,
  Users, Accessibility, Sparkles, Send, Loader2, ArrowRight, CheckCircle2
} from 'lucide-react'
import { useState } from 'react'
import { lifeEventsApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/life-events')({
  component: LifeEventsPage,
})

const PRESET_EVENTS = [
  { icon: <GraduationCap className="w-7 h-7" />, title: 'Higher Education / Student', desc: 'College admissions, scholarships, exam coaching', category: 'Education' },
  { icon: <Briefcase className="w-7 h-7" />, title: 'Employment & Skilling', desc: 'Job search, MSME loans, artisan stipends', category: 'Employment' },
  { icon: <Heart className="w-7 h-7" />, title: 'Marriage & Family', desc: 'Kanyadan assistance, maternal nutrition grants', category: 'Women' },
  { icon: <Baby className="w-7 h-7" />, title: 'Newborn Child', desc: 'Institutional delivery incentives, child care', category: 'Healthcare' },
  { icon: <Home className="w-7 h-7" />, title: 'Housing Construction', desc: 'PMAY subsidies, rural pucca house grants', category: 'Housing' },
  { icon: <Tractor className="w-7 h-7" />, title: 'Agriculture & Farming', desc: 'PM-KISAN, crop insurance, solar pumps', category: 'Agriculture' },
  { icon: <Users className="w-7 h-7" />, title: 'Senior Citizen', desc: 'Guaranteed old-age pensions, healthcare cover', category: 'Social Welfare' },
  { icon: <Accessibility className="w-7 h-7" />, title: 'Divyangjan / Disability', desc: 'UDID welfare, motorized aids, monthly pension', category: 'Disability' },
]

function LifeEventsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [classifiedResult, setClassifiedResult] = useState<{
    eventType: string
    suggestedCategories: string[]
  } | null>(null)
  const [error, setError] = useState('')

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || isLoading) return
    setIsLoading(true)
    setError('')
    try {
      if (!user) {
        // Guest mode demo classification
        const lower = inputText.toLowerCase()
        let cat = 'Social Welfare'
        let eventType = 'GENERAL_EVENT'
        if (lower.includes('farm') || lower.includes('kisan') || lower.includes('crop')) {
          cat = 'Agriculture'; eventType = 'FARMING'
        } else if (lower.includes('job') || lower.includes('unemployed') || lower.includes('work')) {
          cat = 'Employment'; eventType = 'CAREER_TRANSITION'
        } else if (lower.includes('marry') || lower.includes('marriage') || lower.includes('bride')) {
          cat = 'Women'; eventType = 'MARRIAGE'
        } else if (lower.includes('school') || lower.includes('college') || lower.includes('student') || lower.includes('study')) {
          cat = 'Education'; eventType = 'EDUCATION'
        } else if (lower.includes('baby') || lower.includes('child') || lower.includes('pregnant')) {
          cat = 'Healthcare'; eventType = 'CHILDBIRTH'
        } else if (lower.includes('house') || lower.includes('home') || lower.includes('awas')) {
          cat = 'Housing'; eventType = 'HOME_CONSTRUCTION'
        }
        setClassifiedResult({ eventType, suggestedCategories: [cat] })
      } else {
        const res = await lifeEventsApi.submit(inputText.trim())
        setClassifiedResult({
          eventType: res.eventType,
          suggestedCategories: res.suggestedCategories || ['Social Welfare'],
        })
      }
    } catch {
      setError('Unable to analyze life event right now. Please select one of the categories below.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white pt-14 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link to="/" className="text-blue-400 hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Life Events</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-300 mb-4 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Contextual Welfare Intelligence</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Welfare for Every Life Milestone
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
              Government benefits change as your life evolves. Describe your current situation or choose a milestone to find verified schemes tailored to your immediate needs.
            </p>

            {/* AI Life Event Input Form */}
            <form onSubmit={handleClassify} className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-xl max-w-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="e.g. 'I just had a baby girl', 'I lost my job', 'Starting college'..."
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shrink-0 shadow-md"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Find Benefits</span>
                </button>
              </div>
            </form>

            {error && <p className="text-xs text-rose-300 mt-2">{error}</p>}

            {/* Classified AI Result Banner */}
            {classifiedResult && (
              <div className="mt-6 p-5 bg-white text-slate-900 rounded-2xl shadow-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Milestone Detected: {classifiedResult.eventType}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    We matched this event to: <strong className="text-slate-900">{classifiedResult.suggestedCategories.join(', ')}</strong> welfare schemes.
                  </p>
                </div>
                <div className="flex gap-2">
                  {classifiedResult.suggestedCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => navigate({ to: '/schemes', search: { category: cat } as any })}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Explore {cat} Schemes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Preset Milestones Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Browse by Milestone</h2>
              <p className="text-xs text-slate-500">Select a life circumstance to view relevant government entitlements</p>
            </div>
            <Link to="/schemes" className="text-xs font-bold text-blue-600 hover:underline">
              View All Schemes →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRESET_EVENTS.map((ev, i) => (
              <Link
                key={i}
                to="/schemes"
                search={{ category: ev.category } as any}
                className="rounded-2xl border border-slate-100 p-6 flex flex-col items-start bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-indigo-600 mb-4 group-hover:scale-110 transition duration-300 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
                  {ev.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-indigo-600 transition">{ev.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{ev.desc}</p>
                <span className="mt-4 text-[11px] font-bold text-indigo-600 inline-flex items-center gap-1">
                  View schemes <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
