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
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${phase === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: 'radial-gradient(ellipse at 60% 40%, #0f1f3d 0%, #050d1a 50%, #000000 100%)' }}
    >
      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[100px]" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-purple-600/8 rounded-full blur-[70px]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[
          { top: '15%', left: '10%', size: 'w-1.5 h-1.5', color: 'bg-blue-400', anim: 'animate-float-1', opacity: 'opacity-50' },
          { top: '25%', right: '12%', size: 'w-1 h-1', color: 'bg-cyan-400', anim: 'animate-float-2', opacity: 'opacity-40' },
          { top: '70%', left: '8%', size: 'w-2 h-2', color: 'bg-blue-300', anim: 'animate-float-3', opacity: 'opacity-30' },
          { top: '60%', right: '10%', size: 'w-1.5 h-1.5', color: 'bg-purple-400', anim: 'animate-float-1', opacity: 'opacity-40' },
          { top: '40%', left: '20%', size: 'w-1 h-1', color: 'bg-cyan-300', anim: 'animate-float-2', opacity: 'opacity-50' },
          { top: '80%', right: '20%', size: 'w-1.5 h-1.5', color: 'bg-blue-400', anim: 'animate-float-3', opacity: 'opacity-35' },
          { top: '10%', left: '50%', size: 'w-1 h-1', color: 'bg-cyan-400', anim: 'animate-float-1', opacity: 'opacity-45' },
          { top: '85%', left: '45%', size: 'w-2 h-2', color: 'bg-blue-300', anim: 'animate-float-2', opacity: 'opacity-25' },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute ${p.size} ${p.color} ${p.anim} ${p.opacity} rounded-full`}
            style={{ top: p.top, left: p.left, right: p.right }}
          />
        ))}
      </div>

      {/* Scanning line effect */}
      <div className={`absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent transition-all duration-1000 ${phase >= 1 ? 'top-1/2' : 'top-0'}`} />

      {/* Main content */}
      <div className={`relative z-10 flex flex-col items-center gap-5 transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Logo with rings */}
        <div className="relative flex items-center justify-center">
          {phase >= 2 && (
            <>
              <div className="absolute w-32 h-32 rounded-full border border-blue-500/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute w-24 h-24 rounded-full border border-blue-500/30 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
            </>
          )}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 relative z-10">
            <Shield size={40} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">Sentinel AI</h1>
          <p className="text-blue-400/80 text-sm mt-1 tracking-widest uppercase">Autonomous Incident Response</p>
        </div>

        {/* Loading bar */}
        <div className={`w-56 h-0.5 bg-gray-800 rounded-full overflow-hidden transition-opacity duration-300 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-700 ${phase >= 2 ? 'w-full' : 'w-0'}`} />
        </div>

        <p className={`text-xs text-gray-600 tracking-wider transition-opacity duration-300 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          POWERED BY GROQ · SPLUNK
        </p>
      </div>
    </div>
  )
}
