
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { SubscriptionOffer } from '../types'

export default function OfferDetail(){
  const { slug } = useParams()
  const nav = useNavigate()
  const [offer, setOffer] = useState<SubscriptionOffer | null>(null)

  useEffect(()=>{
    if (!slug) return
    api.getOfferBySlug(slug).then(setOffer)
  }, [slug])

  if (!offer) return <main className="p-6 text-slate-400">Lade…</main>

  return (
    <main className="py-6 space-y-4">
      <button onClick={()=>nav(-1)} className="text-slate-400 text-sm">← Zurück</button>
      <h1 className="text-2xl font-bold">{offer.title}</h1>
      {offer.description && <p className="text-slate-300">{offer.description}</p>}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-1">
        <div className="text-slate-300 text-sm">Preis</div>
        <div className="text-lg font-semibold">
          {offer.price_from != null ? <>ab {offer.price_from.toFixed(2)} €</> : <>auf Anfrage</>}
        </div>
        {offer.terms && <div className="text-slate-400 text-sm">{offer.terms}</div>}
      </div>

      <button
        onClick={()=>nav('/request/new', { state: { offerId: offer.id, offerTitle: offer.title } })}
        className="w-full px-4 py-3 rounded-xl bg-brand-400 text-slate-950 font-semibold"
      >
        Dieses Abo anfragen
      </button>

      <section className="space-y-2">
        <div className="text-sm text-slate-300 font-semibold">FAQ (Kurz)</div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <div>
            <div className="font-medium">Wie lange dauert die Freischaltung?</div>
            <div className="text-slate-300 text-sm">In der Regel innerhalb von 24–48 Stunden, je nach Paket.</div>
          </div>
          <div>
            <div className="font-medium">Kann ich monatlich kündigen?</div>
            <div className="text-slate-300 text-sm">Ja, sofern nicht anders in den Bedingungen angegeben.</div>
          </div>
        </div>
      </section>
    </main>
  )
}
