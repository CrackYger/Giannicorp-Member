
export function getEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  const configured = !!(url && key)
  return { url, key, configured }
}
