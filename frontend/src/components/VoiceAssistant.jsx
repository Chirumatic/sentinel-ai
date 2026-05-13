import { useState, useRef, useEffect } from 'react'
import { chatWithAI } from '../api/client'
import { Mic, MicOff, Volume2, VolumeX, X, Loader } from 'lucide-react'

const speak = (text) => {
  window.speechSynthesis.cancel()
  // Strip markdown for cleaner speech
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\n+/g, '. ')
  const utterance = new SpeechSynthesisUtterance(clean)
  utterance.rate = 1.0
  utterance.pitch = 1.0
  utterance.volume = 1.0
  // Prefer a natural English voice if available
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
    || voices.find(v => v.lang === 'en-US')
    || voices[0]
  if (preferred) utterance.voice = preferred
  window.speechSynthesis.speak(utterance)
  return utterance
}

export default function VoiceAssistant({ incidentContext, onClose }) {
  const [status, setStatus] = useState('idle') // idle | listening | thinking | speaking
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [muted, setMuted] = useState(false)
  const [history, setHistory] = useState([])
  const recognitionRef = useRef(null)

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      recognitionRef.current?.stop()
    }
  }, [])

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome.')
      return
    }

    window.speechSynthesis.cancel()
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    recognition.onstart = () => setStatus('listening')

    recognition.onresult = async (e) => {
      const text = e.results[0][0].transcript
      setTranscript(text)
      setStatus('thinking')

      try {
        const res = await chatWithAI(text, incidentContext)
        const reply = res.data.response
        setResponse(reply)
        setHistory(prev => [...prev, { q: text, a: reply }])
        setStatus('speaking')
        if (!muted) {
          const utterance = speak(reply)
          utterance.onend = () => setStatus('idle')
        } else {
          setStatus('idle')
        }
      } catch {
        setResponse('Sorry, I could not process that request.')
        setStatus('idle')
      }
    }

    recognition.onerror = () => setStatus('idle')
    recognition.onend = () => {
      if (status === 'listening') setStatus('idle')
    }

    recognition.start()
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setStatus('idle')
  }

  const toggleMute = () => {
    setMuted(m => !m)
    if (!muted) window.speechSynthesis.cancel()
  }

  const statusLabel = {
    idle: 'Tap the mic to speak',
    listening: 'Listening...',
    thinking: 'Analyzing...',
    speaking: 'Speaking...',
  }

  const pulseClass = status === 'listening'
    ? 'animate-ping bg-red-500'
    : status === 'thinking'
    ? 'animate-ping bg-yellow-500'
    : status === 'speaking'
    ? 'animate-ping bg-green-500'
    : ''

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-white">Voice Assistant</h2>
            <p className="text-xs text-gray-400">Powered by Sentinel AI</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-colors ${muted ? 'bg-red-500/20 text-red-400' : 'hover:bg-gray-700 text-gray-400'}`}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Mic Area */}
        <div className="flex flex-col items-center py-8 gap-4">
          <div className="relative">
            {pulseClass && (
              <div className={`absolute inset-0 rounded-full opacity-40 ${pulseClass}`} />
            )}
            <button
              onClick={status === 'idle' ? startListening : stopSpeaking}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                status === 'listening'
                  ? 'bg-red-500 hover:bg-red-400 scale-110'
                  : status === 'thinking'
                  ? 'bg-yellow-500 cursor-wait'
                  : status === 'speaking'
                  ? 'bg-green-500 hover:bg-green-400'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {status === 'thinking' ? (
                <Loader size={28} className="animate-spin text-white" />
              ) : status === 'listening' ? (
                <MicOff size={28} className="text-white" />
              ) : (
                <Mic size={28} className="text-white" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-400">{statusLabel[status]}</p>
        </div>

        {/* Transcript & Response */}
        {(transcript || response) && (
          <div className="px-5 pb-5 space-y-3">
            {transcript && (
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">You said</p>
                <p className="text-sm text-white">"{transcript}"</p>
              </div>
            )}
            {response && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                <p className="text-xs text-blue-400 mb-1">Sentinel AI</p>
                <p className="text-sm text-gray-300 whitespace-pre-line">{response}</p>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="px-5 pb-5">
            <p className="text-xs text-gray-500 mb-2">Previous ({history.length - 1})</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {history.slice(0, -1).reverse().map((item, i) => (
                <div key={i} className="text-xs text-gray-500 bg-gray-800/50 rounded p-2">
                  <span className="text-gray-400">Q: </span>{item.q}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="px-5 pb-5">
          <p className="text-xs text-gray-600 text-center">
            Try: "What caused this incident?" or "How do I fix it?"
          </p>
        </div>
      </div>
    </div>
  )
}
