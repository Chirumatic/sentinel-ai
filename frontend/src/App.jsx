import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Sentinel AI</h1>
          <p className="text-gray-400 text-sm">Autonomous Incident Investigation & Response</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Active Incidents</h2>
            <p className="text-gray-400">No active incidents</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">AI Analysis</h2>
            <p className="text-gray-400">Ready to investigate</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">System Status</h2>
            <p className="text-green-400">All systems operational</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
