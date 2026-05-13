import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDistanceToNow } from 'date-fns'

export default function IncidentRateGraph({ incidents }) {
  const data = useMemo(() => {
    // Group incidents into 5-minute buckets over the last 2 hours
    const now = Date.now()
    const buckets = {}
    const BUCKET_MS = 5 * 60 * 1000
    const NUM_BUCKETS = 24 // 2 hours

    // Initialize empty buckets
    for (let i = NUM_BUCKETS - 1; i >= 0; i--) {
      const bucketTime = now - i * BUCKET_MS
      const label = new Date(bucketTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      buckets[bucketTime] = { time: label, total: 0, critical: 0, high: 0, medium: 0, low: 0 }
    }

    // Place incidents into buckets
    incidents.forEach(inc => {
      const incTime = new Date(inc.timestamp).getTime()
      const bucketKeys = Object.keys(buckets).map(Number)
      const closest = bucketKeys.reduce((prev, curr) =>
        Math.abs(curr - incTime) < Math.abs(prev - incTime) ? curr : prev
      )
      if (buckets[closest]) {
        buckets[closest].total++
        buckets[closest][inc.severity] = (buckets[closest][inc.severity] || 0) + 1
      }
    })

    return Object.values(buckets)
  }, [incidents])

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs shadow-xl">
        <p className="text-gray-400 mb-2">{label}</p>
        {payload.map(p => p.value > 0 && (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-gray-300 capitalize">{p.dataKey}: {p.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Incident Rate (Last 2 Hours)</h3>
        <div className="flex items-center gap-3 text-xs">
          {[
            { color: '#ef4444', label: 'Critical' },
            { color: '#f97316', label: 'High' },
            { color: '#eab308', label: 'Medium' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5 text-gray-400">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="mediumGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} fill="url(#criticalGrad)" />
          <Area type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} fill="url(#highGrad)" />
          <Area type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={1.5} fill="url(#mediumGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
