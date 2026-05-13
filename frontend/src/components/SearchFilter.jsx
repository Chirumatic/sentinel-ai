import { Search, X } from 'lucide-react'

export default function SearchFilter({ search, onSearch, filter, onFilter }) {
  return (
    <div className="space-y-2">
      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search incidents..."
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-8 pr-8 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {['all', 'active', 'investigating', 'resolved'].map(f => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}
