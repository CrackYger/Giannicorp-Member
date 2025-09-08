
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback(){
  const nav = useNavigate()
  const [msg, setMsg] = useState('Anmeldung wird bestätigt…')

  useEffect(()=>{
    let alive = true
    ;(async () => {
      try {
        // Supabase v2: for email magic links usually the session is set automatically.
        // We still try to retrieve session to confirm.
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (alive) setMsg('Erfolgreich angemeldet.')
      } catch (e) {
        console.error(e)
        if (alive) setMsg('Fehler bei der Anmeldung. Öffne den Link ggf. erneut.')
      } finally {
        setTimeout(()=> nav('/', { replace: true }), 800)
      }
    })()
    return () => { alive = false }
  }, [nav])

  return <main className="p-6">{msg}</main>
}
