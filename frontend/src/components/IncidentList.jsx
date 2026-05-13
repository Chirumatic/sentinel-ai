import { SeverityBadge, StatusBadge } from './SeverityBadge'
import { formatDistanceToNow } from 'date-fns'
import { AlertTriangle, ChevronRight } from 'lucide-react'

export default function IncidentList({ incidents, selectedId, onSelect }) {
  if (!incidents.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertTriangle className="mx-auto mb-2 opacity-40" size={32} />
        <p>No incidents found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {incidents.map((inc) => (
        <button
          key={inc.id}
          onClick={() => onSelect(inc)}
          className={`w-full text-left p-4 rounded-lg border transition-all animate-fade-in ${
            selectedId === inc.id
              ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/5'
              : inc.severity === 'critical'
              ? 'bg-gray-800/50 border-gray-700 hover:border-red-500/40 hover:bg-red-500/5'
              : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-gray-500 font-mono">{inc.id}</span>
                <SeverityBadge severity={inc.severity} />
                <StatusBadge status={inc.status} />
              </div>
              <p className="text-sm font-medium text-white truncate">{inc.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(inc.timestamp), { addSuffix: true })}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-500 mt-1 shrink-0" />
          </div>
        </button>
      ))}
    </div>
  )
}
