
import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'

export default function Login(){
  const { signIn, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function submit(e: React.FormEvent){
    e.preventDefault()
    const res = await signIn(email.trim())
    if (res.ok) setSent(true)
  }

  return (
    <main className="py-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Anmelden</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          type="email"
          required
          placeholder="deine@email.de"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none"
        />
        <button disabled={!email}
          className="w-full px-4 py-2 rounded-lg bg-brand-400 text-slate-950 font-semibold disabled:opacity-50">
          Magic-Link senden
        </button>
        {sent && <div className="text-green-400 text-sm">Link gesendet. Bitte E-Mail prüfen.</div>}
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {loading && <div className="text-slate-400 text-sm">Lade…</div>}
      </form>
      <div className="mt-4 text-xs text-slate-400">
        Debug: Öffne die Browser-Konsole – du siehst dort `[auth]`-Logs.
      </div>
    </main>
  )
}
