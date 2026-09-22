import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, GraduationCap, Briefcase, Heart, Baby, Home, Tractor, Users, Accessibility } from 'lucide-react'

export const Route = createFileRoute('/life-events')({
  component: LifeEventsPage,
})

function LifeEventsPage() {
  const events = [
    { icon: <GraduationCap className="w-8 h-8" />, title: 'Student', desc: 'Education, Scholarships' },
    { icon: <Briefcase className="w-8 h-8" />, title: 'New Job', desc: 'Employment, Skill Development' },
    { icon: <Heart className="w-8 h-8" />, title: 'Marriage', desc: 'Financial Assistance' },
    { icon: <Baby className="w-8 h-8" />, title: 'Newborn/Child', desc: 'Maternity Benefits' },
    { icon: <Home className="w-8 h-8" />, title: 'Home Construction', desc: 'Housing Schemes' },
    { icon: <Tractor className="w-8 h-8" />, title: 'Farmer', desc: 'Agriculture Support' },
    { icon: <Users className="w-8 h-8" />, title: 'Senior Citizen', desc: 'Pension, Healthcare' },
    { icon: <Accessibility className="w-8 h-8" />, title: 'Divyangjan', desc: 'Disability Support' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Life Events</span>
      </div>

      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-[#00428a] mb-2">Select Your Life Event</h1>
        <p className="text-sm text-gray-600">Get relevant schemes based on your current situation</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {events.map((ev, i) => (
          <Link key={i} to="/schemes" className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center text-center hover:shadow-md hover:border-blue-200 transition group">
            <div className="text-blue-500 mb-4 group-hover:scale-110 transition duration-300">
              {ev.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{ev.title}</h3>
            <p className="text-xs text-gray-500">{ev.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
