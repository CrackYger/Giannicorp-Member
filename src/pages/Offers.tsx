
import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { SubscriptionOffer } from '../types'
import { Link } from 'react-router-dom'

export default function Offers(){
  const [offers, setOffers] = useState<SubscriptionOffer[]>([])
  const [q, setQ] = useState('')

  useEffect(()=>{ api.getOffers().then(setOffers) }, [])

  const filtered = useMemo(()=>{
    const s = q.trim().toLowerCase()
    if(!s) return offers
    return offers.filter(o =>
      o.title.toLowerCase().includes(s) ||
      (o.description ?? '').toLowerCase().includes(s) ||
      (o.terms ?? '').toLowerCase().includes(s)
    )
  }, [offers, q])

  return (
    <main className="py-6 space-y-4">
      <h2 className="text-xl font-semibold">Abo-Katalog</h2>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Suchen (z. B. Netflix, Musik, TV+)"
          className="w-full bg-transparent outline-none"
        />
      </div>
      <div className="space-y-3">
        {filtered.map(o => (
          <Link to={`/offers/${o.slug}`} key={o.id} className="block rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{o.title}</div>
                <div className="text-slate-400 text-sm">
                  {o.price_from != null ? <>ab {o.price_from.toFixed(2)} €</> : <>auf Anfrage</>}
                  {o.terms ? <> • {o.terms}</> : null}
                </div>
              </div>
              <span className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">Details</span>
            </div>
          </Link>
        ))}
        {!filtered.length && <div className="text-slate-400">Keine passenden Abos gefunden.</div>}
      </div>
    </main>
  )
}
