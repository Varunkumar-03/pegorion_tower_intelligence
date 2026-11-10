import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import AttractiveCard from '../../components/AttractiveCard'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MapPin, Users, FileText, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { API_BASE_URL } from '../../lib/api'

const towerRegistry: Record<string, {
  id: string
  code: string
  name: string
  location: string
  status: string
  latitude: number
  longitude: number
  property: string
  equipment: { type: string; manufacturer: string; model: string; installed: string }[]
  carriers: string[]
}> = {
  'vb-001-dallas': {
    id: 'vb-001-dallas',
    code: 'VB-TOWER-001',
    name: 'Dallas Site Alpha',
    location: 'Dallas, TX',
    status: 'Active',
    latitude: 32.7767,
    longitude: -96.7970,
    property: 'Dallas Metro Site',
    equipment: [
      { type: 'Antenna', manufacturer: 'Ericsson', model: 'AirScale Massive MIMO', installed: '2022-01-15' },
      { type: 'Baseband', manufacturer: 'Nokia', model: 'AirScale 5G BBU', installed: '2021-08-20' },
      { type: 'Microwave Backhaul', manufacturer: 'Aviat', model: 'CTR 8540', installed: '2022-03-11' },
      { type: 'Battery Rack', manufacturer: 'Enersys', model: 'PowerSafe 48V', installed: '2020-11-04' }
    ],
    carriers: ['Verizon', 'AT&T', 'T-Mobile'],
  },
  'vb-002-houston': {
    id: 'vb-002-houston',
    code: 'VB-TOWER-002',
    name: 'Houston Central',
    location: 'Houston, TX',
    status: 'Active',
    latitude: 29.7604,
    longitude: -95.3698,
    property: 'Houston Central Hub',
    equipment: [
      { type: 'Antenna', manufacturer: 'Samsung', model: 'Massive MIMO 64T64R', installed: '2022-06-12' },
      { type: 'Remote Radio Unit', manufacturer: 'Ericsson', model: 'Radio 4415', installed: '2022-09-05' },
      { type: 'Tower Top Amplifier', manufacturer: 'CommScope', model: 'TTA-Dual', installed: '2021-04-18' }
    ],
    carriers: ['Verizon', 'AT&T'],
  },
  'vb-003-austin': {
    id: 'vb-003-austin',
    code: 'VB-TOWER-003',
    name: 'Austin Hub 5G',
    location: 'Austin, TX',
    status: 'Active',
    latitude: 30.2672,
    longitude: -97.7431,
    property: 'Austin Tech Corridor',
    equipment: [
      { type: '5G mmWave Antenna', manufacturer: 'Qualcomm / Nokia', model: 'AirScale mmWave', installed: '2023-02-18' },
      { type: 'Baseband Unit', manufacturer: 'Nokia', model: 'BBU 5G Ultra', installed: '2023-03-01' },
      { type: 'Backup Power UPS', manufacturer: 'Vertiv', model: 'NetSure 7100', installed: '2021-11-20' }
    ],
    carriers: ['T-Mobile', 'Sprint', 'Dish'],
  }
}

export default function TowerDetails({ initialId, initialTower }: { initialId?: string; initialTower?: any }) {
  const router = useRouter()
  const id = router.query.id || initialId
  const queryKey = typeof id === 'string' ? id.toLowerCase() : 'vb-001-dallas'

  const [towerData, setTowerData] = useState<any>(initialTower || towerRegistry[queryKey] || towerRegistry['vb-001-dallas'])

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/towers/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setTowerData(data)
        })
        .catch(() => {})
    }
  }, [id])

  const currentTower = towerData || towerRegistry[queryKey] || towerRegistry['vb-001-dallas']

  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-2">
          <Link href="/towers" className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center group transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Back to Tower Portfolio
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{currentTower.name}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                {currentTower.status}
              </span>
            </div>
            <p className="mt-1 text-sm font-mono text-gray-500">{currentTower.code}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/leases"
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none text-sm font-medium transition-colors"
            >
              View Leases
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (2 Cols) */}
          <div className="min-w-0 lg:col-span-2 space-y-6">
            {/* Site Information */}
            <AttractiveCard title="Site Information">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-none">
                  <dt className="text-xs font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" /> {currentTower.location}
                  </dd>
                </div>
                <div className="p-3 bg-gray-50 rounded-none">
                  <dt className="text-xs font-medium text-gray-500">GPS Coordinates</dt>
                  <dd className="mt-1 text-sm font-mono font-medium text-black">
                    {currentTower.latitude}, {currentTower.longitude}
                  </dd>
                </div>
                <div className="p-3 bg-gray-50 rounded-none">
                  <dt className="text-xs font-medium text-gray-500">Property Identifier</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">{currentTower.property}</dd>
                </div>
                <div className="p-3 bg-gray-50 rounded-none">
                  <dt className="text-xs font-medium text-gray-500">Operational Status</dt>
                  <dd className="mt-1 text-sm font-semibold text-green-700 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-green-600 flex-shrink-0" />
                    {currentTower.status}
                  </dd>
                </div>
              </dl>
            </AttractiveCard>

            {/* Equipment Units */}
            <AttractiveCard title="Installed Equipment Units">
              <div className="overflow-x-auto -mx-6 -mb-6">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Manufacturer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Model</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Installed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {currentTower.equipment.map((eq: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5 whitespace-nowrap font-medium text-gray-900">{eq.type}</td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-gray-600">{eq.manufacturer}</td>
                        <td className="px-6 py-3.5 whitespace-nowrap font-mono text-xs text-blue-600">{eq.model}</td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-gray-500 text-xs">{eq.installed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AttractiveCard>
          </div>

          {/* Right Column (1 Col) */}
          <div className="min-w-0 space-y-6">
            {/* Carriers */}
            <AttractiveCard title="Active Carriers">
              <div className="space-y-3">
                {currentTower.carriers.length > 0 ? (
                  currentTower.carriers.map((carrier: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-none">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-none bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {carrier.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{carrier}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">Connected</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No carriers assigned</p>
                )}
              </div>
            </AttractiveCard>

            {/* Lease Agreement */}
            <AttractiveCard title="Lease Agreement">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-none">
                  <div className="flex items-center space-x-2 text-blue-900 font-medium text-sm">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Master Agreement Active</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Ground lease agreement active through 2034 with scheduled annual escalation.</p>
                </div>
                <Link
                  href="/leases"
                  className="w-full inline-flex items-center justify-center py-2 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-none text-xs font-semibold transition-colors shadow-sm"
                >
                  View Lease Agreement <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </AttractiveCard>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  const id = context.params?.id || 'vb-001-dallas'
  try {
    const res = await fetch(`${API_BASE_URL}/towers/${id}`)
    if (res.ok) {
      const data = await res.json()
      return {
        props: {
          initialId: id,
          initialTower: data
        }
      }
    }
  } catch (err) {
    console.warn('Error fetching live tower details in SSR:', err)
  }
  return {
    props: {
      initialId: id,
      initialTower: null
    }
  }
}
