
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Request } from '../types'
import { useAuth } from '../auth/AuthProvider'
import { Link } from 'react-router-dom'

const statusColor: Record<string,string> = {
  Submitted: 'bg-slate-700',
  UnderReview: 'bg-amber-400 text-slate-950',
  InfoRequested: 'bg-rose-400 text-slate-950',
  Approved: 'bg-emerald-400 text-slate-950',
  Active: 'bg-emerald-600',
  Closed: 'bg-slate-600'
}

export default function MyRequests(){
  const [items, setItems] = useState<Request[]>([])
  const { user } = useAuth()

  useEffect(()=>{
    if (!user) return
    api.listRequests({ id: user.id, email: user.email ?? '' } as any).then(setItems)
  }, [user])

  return (
    <main className="py-6 space-y-4">
      <h2 className="text-xl font-semibold">Meine Anfragen</h2>
      <div className="space-y-3">
        {items.map(r => (
          <Link to={`/requests/${r.id}`} key={r.id} className="block rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{r.title}</div>
                <div className="text-slate-400 text-sm">Status seit: {new Date(r.updated_at).toLocaleString()}</div>
              </div>
              <span className={'px-2 py-1 rounded-lg text-xs font-semibold ' + (statusColor[r.status] ?? 'bg-slate-700')}>{r.status}</span>
            </div>
          </Link>
        ))}
        {!items.length && <div className="text-slate-400">Noch keine Anfragen.</div>}
      </div>
    </main>
  )
}
