import Layout from '../../components/Layout'
import { Scale, Calendar, AlertCircle } from 'lucide-react'

const cases = [
  { id: 'VB-LEGAL-2024-001', title: 'Zoning Appeal - Dallas Site', type: 'litigation', status: 'Open', nextHearing: '2024-03-15', priority: 'High' },
  { id: 'VB-LEGAL-2024-002', title: 'Easement Dispute - Houston Site', type: 'litigation', status: 'Pending', nextHearing: '2024-04-20', priority: 'Medium' },
  { id: 'VB-LEGAL-2024-003', title: 'Permit Compliance - Austin Hub', type: 'regulatory', status: 'Resolved', nextHearing: '-', priority: 'Low' },
]

export default function LitigationPage() {
  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Litigation Intelligence</h1>
        <p className="mt-1 text-sm text-gray-500">Case tracking, precedent research, and litigation management</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow border border-gray-200 rounded-none p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Cases</h3>
            <p className="mt-2 text-3xl font-bold text-black">2</p>
          </div>
          <div className="bg-white shadow border border-gray-200 rounded-none p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Hearings</h3>
            <p className="mt-2 text-3xl font-bold text-black">2</p>
          </div>
          <div className="bg-white shadow border border-gray-200 rounded-none p-6">
            <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
            <p className="mt-2 text-3xl font-bold text-black">1</p>
          </div>
        </div>

        <div className="mt-6 bg-white shadow border border-gray-200 rounded-none">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Case Repository</h3>
          </div>
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matter #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Hearing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cases.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 'Open' ? 'bg-red-100 text-red-800' : c.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> {c.nextHearing}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.priority === 'High' ? 'bg-red-100 text-red-800' : c.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {c.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}