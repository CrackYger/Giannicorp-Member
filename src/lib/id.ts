
export function uid(prefix = ''){
  const r = Math.random().toString(36).slice(2, 8)
  return `${prefix}${Date.now().toString(36)}${r}`
}
