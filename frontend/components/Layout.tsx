import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Menu,
  BarChart2,
  FileText,
  Scale,
  Settings,
  Home,
  Search,
  User,
  LogOut
} from 'lucide-react'

const navItems = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Tower Intelligence', href: '/towers', icon: BarChart2 },
  { name: 'Lease Intelligence', href: '/leases', icon: FileText },
  { name: 'Legal Intelligence', href: '/legal', icon: Scale },
  { name: 'Operations', href: '/operations', icon: Settings },
  { name: 'AI Workspace', href: '/ai', icon: Search },
]

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const isCurrent = (href: string) => {
    if (href === '/') return router.pathname === '/'
    return router.pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-[#F4F6FA] text-slate-900">
      {/* Sidebar with Dark Navy color palette from reference */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#0B1A2E] border-r border-[#162D4A] z-40">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="px-6 pt-3 pb-2 flex items-center justify-between">
            <div className="flex items-center pl-3">
              {/* VERTICAL BRIDGE LOGO (White on Dark Navy) */}
              <img
                src="https://www.deepsouthcommunications.com/wp-content/uploads/2020/11/vertical-bridge-logo.png"
                alt="Vertical Bridge"
                className="h-12 w-auto max-w-[180px] object-contain brightness-0 invert opacity-95"
              />
            </div>
          </div>

          <nav className="flex-1 flex flex-col px-3 pb-2 space-y-1 mt-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isCurrent(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3.5 py-2.5 text-sm rounded-none transition-colors ${
                    active
                      ? 'bg-[#163356] text-white border-l-4 border-blue-500 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-[#132842] font-medium'
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
                      active ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="px-4 mt-auto border-t border-[#162D4A] pt-4">
            <div className="flex items-center text-xs text-slate-400">
              <User className="w-4 h-4 mr-2 text-slate-400" />
              <span>Vertical Bridge Platform</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex w-64 flex-col bg-[#0B1A2E] border-r border-[#162D4A]">
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <div className="flex items-center pl-3">
                <img
                  src="https://www.deepsouthcommunications.com/wp-content/uploads/2020/11/vertical-bridge-logo.png"
                  alt="Vertical Bridge"
                  className="h-10 w-auto max-w-[160px] object-contain brightness-0 invert"
                />
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-none p-2 text-slate-400 hover:bg-[#162D4A] hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col px-3 pb-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isCurrent(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3.5 py-2.5 text-sm rounded-none transition-colors ${
                      active
                        ? 'bg-[#163356] text-white border-l-4 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-[#132842] font-medium'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        active ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 md:pl-64 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-none p-2 text-slate-600 hover:bg-slate-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <img
            src="https://www.deepsouthcommunications.com/wp-content/uploads/2020/11/vertical-bridge-logo.png"
            alt="Vertical Bridge"
            className="h-8 w-auto"
          />
          <div className="w-10" />
        </div>

        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200 py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <div className="flex items-center">
              <span>© 2026 Vertical Bridge Infrastructure. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://pegorion.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors"
                title="Visit Pegorion"
              >
                <span className="hidden sm:inline">Built with Pegorion Platform</span>
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
