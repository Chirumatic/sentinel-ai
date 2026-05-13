import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Landing from './pages/Landing.jsx'
import './index.css'

function Root() {
  const [entered, setEntered] = useState(
    () => sessionStorage.getItem('sentinel-entered') === 'true'
  )

  const handleEnter = () => {
    sessionStorage.setItem('sentinel-entered', 'true')
    setEntered(true)
  }

  return entered ? <App /> : <Landing onEnter={handleEnter} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
