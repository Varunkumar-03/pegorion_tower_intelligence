import { useState } from 'react'
import Link from 'next/link'
import { Menu, Home, BarChart2, FileText, Scale, Settings, Search } from 'lucide-react'

const navItems = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Tower Intelligence', href: '/towers', icon: BarChart2 },
  { name: 'Lease Intelligence', href: '/leases', icon: FileText },
  { name: 'Legal Intelligence', href: '/legal', icon: Scale },
  { name: 'Operations', href: '/operations', icon: Settings },
  { name: 'AI Workspace', href: '/ai', icon: Search },
]

export default function RegulatoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="px-4 pb-2 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Pegorion</h2>
          </div>
          <nav className="flex-1 flex flex-col px-2 pb-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href} className="text-gray-600 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                  <Icon className="mr-4 flex-shrink-0 h-5 w-5 text-gray-400" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">Pegorion</h1>
      </div>

      <main className="flex flex-col flex-1 md:pl-64">
        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Regulatory Intelligence</h1>
          <p className="mt-1 text-sm text-gray-500">FCC rules, FAA regulations, and compliance tracking</p>

          <div className="mt-6 bg-white shadow border border-gray-200 rounded-none p-6">
            <div className="flex items-center mb-4">
              <Search className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Regulatory Repository</h3>
                <p className="text-sm text-gray-500">Connect to backend API for regulation management</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="border border-gray-200 rounded-none p-4">
                <h4 className="font-medium text-gray-900 mb-2">FCC Regulations</h4>
                <p className="text-sm text-gray-500">Title 47 telecommunications rules</p>
              </div>
              <div className="border border-gray-200 rounded-none p-4">
                <h4 className="font-medium text-gray-900 mb-2">FAA Part 77</h4>
                <p className="text-sm text-gray-500">Tower obstruction safety rules</p>
              </div>
              <div className="border border-gray-200 rounded-none p-4">
                <h4 className="font-medium text-gray-900 mb-2">Compliance Alerts</h4>
                <p className="text-sm text-gray-500">Renewal and filing deadlines</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}