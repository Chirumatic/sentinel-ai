import { useState, useEffect } from 'react'
import { getIncidents, getIncident } from './api/client'
import IncidentList from './components/IncidentList'
import IncidentDetail from './components/IncidentDetail'
import ChatAssistant from './components/ChatAssistant'
import { Shield, RefreshCw, MessageSquare, X } from 'lucide-react'

export default function App() {
  const [incidents, setIncidents] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedLogs, setSelectedLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [filter, setFilter] = useState('all')

  const fetchIncidents = async () => {
    setLoading(true)
    try {
      const res = await getIncidents()
      setIncidents(res.data.incidents)
    } catch (e) {
      console.error('Failed to fetch incidents', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (inc) => {
    setSelected(inc)
    try {
      const res = await getIncident(inc.id)
      setSelectedLogs(res.data.logs || [])
    } catch {
      setSelectedLogs([])
    }
  }

  useEffect(() => { fetchIncidents() }, [])

  const filtered = filter === 'all'
    ? incidents
    : incidents.filter(i => i.status === filter || i.severity === filter)

  const counts = {
    critical: incidents.filter(i => i.severity === 'critical').length,
    active: incidents.filter(i => i.status === 'active').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold leading-none">Sentinel AI</h1>
            <p className="text-xs text-gray-400">Incident Response Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
          <button
            onClick={fetchIncidents}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              showChat ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <MessageSquare size={14} />
            AI Chat
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-6 py-2 flex gap-6">
        {[
          { label: 'Critical', value: counts.critical, color: 'text-red-400' },
          { label: 'Active', value: counts.active, color: 'text-orange-400' },
          { label: 'Investigating', value: counts.investigating, color: 'text-yellow-400' },
          { label: 'Resolved', value: counts.resolved, color: 'text-green-400' },
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Incident List */}
        <div className="w-80 shrink-0 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Incidents</h2>
            <div className="flex gap-1 flex-wrap">
              {['all', 'active', 'investigating', 'resolved'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
            ) : (
              <IncidentList
                incidents={filtered}
                selectedId={selected?.id}
                onSelect={handleSelect}
              />
            )}
          </div>
        </div>

        {/* Incident Detail */}
        <div className="flex-1 overflow-y-auto p-6">
          {selected ? (
            <IncidentDetail incident={selected} logs={selectedLogs} />
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <Shield size={48} className="mx-auto mb-4 text-gray-700" />
                <p className="text-gray-500">Select an incident to investigate</p>
                <p className="text-gray-600 text-sm mt-1">Sentinel AI will analyze it automatically</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 shrink-0 border-l border-gray-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-300">AI Assistant</h2>
              <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatAssistant incidentContext={selected} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
