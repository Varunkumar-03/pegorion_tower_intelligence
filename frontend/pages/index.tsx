import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import AttractiveCard from '../components/AttractiveCard'
import Link from 'next/link'
import { API_BASE_URL } from '../lib/api'
import {
  Radio,
  FileText,
  Scale,
  Settings,
  MapPin,
  Activity,
  Users,
  Shield,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react'

// Key sites from portfolio
const featuredTowers = [
  {
    id: 'vb-001-dallas',
    site_id_code: 'VB-TOWER-001',
    site_name: 'Dallas Site Alpha',
    city: 'Dallas, TX',
    equipment_count: 8,
    status: 'Active',
    carriers: ['Verizon', 'AT&T', 'T-Mobile'],
    monthly_revenue: '$4,850/mo'
  },
  {
    id: 'vb-002-houston',
    site_id_code: 'VB-TOWER-002',
    site_name: 'Houston Central',
    city: 'Houston, TX',
    equipment_count: 6,
    status: 'Active',
    carriers: ['Verizon', 'AT&T'],
    monthly_revenue: '$5,200/mo'
  },
  {
    id: 'vb-003-austin',
    site_id_code: 'VB-TOWER-003',
    site_name: 'Austin Hub 5G',
    city: 'Austin, TX',
    equipment_count: 12,
    status: 'Active',
    carriers: ['T-Mobile', 'Sprint', 'Dish'],
    monthly_revenue: '$6,100/mo'
  }
]

// Key leases
const criticalLeases = [
  {
    id: 'lease-001',
    lease_number: 'VB-LEASE-2024-001',
    property_name: 'Dallas Site Alpha',
    landlord_name: 'TowerCo Properties LLC',
    annual_rent: '$480,000/yr',
    end_date: '2034-12-31',
    escalation: '2.5% Annual',
    status: 'Active',
    statusBadge: 'bg-green-100 text-green-800'
  },
  {
    id: 'lease-002',
    lease_number: 'VB-LEASE-2024-002',
    property_name: 'Houston Central',
    landlord_name: 'MetroTowers Inc.',
    annual_rent: '$350,000/yr',
    end_date: '2033-03-31',
    escalation: '3.0% Bi-annual',
    status: 'Active',
    statusBadge: 'bg-green-100 text-green-800'
  }
]

// Platform navigation modules
const modules = [
  {
    name: 'Tower Intelligence',
    description: 'Monitor tower site locations, structural assets, and colocation equipment.',
    icon: <Radio className="w-5 h-5 text-blue-600" />,
    href: '/towers',
    stat: '152 Sites',
    statLabel: 'Texas Portfolio'
  },
  {
    name: 'Lease Intelligence',
    description: 'Track master agreements, CPI rent escalations, and 90-day renewal terms.',
    icon: <FileText className="w-5 h-5 text-emerald-600" />,
    href: '/leases',
    stat: '$12.4M',
    statLabel: 'Annual Contracted Rent'
  },
  {
    name: 'Legal Intelligence',
    description: 'Manage zoning permits, municipal appeals, carrier disputes, and hearings.',
    icon: <Scale className="w-5 h-5 text-purple-600" />,
    href: '/legal',
    stat: '12 Matters',
    statLabel: 'Active Cases'
  },
  {
    name: 'Operations Center',
    description: 'Orchestrate structural inspections, colocation workflows, and maintenance tickets.',
    icon: <Settings className="w-5 h-5 text-amber-600" />,
    href: '/operations',
    stat: '57 Tasks',
    statLabel: 'Pending Actions'
  }
]

export default function Home() {
  const [towers, setTowers] = useState(featuredTowers)

  useEffect(() => {
    fetch(`${API_BASE_URL}/towers`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.slice(0, 3).map((t, idx) => ({
            id: t.id,
            site_id_code: t.site_id_code,
            site_name: t.site_name,
            city: t.city || 'Texas, TX',
            equipment_count: t.equipment_count || 6,
            status: t.status || 'Active',
            carriers: t.carriers && t.carriers.length > 0 ? t.carriers : ['Verizon', 'AT&T'],
            monthly_revenue: idx === 0 ? '$4,850/mo' : idx === 1 ? '$5,200/mo' : '$6,100/mo'
          }))
          setTowers(formatted)
        }
      })
      .catch(() => {})
  }, [])
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header - Consistent with Towers & Leases */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Intelligence</h1>
            <p className="mt-2 text-gray-500">
              Overview of telecommunications infrastructure, master lease agreements, and operational telemetry
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              href="/towers"
              className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-none hover:bg-slate-50 font-semibold text-xs inline-flex items-center bg-white shadow-sm transition-colors"
            >
              <Radio className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              View Towers
            </Link>
            <Link
              href="/ai"
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-none font-semibold text-xs inline-flex items-center shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI Copilot
            </Link>
          </div>
        </div>

        {/* Top Key Insights - Matching Towers & Leases Card Styles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AttractiveCard title="Active Towers">
            <div className="text-center">
              <p className="text-4xl font-bold text-black">152</p>
              <p className="text-sm text-gray-500 mt-1">across Texas region</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Contracted ARR">
            <div className="text-center">
              <p className="text-4xl font-bold text-black">$12.4M</p>
              <p className="text-sm text-gray-500 mt-1">annual lease revenue</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Expiring Soon">
            <div className="text-center">
              <p className="text-4xl font-bold text-black">7</p>
              <p className="text-sm text-gray-500 mt-1">within 90-day window</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Legal Matters">
            <div className="text-center">
              <p className="text-4xl font-bold text-black">3</p>
              <p className="text-sm text-gray-500 mt-1">pending filings / hearings</p>
            </div>
          </AttractiveCard>
        </div>

        {/* Section 1: Featured Tower Sites - Matching Towers Page */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Featured Tower Sites</h2>
            <Link href="/towers" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              View all 152 towers <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {towers.map((tower) => (
              <AttractiveCard key={tower.id} hover>
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-gray-400">{tower.site_id_code}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{tower.site_name}</h3>
                    </div>
                    <span className="mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {tower.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                      <span>{tower.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                      <span><span className="font-semibold text-black">{tower.equipment_count}</span> Equipment Units</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                      <span>{tower.carriers.join(', ')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-black">{tower.monthly_revenue}</span>
                    <Link href={`/towers/${tower.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Site Details →
                    </Link>
                  </div>
                </div>
              </AttractiveCard>
            ))}
          </div>
        </div>

        {/* Section 2: Critical Leases - Matching Leases Page */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Active Master Leases</h2>
            <Link href="/leases" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              View all leases <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {criticalLeases.map((lease) => (
              <AttractiveCard key={lease.id} hover>
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-gray-400">{lease.lease_number}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{lease.property_name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{lease.landlord_name}</p>
                    </div>
                    <span className={`mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full ${lease.statusBadge}`}>
                      {lease.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-none">
                    <div>
                      <span className="text-xs text-gray-500">Annual Rent</span>
                      <p className="text-base font-bold text-black mt-0.5">{lease.annual_rent}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Escalation Clause</span>
                      <p className="text-base font-bold text-black mt-0.5">{lease.escalation}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      Term expires: {lease.end_date}
                    </span>
                    <Link href="/leases" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Manage Lease →
                    </Link>
                  </div>
                </div>
              </AttractiveCard>
            ))}
          </div>
        </div>

        {/* Section 3: Platform Modules */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Intelligence Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => (
              <Link key={module.name} href={module.href}>
                <AttractiveCard hover>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-none bg-gray-50 border border-gray-100 flex items-center justify-center">
                        {module.icon}
                      </div>
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-blue-600">
                        Open →
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-900">{module.name}</h3>
                      <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{module.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">{module.statLabel}</span>
                      <span className="text-sm font-bold text-black">{module.stat}</span>
                    </div>
                  </div>
                </AttractiveCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
