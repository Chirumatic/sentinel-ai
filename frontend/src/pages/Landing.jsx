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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={18} />
          </div>
          <span className="font-bold text-lg">Sentinel AI</span>
        </div>
        <button
          onClick={onEnter}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
        >
          Open Dashboard <ArrowRight size={14} />
        </button>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Built for Splunk AgenticOps Hackathon
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Autonomous Incident<br />
          <span className="text-blue-400">Investigation & Response</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Sentinel AI transforms operational data into actionable intelligence. Detect, investigate, and resolve incidents faster with AI — while keeping humans in control.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={onEnter}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Launch Dashboard <ArrowRight size={16} />
          </button>
          <a
            href="https://github.com/Chirumatic/sentinel-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '< 5s', label: 'AI Analysis Time' },
            { value: '12+', label: 'Incident Types' },
            { value: '100%', label: 'Human Controlled' },
            { value: 'Live', label: 'Real-Time Updates' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-blue-400">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Everything you need for intelligent incident response</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
              <div className="w-9 h-9 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6 bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Real-world use cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map(u => (
              <div key={u.title} className="flex gap-3">
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

      {/* Tech Stack */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8">Built with</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['React', 'FastAPI', 'Groq', 'Llama 3.3', 'Splunk', 'Tailwind CSS', 'Recharts', 'Vercel', 'Render'].map(t => (
            <span key={t} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center border-t border-gray-800">
        <h2 className="text-2xl font-bold mb-4">Ready to see it in action?</h2>
        <p className="text-gray-400 mb-6">Watch AI investigate a live incident in real time.</p>
        <button
          onClick={onEnter}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors mx-auto"
        >
          Launch Dashboard <ArrowRight size={16} />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-6 text-center text-xs text-gray-600">
        Sentinel AI — Built for Splunk AgenticOps Hackathon 2026
      </footer>
    </div>
  )
}
