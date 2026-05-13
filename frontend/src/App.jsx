import { useState, useEffect, useCallback } from 'react'
import { getIncidents, getIncident } from './api/client'
import IncidentList from './components/IncidentList'
import IncidentDetail from './components/IncidentDetail'
import ChatAssistant from './components/ChatAssistant'
import { SeverityPieChart, StatusBarChart, SourceBarChart } from './components/Charts'
import Heatmap from './components/Heatmap'
import IncidentRateGraph from './components/IncidentRateGraph'
import SearchFilter from './components/SearchFilter'
import ActivityFeed from './components/ActivityFeed'
import DemoWalkthrough from './components/DemoWalkthrough'
import { useTheme } from './hooks/useTheme'
import { useSoundAlerts } from './hooks/useSoundAlerts'
import SplashScreen from './components/SplashScreen'
import Settings from './components/Settings'
import AuditLog from './components/AuditLog'
import AlertToast from './components/AlertToast'
import { useAutoRefresh } from './hooks/useAutoRefresh'
import { useNotifications } from './hooks/useNotifications'
import { Shield, RefreshCw, MessageSquare, X, LayoutDashboard, BarChart2, Mic, ClipboardList, ArrowLeft, Plus, Sun, Moon, Settings as SettingsIcon, Radio, Play, LogOut } from 'lucide-react'
import VoiceAssistant from './components/VoiceAssistant'
import CreateIncident from './components/CreateIncident'

