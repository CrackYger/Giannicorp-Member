
# Giannicorp Member — v0.6.0 (External Admin Bridge)

Dieses Update **entfernt/ignoriert** den In-App-Admin und schickt stattdessen Ereignisse an **deine bestehende Admin-App** (Webhook).

## Was ist neu
- `src/lib/bridge.ts`: Kleiner Webhook-Sender mit HMAC-Signatur (optional).
- `src/lib/env.ts`: Neue Variablen `VITE_ADMIN_WEBHOOK_URL`, `VITE_ADMIN_WEBHOOK_SECRET`.
- `src/lib/api.ts`: Sendet Events an den Webhook bei:
  - `request.created`
  - `request.event` (z. B. `InfoProvided`)
  - `ticket.created`
  - `ticket.message` (wenn User schreibt)

## Konfiguration (.env)
```env
# optional – nur setzen, wenn du an deine Admin-App senden willst
VITE_ADMIN_WEBHOOK_URL=https://deine-admin-app.example.com/api/giannicorp/inbox
VITE_ADMIN_WEBHOOK_SECRET=ein_langes_geheimes_token
```

Wenn `VITE_ADMIN_WEBHOOK_URL` **nicht** gesetzt ist, passiert **keine** Auslieferung (no-op).

## Payload & Sicherheit
- HTTP POST, `Content-Type: application/json`
- Headers:
  - `X-Giannicorp-Event`: z. B. `request.created`
  - `X-Giannicorp-Signature`: `sha256=...` (HMAC über **Body**, Key = `VITE_ADMIN_WEBHOOK_SECRET`), optional
- Body:
```json
{
  "event": "request.created",
  "ts": "2025-09-08T20:00:00.000Z",
  "data": {
    "user": { "id": "...", "email": "..." },
    "request": { "...": "..." }  // je nach Event: request / event / ticket / message
  }
}
```

## Beispiel-Endpoint (Express)
```js
import express from 'express'
import crypto from 'crypto'

const app = express()
app.use(express.json({ limit: '1mb' }))

app.post('/api/giannicorp/inbox', (req, res) => {
  const event = req.header('X-Giannicorp-Event')
  const sig = req.header('X-Giannicorp-Signature') // "sha256=..."
  const secret = process.env.GIANNICORP_WEBHOOK_SECRET

  if (secret && sig) {
    const h = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('base64')
    if (sig !== 'sha256=' + h) return res.status(401).send('Bad signature')
  }

  switch (event) {
    case 'request.created':
      // TODO: in Admin-DB speichern, Benachrichtigung auslösen, etc.
      break
    case 'request.event':
      // TODO
      break
    case 'ticket.created':
    case 'ticket.message':
      // TODO
      break
    default:
      return res.status(400).send('Unknown event')
  }
  res.json({ ok: true })
})

app.listen(3000, ()=> console.log('Inbox ready'))
```

## CORS
Erlaube in deiner Admin-App **CORS** für die Origin deiner Member-PWA (z. B. `http://localhost:5173` und deine spätere Domain).

## Alternative (ohne eigenes Endpoint)
- **Supabase als gemeinsame Datenbasis**: Member schreibt in Supabase; deine Admin-App liest von dort (empfohlen, null Webhook-Komplexität).
- **E-Mail/Telegram**: Leichtgewichtige Benachrichtigungen zusätzlich.
