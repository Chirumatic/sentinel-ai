import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'

const DEFAULTS = {
  refreshInterval: 30,
  notifications: true,
  notifyOnCritical: true,
  notifyOnHigh: false,
  aiModel: 'llama-3.3-70b-versatile',
  maxLogs: 20,
  autoAnalyze: false,
}

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('sentinel-settings') || '{}') }
  } catch {
    return DEFAULTS
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(load)
  const [saved, setSaved] = useState(false)

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }))

  const save = () => {
    localStorage.setItem('sentinel-settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    setSettings(DEFAULTS)
    localStorage.removeItem('sentinel-settings')
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-base font-semibold text-white mb-6">Settings</h2>

      <div className="space-y-6">
        {/* Refresh */}
        <section className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Auto-Refresh</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Refresh interval</p>
              <p className="text-xs text-gray-500">How often to check for new incidents</p>
            </div>
            <select
              value={settings.refreshInterval}
              onChange={e => set('refreshInterval', Number(e.target.value))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {[15, 30, 60, 120, 300].map(v => (
                <option key={v} value={v}>{v}s</option>
              ))}
            </select>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Notifications</h3>
          <div className="space-y-3">
            {[
              { key: 'notifications', label: 'Enable browser notifications', desc: 'Show desktop alerts for new incidents' },
              { key: 'notifyOnCritical', label: 'Notify on Critical', desc: 'Always notify for critical severity' },
              { key: 'notifyOnHigh', label: 'Notify on High', desc: 'Notify for high severity incidents' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <button
                  onClick={() => set(key, !settings[key])}
                  className={`w-10 h-5 rounded-full transition-colors relative ${settings[key] ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* AI */}
        <section className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">AI Configuration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">AI Model</p>
                <p className="text-xs text-gray-500">Model used for incident analysis</p>
              </div>
              <select
                value={settings.aiModel}
                onChange={e => set('aiModel', e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
                <option value="llama3-groq-70b-8192-tool-use-preview">Llama 3 70B Tool</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Max logs per analysis</p>
                <p className="text-xs text-gray-500">Higher = more accurate but slower</p>
              </div>
              <select
                value={settings.maxLogs}
                onChange={e => set('maxLogs', Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Auto-analyze new incidents</p>
                <p className="text-xs text-gray-500">Automatically run AI when incident is selected</p>
              </div>
              <button
                onClick={() => set('autoAnalyze', !settings.autoAnalyze)}
                className={`w-10 h-5 rounded-full transition-colors relative ${settings.autoAnalyze ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.autoAnalyze ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={save}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            <Save size={14} />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-colors"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
        </div>
      </div>
    </div>
  )
}
