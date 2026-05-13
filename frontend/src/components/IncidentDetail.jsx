import { useState } from 'react'
import { SeverityBadge, StatusBadge } from './SeverityBadge'
import { analyzeIncident } from '../api/client'
import { Brain, Clock, Server, AlertTriangle, CheckCircle, Loader } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function IncidentDetail({ incident, logs }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await analyzeIncident(incident.id)
      setAnalysis(res.data.analysis)
    } catch (e) {
      setError('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs text-gray-500 font-mono">{incident.id}</span>
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
        <h2 className="text-lg font-semibold text-white">{incident.title}</h2>
        <p className="text-sm text-gray-400 mt-1">{incident.description}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
          </span>
          <span className="flex items-center gap-1">
            <Server size={12} />
            {incident.affected_systems?.join(', ')}
          </span>
        </div>
      </div>

      {/* AI Analyze Button */}
      {!analysis && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          {loading ? <Loader size={16} className="animate-spin" /> : <Brain size={16} />}
          {loading ? 'Analyzing with AI...' : 'Analyze with Sentinel AI'}
        </button>
      )}

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {/* AI Analysis Results */}
      {analysis && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Brain size={14} /> AI Summary
            </h3>
            <p className="text-sm text-gray-300">{analysis.summary}</p>
          </div>

          {/* Root Cause */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <AlertTriangle size={14} className="text-yellow-400" /> Root Cause
            </h3>
            <p className="text-sm text-gray-300">{analysis.root_cause}</p>
            <div className="mt-2">
              <span className="text-xs text-gray-500">Confidence: </span>
              <span className="text-xs font-medium text-white">
                {Math.round((analysis.confidence || 0) * 100)}%
              </span>
              <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(analysis.confidence || 0) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Business Impact */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Business Impact</h3>
            <p className="text-sm text-gray-300">{analysis.business_impact}</p>
          </div>

          {/* Timeline */}
          {analysis.timeline?.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock size={14} /> Timeline
              </h3>
              <div className="space-y-2">
                {analysis.timeline.map((event, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                      {i < analysis.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-gray-700 mt-1" />
                      )}
                    </div>
                    <p className="text-gray-300 pb-2">{event}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations?.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400" /> Recommended Actions
              </h3>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${
                      rec.priority === 'immediate'
                        ? 'bg-red-500/20 text-red-400'
                        : rec.priority === 'short-term'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {rec.priority}
                    </span>
                    <p className="text-sm text-gray-300">{rec.action}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                ⚠ Human approval required before executing any action
              </p>
            </div>
          )}

          <button
            onClick={() => { setAnalysis(null) }}
            className="w-full py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-sm transition-colors"
          >
            Re-analyze
          </button>
        </div>
      )}

      {/* Raw Logs */}
      {logs?.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Event Logs ({logs.length})</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 text-xs font-mono">
                <span className={`shrink-0 ${
                  log.level === 'CRITICAL' ? 'text-red-400' :
                  log.level === 'ERROR' ? 'text-orange-400' :
                  log.level === 'WARN' ? 'text-yellow-400' : 'text-gray-500'
                }`}>[{log.level}]</span>
                <span className="text-gray-400">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
