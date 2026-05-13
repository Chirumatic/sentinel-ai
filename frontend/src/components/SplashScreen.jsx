import { useEffect, useState } from 'react'
import { Shield } from 'lucide-react'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1200)
    const t3 = setTimeout(() => setPhase(3), 2000)
    const t4 = setTimeout(() => onDone(), 2600)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onDone])

  return (
    <div className={`fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-[100] transition-opacity duration-500 ${phase === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className={`flex flex-col items-center gap-4 transition-all duration-700 relative z-10 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Shield size={40} className="text-white" />
          </div>
          {phase >= 2 && (
            <div className="absolute -inset-2 rounded-2xl border-2 border-blue-500/40 animate-ping" />
          )}
        </div>

        {/* Title */}
        <div className={`text-center transition-all duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sentinel AI</h1>
          <p className="text-gray-400 text-sm mt-1">Autonomous Incident Response</p>
        </div>

        {/* Loading bar */}
        <div className={`w-48 h-0.5 bg-gray-800 rounded-full overflow-hidden mt-2 transition-opacity duration-300 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`h-full bg-blue-500 rounded-full transition-all duration-700 ${phase >= 2 ? 'w-full' : 'w-0'}`} />
        </div>

        <p className={`text-xs text-gray-600 transition-opacity duration-300 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          Powered by Groq · Splunk
        </p>
      </div>
    </div>
  )
}
