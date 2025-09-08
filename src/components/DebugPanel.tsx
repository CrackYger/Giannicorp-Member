
import { supabase } from '../lib/supabase'

export default function DebugPanel(){
  const hasAuth = !!(supabase as any)?.auth
  return (
    <div className="fixed bottom-2 right-2 text-xs bg-slate-900/90 border border-slate-700 rounded-lg p-2">
      <div>Supabase ready: <b>{String(hasAuth)}</b></div>
      <div>Origin: {window.location.origin}</div>
      <div>Path: {window.location.pathname}</div>
    </div>
  )
}
