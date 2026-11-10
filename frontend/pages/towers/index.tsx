import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import AttractiveCard from '../../components/AttractiveCard'
import Link from 'next/link'
import { MapPin, Activity, Users, Download, Plus, X, Navigation, Loader2 } from 'lucide-react'
import { API_BASE_URL } from '../../lib/api'

// Mock data - Replace with real API call when backend is ready
const initialTowers = [
  {
    id: 'vb-001-dallas',
    site_id_code: 'VB-TOWER-001',
    site_name: 'Dallas Site Alpha',
    property_id: 'prop-dallas-01',
    latitude: 32.7767,
    longitude: -96.7970,
    status: 'Active',
    created_at: '2024-01-15T10:30:00Z',
    equipment_count: 8,
    carriers: ['Verizon', 'AT&T', 'T-Mobile']
  },
  {
    id: 'vb-002-houston',
    site_id_code: 'VB-TOWER-002',
    site_name: 'Houston Central',
    property_id: 'prop-houston-01',
    latitude: 29.7604,
    longitude: -95.3698,
    status: 'Active',
    created_at: '2024-02-20T14:15:00Z',
    equipment_count: 6,
    carriers: ['Verizon', 'AT&T']
  },
  {
    id: 'vb-003-austin',
    site_id_code: 'VB-TOWER-003',
    site_name: 'Austin Hub',
    property_id: 'prop-austin-01',
    latitude: 30.2672,
    longitude: -97.7431,
    status: 'Active',
    created_at: '2024-03-10T09:00:00Z',
    equipment_count: 12,
    carriers: ['T-Mobile', 'Sprint']
  }
]

export default function TowersPage() {
  const [towersList, setTowersList] = useState<any[]>(initialTowers)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'detecting' | 'detected' | 'denied'>('idle')
  const [formData, setFormData] = useState({
    site_name: '',
    site_id_code: '',
    latitude: '',
    longitude: '',
    equipment_count: '4',
    carriers: 'Verizon, AT&T'
  })

  // Load real tower sites from backend database
  useEffect(() => {
    fetch(`${API_BASE_URL}/towers`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTowersList(data)
        }
      })
      .catch(err => console.warn('Could not fetch towers from API:', err))
  }, [])

  const detectLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setGeoStatus('detecting')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4)
          const lng = position.coords.longitude.toFixed(4)
          setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
          }))
          setGeoStatus('detected')
        },
        (error) => {
          console.warn('Geolocation access denied or timed out:', error)
          setGeoStatus('denied')
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } else {
      setGeoStatus('denied')
    }
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
    detectLocation()
  }

  const activeTowers = towersList.filter(t => t.status === 'Active').length
  const totalEquipment = towersList.reduce((sum, t) => sum + t.equipment_count, 0)

  const handleExportData = () => {
    const headers = ['Site Code', 'Site Name', 'Latitude', 'Longitude', 'Status', 'Equipment Count', 'Carriers']
    const rows = towersList.map(t => [
      `"${t.site_id_code}"`,
      `"${t.site_name}"`,
      t.latitude,
      t.longitude,
      `"${t.status}"`,
      t.equipment_count,
      `"${t.carriers.join(', ')}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `vertical_bridge_towers_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddTower = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.site_name || !formData.site_id_code) return

    const towerPayload = {
      site_id_code: formData.site_id_code.trim(),
      site_name: formData.site_name.trim(),
      latitude: parseFloat(formData.latitude) || 32.7767,
      longitude: parseFloat(formData.longitude) || -96.7970,
      status: 'Active',
      equipment_count: parseInt(formData.equipment_count, 10) || 1,
      carriers: formData.carriers.split(',').map(c => c.trim()).filter(Boolean)
    }

    try {
      const res = await fetch(`${API_BASE_URL}/towers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(towerPayload)
      })
      if (res.ok) {
        const saved = await res.json()
        setTowersList(prev => [saved, ...prev])
      } else {
        setTowersList(prev => [{ ...towerPayload, id: `vb-${Date.now()}` }, ...prev])
      }
    } catch {
      setTowersList(prev => [{ ...towerPayload, id: `vb-${Date.now()}` }, ...prev])
    }

    setIsAddModalOpen(false)
    setFormData({
      site_name: '',
      site_id_code: '',
      latitude: '',
      longitude: '',
      equipment_count: '4',
      carriers: 'Verizon, AT&T'
    })
    setGeoStatus('idle')
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tower Intelligence</h1>
            <p className="mt-2 text-gray-500">
              Monitor and manage 152+ telecommunications tower sites across Texas
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-none hover:bg-slate-50 flex items-center transition-colors cursor-pointer text-xs font-semibold bg-white shadow-sm"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Export Data
            </button>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-none text-xs font-semibold flex items-center shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Tower
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AttractiveCard title="Active Towers">
            <div className="text-center">
              <p className="text-4xl font-bold text-black">{activeTowers}</p>
              <p className="text-sm text-gray-500 mt-1">of <span className="font-semibold text-black">152</span> total sites</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Total Equipment">
            <div className="text-center">
              <p className="text-4xl font-bold text-black">{totalEquipment}</p>
              <p className="text-sm text-gray-500 mt-1">installed units</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Carrier Agreements">
            <div className="text-center">
              <p className="text-4xl font-bold text-black">5</p>
              <p className="text-sm text-gray-500 mt-1">active carriers</p>
            </div>
          </AttractiveCard>
        </div>

        {/* Towers Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tower Sites</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {towersList.map((tower) => (
              <AttractiveCard key={tower.id} hover>
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{tower.site_name}</h3>
                      <p className="text-sm text-gray-500">{tower.site_id_code}</p>
                    </div>
                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {tower.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-black font-medium">{tower.latitude.toFixed(4)}, {tower.longitude.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span><span className="font-semibold text-black">{tower.equipment_count}</span> equipment units</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{tower.carriers.join(', ')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link href={`/towers/${tower.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details →
                    </Link>
                  </div>
                </div>
              </AttractiveCard>
            ))}
          </div>
        </div>
      </div>

      {/* Add Tower Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Tower Site</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-none hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTower} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Antonio North Hub"
                  value={formData.site_name}
                  onChange={e => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-none border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Site ID Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VB-TOWER-004"
                  value={formData.site_id_code}
                  onChange={e => setFormData({ ...formData, site_id_code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-none border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Site Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={geoStatus === 'detecting'}
                    className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    {geoStatus === 'detecting' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin text-blue-600" />
                        <span>Detecting GPS...</span>
                      </>
                    ) : geoStatus === 'detected' ? (
                      <>
                        <Navigation className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">✓ Auto-detected (re-detect)</span>
                      </>
                    ) : geoStatus === 'denied' ? (
                      <>
                        <Navigation className="w-3.5 h-3.5 mr-1 text-amber-600" />
                        <span className="text-amber-600">Permission blocked (re-try)</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5 mr-1" />
                        <span>Auto-detect GPS</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 32.7767"
                      value={formData.latitude}
                      onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-none border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. -96.7970"
                      value={formData.longitude}
                      onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-none border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Equipment Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.equipment_count}
                    onChange={e => setFormData({ ...formData, equipment_count: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-none border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Carriers
                  </label>
                  <input
                    type="text"
                    placeholder="Verizon, AT&T, Dish"
                    value={formData.carriers}
                    onChange={e => setFormData({ ...formData, carriers: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-none border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-none text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Save Tower
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}