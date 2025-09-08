
# Giannicorp Member — PWA Skeleton (Zero-Cost, iOS-ready)

**Fertig zum Starten.** Mobile-first PWA mit Update-Banner, Tabbar, Beispielseiten
(Katalog, Anfrage, Anfragenliste, Tickets, Ticket-Detail, Profil) und Supabase-Stub.

## Start (lokal)
1. Node 18+ installieren
2. Im Projektordner:
   ```bash
   npm i
   npm run dev
   ```
3. Öffnen: http://localhost:5173

## Build
```bash
npm run build
npm run preview
```

## Supabase (optional für MVP-Backend)
- `.env` aus `.env.example` kopieren und befüllen.
- In `src/lib/supabase.ts` wird der Client automatisch erstellt.

## PWA Updates
- Service Worker lädt neue Version im Hintergrund.
- Banner „Update verfügbar“ → Neu laden = Sofort-Update.

## Struktur
- `src/pages/*` — Screens
- `src/components/*` — UI-Komponenten
- `src/lib/supabase.ts` — Backend-Client
- `public/icons/*` — PWA-Icons
"# Giannicorp-Member" 
