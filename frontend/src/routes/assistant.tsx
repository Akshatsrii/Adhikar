import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Search, Send, Bot, FileText, ChevronRight as RightArrow } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/assistant')({
  component: AssistantPage,
})

function AssistantPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
  const [input, setInput] = useState('')
  const { user } = useAuth()

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'This is a mock response from Adhikar AI. In a real integration, this would query the backend RAG pipeline to provide accurate government scheme information.' }])
    }, 1000)
  }

  const suggestedQuestions = [
    "Which schemes can I apply for?",
    "Documents required for PMAY?",
    "Scholarships for students in Rajasthan",
    "Healthcare schemes for senior citizens",
    "How to apply for PM-KISAN?"
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">AI Assistant</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side - Chat Interface */}
        <div className="flex-1 flex flex-col h-[700px]">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-[#00428a] mb-2">Ask Adhikar AI</h1>
            <p className="text-gray-600 text-sm max-w-xl">Get instant answers about government schemes, eligibility, documents and more.</p>
          </div>

          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 flex flex-col gap-6">
               {messages.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-200">
                      <Bot className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#00428a] mb-2 flex items-center gap-2">
                       <span>👋</span> Hello! I am Adhikar AI
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      I can help you find schemes, check eligibility, understand documents and guide you through the application process.
                    </p>
                 </div>
               ) : (
                 messages.map((msg, idx) => (
                   <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm ${msg.role === 'user' ? 'bg-[#00428a] text-white rounded-br-none shadow-md' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                       {msg.content}
                     </div>
                   </div>
                 ))
               )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
               <div className="relative flex items-center max-w-4xl mx-auto">
                 <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                 <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Ask a question about government schemes..." 
                   className="w-full pl-12 pr-14 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a] text-sm shadow-sm"
                 />
                 <button 
                   onClick={handleSend}
                   className="absolute right-2 w-10 h-10 rounded-full bg-[#00428a] text-white flex items-center justify-center hover:bg-blue-800 transition"
                 >
                   <Send className="w-4 h-4 -ml-0.5" />
                 </button>
               </div>
               <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                 <span className="text-[#00428a]">⚡</span> Powered by AI • Information from official government sources
               </p>
            </div>
          </div>
        </div>

        {/* Right Side - Suggested Questions */}
        <div className="w-full lg:w-80 shrink-0 mt-8 lg:mt-[5.5rem]">
           <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                Suggested Questions
             </h3>
             <div className="flex flex-col gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(q)}
                    className="flex items-center gap-3 text-left w-full p-3 rounded-lg border border-gray-100 hover:border-[#00428a]/30 hover:bg-blue-50/50 transition group"
                  >
                    <RightArrow className="w-4 h-4 text-[#00428a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-xs text-gray-700 font-medium group-hover:text-[#00428a]">{q}</span>
                  </button>
                ))}
             </div>
           </div>
        </div>

      </div>
    </div>
  )
}
