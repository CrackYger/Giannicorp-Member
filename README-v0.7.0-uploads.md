
# Giannicorp Member — v0.7.0 Uploads (Drop-in)

**Neu:**
- Datei-Uploads (bis 5 MB je Datei) für **Anfragen** & **Tickets**.
- Private Supabase Storage-Bucket `gc_uploads` mit RLS.
- UI: FilePicker in „Neue Anfrage“ & „Ticket-Detail“. Download via Signed URL.

## Setup
1) Supabase: `supabase/0005_uploads.sql` im SQL-Editor ausführen (nach 0001–0004).
2) In der Member-App `.env` ist bereits `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` gesetzt.
3) Dateien aus dieser ZIP **ins Projekt kopieren und ersetzen**:
   - `src/types.ts`
   - `src/components/FilePicker.tsx`
   - `src/pages/NewRequest.tsx`
   - `src/pages/RequestDetail.tsx`
   - `src/pages/TicketDetail.tsx`
   - `src/lib/api.ts`
   - `src/lib/supabaseStore.ts`
   - `supabase/0005_uploads.sql`
4) `npm i` (falls nötig) → `npm run dev`

## Hinweise
- Upload-Pfade: `${user.id}/<timestamp>_<filename>`
- Downloads: 1h gültige Signed URLs.
- Admins können alle Uploads lesen (per Policy).
