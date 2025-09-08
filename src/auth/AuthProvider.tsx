
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, supaReady } from '../lib/supabase'

type Ctx = {
  user: User | null
  loading: boolean
  error?: string | null
  requestCode: (email: string) => Promise<{ ok: boolean; error?: string }>
  verifyCode: (email: string, token: string) => Promise<{ ok: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<Ctx>({
  user: null,
  loading: true,
  error: null,
  async requestCode(){ return { ok: false } },
  async verifyCode(){ return { ok: false } },
  async signOut(){}
})

function sanitizeToken(t: string){
  return t.replace(/[^0-9A-Za-z-_]/g, '').trim()
}

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        if (!supaReady() || !(supabase as any)?.auth) {
          setError('Supabase ist nicht konfiguriert (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')
          return
        }
        const { data } = await supabase.auth.getSession()
        if (mounted) setUser(data.session?.user ?? null)
        supabase.auth.onAuthStateChange((_e, sess) => mounted && setUser(sess?.user ?? null))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  async function requestCode(email: string){
    setError(null)
    try {
      if (!supaReady() || !(supabase as any)?.auth) {
        const msg = 'Supabase ist nicht konfiguriert (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
        setError(msg); return { ok: false, error: msg }
      }
      const emailRedirectTo = window.location.origin + window.location.pathname
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } })
      if (error) { setError(error.message); return { ok: false, error: error.message } }
      return { ok: true }
    } catch (e: any) {
      setError(e?.message ?? 'signIn failed'); return { ok: false, error: e?.message ?? 'signIn failed' }
    }
  }

  async function verifyCode(email: string, token: string){
    setError(null)
    const cleaned = sanitizeToken(token)
    try {
      if (!supaReady() || !(supabase as any)?.auth) {
        const msg = 'Supabase ist nicht konfiguriert (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
        setError(msg); return { ok: false, error: msg }
      }
      // Try multiple types for robustness
      const types: any[] = ['email', 'magiclink', 'signup']
      let lastErr: string | null = null
      for (const t of types){
        const { error } = await supabase.auth.verifyOtp({ email, token: cleaned, type: t })
        if (!error) return { ok: true }
        lastErr = error.message
      }
      setError(lastErr ?? 'verify failed')
      return { ok: false, error: lastErr ?? 'verify failed' }
    } catch (e: any) {
      setError(e?.message ?? 'verify failed'); return { ok: false, error: e?.message ?? 'verify failed' }
    }
  }

  async function signOut(){
    try { if ((supabase as any)?.auth) await supabase.auth.signOut() } catch {}
    setUser(null)
  }

  const value = useMemo<Ctx>(() => ({ user, loading, error, requestCode, verifyCode, signOut }), [user, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){ return useContext(AuthContext) }
