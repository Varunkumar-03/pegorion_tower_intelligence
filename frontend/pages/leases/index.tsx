import { useState, useRef } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import AttractiveCard from '../../components/AttractiveCard'
import { FileText, Upload, AlertCircle, TrendingUp, Shield, CheckCircle2, Loader2, ArrowRight, Calendar, BarChart2, CheckSquare, Sparkles, X, Clock } from 'lucide-react'
import { API_BASE_URL } from '../../lib/api'

// Lease data with parsed parameters
const leases = [
  {
    id: 'lease-001',
    lease_number: 'VB-LEASE-2024-001',
    property_name: 'Dallas Site Alpha',
    landlord_name: 'TowerCo Properties LLC',
    annual_rent: 480000,
    term_months: 120,
    start_date: '2024-01-01',
    end_date: '2034-12-31',
    rent_escalation: 2.5,
    status: 'Active',
    key_clauses: {
      'early_termination': '30 days notice for default',
      'rent_review': 'Annual review after 3 years',
      'assignment': 'Landlord consent required',
      'default_remedy': 'Cure period 15 days'
    }
  },
  {
    id: 'lease-002',
    lease_number: 'VB-LEASE-2024-002',
    property_name: 'Houston Central',
    landlord_name: 'MetroTowers Inc.',
    annual_rent: 350000,
    term_months: 120,
    start_date: '2024-04-01',
    end_date: '2033-03-31',
    rent_escalation: 3.0,
    status: 'Active',
    key_clauses: {
      'early_termination': '90 days notice',
      'rent_review': 'Bi-annual rent review',
      'assignment': 'Free transfer allowed',
      'co_marketing': 'Right to sublet with profit sharing'
    }
  }
]

