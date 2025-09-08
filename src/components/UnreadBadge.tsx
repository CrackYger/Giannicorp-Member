
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthProvider'

export default function UnreadBadge({ className = '' }: { className?: string }){
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(()=>{
    let timer: any
    async function load(){
      if (!user) return
      const n = await api.unreadTicketsCount({ id: user.id, email: user.email ?? '' } as any)
      setCount(n)
    }
    load()
    // refresh occasionally
    timer = setInterval(load, 5000)
    return () => clearInterval(timer)
  }, [user])

  if (!count) return null
  return (
    <span className={'px-1.5 py-0.5 rounded-full text-[10px] bg-rose-400 text-slate-950 font-bold ' + className}>
      {count}
    </span>
  )
}
