
import { useEffect, useState } from 'react'

export default function UpdateToast(){
  const [ready, setReady] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(()=>{
    const onReady = () => setOfflineReady(true)
    const onUpdate = () => setReady(true)
    window.addEventListener('app:offline-ready', onReady)
    window.addEventListener('app:update-available', onUpdate)
    return () => {
      window.removeEventListener('app:offline-ready', onReady)
      window.removeEventListener('app:update-available', onUpdate)
    }
  }, [])

  if(!ready && !offlineReady) return null
  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm shadow-lg">
      {ready ? (
        <div className="flex items-center gap-3">
          <span>🔄 Neues Update verfügbar</span>
          <button
            className="px-3 py-1 rounded-lg bg-brand-400 text-slate-950 font-semibold"
            onClick={() => (window as any).__APPLY_UPDATE__?.()}
          >
            Neu laden
          </button>
        </div>
      ) : (
        <div>✅ Offline bereit</div>
      )}
    </div>
  )
}
