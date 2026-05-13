import { useState, useRef, useEffect } from 'react'
import { chatWithAI } from '../api/client'
import { Send, Bot, User, Loader } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function ChatAssistant({ incidentContext }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Sentinel AI. Ask me anything about your incidents or operational data.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const res = await chatWithAI(userMsg, incidentContext)
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
              msg.role === 'assistant' ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
            </div>
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              msg.role === 'assistant'
                ? 'bg-gray-700 text-gray-200'
                : 'bg-blue-600 text-white'
            }`}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown
                  components={{
                    ul: ({children}) => <ul className="list-disc list-inside space-y-1 mt-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mt-1">{children}</ol>,
                    li: ({children}) => <li className="text-gray-200">{children}</li>,
                    strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                    p: ({children}) => <p className="mb-1 last:mb-0">{children}</p>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-gray-700 px-3 py-2 rounded-lg">
              <Loader size={14} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about incidents..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
