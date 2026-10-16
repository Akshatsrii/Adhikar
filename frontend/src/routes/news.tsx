import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Newspaper, ExternalLink, BookmarkPlus, BookmarkCheck, TrendingUp, Clock, Tag, Globe, ChevronRight, Rss, Filter } from 'lucide-react'

export const Route = createFileRoute('/news')({
  component: WelfareNewsFeed,
})

type Sentiment = 'positive' | 'neutral' | 'urgent'

interface NewsItem {
  id: number
  title: string
  summary: string
  category: string
  source: string
  date: string
  sentiment: Sentiment
  url: string
  isBreaking?: boolean
}

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: 'PM-KISAN 17th Installment Released — ₹2,000 Directly to 9.4 Crore Farmers',
    summary: 'Prime Minister transfers latest tranche of PM-KISAN Samman Nidhi directly to farmer bank accounts via DBT. Check if your name appears on the beneficiary list via official portal.',
    category: 'Agriculture',
    source: 'Ministry of Agriculture',
    date: 'Oct 16, 2025',
    sentiment: 'positive',
    url: 'https://pmkisan.gov.in',
    isBreaking: true,
  },
  {
    id: 2,
    title: 'Ayushman Bharat Expands — All Citizens Above 70 Now Eligible for ₹5L Health Cover',
    summary: 'The Union Cabinet approved extension of Ayushman Bharat PMJAY to cover all senior citizens above 70 years irrespective of income. Enrollment begins via Aadhaar-linked Jan Arogya portal.',
    category: 'Healthcare',
    source: 'NHA - National Health Authority',
    date: 'Oct 15, 2025',
    sentiment: 'positive',
    url: 'https://pmjay.gov.in',
  },
  {
    id: 3,
    title: 'MGNREGA Wage Revised Upwards in 22 States — Effective Immediately',
    summary: 'Ministry of Rural Development announces revised MGNREGA daily wages for FY 2025–26. Rajasthan sees highest revision at ₹266/day (+12%). Workers must update Aadhaar-seeded bank accounts.',
    category: 'Employment',
    source: 'Ministry of Rural Development',
    date: 'Oct 14, 2025',
    sentiment: 'positive',
    url: 'https://nrega.nic.in',
  },
  {
    id: 4,
    title: 'PMAY-U 2.0 Applications Open — 1 Crore Urban Houses Under New Phase',
    summary: 'Centre launches PMAY Urban 2.0 targeting economically weaker sections and middle-income groups. States have been allocated fresh housing targets. Applications accepted on awaassoft.nic.in.',
    category: 'Housing',
    source: 'MoHUA',
    date: 'Oct 13, 2025',
    sentiment: 'positive',
    url: 'https://pmaymis.gov.in',
    isBreaking: false,
  },
  {
    id: 5,
    title: 'Scholarship Portal NSP Deadline Extended to Nov 30 — Apply Now',
    summary: 'Ministry of Education extends the National Scholarship Portal deadline for Pre-Matric and Post-Matric scholarships. Over 1.8 Cr applications received; incomplete submissions to be rejected.',
    category: 'Education',
    source: 'NSP - National Scholarship Portal',
    date: 'Oct 12, 2025',
    sentiment: 'urgent',
    url: 'https://scholarships.gov.in',
  },
  {
    id: 6,
    title: 'E-Shram Portal: 30 Crore Unorganised Workers Now Registered',
    summary: 'Ministry of Labour announces milestone: 30 crore workers registered on e-Shram portal. Registered workers get ₹2L accidental insurance free and priority access to welfare schemes.',
    category: 'Employment',
    source: 'Ministry of Labour',
    date: 'Oct 11, 2025',
    sentiment: 'positive',
    url: 'https://eshram.gov.in',
  },
  {
    id: 7,
    title: 'Sukanya Samriddhi Yojana Interest Rate Maintained at 8.2% for Q3 2025',
    summary: 'Ministry of Finance keeps SSY interest rate at 8.2% for Oct–Dec quarter. Parents of girl children under 10 years can open new accounts at any post office or authorized bank branch.',
    category: 'Women & Child',
    source: 'Ministry of Finance',
    date: 'Oct 10, 2025',
    sentiment: 'neutral',
    url: 'https://nsiindia.gov.in',
  },
  {
    id: 8,
    title: 'Digital Ration Card Linking: 81% of Beneficiaries Now Aadhaar-Seeded Under NFSA',
    summary: 'Department of Food & Public Distribution reports 81% Aadhaar seeding under NFSA for portability of ration benefits across states. Remaining beneficiaries urged to link urgently to avoid disruption.',
    category: 'Food Security',
    source: 'DFPD',
    date: 'Oct 9, 2025',
    sentiment: 'neutral',
    url: 'https://dfpd.gov.in',
  },
]