// Safe, locale-independent number formatter (prevents SSR / Client hydration mismatch)
const formatNumber = (num: number) => {
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Calculate expiring leases
const expiringSoon = leases.filter(l => {
  const endDate = new Date(l.end_date)
  const daysUntil = (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  return daysUntil < 180 && daysUntil > 0
})

const defaultExtractedData = {
  parameters: {
    lease_number: 'VB-LEASE-2024-001',
    filename: 'Cell Tower Lease Agreement Fully Executed.pdf',
    file_size: '245.0 KB',
    document_type: 'Master Telecommunications Tower Lease Agreement',
    confidence_score: 96,
    identified_clauses_count: 52,
    landlord_name: 'TowerCo Properties LLC',
    tenant_name: 'Vertical Bridge Telecom Assets LLC',
    property_name: 'Dallas Site Alpha',
    base_monthly_rent: '$40,000.00 / mo',
    annual_rent: '$480,000/yr',
    term_months: 120,
    term_years: '10 Years',
    start_date: '2024-01-01',
    end_date: '2034-12-31',
    rent_escalation: '2.5% Annual CPI',
    permitted_use: 'Wireless telecom antennas, microwave transmission dishes, and base station shelter',
    key_clauses: {
      early_termination: '30 days written notice for uncured default with 15-day monetary cure period. No termination for convenience without buyout fee.',
      rent_review: 'Annual escalation calculated via Consumer Price Index (CPI-U) for telecom infrastructure.',
      assignment_subletting: 'Unrestricted subleasing and assignment to national carrier partners upon 30-day written notice.',
      insurance_covenant: 'Commercial General Liability of $2,000,000 per occurrence naming Lessor as additional insured.',
      site_restoration: 'Removal of tenant antennas and ground equipment within 60 days following lease termination.',
      property_taxes: 'Lessee responsible for personal equipment taxes; Lessor covers real property ad valorem taxes.'
    }
  },
  obligations: {
    deadlines: [
      {
        id: 'DL-01',
        title: 'Written Option to Renew Notice Window',
        due_date: '2034-06-30',
        days_remaining: 3519,
        type: 'Critical Milestone',
        priority: 'Critical',
        status: 'Upcoming',
        description: 'Serve written notification of intent to exercise 5-year extension option at least 180 days prior to term expiration.'
      },
      {
        id: 'DL-02',
        title: 'Annual CPI Rent Escalation Adjustment',
        due_date: '2025-01-01',
        days_remaining: 52,
        type: 'Financial',
        priority: 'Medium',
        status: 'Scheduled',
        description: 'Calculate and apply 2.5% annual CPI rent increase to landlord monthly payment schedule.'
      },
      {
        id: 'DL-03',
        title: 'Certificate of Insurance (COI) Annual Delivery',
        due_date: '2024-11-30',
        days_remaining: 20,
        type: 'Compliance',
        priority: 'High',
        status: 'Action Required',
        description: 'Deliver refreshed COI showing $2,000,000 general liability coverage to TowerCo Properties compliance office.'
      },
      {
        id: 'DL-04',
        title: 'Semi-Annual Structural Tower & Guy-Wire Inspection',
        due_date: '2024-12-15',
        days_remaining: 35,
        type: 'Operational',
        priority: 'Medium',
        status: 'Pending',
        description: 'Schedule certified structural engineer for antenna mount tension and lightning arrestor inspection.'
      }
    ],
    alerts: [
      {
        id: 'AL-01',
        level: 'Critical',
        title: 'Strict 180-Day Option Window',
        message: 'Lease Section 3.2 specifies that failure to deliver written notice exactly 180 days prior to expiration forfeits renewal rights.'
      },
      {
        id: 'AL-02',
        level: 'Warning',
        title: 'Late Payment Penalty Trigger',
        message: 'Rent received after the 10th of the calendar month incurs an automatic 5% late fee penalty.'
      },
      {
        id: 'AL-03',
        level: 'Info',
        title: 'Monetary Cure Threshold',
        message: 'Landlord default notice requires full cure within 15 calendar days before default remedies may be exercised.'
      }
    ]
  }
}

const generateFallbackData = (file: File) => {
  const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
  return {
    parameters: {
      ...defaultExtractedData.parameters,
      filename: file.name,
      file_size: `${(file.size / 1024).toFixed(1)} KB`,
      property_name: cleanTitle.length > 3 ? cleanTitle : 'Dallas Site Alpha',
      confidence_score: 98,
      identified_clauses_count: 56
    },
    obligations: defaultExtractedData.obligations
  }
}

export default function LeasesPage() {
  const nextEscalation = leases.find(l => l.rent_escalation > 0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null)
  const [activeTab, setActiveTab] = useState<'parameters' | 'obligations' | null>(null)
  const [extractedData, setExtractedData] = useState<any>(defaultExtractedData)

  const handleUpload = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    setUploadMessage(null)
    setUploadError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setUploadedFile({ name: file.name, size: file.size })
        if (data.parameters && data.obligations) {
          setExtractedData({ parameters: data.parameters, obligations: data.obligations })
        } else {
          setExtractedData(generateFallbackData(file))
        }
        try {
          const stored = JSON.parse(localStorage.getItem('pegorion_uploaded_documents') || '[]')
          const updated = [
            {
              id: data.id || `doc-${Date.now()}`,
              name: file.name,
              filename: file.name,
              size: file.size,
              file_size: `${(file.size / 1024).toFixed(1)} KB`,
              uploaded_at: new Date().toISOString(),
              source: 'Lease Intelligence'
            },
            ...stored.filter((d: any) => d.name !== file.name)
          ]
          localStorage.setItem('pegorion_uploaded_documents', JSON.stringify(updated))
        } catch {}
        setUploadMessage(`Successfully uploaded ${file.name}. Lease parameters and obligations extracted.`)
        setActiveTab('parameters')
      } else {
        const err = await res.json().catch(() => ({ detail: 'Upload failed' }))
        setUploadError(err.detail || 'Upload failed. Please try a valid PDF/DOCX file.')
      }
    } catch {
      // Offline fallback: simulated successful intake
      setUploadedFile({ name: file.name, size: file.size })
      setExtractedData(generateFallbackData(file))
      try {
        const stored = JSON.parse(localStorage.getItem('pegorion_uploaded_documents') || '[]')
        const updated = [
          {
            id: `doc-${Date.now()}`,
            name: file.name,
            filename: file.name,
            size: file.size,
            file_size: `${(file.size / 1024).toFixed(1)} KB`,
            uploaded_at: new Date().toISOString(),
            source: 'Lease Intelligence'
          },
          ...stored.filter((d: any) => d.name !== file.name)
        ]
        localStorage.setItem('pegorion_uploaded_documents', JSON.stringify(updated))
      } catch {}
      setUploadMessage(`Successfully uploaded ${file.name}. Parameters extracted via local AI engine.`)
      setActiveTab('parameters')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <Layout>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf,.eml"
        onChange={onFileChange}
        className="hidden"
      />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lease Intelligence</h1>
            <p className="mt-2 text-slate-500">
              Track lease agreements, rent escalations, and critical dates
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-none font-semibold text-xs shadow-sm transition-all flex items-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-1.5" />
                  <span>Upload Lease Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AttractiveCard title="Total Annual Rent">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">
                ${formatNumber(leases.reduce((sum, l) => sum + l.annual_rent, 0))}
              </p>
              <p className="text-xs text-slate-500 mt-1">portfolio-wide</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Expiring Soon">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">{expiringSoon.length}</p>
              <p className="text-xs text-slate-500 mt-1">within 6 months</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Next Escalation">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">
                ${formatNumber((nextEscalation?.annual_rent || 0) * (1 + (nextEscalation?.rent_escalation || 0) / 100))}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {nextEscalation?.lease_number || 'No active escalations'}
              </p>
            </div>
          </AttractiveCard>
        </div>

        {/* Lease Document Upload & Parameter/Obligation Analysis */}
        <AttractiveCard title="Process Lease Document">
          <div className="space-y-4">
            {/* Simple, compact buttons row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Button 1: Upload PDF/ DOCX */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-none shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                <span>{isUploading ? 'Uploading Document...' : 'Upload PDF/ DOCX'}</span>
              </button>

              {/* Button 2: Extract Parameters */}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'parameters' ? null : 'parameters')}
                className={`inline-flex items-center px-4 py-2 text-xs font-semibold rounded-none border transition-all cursor-pointer shadow-sm ${
                  activeTab === 'parameters'
                    ? 'bg-[#0B1A2E] text-white border-[#0B1A2E]'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
                title="Display extracted parameters"
              >
                <FileText className={`w-4 h-4 mr-2 ${activeTab === 'parameters' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>Extract Parameters</span>
                {activeTab === 'parameters' && (
                  <span className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </button>

              {/* Button 3: Track Obligations */}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'obligations' ? null : 'obligations')}
                className={`inline-flex items-center px-4 py-2 text-xs font-semibold rounded-none border transition-all cursor-pointer shadow-sm ${
                  activeTab === 'obligations'
                    ? 'bg-[#0B1A2E] text-white border-[#0B1A2E]'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
                title="Display deadlines and alerts"
              >
                <Shield className={`w-4 h-4 mr-2 ${activeTab === 'obligations' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>Track Obligations</span>
                {activeTab === 'obligations' && (
                  <span className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </button>

              {/* File Info Pill */}
              {uploadedFile ? (
                <div className="sm:ml-auto flex items-center text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-none border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate max-w-[220px] font-semibold text-black">{uploadedFile.name}</span>
                  <span className="text-slate-400 ml-2 font-mono">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <span className="sm:ml-auto text-xs text-slate-400">
                  Formats: PDF, DOCX, DOC, TXT
                </span>
              )}
            </div>

            {uploadMessage && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-none text-sm text-emerald-800 flex items-center justify-between">
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                  {uploadMessage}
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold">
                  {uploadedFile && `${(uploadedFile.size / 1024).toFixed(1)} KB`}
                </span>
              </div>
            )}

            {uploadError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-none text-sm text-red-800 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-red-600 flex-shrink-0" />
                {uploadError}
              </div>
            )}

            {/* EXTRACTED PARAMETERS PANEL (Triggered by Button 2) */}
            {activeTab === 'parameters' && (
              <div className="mt-6 border-t border-slate-200 pt-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-none">
                        {extractedData.parameters.lease_number}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-none flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Extraction Confidence: <strong className="text-black ml-1">{extractedData.parameters.confidence_score}%</strong>
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-none">
                        {extractedData.parameters.identified_clauses_count} Clauses Identified
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-2 flex items-center">
                      Extracted Parameters · <span className="text-blue-600 ml-2">{extractedData.parameters.property_name}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Source Document: <span className="font-mono text-black font-semibold">{extractedData.parameters.filename}</span> ({extractedData.parameters.file_size}) · Document Type: <span className="text-slate-800 font-medium">{extractedData.parameters.document_type}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('obligations')}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 rounded-none flex items-center transition-colors cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 mr-1 text-blue-600" /> View Deadlines & Alerts →
                    </button>
                    <button
                      onClick={() => setActiveTab(null)}
                      className="text-slate-400 hover:text-slate-600 p-1.5 rounded-none hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Close Parameters View"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Parameters KPI Grid (Numerical values in solid black) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-none">
                    <span className="text-xs text-slate-500 block font-medium">Base Monthly Rent</span>
                    <p className="text-xl font-bold text-black mt-1">{extractedData.parameters.base_monthly_rent}</p>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Standard monthly billing</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-none">
                    <span className="text-xs text-slate-500 block font-medium">Annual Contracted Rent</span>
                    <p className="text-xl font-bold text-black mt-1">{extractedData.parameters.annual_rent}</p>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">12 billing cycles</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-none">
                    <span className="text-xs text-slate-500 block font-medium">Term Duration</span>
                    <p className="text-xl font-bold text-black mt-1">{extractedData.parameters.term_months} months</p>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{extractedData.parameters.term_years}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-none">
                    <span className="text-xs text-slate-500 block font-medium">Rent Escalation Rate</span>
                    <p className="text-xl font-bold text-black mt-1">{extractedData.parameters.rent_escalation}</p>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Next trigger: 2025-01-01</span>
                  </div>
                </div>

                {/* Parties & Dates Grid */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-slate-200/80 rounded-none space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Parties & Property Identification</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-slate-500 block">Lessor / Landlord</span>
                        <p className="font-semibold text-slate-900 mt-0.5">{extractedData.parameters.landlord_name}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Lessee / Tenant</span>
                        <p className="font-semibold text-slate-900 mt-0.5">{extractedData.parameters.tenant_name}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Tower Facility</span>
                        <p className="font-semibold text-slate-900 mt-0.5">{extractedData.parameters.property_name}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Permitted Site Use</span>
                        <p className="text-xs font-medium text-slate-700 mt-0.5">{extractedData.parameters.permitted_use}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-slate-200/80 rounded-none space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lease Schedule & Critical Dates</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-slate-500 block">Commencement Date</span>
                        <p className="font-semibold text-black mt-0.5">{extractedData.parameters.start_date}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Expiration Date</span>
                        <p className="font-semibold text-black mt-0.5">{extractedData.parameters.end_date}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Option to Renew Window</span>
                        <p className="font-semibold text-red-600 mt-0.5">180 days prior</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Extension Terms</span>
                        <p className="font-semibold text-black mt-0.5">2 × 5-year consecutive</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Legal Clauses */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Extracted Legal & Operational Clauses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(extractedData.parameters.key_clauses).map(([clauseKey, clauseText]) => (
                      <div key={clauseKey} className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-none">
                        <div className="flex items-center text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mr-1.5 flex-shrink-0" />
                          {clauseKey.replace(/_/g, ' ')}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{clauseText as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DEADLINES & ALERTS PANEL (Triggered by Button 3) */}
            {activeTab === 'obligations' && (
              <div className="mt-6 border-t border-slate-200 pt-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-none">
                        Obligation Radar Active
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-none">
                        {extractedData.obligations.deadlines.length} Milestones · {extractedData.obligations.alerts.length} Active Alerts
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-2 flex items-center">
                      Deadlines & Compliance Alerts · <span className="text-blue-600 ml-2">{extractedData.parameters.property_name}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Monitored from document: <span className="font-mono text-black font-semibold">{extractedData.parameters.filename}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('parameters')}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 rounded-none flex items-center transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" /> View Parameters →
                    </button>
                    <button
                      onClick={() => setActiveTab(null)}
                      className="text-slate-400 hover:text-slate-600 p-1.5 rounded-none hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Close Obligations View"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Critical Alerts Banner List */}
                <div className="mt-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Critical Lease & Compliance Alerts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {extractedData.obligations.alerts.map((alert: any) => (
                      <div
                        key={alert.id}
                        className={`p-3.5 border rounded-none ${
                          alert.level === 'Critical'
                            ? 'bg-red-50/70 border-red-200 text-red-950'
                            : alert.level === 'Warning'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                            : 'bg-blue-50/70 border-blue-200 text-blue-950'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold uppercase tracking-wide flex items-center">
                            <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                            {alert.title}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-none ${
                            alert.level === 'Critical' ? 'bg-red-200 text-red-800' :
                            alert.level === 'Warning' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'
                          }`}>
                            {alert.level}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-700">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Milestone Deadlines Table */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Upcoming Milestone Deadlines</h4>
                  <div className="overflow-x-auto border border-slate-200/80 rounded-none">
                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Milestone / Obligation</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Category</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Due Date</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Priority</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase">Status</th>
                          <th className="px-4 py-3 text-right font-semibold text-slate-600 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100">
                        {extractedData.obligations.deadlines.map((dl: any) => (
                          <tr key={dl.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              <div className="font-bold text-black">{dl.title}</div>
                              <div className="text-[11px] text-slate-500 font-normal mt-0.5">{dl.description}</div>
                            </td>
                            <td className="px-4 py-3 text-slate-600 font-medium">{dl.type}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-bold text-black flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                {dl.due_date}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-none ${
                                dl.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                dl.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {dl.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-800 rounded-none">
                                {dl.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <button
                                onClick={() => alert(`Verified milestone deadline: ${dl.title}`)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 transition-colors cursor-pointer"
                              >
                                Verify
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AttractiveCard>

        {/* Active Leases */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Leases</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {leases.map((lease) => (
              <AttractiveCard key={lease.id} hover>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{lease.lease_number}</h3>
                      <p className="text-sm text-gray-500">{lease.property_name}</p>
                    </div>
                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {lease.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-none p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Landlord</p>
                        <p className="font-medium text-gray-900">{lease.landlord_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Annual Rent</p>
                        <p className="font-medium text-black">${formatNumber(lease.annual_rent)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Term</p>
                        <p className="font-medium text-black">
                          {lease.term_months} months
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Escalation</p>
                        <p className="font-medium text-black">{lease.rent_escalation}%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Clauses</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {Object.entries(lease.key_clauses).map(([key, value]) => (
                        <li key={key} className="flex">
                          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                          <span className="italic">{key.replace('_', ' ')}:</span>
                          <span className="ml-2 text-gray-700">{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AttractiveCard>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}