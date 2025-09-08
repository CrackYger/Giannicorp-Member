
import { useEffect } from 'react'
import { api } from '../lib/api'

export default function Home(){
  useEffect(()=>{ api.initDemo() }, [])
  return (
    <main className="py-6 space-y-4">
      <h1 className="text-2xl font-bold">Giannicorp Member</h1>
      <p className="text-slate-300">
        Willkommen! Hier siehst du deinen Abo-Katalog, kannst Abos anfragen,
        Wunsch-Abos vorschlagen und Support-Tickets erstellen.
      </p>
    </main>
  )
}