export default function App() {
  const [incidents, setIncidents] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedLogs, setSelectedLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  const [showVoice, setShowVoice] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('incidents')
  const [toastAlerts, setToastAlerts] = useState([])
  const [showSplash, setShowSplash] = useState(true)
  const { theme, toggle: toggleTheme } = useTheme()
  const { playAlert } = useSoundAlerts()
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
        playAlert(inc.severity)
        const toastId = inc.id + Date.now()
        setToastAlerts(t => [...t, { ...inc, _toastId: toastId }])
        setTimeout(() => setToastAlerts(t => t.filter(a => a._toastId !== toastId)), 6000)
      })
      return [...truly_new, ...prev]
    })
  }, [notify])

  useAutoRefresh({ fetchFn, interval: 30000, onNewItems: handleNewIncidents })

  const user = JSON.parse(sessionStorage.getItem('sentinel-user') || '{}')

  const handleLogout = () => {
    sessionStorage.removeItem('sentinel-user')
    sessionStorage.removeItem('sentinel-entered')
    window.location.reload()
  }
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
    <div className="flex flex-col h-screen text-white relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 30% 20%, #0f1f3d 0%, #050d1a 60%, #000000 100%)' }}
    >
      {/* Mobile background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-purple-600/8 rounded-full blur-[50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>
      {/* Mobile Header */}
      <header className="bg-gray-900/70 backdrop-blur-sm border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0 relative z-10">
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
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-4 py-2 flex gap-4 relative z-10">
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
      <div className="flex-1 overflow-y-auto relative z-10">
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
            <IncidentRateGraph incidents={incidents} />
            <SeverityPieChart incidents={incidents} />
            <StatusBarChart incidents={incidents} />
            <SourceBarChart incidents={incidents} />
            <Heatmap incidents={incidents} />
          </div>
        )}
        {mobilePanel === 'audit' && (
          <div className="p-4"><AuditLog /></div>
        )}
        {mobilePanel === 'activity' && (
          <div className="h-full"><ActivityFeed /></div>
        )}
        {mobilePanel === 'settings' && (
          <div className="p-4"><Settings /></div>
        )}
        {mobilePanel === 'chat' && (
          <div className="h-full">
            <ChatAssistant incidentContext={selected} />
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 flex shrink-0 relative z-10">
        {[
          { id: 'list', icon: <LayoutDashboard size={18} />, label: 'Incidents' },
          { id: 'charts', icon: <BarChart2 size={18} />, label: 'Charts' },
          { id: 'audit', icon: <ClipboardList size={18} />, label: 'Audit' },
          { id: 'activity', icon: <Radio size={18} />, label: 'Activity' },
          { id: 'chat', icon: <MessageSquare size={18} />, label: 'Chat' },
          { id: 'settings', icon: <SettingsIcon size={18} />, label: 'Settings' },
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
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden"
      style={{ background: theme === 'light'
        ? 'radial-gradient(ellipse at 70% 10%, #dbeafe 0%, #eff6ff 50%, #f8fafc 100%)'
        : 'radial-gradient(ellipse at 70% 10%, #0d1f3c 0%, #050d1a 50%, #000000 100%)' }}
    >
      {/* Dashboard background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Glows */}
        <div className={`absolute top-0 right-0 w-[700px] h-[500px] rounded-full blur-[120px] ${theme === 'light' ? 'bg-blue-300/20' : 'bg-blue-600/8'}`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full blur-[100px] ${theme === 'light' ? 'bg-indigo-300/15' : 'bg-purple-600/6'}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full blur-[80px] ${theme === 'light' ? 'bg-sky-300/10' : 'bg-cyan-600/4'}`} />
        {/* Grid */}
        <div className={`absolute inset-0 ${theme === 'light'
          ? 'bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:40px_40px]'
          : 'bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px]'}`} />
        {/* Floating particles */}
        <div className="absolute top-[20%] right-[5%] w-1.5 h-1.5 bg-blue-400 rounded-full opacity-30 animate-float-1" />
        <div className="absolute top-[50%] right-[15%] w-1 h-1 bg-cyan-400 rounded-full opacity-25 animate-float-2" />
        <div className="absolute top-[70%] right-[8%] w-2 h-2 bg-blue-300 rounded-full opacity-20 animate-float-3" />
        <div className="absolute top-[30%] left-[35%] w-1 h-1 bg-purple-400 rounded-full opacity-20 animate-float-1" />
        <div className="absolute bottom-[15%] right-[30%] w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-25 animate-float-2" />
      </div>
      <header className={`backdrop-blur-sm border-b px-6 py-3 flex items-center justify-between shrink-0 relative z-10 ${theme === 'light' ? 'bg-white/80 border-blue-100 text-gray-900' : 'bg-gray-900/80 border-gray-800 text-white'}`}>
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
              { id: 'settings', icon: <SettingsIcon size={13} />, label: 'Settings' },
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
          <button onClick={() => setShowWalkthrough(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
            <Play size={12} /> Demo
          </button>
          <button onClick={() => setShowActivity(!showActivity)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${showActivity ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
            <Radio size={14} /> Activity
          </button>
          <button onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${showChat ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
            <MessageSquare size={14} /> AI Chat
          </button>
          {user.name && (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-700">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                {user.name[0]}
              </div>
              <span className="text-xs text-gray-400 hidden xl:block">{user.name}</span>
              <button onClick={handleLogout} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-white transition-colors" title="Sign out">
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className={`backdrop-blur-sm border-b px-6 py-2 flex gap-6 relative z-10 ${theme === 'light' ? 'bg-blue-50/80 border-blue-100' : 'bg-gray-900/50 border-gray-800'}`}>
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

      <div className="flex flex-1 overflow-hidden relative z-10">
        <div className={`w-80 shrink-0 border-r flex flex-col overflow-hidden ${theme === 'light' ? 'border-blue-100 bg-white/60' : 'border-gray-800'}`}>
          <div className={`p-4 border-b ${theme === 'light' ? 'border-blue-100' : 'border-gray-800'}`}>
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
           view === 'settings' ? <Settings /> :
           view === 'charts' ? (
            <div>
              <h2 className="text-base font-semibold text-white mb-4">Incident Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                <SeverityPieChart incidents={incidents} />
                <StatusBarChart incidents={incidents} />
                <SourceBarChart incidents={incidents} />
              </div>
              <IncidentRateGraph incidents={incidents} />
              <div className="mt-4">
                <Heatmap incidents={incidents} />
              </div>
            </div>
          ) : selected ? (
            <IncidentDetail incident={selected} logs={selectedLogs} />
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="relative mx-auto mb-6 w-24 h-24">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-2 bg-blue-500/10 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                  <div className="relative w-24 h-24 bg-gray-800/80 border border-gray-700 rounded-full flex items-center justify-center">
                    <Shield size={36} className="text-gray-600" />
                  </div>
                </div>
                <p className="text-gray-400 font-medium">Select an incident to investigate</p>
                <p className="text-gray-600 text-sm mt-1">Sentinel AI will analyze it automatically</p>
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Monitoring {incidents.length} incidents
                </div>
              </div>
            </div>
          )}
        </div>

        {showActivity && (
          <div className="w-72 shrink-0 border-l border-gray-800 flex flex-col overflow-hidden">
            <ActivityFeed />
          </div>
        )}

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
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      {/* Responsive: mobile vs desktop */}
      <div className="block md:hidden h-screen">
        <MobileLayout />
      </div>
      <div className="hidden md:block">
        <DesktopLayout />
      </div>

      {showWalkthrough && (
        <DemoWalkthrough onClose={() => setShowWalkthrough(false)} />
      )}

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
