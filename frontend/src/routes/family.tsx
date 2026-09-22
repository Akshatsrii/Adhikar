import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Plus, User, Edit } from 'lucide-react'

export const Route = createFileRoute('/family')({
  component: FamilyPage,
})

function FamilyPage() {
  const family = [
    { name: 'Akshat Srivastava', rel: 'Self', age: 22, gender: 'Male', avatar: 'https://i.pravatar.cc/150?u=akshat' },
    { name: 'Priya Srivastava', rel: 'Mother', age: 45, gender: 'Female', avatar: 'https://i.pravatar.cc/150?u=priya' },
    { name: 'Rajesh Srivastava', rel: 'Father', age: 48, gender: 'Male', avatar: 'https://i.pravatar.cc/150?u=rajesh' },
    { name: 'Saloni Srivastava', rel: 'Sister', age: 18, gender: 'Female', avatar: 'https://i.pravatar.cc/150?u=saloni' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Family Management</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00428a] mb-2">Manage Family Members</h1>
          <p className="text-sm text-gray-600">Add family members to find schemes for your entire family</p>
        </div>
        <button className="bg-[#00428a] text-white px-5 py-2.5 rounded text-sm font-bold flex items-center gap-2 hover:bg-blue-800 transition shadow-sm shrink-0">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-4xl">
        <div className="divide-y divide-gray-100">
          {family.map((member, idx) => (
            <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                   <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-xs font-medium text-gray-500">
                    {member.rel} <span className="text-gray-300 mx-1">|</span> {member.age} years <span className="text-gray-300 mx-1">|</span> {member.gender}
                  </p>
                </div>
              </div>
              
              <button className="flex items-center gap-1.5 text-[#00428a] text-xs font-bold hover:bg-blue-50 px-3 py-2 rounded transition">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
