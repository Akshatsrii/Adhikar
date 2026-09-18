import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { adminApi, type AuthUser } from '@/lib/api'

type Scheme = any;
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState<'schemes' | 'users' | 'bulk'>('schemes')

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate({ to: '/dashboard' })
    }
  }, [user, navigate])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-ink)]">Admin Dashboard</h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          Manage schemes, upload bulk data, and control user roles.
        </p>
      </div>

      <div className="flex gap-4 border-b border-[var(--color-line)] pb-2">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
            activeTab === 'schemes' ? 'bg-white border border-b-0 border-[var(--color-line)] text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] hover:bg-white/50'
          }`}
        >
          Schemes
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
            activeTab === 'users' ? 'bg-white border border-b-0 border-[var(--color-line)] text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] hover:bg-white/50'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
            activeTab === 'bulk' ? 'bg-white border border-b-0 border-[var(--color-line)] text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] hover:bg-white/50'
          }`}
        >
          Bulk Upload
        </button>
      </div>

      {activeTab === 'schemes' && <SchemesManager />}
      {activeTab === 'users' && <UsersManager />}
      {activeTab === 'bulk' && <BulkUploadManager />}
    </div>
  )
}

function SchemesManager() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null)
  
  async function loadSchemes() {
    setLoading(true)
    try {
      const res = await adminApi.listSchemes()
      setSchemes(res.items)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSchemes()
  }, [])

  async function handleDelete(slug: string) {
    if (!confirm('Are you sure you want to delete this scheme?')) return
    try {
      await adminApi.deleteScheme(slug)
      await loadSchemes()
    } catch (err) {
      alert('Delete failed')
    }
  }

  if (loading) return <div>Loading schemes...</div>

  if (editingScheme) {
    return <SchemeEditor scheme={editingScheme} onCancel={() => setEditingScheme(null)} onSaved={() => { setEditingScheme(null); loadSchemes() }} />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={() => setEditingScheme({} as Scheme)} className="btn-primary py-2 px-4">
          + Add New Scheme
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[var(--color-line)] bg-white shadow-sm">
        <table className="min-w-full divide-y divide-[var(--color-line)]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[var(--color-line)]">
            {schemes.map(s => (
              <tr key={s.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditingScheme(s)} className="text-[var(--color-saffron-deep)] hover:text-orange-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(s.slug)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SchemeEditor({ scheme, onCancel, onSaved }: { scheme: Partial<Scheme>, onCancel: () => void, onSaved: () => void }) {
  const [formData, setFormData] = useState<Partial<Scheme>>({
    slug: '', name: '', department: '', category: 'Agriculture', level: 'central', benefit: '', description: '', source_url: '', ...scheme
  })

  async function handleSave() {
    try {
      if (scheme.slug) {
        await adminApi.updateScheme(scheme.slug, formData)
      } else {
        await adminApi.createScheme(formData)
      }
      onSaved()
    } catch (err: any) {
      alert(err.message || 'Failed to save scheme')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-[var(--color-line)] shadow-sm flex flex-col gap-4">
      <h2 className="text-xl font-bold">{scheme.slug ? 'Edit Scheme' : 'Add New Scheme'}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input disabled={!!scheme.slug} type="text" className="input-field mt-1 w-full" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" className="input-field mt-1 w-full" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input type="text" className="input-field mt-1 w-full" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" className="input-field mt-1 w-full" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Benefit</label>
          <input type="text" className="input-field mt-1 w-full" value={formData.benefit} onChange={e => setFormData({ ...formData, benefit: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Source URL</label>
          <input type="text" className="input-field mt-1 w-full" value={formData.source_url} onChange={e => setFormData({ ...formData, source_url: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea className="input-field mt-1 w-full h-32" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
      </div>
      
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onCancel} className="btn-secondary py-2 px-4">Cancel</button>
        <button onClick={handleSave} className="btn-primary py-2 px-4">Save Scheme</button>
      </div>
    </div>
  )
}

function UsersManager() {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [loading, setLoading] = useState(true)

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await adminApi.getUsers()
      setUsers(res)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function toggleRole(id: string, currentRole?: string) {
    const newRole = currentRole === 'admin' ? 'citizen' : 'admin'
    if (!confirm(`Change user to ${newRole}?`)) return
    
    try {
      await adminApi.updateUserRole(id, newRole)
      await loadUsers()
    } catch (err) {
      alert('Update failed')
    }
  }

  if (loading) return <div>Loading users...</div>

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-line)] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-[var(--color-line)]">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[var(--color-line)]">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {u.role || 'citizen'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => toggleRole(u.id, u.role)} className="text-[var(--color-saffron-deep)] hover:text-orange-900">
                  {u.role === 'admin' ? 'Make Citizen' : 'Make Admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BulkUploadManager() {
  const [jsonText, setJsonText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function handleUpload() {
    setLoading(true)
    setResult('')
    try {
      const parsed = JSON.parse(jsonText)
      if (!Array.isArray(parsed)) throw new Error('Root must be an array of scheme objects.')
      
      const res = await adminApi.bulkCreateSchemes(parsed)
      setResult(res.message || 'Upload successful!')
      setJsonText('')
    } catch (err: any) {
      setResult('Error: ' + (err.message || 'Invalid JSON'))
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-[var(--color-line)] shadow-sm flex flex-col gap-4">
      <h2 className="text-xl font-bold">Bulk Upload JSON</h2>
      <p className="text-sm text-gray-600">Paste an array of Scheme JSON objects here to insert them in bulk. Existing slugs will be skipped.</p>
      
      <textarea 
        className="input-field mt-1 w-full font-mono text-sm h-64" 
        placeholder={`[\n  {\n    "slug": "new-scheme",\n    "name": "New Scheme",\n    ...\n  }\n]`}
        value={jsonText} 
        onChange={e => setJsonText(e.target.value)} 
      />
      
      {result && <div className={`p-3 rounded-md ${result.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{result}</div>}
      
      <div className="flex justify-end">
        <button disabled={loading || !jsonText.trim()} onClick={handleUpload} className="btn-primary py-2 px-4">
          {loading ? 'Uploading...' : 'Upload Schemes'}
        </button>
      </div>
    </div>
  )
}
