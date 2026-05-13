import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function AlertToast({ alerts, onDismiss }) {
  if (!alerts.length) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in ${
            alert.severity === 'critical'
              ? 'bg-red-950 border-red-500/50 text-red-200'
              : alert.severity === 'high'
              ? 'bg-orange-950 border-orange-500/50 text-orange-200'
              : 'bg-gray-800 border-gray-600 text-gray-200'
          }`}
        >
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{alert.title}</p>
            <p className="text-xs opacity-70 mt-0.5">{alert.description}</p>
          </div>
          <button
            onClick={() => onDismiss(alert.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
