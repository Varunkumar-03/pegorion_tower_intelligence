import { useState } from 'react'
import Layout from '../../components/Layout'
import AttractiveCard from '../../components/AttractiveCard'
import { CheckCircle, Clock, AlertCircle, TrendingUp, Settings, Users, User, FileText, Calendar, X, Play, CheckCircle2 } from 'lucide-react'

const workflows = [
  { id: 'WF-001', name: 'Colocation Intake', status: 'Active', tasks: 12, completed: 8 },
  { id: 'WF-002', name: 'Lease Review', status: 'In Progress', tasks: 6, completed: 2 },
  { id: 'WF-003', name: 'Approval Workflow', status: 'Active', tasks: 4, completed: 4 },
]

const initialTasks = [
  {
    id: 'task-001',
    title: 'Process Lease Renewal',
    description: 'Dallas Site Alpha',
    status: 'In Progress',
    priority: 'High',
    due: '2024-06-25',
    assignee: 'Legal Team',
    notes: 'Renewal terms drafted. CPI escalations verified with TowerCo. Awaiting landlord countersignature.',
    checklist: ['Review master lease terms', 'Calculate CPI escalation', 'Send notice to landlord', 'Execute renewal addendum']
  },
  {
    id: 'task-002',
    title: 'Equipment Maintenance',
    description: 'Houston Tower',
    status: 'Pending',
    priority: 'Medium',
    due: '2024-06-20',
    assignee: 'Ops Team',
    notes: 'Scheduled semi-annual structural and electrical integrity check on Vertiv NetSure 7100 DC power plant.',
    checklist: ['Inspect antenna mounts', 'Test backup battery string', 'Inspect lightning arrestors', 'File maintenance log']
  },
  {
    id: 'task-003',
    title: 'Carrier Update Docs',
    description: 'Austin Hub 5G',
    status: 'Completed',
    priority: 'High',
    due: '2024-06-10',
    assignee: 'Network Team',
    notes: 'T-Mobile mmWave co-location addendum successfully verified and filed in system.',
    checklist: ['Verify co-lo drawings', 'Zoning safety inspection', 'Carrier sign-off', 'Upload executed permit']
  },
]

export default function OperationsPage() {
  const [tasksList, setTasksList] = useState(initialTasks)
  const [selectedTask, setSelectedTask] = useState<any | null>(null)

  const completed = tasksList.filter(t => t.status === 'Completed').length
  const inProgress = tasksList.filter(t => t.status === 'In Progress').length
  const pending = tasksList.filter(t => t.status === 'Pending').length

  const handleStartTask = (taskId: string) => {
    setTasksList(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Pending' ? 'In Progress' : 'Completed'
        const updated = { ...t, status: nextStatus }
        if (selectedTask?.id === taskId) setSelectedTask(updated)
        return updated
      }
      return t
    }))
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-amber-100 text-amber-800'
      case 'Pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-amber-100 text-amber-800'
      case 'Low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operations Center</h1>
          <p className="mt-2 text-gray-500">
            Track tasks, workflows, and operational deadlines across all verticals
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AttractiveCard title="Completed Tasks">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">{completed}</p>
              <p className="text-sm text-gray-500 mt-1">this month</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="In Progress">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">{inProgress}</p>
              <p className="text-sm text-gray-500 mt-1">active tasks</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Pending">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">{pending}</p>
              <p className="text-sm text-gray-500 mt-1">awaiting start</p>
            </div>
          </AttractiveCard>
          <AttractiveCard title="Active Workflows">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">{workflows.length}</p>
              <p className="text-sm text-gray-500 mt-1">running processes</p>
            </div>
          </AttractiveCard>
        </div>

        {/* Active Workflows */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Workflows</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <AttractiveCard key={workflow.id} title={workflow.name} hover>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Progress</span>
                    <span className="text-sm text-gray-500">
                      <span className="font-semibold text-black">{workflow.completed}</span>/<span className="font-semibold text-black">{workflow.tasks}</span> steps
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(workflow.completed / workflow.tasks) * 100}%` }}></div>
                  </div>
                  <div className="flex space-x-2">
                    {['Create', 'Review', 'Approve', 'Execute'].map((step, idx) => (
                      <div key={idx} className="flex-1 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-sm font-medium ${
                          idx < workflow.completed / workflow.tasks * 4
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <p className="text-xs mt-1 text-gray-600">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AttractiveCard>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tasks</h2>
          <div className="space-y-4">
            {tasksList.map((task) => (
              <AttractiveCard key={task.id} hover>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Due: {task.due}</span>
                    <User className="w-4 h-4 ml-4 mr-2 flex-shrink-0" />
                    <span className="text-gray-500">by {task.assignee}</span>
                  </div>

                  {task.status !== 'Completed' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStartTask(task.id)}
                        className={`px-3 py-1 text-sm text-white rounded-none transition-colors cursor-pointer flex items-center ${
                          task.status === 'In Progress' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {task.status === 'In Progress' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete Task
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 mr-1" /> Start Task
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  )}

                  {task.status === 'Completed' && (
                    <div>
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        View Task Summary →
                      </button>
                    </div>
                  )}
                </div>
              </AttractiveCard>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-none">
                  {selectedTask.id.toUpperCase()}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedTask.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{selectedTask.description}</p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-none hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-none text-xs">
                <div>
                  <span className="text-gray-500">Status</span>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-none font-medium ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Priority</span>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-none font-medium ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Due Date</span>
                  <p className="font-semibold text-gray-900 mt-1">{selectedTask.due}</p>
                </div>
                <div>
                  <span className="text-gray-500">Assignee</span>
                  <p className="font-semibold text-gray-900 mt-1">{selectedTask.assignee}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Task Execution Notes
                </h4>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-none border border-gray-100 leading-relaxed">
                  {selectedTask.notes}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Action Checklist
                </h4>
                <div className="space-y-1.5">
                  {selectedTask.checklist.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-none">
                      <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 ${
                        selectedTask.status === 'Completed' ? 'text-emerald-500' : 'text-gray-300'
                      }`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              {selectedTask.status !== 'Completed' ? (
                <button
                  type="button"
                  onClick={() => handleStartTask(selectedTask.id)}
                  className={`px-4 py-2 text-white rounded-none text-xs font-medium transition-colors cursor-pointer ${
                    selectedTask.status === 'In Progress' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {selectedTask.status === 'In Progress' ? 'Mark Task Completed' : 'Start Task Now'}
                </button>
              ) : (
                <span className="text-xs text-emerald-700 font-medium flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" /> All milestones verified
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none text-xs font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
