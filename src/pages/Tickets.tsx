
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Ticket } from '../types'
import { useAuth } from '../auth/AuthProvider'

export default function Tickets(){
  const [items, setItems] = useState<Ticket[]>([])
  const [subject, setSubject] = useState('')
  const { user } = useAuth()

  async function refresh(){
    if (!user) return
    const nxt = await api.listTickets({ id: user.id, email: user.email ?? '' } as any)
    setItems(nxt)
  }

  useEffect(()=>{ refresh() }, [user])

  async function createTicket(){
    if(!subject.trim() || !user) return
    await api.createTicket({ id: user.id, email: user.email ?? '' } as any, subject)
    setSubject('')
    await refresh()
  }

  return (
    <main className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Support</h2>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 flex gap-2">
        <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Neues Ticket: Betreff…" className="flex-1 bg-transparent outline-none" />
        <button onClick={createTicket} className="px-3 py-2 rounded-lg bg-brand-400 text-slate-950 font-semibold">Erstellen</button>
      </div>
      <div className="space-y-3">
        {items.map(t => (
          <Link key={t.id} to={`/tickets/${t.id}`} className="block rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{t.subject}</div>
              <div className="flex items-center gap-2">
                {t.unread ? <span className="px-2 py-0.5 rounded-full text-xs bg-rose-400 text-slate-950">{t.unread}</span> : null}
                <span className="text-xs text-slate-400">{t.status}</span>
              </div>
            </div>
          </Link>
        ))}
        {!items.length && <div className="text-slate-400">Noch keine Tickets.</div>}
      </div>
    </main>
  )
}
