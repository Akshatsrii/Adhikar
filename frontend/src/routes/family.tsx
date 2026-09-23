import { createFileRoute, Navigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Plus, User, Trash2, Loader2, Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { familyApi, FamilyMember, FamilyMemberInput } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/family')({
  component: FamilyPage,
})

function FamilyPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<FamilyMemberInput>({
    name: '',
    relation: 'other',
    profile: { age: 0, occupation: '' }
  })

  useEffect(() => {
    if (user) loadMembers()
  }, [user])

  const loadMembers = async () => {
    try {
      setIsLoading(true)
      const data = await familyApi.list()
      setMembers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await familyApi.add(formData)
      await loadMembers()
      setShowAddForm(false)
      setFormData({ name: '', relation: 'other', profile: { age: 0, occupation: '' } })
    } catch (err) {
      alert('Error adding family member')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this family member?')) return
    try {
      await familyApi.remove(id)
      await loadMembers()
    } catch (err) {
      alert('Error removing member')
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa] min-h-screen">
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
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="bg-[#00428a] text-white px-5 py-2.5 rounded font-bold hover:bg-blue-800 transition shadow-sm flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-[#00428a]">Add New Member</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#00428a] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Relation</label>
                <select value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value as any})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#00428a] focus:outline-none">
                  <option value="spouse">Spouse</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Age</label>
                <input required type="number" value={formData.profile.age || ''} onChange={e => setFormData({...formData, profile: {...formData.profile, age: Number(e.target.value)}})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#00428a] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Occupation</label>
                <input type="text" value={formData.profile.occupation || ''} onChange={e => setFormData({...formData, profile: {...formData.profile, occupation: e.target.value}})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#00428a] focus:outline-none" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button disabled={isSubmitting} type="submit" className="bg-[#00428a] text-white px-5 py-2 rounded font-bold hover:bg-blue-800 transition flex items-center gap-2 text-sm disabled:opacity-70">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00428a]" />
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm flex flex-col items-center">
          <User className="w-12 h-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Family Members Found</h3>
          <p className="text-gray-500 text-sm max-w-md">Add your family members to get personalized scheme recommendations for them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m, i) => (
            <div key={m._id || i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition relative group">
              <button onClick={() => handleDelete(m._id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-[#00428a] font-bold text-xl shrink-0 overflow-hidden border border-blue-200">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{m.name}</h3>
                  <div className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase tracking-wide">
                    {m.relation}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-4 border-t border-gray-100 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="font-bold text-gray-800">{m.profile?.age || '-'} yrs</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Occupation</p>
                  <p className="font-bold text-gray-800 truncate" title={m.profile?.occupation}>{m.profile?.occupation || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
