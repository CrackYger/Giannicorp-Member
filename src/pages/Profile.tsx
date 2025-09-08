
import { useAuth } from '../auth/AuthProvider'

export default function Profile(){
  const { user, signOut, demoMode } = useAuth()
  return (
    <main className="py-6 space-y-4">
      <h2 className="text-xl font-semibold">Profil</h2>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
        <div className="text-slate-300 text-sm">Angemeldet als:</div>
        <div className="font-semibold">{user?.email ?? '–'}</div>
        {demoMode && <div className="text-xs text-slate-400">Demo-Modus</div>}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
        <div className="text-slate-300 text-sm">App-Version</div>
        <div className="font-mono">v0.5.0</div>
      </div>
      <button onClick={signOut} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">Abmelden</button>
    </main>
  )
}
