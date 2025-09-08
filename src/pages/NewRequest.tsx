
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthProvider'
import FilePicker from '../components/FilePicker'

export default function NewRequest(){
  const nav = useNavigate()
  const loc = useLocation() as any
  const { user } = useAuth()
  const [title, setTitle] = useState(loc?.state?.offerTitle || '')
  const [offerId] = useState<string | undefined>(loc?.state?.offerId)
  const [details, setDetails] = useState('')
  const [type, setType] = useState<'offer'|'custom'>(offerId ? 'offer' : 'custom')
  const [files, setFiles] = useState<File[]>([])

  useEffect(()=>{ api.initDemo() }, [])

  async function submit(){
    if (!user) return
    const req = await api.createRequest({ id: user.id, email: user.email ?? '' } as any, { type, title: title || (type==='offer'?'(ohne Titel)':'Wunsch-Abo'), details, offer_id: offerId })
    if (req && files.length) {
      await api.uploadRequestFiles({ id: user.id, email: user.email ?? '' } as any, req.id, files)
    }
    nav('/requests', { replace: true })
  }

  return (
    <main className="py-6 space-y-4">
      <h2 className="text-xl font-semibold">Neue Anfrage</h2>
      <div className="space-y-3">
        <div className="flex gap-2">
          <button onClick={()=>setType('offer')} className={'px-3 py-1 rounded-lg border ' + (type==='offer'?'bg-brand-400 text-slate-950 border-brand-400':'border-slate-700')}>Abo aus Katalog</button>
          <button onClick={()=>setType('custom')} className={'px-3 py-1 rounded-lg border ' + (type==='custom'?'bg-brand-400 text-slate-950 border-brand-400':'border-slate-700')}>Wunsch-Abo</button>
        </div>
        <label className="block">
          <span className="text-sm text-slate-300">{type==='offer' ? 'Titel / Dienst' : 'Wunsch-Abo / Dienst'}</span>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={type==='offer' ? 'z. B. Netflix Standard' : 'z. B. YouTube Premium Family'}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-brand-400" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Details (optional)</span>
          <textarea value={details} onChange={e=>setDetails(e.target.value)} rows={5} placeholder="Wunschstart, Notizen, Besonderheiten…"
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-brand-400" />
        </label>

        <div className="space-y-2">
          <div className="text-sm text-slate-300">Anhänge (max. 5 MB je Datei)</div>
          <div className="flex gap-2 flex-wrap">
            <FilePicker onPick={(picked)=> setFiles(prev => [...prev, ...picked])} />
            {files.map((f,i) => (
              <span key={i} className="px-2 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700">{f.name}</span>
            ))}
          </div>
        </div>

        <button onClick={submit} className="px-4 py-2 rounded-lg bg-brand-400 text-slate-950 font-semibold w-full">Anfrage senden</button>
      </div>
    </main>
  )
}
