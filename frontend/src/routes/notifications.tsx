import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, CheckCircle2, Clock, FileText, Bell } from 'lucide-react'

export const Route = createFileRoute('/notifications')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const notifications = [
    { title: 'Application Status Updated', desc: 'Your application for Post-Matric Scholarship is under review.', time: '2 hours ago', unread: true, icon: <FileText className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'New Scheme Released', desc: 'Rajasthan Skill Development Scheme 2025 launched.', time: '1 day ago', unread: true, icon: <Bell className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' },
    { title: 'Document Verified', desc: 'Your documents have been verified successfully.', time: '3 days ago', unread: false, icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
    { title: 'Deadline Reminder', desc: 'Last 7 days to apply for PM-KISAN Samman Nidhi.', time: '1 week ago', unread: false, icon: <Clock className="w-5 h-5" />, color: 'bg-red-100 text-red-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Notifications</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00428a] mb-2">Notifications</h1>
          <p className="text-sm text-gray-600">Stay updated with important alerts</p>
        </div>
        <button className="bg-[#00428a] text-white px-5 py-2.5 rounded text-xs font-bold hover:bg-blue-800 transition shadow-sm">
          Mark All as Read
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 px-2 scrollbar-hide">
          <button className="px-5 py-4 text-sm font-bold text-[#00428a] border-b-2 border-[#00428a] whitespace-nowrap bg-blue-50/50">All</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Application (2)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Scheme Updates (0)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Deadlines (1)</button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {notifications.map((notif, i) => (
            <div key={i} className={`p-6 flex gap-5 transition hover:bg-gray-50 ${notif.unread ? 'bg-blue-50/20' : ''}`}>
              <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${notif.color}`}>
                {notif.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{notif.title}</h3>
                  <span className="text-xs font-medium text-gray-400">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-600">{notif.desc}</p>
              </div>
              {notif.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
