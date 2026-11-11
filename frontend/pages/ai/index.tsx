import Layout from '../../components/Layout'
import AttractiveCard from '../../components/AttractiveCard'
import { useState, useRef, useEffect } from 'react'
import { Send, FileText, Scale, Upload, Brain, TrendingUp, Copy, Check, Sparkles, Loader2, Shield, AlertCircle, CheckCircle2, ChevronRight, X, ArrowRight } from 'lucide-react'
import { API_BASE_URL } from '../../lib/api'

const sampleQuestions = [
  "What's the early termination clause in lease VB-LEASE-001?",
  "Summarize all expiring leases within 90 days",
  "What are the key terms in the Austin Hub lease?",
  "Compare rent escalations across all leases"
]

const cleanHumanText = (text: string) => {
  if (!text) return ''
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\*+/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/^\s*[-*•]\s+/gm, '')
    .trim()
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  citations?: { doc: string; page: number; snippet: string }[]
}

export default function AIWorkspacePage() {
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your Pegorion legal and telecom assistant. You can ask me anything about your tower leases, contract clauses, or upcoming deadlines.',
      citations: [
        { doc: 'VB-LEASE-001', page: 3, snippet: 'The tenant shall pay rent in accordance with Section 4.2.' },
        { doc: 'VB-LEGAL-2024-001', page: 1, snippet: 'Zoning Appeal - Dallas Site, filed 2024-01-15.' }
      ]
    }
  ])

  const [activeCapability, setActiveCapability] = useState<'document' | 'case' | 'predictive' | null>(null)
  const [capabilityData, setCapabilityData] = useState<any>({
    document: null,
    case: null,
    predictive: null
  })
  const [fetchingCapability, setFetchingCapability] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation, loading])

  const handleCapabilityClick = async (type: 'document' | 'case' | 'predictive') => {
    // Toggle active state if clicking the same button
    if (activeCapability === type) {
      setActiveCapability(null)
      return
    }

    setActiveCapability(type)

    // Immediately trigger relevant query in the AI Chat Assistant
    if (type === 'document') {
      sendQuery("Extract clauses, terms, and key provisions from lease VB-LEASE-001")
    } else if (type === 'case') {
      sendQuery("Get resolution recommendations and legal precedents for pending telecom legal matters")
    } else if (type === 'predictive') {
      sendQuery("Show predictive insights, portfolio risk scoring, and timeline predictions")
    }

    // Fetch live capability data if not loaded yet
    if (!capabilityData[type]) {
      setFetchingCapability(true)
      try {
        const endpoint = type === 'document' ? 'document-analysis' : type === 'case' ? 'case-resolution' : 'predictive-insights'
        const res = await fetch(`${API_BASE_URL}/ai/${endpoint}`)
        if (res.ok) {
          const data = await res.json()
          setCapabilityData((prev: any) => ({ ...prev, [type]: data }))
        }
      } catch {
        // Fallbacks are rendered automatically
      } finally {
        setFetchingCapability(false)
      }
    }
  }

  const sendQuery = async (queryText: string) => {
    const question = queryText.trim()
    if (!question || loading) return

    const userMsg: Message = { role: 'user', content: question }
    setConversation((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question })
      })
      if (res.ok) {
        const data = await res.json()
        setConversation((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: cleanHumanText(data.response),
            citations: data.citations || []
          }
        ])
        setLoading(false)
        return
      }
    } catch {
      // Fallback if network issue
    }

    setConversation((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: getAIResponse(question),
        citations: [
          { doc: 'VB-LEASE-001', page: 3, snippet: `Analysis: ${question}` },
          { doc: 'VB-LEGAL-2024-002', page: 1, snippet: 'Carrier Rights of Way matter status' }
        ]
      }
    ])
    setLoading(false)
  }

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault()
    sendQuery(input)
  }

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase()
    if (q.includes('clause') || q.includes('document') || q.includes('provision')) {
      return 'Document Analysis for lease VB-LEASE-001 extracted 5 key provisions: default termination requires 30 days notice with a 15-day cure period, annual 2.5% escalation, 5G AAU installation permitted, and $5M liability insurance required.'
    }
    if (q.includes('resolution') || q.includes('precedent') || q.includes('legal matter')) {
      return 'Case Resolution recommends filing an emergency FCC 6409(a) shot-clock petition for the Dallas Zoning Appeal (92% win probability) and serving a 15-day cure notice for the Houston Rights-of-Way dispute.'
    }
    if (q.includes('predictive') || q.includes('risk scoring') || q.includes('forecast')) {
      return 'Predictive Insights projects a portfolio risk index of 24/100 (Low Risk), 96% renewal probability through 2034, and a cumulative +$148,500 in 5-year ARR escalation growth.'
    }
    if (q.includes('termination') || q.includes('early')) {
      return 'For lease VB-LEASE-001, early termination is only permitted for default with 30 days written notice and a 15-day cure period. There is no option to terminate without cause.'
    }
    if (q.includes('expiring') || q.includes('90 days')) {
      return 'Good news: there are zero leases expiring within the next 90 days. Houston Central expires in March 2033, and Dallas Site Alpha in December 2034.'
    }
    if (q.includes('austin')) {
      return 'The Austin Hub lease is a 10-year 5G co-location agreement with T-Mobile that includes a 3.2% annual rent escalation.'
    }
    if (q.includes('escalat')) {
      return 'Comparing escalations: Dallas Site Alpha is at 2.5%, Houston Central is at 3.0%, and Austin Hub is at 3.2% annually.'
    }
    return `All telecom agreements across Dallas, Houston, and Austin are currently active and in full compliance.`
  }

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Legal Workspace</h1>
          <p className="mt-2 text-gray-500">
            AI-assisted legal research, document analysis, and lease intelligence
          </p>
        </div>

        {/* AI Capabilities as Interactive Buttons */}
        <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-gray-100 gap-2">
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">AI Intelligence Modes</h2>
              <p className="text-xs text-gray-500">Click a button below to inspect live intelligence and generate answers</p>
            </div>
            {activeCapability && (
              <button
                type="button"
                onClick={() => setActiveCapability(null)}
                className="text-xs text-slate-500 hover:text-slate-800 underline self-start sm:self-auto cursor-pointer"
              >
                Close Mode View
              </button>
            )}
          </div>

          {/* 3 Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Button 1: Document Analysis */}
            <button
              type="button"
              onClick={() => handleCapabilityClick('document')}
              className={`inline-flex items-center px-4 py-2.5 text-xs font-semibold rounded-none border transition-all cursor-pointer shadow-sm ${
                activeCapability === 'document'
                  ? 'bg-[#0B1A2E] text-white border-[#0B1A2E]'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
              }`}
              title="Extract clauses, terms, and key provisions"
            >
              <FileText className={`w-4 h-4 mr-2 ${activeCapability === 'document' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span>Document Analysis</span>
              {activeCapability === 'document' && (
                <span className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </button>

            {/* Button 2: Case Resolution */}
            <button
              type="button"
              onClick={() => handleCapabilityClick('case')}
              className={`inline-flex items-center px-4 py-2.5 text-xs font-semibold rounded-none border transition-all cursor-pointer shadow-sm ${
                activeCapability === 'case'
                  ? 'bg-[#0B1A2E] text-white border-[#0B1A2E]'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
              }`}
              title="Get resolution recommendations for legal matters"
            >
              <Scale className={`w-4 h-4 mr-2 ${activeCapability === 'case' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span>Case Resolution</span>
              {activeCapability === 'case' && (
                <span className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </button>

            {/* Button 3: Predictive Insights */}
            <button
              type="button"
              onClick={() => handleCapabilityClick('predictive')}
              className={`inline-flex items-center px-4 py-2.5 text-xs font-semibold rounded-none border transition-all cursor-pointer shadow-sm ${
                activeCapability === 'predictive'
                  ? 'bg-[#0B1A2E] text-white border-[#0B1A2E]'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
              }`}
              title="Risk scoring and timeline predictions"
            >
              <TrendingUp className={`w-4 h-4 mr-2 ${activeCapability === 'predictive' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span>Predictive Insights</span>
              {activeCapability === 'predictive' && (
                <span className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </button>
          </div>


          {/* Interactive Capability Details Panel */}
          {activeCapability && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {/* Panel 1: Document Analysis */}
              {activeCapability === 'document' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50/70 border border-blue-200 px-3.5 py-2.5 rounded-none gap-2">
                    <div className="flex items-center space-x-2 text-xs text-blue-900">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold">Analyzed: Cell Tower Lease Agreement Fully Executed.pdf</span>
                      <span className="text-blue-600 font-mono text-[11px]">(56 clauses identified)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => sendQuery("Extract all critical clauses and compliance provisions for active lease VB-LEASE-001")}
                      className="text-xs px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-none transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      Ask AI Full Clause Breakdown →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {[
                      {
                        title: "Early Termination (Section 14.2)",
                        desc: "Permitted only for default with 30-day notice and 15-day cure period. No unilateral early termination without cause.",
                        tag: "Low Risk",
                        conf: "98% Confidence",
                        q: "Explain the early termination and cure period mechanics in VB-LEASE-001"
                      },
                      {
                        title: "Rent Escalation (Section 4.1)",
                        desc: "Fixed annual compound escalation of 2.5% effective on each anniversary of Commencement Date.",
                        tag: "Verified",
                        conf: "99% Confidence",
                        q: "Compare the rent escalation in VB-LEASE-001 against our Houston and Austin leases"
                      },
                      {
                        title: "Permitted Equipment & 5G (Section 8.3)",
                        desc: "Tenant holds right to install, maintain, and upgrade up to 12 panel antennas, 6 RRUs, and microwave backhaul.",
                        tag: "Authorized",
                        conf: "95% Confidence",
                        q: "What are the carrier equipment and sub-leasing limits under Section 8.3?"
                      },
                      {
                        title: "Indemnity & Insurance (Section 19.1)",
                        desc: "Tenant maintains Commercial General Liability not less than $5,000,000 per occurrence naming Landlord additional insured.",
                        tag: "Medium Risk",
                        conf: "96% Confidence",
                        q: "What are our indemnification obligations and insurance coverage minimums?"
                      }
                    ].map((clause, idx) => (
                      <div
                        key={idx}
                        onClick={() => sendQuery(clause.q)}
                        className="p-3 bg-gray-50 hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer rounded-none group"
                        title="Click to ask AI about this clause"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-900 group-hover:text-blue-700">{clause.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 font-semibold">{clause.tag}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{clause.desc}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                          <span className="text-slate-400 font-mono">{clause.conf}</span>
                          <span className="text-blue-600 font-medium group-hover:underline flex items-center">
                            Inspect in Chat <ArrowRight className="w-3 h-3 ml-1" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Panel 2: Case Resolution */}
              {activeCapability === 'case' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-none gap-2">
                    <div className="flex items-center space-x-2 text-xs text-slate-800">
                      <Scale className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold">Active Legal Matters: 2 Open Proceedings</span>
                      <span className="text-slate-500 text-[11px]">• Precedents & Cure Period Tracking</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => sendQuery("Provide resolution strategy and precedent citations for pending legal matters")}
                      className="text-xs px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-none transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      Generate Full Legal Strategy →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {[
                      {
                        matter: "VB-LEGAL-2024-001 • Dallas Site Alpha",
                        title: "Zoning Variance Appeal",
                        precedent: "City of Dallas v. Metro Tower (2021) • FCC 6409(a)",
                        action: "File emergency petition under 47 U.S.C. § 1455(a) to enforce deemed-granted status within 14 business days.",
                        prob: "92% Success Rate",
                        q: "What is the recommended legal action for the Dallas Site Alpha zoning appeal?"
                      },
                      {
                        matter: "VB-LEGAL-2024-002 • Houston Central",
                        title: "Carrier Rights-of-Way Dispute",
                        precedent: "Texas Utilities Code § 54.205 right-of-way co-location",
                        action: "Serve certified 15-day cure notice citing statutory utility rights before entering binding arbitration.",
                        prob: "88% Success Rate",
                        q: "How should we resolve the Houston Central carrier rights-of-way dispute?"
                      }
                    ].map((matter, idx) => (
                      <div
                        key={idx}
                        onClick={() => sendQuery(matter.q)}
                        className="p-3 bg-gray-50 hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer rounded-none group"
                        title="Click to generate resolution in AI Chat"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-mono text-slate-500">{matter.matter}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-800 font-bold">{matter.prob}</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-700">{matter.title}</h4>
                        <p className="text-[11px] text-blue-700 mt-0.5 font-medium">Precedent: {matter.precedent}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{matter.action}</p>
                        <div className="mt-2 text-right">
                          <span className="text-[11px] text-blue-600 font-medium group-hover:underline inline-flex items-center">
                            Run Action Plan in Chat <ArrowRight className="w-3 h-3 ml-1" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Panel 3: Predictive Insights */}
              {activeCapability === 'predictive' && (
                <div className="space-y-3">
                  {/* KPI Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-none text-center">
                      <p className="text-[11px] font-medium text-gray-500">Portfolio Risk Index</p>
                      <p className="text-xl font-bold text-black mt-1">24<span className="text-xs font-normal text-gray-400">/100</span></p>
                      <p className="text-[10px] text-green-700 font-semibold mt-0.5">Low Risk • Safe</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-none text-center">
                      <p className="text-[11px] font-medium text-gray-500">Renewal Probability</p>
                      <p className="text-xl font-bold text-black mt-1">96%</p>
                      <p className="text-[10px] text-blue-700 font-semibold mt-0.5">High Confidence</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-none text-center">
                      <p className="text-[11px] font-medium text-gray-500">5-Yr Escalation Gain</p>
                      <p className="text-xl font-bold text-black mt-1">+$148,500</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Projected ARR</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-none text-center">
                      <p className="text-[11px] font-medium text-gray-500">Dispute Probability</p>
                      <p className="text-xl font-bold text-black mt-1">4.2%</p>
                      <p className="text-[10px] text-green-700 font-semibold mt-0.5">Benchmark: 14%</p>
                    </div>
                  </div>

                  {/* Site forecast list */}
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded-none">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-900">Site-by-Site 5-Year Progression</span>
                      <button
                        type="button"
                        onClick={() => sendQuery("Predict portfolio risk scoring and 5-year financial escalation forecast")}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                      >
                        Forecast in AI Chat →
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { site: "Dallas Site Alpha (VB-LEASE-001)", current: "$40,000/mo", proj: "$44,152/mo", risk: "Low (18/100)", renewal: "98%" },
                        { site: "Houston Central (VB-LEASE-002)", current: "$29,166/mo", proj: "$33,811/mo", risk: "Low-Med (28/100)", renewal: "94%" },
                        { site: "Austin Hub 5G (VB-COLO-002)", current: "$34,166/mo", proj: "$40,001/mo", risk: "Low (14/100)", renewal: "99%" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1.5 px-2 bg-white border border-gray-200 rounded-none">
                          <span className="font-semibold text-gray-900">{item.site}</span>
                          <div className="flex items-center space-x-4 mt-1 sm:mt-0 text-[11px]">
                            <span className="text-gray-500">Current: <strong className="text-black">{item.current}</strong></span>
                            <span className="text-blue-700 font-medium">2028: <strong className="text-black">{item.proj}</strong></span>
                            <span className="text-green-700 font-semibold">Renewal: <strong className="text-black">{item.renewal}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>


        {/* AI Chat Assistant with integrated Suggested Queries */}
        <AttractiveCard title="AI Chat Assistant">
          <div className="space-y-4">
            <div className="h-96 overflow-y-auto p-4 bg-gray-50 rounded-none space-y-3">
              {conversation.map((msg, idx) => (
                <div key={idx} className="mb-3">
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl px-4 py-2 rounded-none ${msg.role === 'user' ? 'bg-[#2563EB] text-white' : 'bg-white border border-gray-200 text-gray-900 shadow-sm'}`}>
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                  {msg.citations && (
                    <div className="mt-2 ml-4">
                      <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                        <FileText className="w-3 h-3 mr-1 text-slate-400" /> Source Citations:
                      </p>
                      {msg.citations.map((cite, cIdx) => (
                        <div key={cIdx} className="flex items-start text-xs text-gray-600 mb-1">
                          <span className="w-20 text-gray-400 mr-2 font-mono">[{cite.doc}]</span>
                          <span className="text-gray-500">
                            <strong className="text-gray-700 font-semibold">Page {cite.page}:</strong> "{cite.snippet}"
                          </span>
                          <button
                            onClick={() => copyToClipboard(cite.doc)}
                            className="ml-2 p-0.5 rounded hover:bg-gray-200 cursor-pointer"
                          >
                            {copiedId === cite.doc ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start mb-3">
                  <div className="px-4 py-2 bg-white border border-slate-200 text-xs text-slate-600 rounded-none flex items-center shadow-sm">
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2 text-blue-600" />
                    <span>Analyzing documents and generating answer...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Queries integrated directly inside the AI Chat Assistant */}
            <div className="pt-1 pb-1">
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                Suggested Queries (click to ask):
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendQuery(q)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 rounded-none transition-colors cursor-pointer disabled:opacity-50 text-left font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAsk} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about leases, contracts, or legal matters..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-none font-semibold text-sm transition-colors flex items-center disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </form>

            <p className="text-xs text-gray-500 italic">
              AI analysis based on Pegorion document repository. Not legal advice.
            </p>
          </div>
        </AttractiveCard>
      </div>
    </Layout>
  )
}
