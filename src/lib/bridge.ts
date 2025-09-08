
import { getEnv } from './env'

async function hmacSHA256(secret: string, payload: string): Promise<string | null> {
  try {
    // Browser WebCrypto
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
    // convert ArrayBuffer -> base64
    const bytes = new Uint8Array(sig)
    let bin = ''
    bytes.forEach(b => bin += String.fromCharCode(b))
    return 'sha256=' + btoa(bin)
  } catch {
    return null
  }
}

export async function emit(event: string, payload: any){
  const { adminWebhookUrl, adminWebhookSecret } = getEnv()
  if (!adminWebhookUrl) return // silently no-op if not configured

  const body = JSON.stringify({
    event,
    ts: new Date().toISOString(),
    data: payload
  })

  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    'X-Giannicorp-Event': event,
  }

  if (adminWebhookSecret) {
    const sig = await hmacSHA256(adminWebhookSecret, body)
    if (sig) headers['X-Giannicorp-Signature'] = sig
  }

  try {
    await fetch(adminWebhookUrl, {
      method: 'POST',
      headers,
      body,
      keepalive: true, // allow on page unload
      mode: 'cors',
    })
  } catch (e) {
    // swallow errors to not break UX
    console.warn('[bridge] webhook send failed', e)
  }
}
