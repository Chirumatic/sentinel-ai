import { useState, useEffect, useCallback } from 'react'
import { getIncidents, getIncident } from './api/client'
import IncidentList from './components/IncidentList'
import IncidentDetail from './components/IncidentDetail'
import ChatAssistant from './components/ChatAssistant'
import { SeverityPieChart, StatusBarChart, SourceBarChart } from './components/Charts'
import Heatmap from './components/Heatmap'
import SearchFilter from './components/SearchFilter'
import { useTheme } from './hooks/useTheme'
import AuditLog from './components/AuditLog'
import AlertToast from './components/AlertToast'
import { useAutoRefresh } from './hooks/useAutoRefresh'
import { useNotifications } from './hooks/useNotifications'
import { Shield, RefreshCw, MessageSquare, X, LayoutDashboard, BarChart2, Mic, ClipboardList, ArrowLeft, Plus, Sun, Moon } from 'lucide-react'
import VoiceAssistant from './components/VoiceAssistant'
import CreateIncident from './components/CreateIncident'

export default function App() {
  const [incidents, setIncidents] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedLogs, setSelectedLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showVoice, setShowVoice] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('incidents')
  const [toastAlerts, setToastAlerts] = useState([])
  const { theme, toggle: toggleTheme } = useTheme()
  // Mobile: 'list' | 'detail' | 'charts' | 'audit' | 'chat'
  const [mobilePanel, setMobilePanel] = useState('list')

  const { notify } = useNotifications()

  const fetchFn = useCallback(async () => {
    const res = await getIncidents()
    return res.data.incidents
  }, [])

  const handleNewIncidents = useCallback((newItems) => {
    setIncidents(prev => {
      const existingIds = new Set(prev.map(i => i.id))
      const truly_new = newItems.filter(i => !existingIds.has(i.id))
      if (!truly_new.length) return prev
      truly_new.forEach(inc => {
        notify(inc.title, inc.description, inc.severity)
        const toastId = inc.id + Date.now()
        setToastAlerts(t => [...t, { ...inc, _toastId: toastId }])
        setTimeout(() => setToastAlerts(t => t.filter(a => a._toastId !== toastId)), 6000)
      })
      return [...truly_new, ...prev]
    })
  }, [notify])

  useAutoRefresh({ fetchFn, interval: 30000, onNewItems: handleNewIncidents })

  const handleCreated = (newInc) => {
    setIncidents(prev => [newInc, ...prev])
  }

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
    setMobilePanel('detail')
    setView('incidents')
  }

  useEffect(() => { fetchIncidents() }, [])

  const filtered = incidents.filter(i => {
    const matchesFilter = filter === 'all' || i.status === filter || i.severity === filter
    const matchesSearch = !search ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.affected_systems?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const counts = {
    critical: incidents.filter(i => i.severity === 'critical').length,
    active: incidents.filter(i => i.status === 'active').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
  }

  // ── MOBILE LAYOUT ──────────────────────────────────────────
  const MobileLayout = () => (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Mobile Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {mobilePanel === 'detail' && (
            <button onClick={() => setMobilePanel('list')} className="p-1 mr-1 text-gray-400">
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={15} />
          </div>
          <span className="font-bold text-sm">Sentinel AI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
          <button onClick={fetchIncidents} className="p-1.5 hover:bg-gray-700 rounded-lg">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={toggleTheme} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button onClick={() => setShowCreate(true)} className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg">
            <Plus size={14} />
          </button>
          <button onClick={() => setShowVoice(true)} className="p-1.5 bg-gray-700 rounded-lg">
            <Mic size={14} />
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-2 flex gap-4">
        {[
          { label: 'Critical', value: counts.critical, color: 'text-red-400' },
          { label: 'Active', value: counts.active, color: 'text-orange-400' },
          { label: 'Investigating', value: counts.investigating, color: 'text-yellow-400' },
          { label: 'Resolved', value: counts.resolved, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1">
            <span className={`text-base font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {mobilePanel === 'list' && (
          <div className="p-4">
            <SearchFilter search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} />
            <div className="mt-4">
            {loading
              ? <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
              : <IncidentList incidents={filtered} selectedId={selected?.id} onSelect={handleSelect} />
            }
            </div>
          </div>
        )}
        {mobilePanel === 'detail' && (
          <div className="p-4">
            {selected
              ? <IncidentDetail incident={selected} logs={selectedLogs} />
              : <div className="text-center py-12 text-gray-500">Select an incident from the list</div>
            }
          </div>
        )}
        {mobilePanel === 'charts' && (
          <div className="p-4 space-y-4">
            <SeverityPieChart incidents={incidents} />
            <StatusBarChart incidents={incidents} />
            <SourceBarChart incidents={incidents} />
            <Heatmap incidents={incidents} />
          </div>
        )}
        {mobilePanel === 'audit' && (
          <div className="p-4"><AuditLog /></div>
        )}
        {mobilePanel === 'chat' && (
          <div className="h-full">
            <ChatAssistant incidentContext={selected} />
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bg-gray-900 border-t border-gray-800 flex shrink-0">
        {[
          { id: 'list', icon: <LayoutDashboard size={18} />, label: 'Incidents' },
          { id: 'charts', icon: <BarChart2 size={18} />, label: 'Charts' },
          { id: 'audit', icon: <ClipboardList size={18} />, label: 'Audit' },
          { id: 'chat', icon: <MessageSquare size={18} />, label: 'Chat' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setMobilePanel(tab.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors ${
              mobilePanel === tab.id ? 'text-blue-400' : 'text-gray-500'
            }`}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )

  // ── DESKTOP LAYOUT ─────────────────────────────────────────
  const DesktopLayout = () => (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
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
          <button onClick={fetchIncidents} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={toggleTheme} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400" title="Toggle theme">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 transition-colors">
            <Plus size={14} /> New Incident
          </button>
          <div className="flex bg-gray-800 rounded-lg p-0.5">
            {[
              { id: 'incidents', icon: <LayoutDashboard size={13} />, label: 'Incidents' },
              { id: 'charts', icon: <BarChart2 size={13} />, label: 'Charts' },
              { id: 'audit', icon: <ClipboardList size={13} />, label: 'Audit Log' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setView(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${view === tab.id ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowVoice(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-gray-700 hover:bg-gray-600 transition-colors">
            <Mic size={14} /> Voice
          </button>
          <button onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${showChat ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
            <MessageSquare size={14} /> AI Chat
          </button>
        </div>
      </header>

      <div className="bg-gray-900/50 border-b border-gray-800 px-6 py-2 flex gap-6">
        {[
          { label: 'Critical', value: counts.critical, color: 'text-red-400' },
          { label: 'Active', value: counts.active, color: 'text-orange-400' },
          { label: 'Investigating', value: counts.investigating, color: 'text-yellow-400' },
          { label: 'Resolved', value: counts.resolved, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Incidents</h2>
            <SearchFilter search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {loading
              ? <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
              : <IncidentList incidents={filtered} selectedId={selected?.id} onSelect={handleSelect} />
            }
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {view === 'audit' ? <AuditLog /> :
           view === 'charts' ? (
            <div>
              <h2 className="text-base font-semibold text-white mb-4">Incident Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                <SeverityPieChart incidents={incidents} />
                <StatusBarChart incidents={incidents} />
                <SourceBarChart incidents={incidents} />
              </div>
              <Heatmap incidents={incidents} />
            </div>
          ) : selected ? (
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

  return (
    <>
      {/* Responsive: mobile vs desktop */}
      <div className="block md:hidden h-screen">
        <MobileLayout />
      </div>
      <div className="hidden md:block">
        <DesktopLayout />
      </div>

      {showVoice && (
        <VoiceAssistant incidentContext={selected} onClose={() => setShowVoice(false)} />
      )}

      {showCreate && (
        <CreateIncident onCreated={handleCreated} onClose={() => setShowCreate(false)} />
      )}

      <AlertToast
        alerts={toastAlerts}
        onDismiss={(id) => setToastAlerts(t => t.filter(a => a._toastId !== id))}
      />
    </>
  )
}
