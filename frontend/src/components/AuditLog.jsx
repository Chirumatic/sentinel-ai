import { useState, useEffect } from 'react'
import { getActionLog } from '../api/client'
import { ThumbsUp, ThumbsDown, ClipboardList } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function AuditLog() {
  const [log, setLog] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getActionLog()
      .then(res => setLog(res.data.log))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-8 text-gray-500 text-sm">Loading audit log...</div>

  if (!log.length) return (
    <div className="text-center py-12 text-gray-500">
      <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
      <p>No actions recorded yet</p>
      <p className="text-sm mt-1 text-gray-600">Approve or reject AI recommendations to see them here</p>
    </div>
  )

  return (
    <div>
      <h2 className="text-base font-semibold text-white mb-4">Action Audit Log</h2>
      <div className="space-y-3">
        {log.map((entry) => (
          <div key={entry.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono text-gray-500">{entry.id}</span>
                  <span className="text-xs font-mono text-blue-400">{entry.incident_id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    entry.priority === 'immediate' ? 'bg-red-500/20 text-red-400' :
                    entry.priority === 'short-term' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{entry.priority}</span>
                </div>
                <p className="text-sm text-white">{entry.action}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>By: {entry.approved_by}</span>
                  <span>{formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
                entry.decision === 'approved'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {entry.decision === 'approved'
                  ? <><ThumbsUp size={12} /> Approved</>
                  : <><ThumbsDown size={12} /> Rejected</>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
