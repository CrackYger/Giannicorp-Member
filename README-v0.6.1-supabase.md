
# Member v0.6.1 — Supabase Pack (Drop-in)
**Was ist das?** Ein kleines Paket mit Supabase-Migrationen + env-Helpern.
**Ziel:** Deine Member-App nutzt sofort Supabase (statt LocalStorage), ohne Codearbeit.

## Nutzung
1) Diesen Ordner in dein Projekt kopieren. Vor allem den Ordner **supabase/** und die Dateien unter **src/lib/**.
2) In Supabase im SQL-Editor nacheinander ausführen:
   - `supabase/0001_init.sql`
   - `supabase/0002_events_policies.sql`
   - `supabase/0003_ticket_reads.sql`
   - `supabase/0004_admin_roles.sql`
3) In Supabase dich als Admin hinterlegen:
   ```sql
   insert into admin_users (user_id, note) values ('<DEIN_AUTH_USER_ID>', 'Gianni');
   ```
4) `.env` der **Member-App** setzen (siehe `.env.example.supabase`):
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
5) Dev starten: `npm i && npm run dev`

> Sobald `URL` & `ANON_KEY` gesetzt sind, schaltet die App automatisch auf Cloud (Supabase) um.
