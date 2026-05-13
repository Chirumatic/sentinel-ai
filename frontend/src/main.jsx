import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import './index.css'

function Root() {
  const [stage, setStage] = useState(() => {
    const user = sessionStorage.getItem('sentinel-user')
    const entered = sessionStorage.getItem('sentinel-entered')
    if (user) return 'app'
    if (entered) return 'login'
    return 'landing'
  })

  const handleEnterFromLanding = () => {
    sessionStorage.setItem('sentinel-entered', 'true')
    setStage('login')
  }

  const handleLogin = (user) => {
    sessionStorage.setItem('sentinel-user', JSON.stringify(user))
    setStage('app')
  }

  if (stage === 'landing') return <Landing onEnter={handleEnterFromLanding} />
  if (stage === 'login') return <Login onLogin={handleLogin} />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
