import Layout from '../../components/Layout'
import { FileText, AlertCircle } from 'lucide-react'

const contracts = [
  { id: 'CT-001', type: 'Master Lease', number: 'VB-LEASE-001', status: 'Active', signed: '2023-01-01', risk: 'Low' },
  { id: 'CT-002', type: 'Colocation Agreement', number: 'VB-COLO-002', status: 'Active', signed: '2023-06-15', risk: 'Medium' },
  { id: 'CT-003', type: 'Ground Lease', number: 'VB-GROUND-003', status: 'Draft', signed: '-', risk: 'Pending' },
]

export default function ContractsPage() {
  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contract Intelligence</h1>
        <p className="mt-1 text-sm text-gray-500">Contract repository, lifecycle management, and risk analysis</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow border border-gray-200 rounded-none p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Contracts</h3>
            <p className="mt-2 text-3xl font-bold text-black">12</p>
          </div>
          <div className="bg-white shadow border border-gray-200 rounded-none p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Agreements</h3>
            <p className="mt-2 text-3xl font-bold text-black">8</p>
          </div>
          <div className="bg-white shadow border border-gray-200 rounded-none p-6">
            <h3 className="text-sm font-medium text-gray-500">Under Review</h3>
            <p className="mt-2 text-3xl font-bold text-black">2</p>
          </div>
        </div>

        <div className="mt-6 bg-white shadow border border-gray-200 rounded-none">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contract Repository</h3>
          </div>
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signed Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.signed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.risk === 'Low' ? 'bg-green-100 text-green-800' : c.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {c.risk}
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