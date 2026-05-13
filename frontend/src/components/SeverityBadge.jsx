const colors = {
  critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
}

const statusColors = {
  active: 'bg-red-500/20 text-red-400 border border-red-500/30',
  investigating: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  resolved: 'bg-green-500/20 text-green-400 border border-green-500/30',
}

export function SeverityBadge({ severity }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${colors[severity] || colors.low}`}>
      {severity}
    </span>
  )
}

export function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${statusColors[status] || statusColors.active}`}>
      {status}
    </span>
  )
}
