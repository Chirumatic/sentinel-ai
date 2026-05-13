import { useState } from 'react'
import { Shield, Eye, EyeOff, Loader } from 'lucide-react'

// Demo credentials
const DEMO_USERS = [
  { email: 'admin@sentinel.ai', password: 'sentinel123', name: 'Admin', role: 'Administrator' },
  { email: 'engineer@sentinel.ai', password: 'engineer123', name: 'Engineer', role: 'DevOps Engineer' },
  { email: 'analyst@sentinel.ai', password: 'analyst123', name: 'Analyst', role: 'Security Analyst' },
]

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800)) // Simulate auth delay

    const user = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (user) {
      sessionStorage.setItem('sentinel-user', JSON.stringify(user))
      onLogin(user)
    } else {
      setError('Invalid email or password.')
    }
    setLoading(false)
  }

  const loginAsDemo = async (user) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    sessionStorage.setItem('sentinel-user', JSON.stringify(user))
    onLogin(user)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 60% 30%, #0d1f3c 0%, #050d1a 60%, #000000 100%)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-blue-400 rounded-full opacity-40 animate-float-1" />
        <div className="absolute top-[70%] right-[12%] w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-float-2" />
        <div className="absolute bottom-[20%] left-[20%] w-2 h-2 bg-purple-400 rounded-full opacity-25 animate-float-3" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sentinel AI</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@sentinel.ai"
                className="w-full bg-gray-800/80 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/80 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-xs text-gray-500">or try a demo account</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Demo accounts */}
          <div className="space-y-2">
            {DEMO_USERS.map(user => (
              <button
                key={user.email}
                onClick={() => loginAsDemo(user)}
                disabled={loading}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700 hover:border-gray-500 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                <div className="text-left">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.role}</p>
                </div>
                <span className="text-xs text-blue-400">Quick login →</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Sentinel AI — Splunk AgenticOps Hackathon 2026
        </p>
      </div>
    </div>
  )
}
