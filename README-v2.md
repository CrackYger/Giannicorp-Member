
# Giannicorp Member — v0.2.0 (Data Layer + Demo Backend)

**Neu in dieser Version:**
- Daten-Layer (`src/lib/api.ts`) mit **automatischem Fallback**:
  - Wenn **Supabase env** gesetzt: echte Cloud-DB.
  - Sonst: **lokale Demo** via LocalStorage (funktioniert sofort).
- Seiten sind an den Store angebunden:
  - Abo-Katalog liest aus Store (Demo-Angebote werden beim ersten Start gesät).
  - Neue Anfrage speichert im Store.
  - Meine Anfragen, Tickets und Ticket-Thread nutzen Store-APIs.
- Supabase **SQL-Migration**: `supabase/0001_init.sql` (Tabellen + RLS).

## Nutzung ohne Backend (Demo, 0 Schritte)
Einfach `npm i` + `npm run dev` → alles läuft lokal mit LocalStorage.

## Umstieg auf echtes Backend (Supabase)
1) Supabase-Projekt erstellen, SQL aus `supabase/0001_init.sql` ausführen.
2) `.env` befüllen:
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
3) App neu starten → Store nutzt automatisch Supabase.
