
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function ProtectedRoute(){
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <div className="p-6 text-slate-300">Lade…</div>
  if (!user) return <Navigate to="/auth" state={{ from: loc }} replace />
  return <Outlet />
}
