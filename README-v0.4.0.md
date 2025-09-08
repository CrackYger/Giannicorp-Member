
# Giannicorp Member — v0.4.0 (Request-Detail + Timeline + Info-Reply)

**Neu in v0.4.0**
- **Request-Detailseite** (`/requests/:id`) mit **Timeline** (Ereignisse).
- **Zusatzinfo senden** bei Status **InfoRequested** (fügt Event `InfoProvided` hinzu und setzt Status auf **UnderReview**).
- **Anfragenliste** klickbar → Detailansicht.
- **Supabase-Migration** `supabase/0002_events_policies.sql`: erlaubt Nutzern Events für eigene Anfragen einzutragen; Trigger aktualisiert `requests.updated_at` automatisch.

**Demo-Mode (ohne Backend):**
- Events & Status werden in LocalStorage verwaltet.

**Mit Supabase:**
- `0001_init.sql` aus v0.2.0 + `0002_events_policies.sql` ausführen.
- `.env` mit URL & ANON KEY füllen.
