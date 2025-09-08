
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { TicketMessage, TicketFile } from '../types'
import { useAuth } from '../auth/AuthProvider'
import FilePicker from '../components/FilePicker'

export default function TicketDetail(){
  const { id } = useParams()
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [body, setBody] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [attachments, setAttachments] = useState<TicketFile[]>([])
  const { user } = useAuth()

  async function load(){
    if (!id || !user) return
    const res = await api.getTicket({ id: user.id, email: user.email ?? '' } as any, id)
    if (res) { setMessages(res.messages) }
    await api.markTicketRead({ id: user.id, email: user.email ?? '' } as any, id)
    const a = await api.getTicketFiles(id)
    setAttachments(a)
  }
  useEffect(()=>{ load() }, [id, user])

  async function send(){
    if(!id || (!body.trim() && files.length===0) || !user) return
    if (files.length) {
      await api.uploadTicketFiles({ id: user.id, email: user.email ?? '' } as any, id, files)
      setFiles([])
    }
    if (body.trim()) {
      const msg = await api.sendTicketMessage({ id: user.id, email: user.email ?? '' } as any, id, body)
      setMessages(prev => [...prev, msg])
      setBody('')
    }
    await load()
  }

  async function open(path: string){
    const url = await api.getSignedUrl(path)
    if (url) window.open(url, '_blank')
  }

  return (
    <main className="py-6 space-y-4">
      <h2 className="text-xl font-semibold">Ticket</h2>
      <div className="space-y-2">
        {messages.map(m => (
          <div key={m.id} className={'max-w-[80%] rounded-xl px-3 py-2 ' + (m.sender==='user'?'bg-brand-400 text-slate-950 ml-auto':'bg-slate-800')}>
            <div className="text-sm whitespace-pre-wrap">{m.body}</div>
            <div className="text-[10px] opacity-60">{new Date(m.created_at).toLocaleTimeString()}</div>
          </div>
        ))}
        {!messages.length && <div className="text-slate-400">Noch keine Nachrichten.</div>}
      </div>

      <section className="space-y-2">
        <div className="text-sm text-slate-300">Anhänge</div>
        <div className="space-y-2">
          {attachments.map(a => (
            <button key={a.id} onClick={()=>open(a.path)} className="w-full text-left rounded-xl border border-slate-800 bg-slate-900 p-3">
              <div className="text-sm">{a.path.split('/').slice(1).join('/')}</div>
              <div className="text-[10px] text-slate-500">{new Date(a.created_at).toLocaleString()}</div>
            </button>
          ))}
          {!attachments.length && <div className="text-slate-400">Keine Anhänge.</div>}
        </div>
      </section>

      <div className="fixed bottom-16 left-0 right-0 px-4 space-y-2">
        <div className="max-w-screen-md mx-auto bg-slate-900 border border-slate-700 rounded-xl p-2 flex gap-2">
          <input value={body} onChange={e=>setBody(e.target.value)} placeholder="Nachricht…" className="flex-1 bg-transparent outline-none" />
          <FilePicker onPick={(picked)=> setFiles(prev => [...prev, ...picked])} />
          <button onClick={send} className="px-3 py-1 rounded-lg bg-brand-400 text-slate-950 font-semibold">Senden</button>
        </div>
        {files.length ? <div className="max-w-screen-md mx-auto text-xs text-slate-300">{files.length} Datei(en) ausgewählt</div> : null}
      </div>
    </main>
  )
}
