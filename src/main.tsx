
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    const ev = new CustomEvent('app:update-available')
    window.dispatchEvent(ev)
  },
  onOfflineReady() {
    const ev = new CustomEvent('app:offline-ready')
    window.dispatchEvent(ev)
  },
})

// Expose to window for our UpdateToast to trigger apply
;(window as any).__APPLY_UPDATE__ = () => updateSW(true)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
