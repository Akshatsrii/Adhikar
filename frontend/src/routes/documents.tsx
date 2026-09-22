import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Plus, FileText, CheckCircle2, Clock, MoreVertical, Eye } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/documents')({
  component: DocumentsPage,
})

function DocumentsPage() {
  const documents = [
    { name: 'Aadhaar Card', type: 'Identity Proof', status: 'Verified', date: '12 Jan 2025', expiry: '-' },
    { name: 'PAN Card', type: 'Identity Proof', status: 'Verified', date: '12 Jan 2025', expiry: '-' },
    { name: 'Income Certificate', type: 'Income Proof', status: 'Pending', date: '15 Jan 2025', expiry: '31 Dec 2026' },
    { name: 'Caste Certificate', type: 'Other', status: 'Verified', date: '10 Jan 2025', expiry: '-' },
    { name: 'Marksheet (10th)', type: 'Educational', status: 'Verified', date: '08 Jan 2025', expiry: '-' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">My Documents</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00428a] mb-2">My Documents</h1>
          <p className="text-sm text-gray-600">Upload, manage and verify your documents for government scheme applications</p>
        </div>
        <button className="bg-[#00428a] text-white px-5 py-2.5 rounded text-sm font-bold flex items-center gap-2 hover:bg-blue-800 transition shadow-sm shrink-0">
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Tabs */}
        <div className="flex items-center overflow-x-auto border-b border-gray-200 scrollbar-hide px-2">
          <button className="px-5 py-4 text-sm font-bold text-[#00428a] border-b-2 border-[#00428a] whitespace-nowrap bg-blue-50/50">All Documents (5)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Identity Proof (2)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Address Proof (0)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Income Proof (1)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Educational (1)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Others (1)</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Verified Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Upload Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      doc.status === 'Verified' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {doc.status === 'Verified' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doc.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doc.expiry}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="flex items-center gap-1 border border-[#00428a]/20 text-[#00428a] px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-50 transition">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
