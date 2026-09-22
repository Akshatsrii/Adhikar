import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Phone, Mail, MapPin, ChevronDown } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const faqs = [
    "How can I check my eligibility?",
    "What documents are required?",
    "How to apply for a scheme?",
    "Is there any application fee?",
    "How do I track my application?",
    "Can I apply for multiple schemes?",
    "Whom to contact for support?"
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Help & Support</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#00428a] mb-2">Help & Support</h1>
        <p className="text-sm text-gray-600">Get assistance for government schemes and services.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-8 scrollbar-hide">
        <button className="px-6 py-3 text-sm font-bold text-[#00428a] border-b-2 border-[#00428a] whitespace-nowrap bg-blue-50/50">Frequently Asked Questions</button>
        <button className="px-6 py-3 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">User Guides</button>
        <button className="px-6 py-3 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Grievance Redressal</button>
        <button className="px-6 py-3 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Contact Us</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side - FAQ Accordion */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <button key={i} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition group">
                <span className="text-sm font-medium text-gray-800 group-hover:text-[#00428a]">{faq}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#00428a]" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Contact Us Card */}
        <div className="w-full lg:w-[350px] shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">Need more help? Reach out to us through the following channels.</p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 mb-1">Toll Free Number</h4>
                  <p className="text-sm font-bold text-gray-900">1800-123-4567</p>
                  <p className="text-[10px] text-gray-400">(Mon - Sat, 9:00 AM to 6:00 PM)</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 mb-1">Email Support</h4>
                  <a href="mailto:support@adhikar.gov.in" className="text-sm font-bold text-[#00428a] hover:underline">support@adhikar.gov.in</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 mb-1">Address</h4>
                  <p className="text-xs text-gray-800 leading-relaxed font-medium">Ministry of Electronics & Information Technology,<br/>Government of India, New Delhi - 110001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
