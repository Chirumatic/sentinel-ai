import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Play } from 'lucide-react'

const STEPS = [
  {
    title: 'Welcome to Sentinel AI',
    description: 'Sentinel AI is an autonomous incident investigation and response assistant. It detects, analyzes, and helps resolve operational incidents using AI — while keeping humans in control.',
    highlight: null,
    tip: 'This walkthrough will guide you through the key features in about 2 minutes.',
  },
  {
    title: 'Live Incident Detection',
    description: 'The left panel shows all active incidents in real time. New incidents appear automatically every 20 seconds, simulating a live operational environment.',
    highlight: 'incidents',
    tip: 'Watch the incident count in the header — it updates as new incidents arrive.',
  },
  {
    title: 'AI-Powered Analysis',
    description: 'Click any incident, then press "Analyze with Sentinel AI". The AI investigates the logs, identifies the root cause, assesses business impact, and generates a timeline — all in seconds.',
    highlight: 'analyze',
    tip: 'Try clicking "Production API High Latency" and analyzing it.',
  },
  {
    title: 'Human-in-the-Loop Approval',
    description: 'After analysis, the AI recommends remediation actions. Engineers can Approve or Reject each recommendation. Every decision is logged in the Audit Trail.',
    highlight: 'approval',
    tip: 'This is the core AgenticOps principle — AI assists, humans decide.',
  },
  {
    title: 'Incident Analytics',
    description: 'The Charts tab shows severity distribution, incident status breakdown, source analysis, and a frequency heatmap — giving you full operational visibility.',
    highlight: 'charts',
    tip: 'Click the "Charts" tab in the header to explore the analytics.',
  },
  {
    title: 'Voice Assistant',
    description: 'Click the Voice button to ask questions verbally. Ask "What caused this incident?" or "How do I fix it?" and hear the AI respond out loud.',
    highlight: 'voice',
    tip: 'Works best in Chrome. Allow microphone access when prompted.',
  },
  {
    title: 'AI Chat Assistant',
    description: 'The AI Chat panel lets you have a conversation about any incident. Ask follow-up questions, request more details, or explore remediation options.',
    highlight: 'chat',
    tip: 'The AI has full context of the selected incident.',
  },
  {
    title: "You're ready to demo!",
    description: 'Sentinel AI demonstrates the future of AgenticOps — transforming operational data into intelligent action while maintaining human oversight and trust.',
    highlight: null,
    tip: 'Built for the Splunk AgenticOps Hackathon 2026.',
  },
]

export default function DemoWalkthrough({ onClose }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const isFirst = step === 0

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Play size={14} className="text-blue-400" />
            <span className="text-sm font-semibold text-white">Demo Walkthrough</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{step + 1} / {STEPS.length}</span>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-800">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-white mb-3">{current.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">{current.description}</p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
            <p className="text-xs text-blue-300">💡 {current.tip}</p>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 pb-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all ${
                i === step ? 'w-4 h-1.5 bg-blue-500' : 'w-1.5 h-1.5 bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 p-5 pt-2">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={isFirst}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <button
            onClick={isLast ? onClose : () => setStep(s => s + 1)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            {isLast ? 'Start Demo' : 'Next'}
            {!isLast && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
