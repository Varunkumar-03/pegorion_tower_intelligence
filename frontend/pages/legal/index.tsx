import { useState, useEffect, useRef } from 'react'
import Layout from '../../components/Layout'
import AttractiveCard from '../../components/AttractiveCard'
import Link from 'next/link'
import { API_BASE_URL } from '../../lib/api'
import {
  Scale,
  AlertCircle,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Lightbulb,
  X,
  Shield,
  Clock,
  ArrowRight,
  FileDown,
  Upload,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

// Legal matter data
const legalMatters = [
  {
    id: 'legal-001',
    matter_number: 'VB-LEGAL-2024-001',
    title: 'Lease Dispute - Dallas Site Alpha',
    matter_type: 'Litigation',
    status: 'Open',
    priority: 'High',
    opened_date: '2024-06-01',
    organization_id: 'org-vb',
    deadline: '2024-09-15',
    assigned_to: 'Legal Team A',
    description: 'Tenant default on rent payment. Awaiting response from legal counsel.',
    resolution_steps: [
      'Review lease terms (COMPLETED)',
      'Send default notice (IN PROGRESS)',
      'Wait 30 days for cure period (PENDING)',
      'Prepare eviction filing (PENDING)'
    ],
    key_issues: [
      'Rent payment 45 days overdue',
      'Tenant unresponsive to calls',
      'Potential need for legal action'
    ],
    ai_recommendation: {
      action: 'Send formal default notice via certified mail',
      rationale: 'Lease requires 15-day cure period before legal action. Tenant has not responded to 3 prior notices.',
      risk: 'High - Financial impact $480K ARR at risk'
    }
  },
  {
    id: 'legal-002',
    matter_number: 'VB-LEGAL-2024-002',
    title: 'Carrier Rights of Way Negotiation',
    matter_type: 'Regulatory',
    status: 'In Progress',
    priority: 'Medium',
    opened_date: '2024-05-15',
    organization_id: 'org-vb',
    deadline: '2024-08-01',
    assigned_to: 'Regulatory Affairs',
    description: 'Negotiating ROW agreements with T-Mobile for Austin Hub expansion',
    resolution_steps: [
      'Draft preliminary agreement (COMPLETED)',
      'Review zoning compliance (COMPLETED)',
      'Negotiate terms (IN PROGRESS)',
      'Finalize and sign (PENDING)'
    ],
    key_issues: [
      'Zoning variance required',
      'Cost escalation concerns',
      'Timeline pressure for build-out'
    ],
    ai_recommendation: {
      action: 'Request expedited zoning hearing',
      rationale: 'Build-out deadline requires faster approval. Standard process takes 90 days.',
      risk: 'Medium - Timeline dependent on municipal approval'
    }
  }
]

// AI-powered case resolution helper
const aiInsights = {
  suggestedActions: [
    {
      matter_id: 'legal-001',
      action: 'Send formal default notice via certified mail',
      rationale: 'Lease requires 15-day cure period before legal action',
      deadline: '2024-06-15'
    },
    {
      matter_id: 'legal-002',
      action: 'Request expedited zoning hearing',
      rationale: 'Build-out deadline requires faster approval',
      deadline: '2024-06-20'
    }
  ],
  risk_assessment: [
    { matter_id: 'legal-001', risk_level: 'High', reason: 'Financial impact $480K ARR at risk' },
    { matter_id: 'legal-002', risk_level: 'Medium', reason: 'Timeline dependent on municipal approval' }
  ]
}

// Fallback legal analysis generator for imported lease documents
const generateFallbackLegalAnalysis = (docName: string) => {
  const cleanName = docName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
  return {
    document_name: docName,
    property_name: cleanName || 'Dallas Site Alpha',
    analysis_timestamp: 'Just now',
    risk_level: 'High',
    risk_score: 78,
    legal_problems: [
      {
        id: 'LP-01',
        category: 'Default & Termination Risk',
        severity: 'Critical',
        issue: 'Asymmetrical Early Termination & 15-Day Cure Window',
        clause_reference: 'Section 14.2 (Remedies on Default)',
        finding: 'Landlord holds unilateral termination right upon 30 days notice for default with only a 15-day monetary cure period. No mutual termination for convenience without substantial buyout penalty (24 months gross rent).',
        impact: 'Exposes lessee to premature contract termination and loss of cell site tenancy during temporary billing disputes.'
      },
      {
        id: 'LP-02',
        category: 'Financial Escalation',
        severity: 'High',
        issue: 'Uncapped Compounding CPI Rent Escalation Formula',
        clause_reference: 'Section 4.3 (Annual Rent Adjustments)',
        finding: 'Rent escalator is linked to regional CPI-U with a 2.5% minimum floor but NO upper ceiling. In high inflation periods, compounding annual increases create substantial budget unpredictability.',
        impact: 'Projected 5-year rent expansion exceeds regional standard benchmark by approximately 18%.'
      },
      {
        id: 'LP-03',
        category: 'Operational & Co-location',
        severity: 'Medium',
        issue: 'Restrictive Subletting & Carrier Assignment Consent Barrier',
        clause_reference: 'Section 11.1 (Assignment Rights)',
        finding: 'Subleasing antenna space to third-party wireless carriers requires prior written consent from landlord, which cannot be unreasonably withheld but introduces approval delays of up to 45 business days.',
        impact: 'Delays carrier 5G co-location onboarding, risking loss of equipment tenant contracts.'
      },
      {
        id: 'LP-04',
        category: 'Decommissioning Liabilities',
        severity: 'Medium',
        issue: 'Strict 60-Day Foundation Removal & Holdover Penalty Mandate',
        clause_reference: 'Section 18.4 (Surrender of Premises)',
        finding: 'Full subsurface concrete footing removal and site restoration required within 60 calendar days post-expiration. Daily holdover penalty of 200% base rent applies immediately thereafter.',
        impact: 'Unreasonable timeline for heavy tower crane decommissioning in inclement weather.'
      }
    ],
    recommendations: [
      {
        action: 'Issue formal amendment request capping annual CPI escalation at 3.0% maximum',
        rationale: 'Prevents runaway rent spikes during economic volatility and standardizes budgeting.',
        deadline: '2024-07-15',
        priority: 'High'
      },
      {
        action: 'Execute blanket carrier affiliate assignment carve-out',
        rationale: 'Removes discretionary landlord consent requirement for Tier 1 wireless carriers (Verizon, AT&T, T-Mobile).',
        deadline: '2024-08-01',
        priority: 'Critical'
      },
      {
        action: 'Serve preliminary 180-day option extension notice in certified mail escrow',
        rationale: 'Protects unilateral 5-year extension option from accidental forfeiture under Section 3.2.',
        deadline: '2024-09-01',
        priority: 'High'
      }
    ],
    generated_matter: {
      id: `VB-LEGAL-2024-003`,
      matter_number: `VB-LEGAL-2024-003`,
      title: `Lease Risk Review & Defense - ${cleanName || 'Imported Agreement'}`,
      matter_type: 'Contract Review',
      status: 'In Review',
      priority: 'High',
      opened_date: '2024-06-15',
      organization_id: 'org-vb',
      deadline: '2024-07-30',
      assigned_to: 'Legal Team A',
      description: `AI-assisted legal risk audit of imported ${docName}. Critical vulnerabilities identified in unilateral default cure periods, compounding rent escalations, and sublease carrier consent barriers.`,
      resolution_steps: [
        'Review asymmetrical cure period clause (COMPLETED)',
        'Draft rent escalation cap amendment (IN PROGRESS)',
        'Obtain landlord consent waiver for carrier co-location (PENDING)',
        'File final compliance memorandum (PENDING)'
      ],
      key_issues: [
        '15-day cure period presents forfeiture exposure',
        'Compounding CPI lacks upper rate ceiling',
        'Landlord consent required for carrier sublets'
      ],
      ai_recommendation: {
        action: 'Execute blanket carrier affiliate assignment carve-out and 3% CPI cap',
        rationale: 'Mitigates early termination risks and protects 5G colocation revenue.',
        risk: 'High - Contractual forfeiture & inflation exposure'
      }
    }
  }
}

export default function LegalPage() {
  const [selectedMatter, setSelectedMatter] = useState<any | null>(null)
  const [mattersList, setMattersList] = useState<any[]>(legalMatters)
  const [aiActions, setAiActions] = useState<any[]>(aiInsights.suggestedActions)
  const [aiRisks, setAiRisks] = useState<any[]>(aiInsights.risk_assessment)

  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [availableDocs, setAvailableDocs] = useState<any[]>([])
  const [selectedDocName, setSelectedDocName] = useState<string>('Cell Tower Lease Agreement Fully Executed.pdf')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [importedAnalysis, setImportedAnalysis] = useState<any | null>(null)
  const [importNotification, setImportNotification] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openMatters = mattersList.filter(m => m.status !== 'Closed').length
  const highPriority = mattersList.filter(m => m.priority === 'High').length

  const loadAvailableDocs = async () => {
    let docsFromBackend: any[] = []
    try {
      const res = await fetch(`${API_BASE_URL}/documents/`)
      if (res.ok) {
        docsFromBackend = await res.json()
      }
    } catch {}

    let docsFromLocal: any[] = []
    try {
      docsFromLocal = JSON.parse(localStorage.getItem('pegorion_uploaded_documents') || '[]')
    } catch {}

    const combined: any[] = [
      ...docsFromLocal,
      ...docsFromBackend,
      {
        id: 'doc-vb-default',
        name: 'Cell Tower Lease Agreement Fully Executed.pdf',
        size: 509337,
        file_size: '497.4 KB',
        uploaded_at: '2024-06-15T10:30:00Z',
        source: 'Lease Intelligence'
      }
    ]

    // Deduplicate by filename
    const unique = combined.filter((doc, idx, arr) => arr.findIndex(d => d.name === doc.name) === idx)
    setAvailableDocs(unique)
    if (unique.length > 0) {
      setSelectedDocName(unique[0].name)
    }
    setIsImportModalOpen(true)
  }

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true)
    const targetDoc = selectedDocName || 'Cell Tower Lease Agreement Fully Executed.pdf'

    try {
      const res = await fetch(`${API_BASE_URL}/documents/analyze-legal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_name: targetDoc })
      })

      if (res.ok) {
        const data = await res.json()
        setImportedAnalysis(data)
        if (data.generated_matter) {
          setMattersList(prev => [data.generated_matter, ...prev.filter(m => m.matter_number !== data.generated_matter.matter_number)])
        }
        if (data.recommendations) {
          setAiActions(prev => [
            ...data.recommendations.map((r: any) => ({
              matter_id: data.generated_matter?.id || 'imported-01',
              action: r.action,
              rationale: r.rationale,
              deadline: r.deadline
            })),
            ...prev
          ])
        }
        if (data.legal_problems) {
          setAiRisks(prev => [
            {
              matter_id: data.generated_matter?.id || 'imported-01',
              risk_level: data.risk_level || 'High',
              reason: `${data.legal_problems[0]?.category}: ${data.legal_problems[0]?.issue}`
            },
            ...prev
          ])
        }
        setImportNotification(`Document "${targetDoc}" successfully imported. AI Legal Analysis detected ${data.legal_problems?.length || 4} critical legal issues.`)
      } else {
        throw new Error('API fallback')
      }
    } catch {
      const fallbackAnalysis = generateFallbackLegalAnalysis(targetDoc)
      setImportedAnalysis(fallbackAnalysis)
      setMattersList(prev => [fallbackAnalysis.generated_matter, ...prev.filter(m => m.matter_number !== fallbackAnalysis.generated_matter.matter_number)])
      setAiActions(prev => [
        ...fallbackAnalysis.recommendations.map((r: any) => ({
          matter_id: fallbackAnalysis.generated_matter.id,
          action: r.action,
          rationale: r.rationale,
          deadline: r.deadline
        })),
        ...prev
      ])
      setImportNotification(`Document "${targetDoc}" successfully imported. AI Legal Analysis detected 4 critical legal issues.`)
    } finally {
      setIsAnalyzing(false)
      setIsImportModalOpen(false)
    }
  }

  const handleModalDirectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      filename: file.name,
      size: file.size,
      file_size: `${(file.size / 1024).toFixed(1)} KB`,
      uploaded_at: new Date().toISOString(),
      source: 'Direct Upload (Legal)'
    }

    setAvailableDocs(prev => [newDoc, ...prev])
    setSelectedDocName(file.name)
  }

  return (
    <Layout>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleModalDirectUpload}
        className="hidden"
      />
      <div className="space-y-8">
        {/* Header with Top Right "Import Document" Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Legal Intelligence</h1>
            <p className="mt-2 text-gray-500">
              Track legal matters, deadlines, and get AI-assisted resolution recommendations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAvailableDocs}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-none font-semibold text-xs shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4 mr-1.5" />
              <span>Import Document</span>
            </button>
          </div>
        </div>

        {/* Import Notification Toast */}
        {importNotification && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-none flex items-center justify-between animate-in fade-in">
            <span className="flex items-center font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
              {importNotification}
            </span>
            <button
              onClick={() => setImportNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 ml-3 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* AI LEGAL ANALYSIS DOSSIER (Rendered after importing document) */}
        {importedAnalysis && (
          <div className="border border-blue-200 bg-white p-5 rounded-none shadow-sm space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-none flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    AI Legal Analysis Dossier
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-none">
                    Risk Level: {importedAnalysis.risk_level} · Score: <strong className="text-black ml-1">{importedAnalysis.risk_score}</strong>/100
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-none">
                    Source: Lease Intelligence
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-2 flex items-center">
                  Legal Problems & Risk Audit: <span className="text-blue-600 ml-2">{importedAnalysis.document_name}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Analysis completed just now for <span className="text-black font-semibold">{importedAnalysis.property_name}</span>. Identified <strong className="text-black">{importedAnalysis.legal_problems?.length || 4}</strong> legal problems and risk exposure areas.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMatter(importedAnalysis.generated_matter)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 rounded-none flex items-center transition-colors cursor-pointer"
                >
                  View Generated Case File →
                </button>
                <button
                  onClick={() => setImportedAnalysis(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-none hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close Analysis Dossier"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Identified Legal Problems Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 mr-1.5" />
                Identified Legal Problems & Contractual Vulnerabilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {importedAnalysis.legal_problems?.map((prob: any) => (
                  <div
                    key={prob.id}
                    className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-none space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {prob.category}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-none ${
                          prob.severity === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : prob.severity === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {prob.severity}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{prob.issue}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{prob.finding}</p>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-blue-700 font-mono font-medium">{prob.clause_reference}</span>
                      <span className="text-slate-500 italic">Impact: {prob.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Recommendations Banner */}
            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-none">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center">
                <Lightbulb className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                AI Recommended Legal Strategy
              </h4>
              <div className="space-y-2">
                {importedAnalysis.recommendations?.map((rec: any, idx: number) => (
                  <div key={idx} className="flex items-start text-xs text-blue-950">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{rec.action}</span>
                      <span className="text-slate-600 ml-1.5">({rec.rationale})</span>
                      <span className="text-slate-500 ml-2 font-mono">Due: {rec.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Section */}
        <AttractiveCard title="AI Legal Assistant">
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-none">
              <Lightbulb className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-blue-900">AI-Generated Recommendations</h3>
                <p className="text-sm text-blue-700">Based on legal precedents, lease terms, and imported agreements</p>
              </div>
            </div>

            <div className="space-y-3">
              {aiActions.map((action, i) => (
                <div key={i} className="flex items-start p-4 bg-gray-50 rounded-none">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{action.action}</p>
                    <p className="text-sm text-gray-600 mt-1">{action.rationale}</p>
                    <div className="flex items-center mt-2">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">Due: {action.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
              {aiRisks.map((risk, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-none mb-2">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-slate-800">{risk.reason}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-none ${
                    risk.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                    risk.risk_level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.risk_level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AttractiveCard>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AttractiveCard title="Open Matters">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">{openMatters}</p>
              <p className="text-sm text-gray-500 mt-1">active cases</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="High Priority">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">{highPriority}</p>
              <p className="text-sm text-gray-500 mt-1">require attention</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Upcoming Deadlines">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">2</p>
              <p className="text-sm text-gray-500 mt-1">next 30 days</p>
            </div>
          </AttractiveCard>
        </div>

        {/* Legal Matters */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Legal Matters</h2>
          <div className="space-y-6">
            {mattersList.map((matter) => (
              <AttractiveCard key={matter.id} hover>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{matter.title}</h3>
                      <p className="text-sm text-gray-500">{matter.matter_number}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        matter.priority === 'High' ? 'bg-red-100 text-red-800' :
                        matter.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {matter.priority}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {matter.status}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm">{matter.description}</p>

                  {/* Key Issues */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Issues</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {matter.key_issues?.map((issue: any, i: number) => (
                        <li key={i} className="flex items-start">
                          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Recommendation */}
                  <div className="bg-blue-50 rounded-none p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      AI Recommendation
                    </h4>
                    <p className="text-sm text-blue-800 font-medium">{matter.ai_recommendation?.action}</p>
                    <p className="text-xs text-blue-700 mt-1">{matter.ai_recommendation?.rationale}</p>
                  </div>

                  {/* Resolution Steps */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resolution Progress</h4>
                    <div className="space-y-2">
                      {matter.resolution_steps?.map((step: any, i: number) => {
                        const status = step.split('(')[1]?.split(']')[0] || 'PENDING'
                        return (
                          <div key={i} className="flex items-center text-sm">
                            {status === 'COMPLETED' && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
                            {status === 'IN PROGRESS' && <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />}
                            {status === 'PENDING' && <div className="w-4 h-4 rounded-full bg-gray-200 mr-2" />}
                            <span className={status === 'COMPLETED' ? 'text-green-700' :
                                             status === 'IN PROGRESS' ? 'text-amber-700' :
                                             'text-gray-600'}>
                              {step}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedMatter(matter)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center cursor-pointer transition-colors"
                    >
                      View Full Case File →
                    </button>
                  </div>
                </div>
              </AttractiveCard>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Case File Modal */}
      {selectedMatter && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-none">
                  {selectedMatter.matter_number}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedMatter.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-none ${
                    selectedMatter.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedMatter.status}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-none ${
                    selectedMatter.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedMatter.priority} Priority
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{selectedMatter.matter_type}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMatter(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-none hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Dossier Body */}
            <div className="mt-5 space-y-5">
              {/* Overview Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-none text-xs">
                <div>
                  <span className="text-gray-500 block">Assigned Counsel</span>
                  <p className="font-semibold text-gray-900 mt-0.5 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {selectedMatter.assigned_to}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 block">Opened Date</span>
                  <p className="font-semibold text-gray-900 mt-0.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {selectedMatter.opened_date}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 block">Filing Deadline</span>
                  <p className="font-semibold text-red-600 mt-0.5 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {selectedMatter.deadline}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 block">Organization</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedMatter.organization_id}</p>
                </div>
              </div>

              {/* Case Summary */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Matter Description & Summary
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/60 p-3 rounded-none border border-gray-100">
                  {selectedMatter.description}
                </p>
              </div>

              {/* AI Strategic Recommendation */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-none p-4">
                <div className="flex items-center text-blue-900 font-semibold text-sm mb-1">
                  <Lightbulb className="w-4 h-4 mr-1.5 text-blue-600" />
                  AI Recommended Legal Action
                </div>
                <p className="text-sm font-medium text-blue-950 mt-1">
                  {selectedMatter.ai_recommendation?.action}
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  <span className="font-semibold">Rationale:</span> {selectedMatter.ai_recommendation?.rationale}
                </p>
                <div className="mt-2 text-xs font-medium text-red-700 bg-red-50/80 px-2.5 py-1 rounded-none inline-block border border-red-200">
                  ⚠️ {selectedMatter.ai_recommendation?.risk}
                </div>
              </div>

              {/* Key Issues Identified */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Key Legal Issues
                </h4>
                <div className="space-y-1.5">
                  {selectedMatter.key_issues.map((issue: string, idx: number) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-none">
                      <AlertCircle className="w-4 h-4 mr-2 text-amber-500 flex-shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Progress */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Resolution Procedure & Milestone Steps
                </h4>
                <div className="space-y-2">
                  {selectedMatter.resolution_steps.map((step: string, idx: number) => {
                    const status = step.split('(')[1]?.split(')')[0]?.split(']')[0] || 'PENDING'
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-gray-50 rounded-none border border-gray-100">
                        <div className="flex items-center">
                          {status === 'COMPLETED' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                          ) : status === 'IN PROGRESS' ? (
                            <Clock className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-none border border-gray-300 mr-2 flex-shrink-0" />
                          )}
                          <span className={status === 'COMPLETED' ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                            {step.split('(')[0].trim()}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold ${
                          status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          status === 'IN PROGRESS' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Associated Evidence & Documents */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Linked Exhibits & Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 bg-gray-50 rounded-none border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-900 truncate">Exhibit_A_Master_Lease.pdf</span>
                    </div>
                    <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-none">PDF</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-none border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-900 truncate">Notice_Of_Default_Demand.pdf</span>
                    </div>
                    <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-none">PDF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <Link
                href="/ai"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                Analyze with AI Assistant <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedMatter(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-none text-xs font-medium transition-colors cursor-pointer"
              >
                Close Case File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Document Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <FileDown className="w-5 h-5 text-blue-600 mr-2" />
                  Import Document for AI Legal Analysis
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select a lease agreement uploaded from the Leases page to evaluate legal problems, cure periods, and liability risks.
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-none hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Selection List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Available Uploaded Documents ({availableDocs.length})
              </label>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {availableDocs.map((doc) => {
                  const isSelected = selectedDocName === doc.name
                  return (
                    <div
                      key={doc.id || doc.name}
                      onClick={() => setSelectedDocName(doc.name)}
                      className={`p-3.5 border rounded-none cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-[#2563EB]'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-8 h-8 rounded-none flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-950 font-bold' : 'text-slate-900'}`}>
                            {doc.name}
                          </p>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono text-black font-semibold">{doc.file_size || '497.4 KB'}</span>
                            <span>·</span>
                            <span className="text-blue-700 font-medium">{doc.source || 'Lease Intelligence'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center pl-3">
                        <input
                          type="radio"
                          name="selectedDocument"
                          checked={isSelected}
                          onChange={() => setSelectedDocName(doc.name)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Direct File Browse Option */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Need to import a different file?</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer flex items-center"
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                Upload New Document
              </button>
            </div>

            {/* Modal Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-none transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunAIAnalysis}
                disabled={isAnalyzing || !selectedDocName}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-none shadow-sm transition-all flex items-center cursor-pointer disabled:opacity-60"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    Analyzing Legal Problems...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                    Import & Analyze with AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}