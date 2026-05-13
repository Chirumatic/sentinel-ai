import { useEffect, useState, useRef } from 'react'
import { getIncidents } from '../api/client'
import { Activity, Shield, AlertTriangle, Database, Wifi, Lock, Server } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const SOURCE_ICONS = {
  security: <Lock size={13} />,
  infrastructure: <Server size={13} />,
  database: <Database size={13} />,
  network: <Wifi size={13} />,
  application: <Activity size={13} />,
}

const SEVERITY_COLORS = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
}

export default function ActivityFeed() {
  const [events, setEvents] = useState([])
  const [lastCount, setLastCount] = useState(0)
  const bottomRef = useRef(null)

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const res = await getIncidents()
        const incidents = res.data.incidents

        if (incidents.length > lastCount) {
          const newOnes = incidents.slice(0, incidents.length - lastCount)
          const newEvents = newOnes.map(inc => ({
            id: inc.id + '-' + Date.now(),
            type: 'incident',
            title: inc.title,
            severity: inc.severity,
            source: inc.source,
            timestamp: inc.timestamp,
            isNew: true,
          }))
          setEvents(prev => [...newEvents, ...prev].slice(0, 50))
          setLastCount(incidents.length)
        } else if (lastCount === 0) {
          // Initial load
          const initial = incidents.slice(0, 10).map(inc => ({
            id: inc.id + '-init',
            type: 'incident',
            title: inc.title,
            severity: inc.severity,
            source: inc.source,
            timestamp: inc.timestamp,
            isNew: false,
          }))
          setEvents(initial)
          setLastCount(incidents.length)
        }
      } catch {}
    }

    fetchAndUpdate()
    const interval = setInterval(fetchAndUpdate, 15000)
    return () => clearInterval(interval)
  }, [lastCount])

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
        <Activity size={14} className="text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Live Activity Feed</h3>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {events.length === 0 && (
          <div className="text-center py-8 text-gray-600 text-sm">
            Waiting for events...
          </div>
        )}
        {events.map((event, i) => (
          <div
            key={event.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
              event.isNew && i === 0
                ? `${SEVERITY_COLORS[event.severity]} animate-fade-in`
                : 'bg-gray-800/30 border-gray-700/50'
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${event.isNew && i === 0 ? '' : 'text-gray-500'}`}>
              {SOURCE_ICONS[event.source] || <Shield size={13} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${event.isNew && i === 0 ? '' : 'text-gray-300'}`}>
                {event.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium uppercase ${
                  event.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{event.severity}</span>
                <span className="text-xs text-gray-600">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
