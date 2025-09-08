
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { RequestEvent, RequestFile } from '../types'
import { useAuth } from '../auth/AuthProvider'

export default function RequestDetail(){
  const { id } = useParams()
  const [events, setEvents] = useState<RequestEvent[]>([])
  const [files, setFiles] = useState<RequestFile[]>([])
  const { user } = useAuth()

  async function load(){
    if (!id) return
    const ev = await api.listRequestEvents(id)
    setEvents(ev)
    const f = await api.getRequestFiles(id)
    setFiles(f)
  }
  useEffect(()=>{ load() }, [id])

  async function open(file: RequestFile){
    const url = await api.getSignedUrl(file.path)
    if (url) window.open(url, '_blank')
  }

  return (
    <main className="py-6 space-y-4">
      <h2 className="text-xl font-semibold">Anfrage</h2>
      <section className="space-y-2">
        <div className="text-sm text-slate-300">Timeline</div>
        <div className="space-y-2">
          {events.map(e => (
            <div key={e.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <div className="text-sm font-medium">{e.type}</div>
              {e.message && <div className="text-sm text-slate-300">{e.message}</div>}
              <div className="text-[10px] text-slate-500">{new Date(e.created_at).toLocaleString()}</div>
            </div>
          ))}
          {!events.length && <div className="text-slate-400">Keine Ereignisse.</div>}
        </div>
      </section>

      <section className="space-y-2">
        <div className="text-sm text-slate-300">Anhänge</div>
        <div className="space-y-2">
          {files.map(f => (
            <button key={f.id} onClick={()=>open(f)} className="w-full text-left rounded-xl border border-slate-800 bg-slate-900 p-3">
              <div className="text-sm">{f.path.split('/').slice(1).join('/')}</div>
              <div className="text-[10px] text-slate-500">{new Date(f.created_at).toLocaleString()}</div>
            </button>
          ))}
          {!files.length && <div className="text-slate-400">Keine Anhänge.</div>}
        </div>
      </section>
    </main>
  )
}
