import { Shield, Brain, Zap, Eye, Users, ArrowRight, CheckCircle, Activity } from 'lucide-react'

const features = [
  { icon: <Brain size={20} />, title: 'AI-Powered Analysis', desc: 'Automatically investigates incidents using Llama 3.3 via Groq — root cause, timeline, and impact in seconds.' },
  { icon: <Eye size={20} />, title: 'Real-Time Monitoring', desc: 'Continuously monitors operational data and surfaces new incidents as they happen.' },
  { icon: <Zap size={20} />, title: 'Instant Recommendations', desc: 'AI suggests remediation actions ranked by priority — immediate, short-term, and long-term.' },
  { icon: <Users size={20} />, title: 'Human-in-the-Loop', desc: 'Engineers approve or reject every AI recommendation. Full audit trail of all decisions.' },
  { icon: <Activity size={20} />, title: 'Cross-Domain Correlation', desc: 'Connects security, infrastructure, database, network, and application events in one view.' },
  { icon: <Shield size={20} />, title: 'Voice Assistant', desc: 'Ask questions verbally and hear AI responses. Hands-free incident investigation.' },
]

const useCases = [
  { title: 'Server Outage', desc: 'Detects CPU spikes, identifies memory leaks, recommends rollback.' },
  { title: 'Security Threat', desc: 'Correlates failed logins, identifies brute-force attacks, suggests IP blocking.' },
  { title: 'Network Issues', desc: 'Analyzes latency spikes, identifies bottlenecks, recommends fixes.' },
]

export default function Landing({ onEnter }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ── Animated background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-600/6 rounded-full blur-[80px]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-float-1" />
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-40 animate-float-2" />
        <div className="absolute top-[60%] left-[5%] w-1 h-1 bg-purple-400 rounded-full opacity-50 animate-float-3" />
        <div className="absolute top-[30%] right-[8%] w-2 h-2 bg-blue-300 rounded-full opacity-30 animate-float-1" />
        <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-40 animate-float-2" />
        <div className="absolute bottom-[30%] right-[25%] w-1 h-1 bg-blue-400 rounded-full opacity-50 animate-float-3" />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-10 border-b border-gray-800/60 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-gray-950/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield size={18} />
          </div>
          <span className="font-bold text-lg">Sentinel AI</span>
        </div>
        <button
          onClick={onEnter}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
        >
          Open Dashboard <ArrowRight size={14} />
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Built for Splunk AgenticOps Hackathon
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Autonomous Incident<br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Investigation & Response
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Sentinel AI transforms operational data into actionable intelligence. Detect, investigate, and resolve incidents faster with AI — while keeping humans in control.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={onEnter}
            className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            Launch Dashboard <ArrowRight size={16} />
          </button>
          <a
            href="https://github.com/Chirumatic/sentinel-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-3.5 border border-gray-700 hover:border-gray-500 rounded-xl text-gray-300 hover:text-white transition-all hover:-translate-y-0.5"
          >
            View on GitHub
          </a>
        </div>

        {/* Hero visual */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-gray-900/80 border border-gray-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-2xl shadow-blue-500/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-gray-500 font-mono">sentinel-ai — dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-left">
              {[
                { label: 'Critical', value: '2', color: 'text-red-400', bg: 'bg-red-500/10' },
                { label: 'Investigating', value: '3', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                { label: 'Resolved', value: '8', color: 'text-green-400', bg: 'bg-green-500/10' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-lg p-3 border border-gray-700/50`}>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-400 font-medium">CRITICAL — Production API High Latency</span>
              </div>
              <p className="text-xs text-gray-400">AI Analysis: Slow database query on transactions table causing cascade failure. Confidence: 82%</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 border-y border-gray-800/60 py-12 backdrop-blur-sm bg-gray-900/20">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '< 5s', label: 'AI Analysis Time' },
            { value: '12+', label: 'Incident Types' },
            { value: '100%', label: 'Human Controlled' },
            { value: 'Live', label: 'Real-Time Updates' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Everything you need for intelligent incident response</h2>
        <p className="text-gray-500 text-center mb-14">Powered by Groq's ultra-fast inference and Llama 3.3</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="group bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-blue-500/40 hover:bg-gray-900/80 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5 backdrop-blur-sm">
              <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="relative z-10 py-16 px-6 backdrop-blur-sm bg-gray-900/30 border-y border-gray-800/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Real-world use cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map(u => (
              <div key={u.title} className="flex gap-3 bg-gray-900/60 rounded-xl p-4 border border-gray-800 hover:border-green-500/30 transition-colors">
                <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white">{u.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="relative z-10 py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8">Built with</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['React', 'FastAPI', 'Groq', 'Llama 3.3', 'Splunk', 'Tailwind CSS', 'Recharts', 'Vercel', 'Render'].map(t => (
            <span key={t} className="px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-full text-sm text-gray-300 hover:border-blue-500/40 hover:text-white transition-colors">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-600/20 to-purple-600/10 border border-blue-500/20 rounded-2xl p-12 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4">Ready to see it in action?</h2>
          <p className="text-gray-400 mb-8">Watch AI investigate a live incident in real time.</p>
          <button
            onClick={onEnter}
            className="flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 mx-auto text-lg"
          >
            Launch Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-gray-800/60 px-6 py-6 text-center text-xs text-gray-600">
        Sentinel AI — Built for Splunk AgenticOps Hackathon 2026
      </footer>
    </div>
  )
}
