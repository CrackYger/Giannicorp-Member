
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useNavigate } from 'react-router-dom'

export default function SignIn(){
  const { requestCode, verifyCode, loading, error, user } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<'request'|'verify'>('request')
  const [sent, setSent] = useState(false)
  const nav = useNavigate()

  // ✅ Auto-Redirect, sobald eingeloggt
  useEffect(()=>{
    if (user) {
      nav('/offers', { replace: true })   // passe ggf. die Route an
    }
  }, [user, nav])

  async function send(e: React.FormEvent){
    e.preventDefault()
    const res = await requestCode(email.trim())
    if (res.ok) { setSent(true); setStage('verify') }
  }
  async function confirm(e: React.FormEvent){
    e.preventDefault()
    const res = await verifyCode(email.trim(), code.trim())
    if (res.ok) {
      // user wird durch onAuthStateChange gesetzt -> redirect passiert im useEffect
      setCode('')
    }
  }

  return (
    <main className="py-8 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Anmelden</h1>

      {/* 🔹 Gemeinsames E-Mail Feld (nur einmal) */}
      <label className="block">
        <span className="text-sm text-slate-300">E‑Mail</span>
        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          type="email"
          required
          placeholder="deine@email.de"
          className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none"
        />
      </label>

      {stage === 'request' && (
        <form onSubmit={send} className="space-y-3">
          <button disabled={!email}
            className="w-full px-4 py-2 rounded-lg bg-brand-400 text-slate-950 font-semibold disabled:opacity-50">
            Login‑Code schicken
          </button>
          <button type="button" onClick={()=>setStage('verify')} className="text-sm underline text-slate-300">
            Ich habe bereits einen Code
          </button>
        </form>
      )}

      {stage === 'verify' && (
        <form onSubmit={confirm} className="space-y-3">
          <label className="block">
            <span className="text-sm text-slate-300">6‑stelliger Code</span>
            <input
              value={code}
              onChange={(e)=>setCode(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              placeholder="123456"
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none"
            />
          </label>
          <div className="flex gap-2">
            <button disabled={!email || !code}
              className="flex-1 px-4 py-2 rounded-lg bg-brand-400 text-slate-950 font-semibold disabled:opacity-50">
              Code bestätigen
            </button>
            <button type="button" onClick={()=>setStage('request')}
              className="px-3 py-2 rounded-lg border border-slate-700">
              Zurück
            </button>
          </div>
        </form>
      )}

      {sent && <div className="text-green-400 text-sm">Code gesendet. Bitte nur den Code eingeben (nicht den Link klicken).</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {loading && <div className="text-slate-400 text-sm">Lade…</div>}
    </main>
  )
}
