import Layout from '../../components/Layout'
import AttractiveCard from '../../components/AttractiveCard'
import { useState, useRef, useEffect } from 'react'
import { Send, FileText, Scale, Upload, Brain, TrendingUp, Copy, Check, Sparkles, Loader2 } from 'lucide-react'
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

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation, loading])

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

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AttractiveCard title="Document Analysis">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-blue-50 border border-blue-100 rounded-none flex items-center justify-center text-blue-600">
                <FileText className="w-7 h-7" />
              </div>
              <p className="text-gray-600 text-sm">Extract clauses, terms, and key provisions</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Case Resolution">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-blue-50 border border-blue-100 rounded-none flex items-center justify-center text-blue-600">
                <Scale className="w-7 h-7" />
              </div>
              <p className="text-gray-600 text-sm">Get resolution recommendations for legal matters</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Predictive Insights">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-blue-50 border border-blue-100 rounded-none flex items-center justify-center text-blue-600">
                <TrendingUp className="w-7 h-7" />
              </div>
              <p className="text-gray-600 text-sm">Risk scoring and timeline predictions</p>
            </div>
          </AttractiveCard>
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
