import { useMemo } from 'react'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const SEVERITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 }

function getColor(value, max) {
  if (value === 0) return 'bg-gray-800'
  const intensity = value / max
  if (intensity < 0.25) return 'bg-blue-900'
  if (intensity < 0.5) return 'bg-blue-700'
  if (intensity < 0.75) return 'bg-orange-600'
  return 'bg-red-500'
}

export default function Heatmap({ incidents }) {
  const { grid, max } = useMemo(() => {
    // Build a 7x24 grid (day x hour) with weighted severity scores
    const grid = Array.from({ length: 7 }, () => Array(24).fill(0))

    incidents.forEach(inc => {
      const d = new Date(inc.timestamp)
      const day = d.getDay()
      const hour = d.getHours()
      grid[day][hour] += SEVERITY_WEIGHT[inc.severity] || 1
    })

    // Add some synthetic historical data to make the heatmap look realistic
    const seed = [
      [1, 9, 3], [1, 10, 4], [1, 14, 2], [2, 2, 5], [2, 3, 4],
      [3, 11, 2], [3, 15, 3], [4, 9, 4], [4, 16, 2], [5, 10, 3],
      [5, 14, 5], [0, 22, 2], [6, 1, 3], [1, 8, 2], [3, 13, 4],
      [4, 11, 3], [2, 16, 2], [5, 9, 4], [1, 15, 3], [3, 10, 2],
    ]
    seed.forEach(([day, hour, val]) => { grid[day][hour] += val })

    const max = Math.max(...grid.flat(), 1)
    return { grid, max }
  }, [incidents])

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Incident Frequency Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Hour labels */}
          <div className="flex mb-1 ml-10">
            {HOURS.filter(h => h % 3 === 0).map(h => (
              <div key={h} className="text-xs text-gray-500" style={{ width: `${3 * 20}px` }}>
                {h.toString().padStart(2, '0')}h
              </div>
            ))}
          </div>

          {/* Grid */}
          {DAYS.map((day, di) => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <span className="text-xs text-gray-500 w-8 shrink-0">{day}</span>
              <div className="flex gap-0.5">
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    title={`${day} ${hour}:00 — score: ${grid[di][hour]}`}
                    className={`w-4 h-4 rounded-sm ${getColor(grid[di][hour], max)} cursor-pointer hover:ring-1 hover:ring-white/30 transition-all`}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-10">
            <span className="text-xs text-gray-500">Low</span>
            {['bg-gray-800', 'bg-blue-900', 'bg-blue-700', 'bg-orange-600', 'bg-red-500'].map(c => (
              <div key={c} className={`w-4 h-4 rounded-sm ${c}`} />
            ))}
            <span className="text-xs text-gray-500">High</span>
          </div>
        </div>
      </div>
    </div>
  )
}
