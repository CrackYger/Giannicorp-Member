
import { Route, Routes, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Offers from './pages/Offers'
import OfferDetail from './pages/OfferDetail'
import NewRequest from './pages/NewRequest'
import MyRequests from './pages/MyRequests'
import RequestDetail from './pages/RequestDetail'
import Tickets from './pages/Tickets'
import TicketDetail from './pages/TicketDetail'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import AuthCallback from './pages/AuthCallback'
import UpdateToast from './components/UpdateToast'
import { AuthProvider } from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import UnreadBadge from './components/UnreadBadge'

function TabBar() {
  const cls = (isActive: boolean) =>
    'flex-1 flex flex-col items-center justify-center text-xs relative ' +
    (isActive ? 'text-brand-400' : 'text-slate-400')
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/80 backdrop-blur tabbar-safe">
      <div className="grid grid-cols-5 h-[56px]">
        <NavLink to="/" className={({isActive})=>cls(isActive)}>
          <span>🏠</span><span>Home</span>
        </NavLink>
        <NavLink to="/offers" className={({isActive})=>cls(isActive)}>
          <span>🗂️</span><span>Abos</span>
        </NavLink>
        <NavLink to="/requests" className={({isActive})=>cls(isActive)}>
          <span>📨</span><span>Anfragen</span>
        </NavLink>
        <NavLink to="/tickets" className={({isActive})=>cls(isActive)}>
          <span>❓</span><span>Support</span>
          <UnreadBadge className="absolute -top-1 right-3" />
        </NavLink>
        <NavLink to="/profile" className={({isActive})=>cls(isActive)}>
          <span>👤</span><span>Profil</span>
        </NavLink>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen safe-bottom">
        <div className="max-w-screen-md mx-auto px-4 pb-4">
          <Routes>
            <Route path="/auth" element={<SignIn />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/offers/:slug" element={<OfferDetail />} />
              <Route path="/request/new" element={<NewRequest />} />
              <Route path="/requests" element={<MyRequests />} />
              <Route path="/requests/:id" element={<RequestDetail />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
        <TabBar />
        <UpdateToast />
      </div>
    </AuthProvider>
  )
}