const sentimentConfig: Record<Sentiment, { label: string; className: string; dot: string }> = {
  positive: { label: 'Positive', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  neutral: { label: 'Update', className: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  urgent: { label: 'Urgent', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
}

const categoryColors: Record<string, string> = {
  Agriculture: 'bg-emerald-100 text-emerald-800',
  Healthcare: 'bg-rose-100 text-rose-800',
  Employment: 'bg-blue-100 text-blue-800',
  Housing: 'bg-amber-100 text-amber-800',
  Education: 'bg-indigo-100 text-indigo-800',
  'Women & Child': 'bg-pink-100 text-pink-800',
  'Food Security': 'bg-orange-100 text-orange-800',
}

export default function WelfareNewsFeed() {
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set())
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [activeSentiment, setActiveSentiment] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(mockNews.map(n => n.category)))]
  const sentiments = ['All', 'positive', 'neutral', 'urgent']

  const filtered = mockNews.filter(n => {
    const catMatch = activeFilter === 'All' || n.category === activeFilter
    const sentMatch = activeSentiment === 'All' || n.sentiment === activeSentiment
    return catMatch && sentMatch
  })

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const breakingNews = mockNews.find(n => n.isBreaking)

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
            <Rss className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400">LIVE FEED</span>
            <span>·</span>
            <span>Updated daily from official government portals</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            Welfare Scheme News
          </h1>
          <p className="text-slate-400 text-base max-w-2xl">
            Latest updates, policy announcements, and deadline alerts for government welfare schemes — curated and tagged for you.
          </p>
        </div>
      </section>

      {/* Breaking News Banner */}
      {breakingNews && (
        <div className="bg-gradient-to-r from-rose-600 to-rose-500 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm font-semibold">
            <span className="bg-white text-rose-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0">BREAKING</span>
            <span className="truncate">{breakingNews.title}</span>
            <a href={breakingNews.url} target="_blank" rel="noreferrer" className="ml-auto flex-shrink-0 flex items-center gap-1 text-white/80 hover:text-white">
              Read <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                  activeFilter === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:ml-auto">
            {sentiments.map(s => {
              const cfg = s === 'All' ? null : sentimentConfig[s as Sentiment]
              return (
                <button
                  key={s}
                  onClick={() => setActiveSentiment(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                    activeSentiment === s
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                  {s === 'All' ? 'All Sentiments' : cfg?.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" />
            <span>{filtered.length} articles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>{mockNews.filter(n => n.sentiment === 'positive').length} positive updates this week</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>{bookmarked.size} bookmarked</span>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((article) => {
            const sentCfg = sentimentConfig[article.sentiment]
            const catColor = categoryColors[article.category] || 'bg-slate-100 text-slate-700'
            const isBookmarked = bookmarked.has(article.id)
            return (
              <article key={article.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${catColor}`}>
                        <Tag className="w-3 h-3 inline mr-1" />
                        {article.category}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${sentCfg.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sentCfg.dot}`} />
                        {sentCfg.label}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleBookmark(article.id)}
                      className={`p-1.5 rounded-lg transition ${isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{article.summary}</p>
                </div>

                <div className="px-5 pb-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{article.source}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                  >
                    Official Source <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-semibold">No articles match your filters</p>
          </div>
        )}

      </div>
    </div>
  )
}
