
# Giannicorp Member — v0.5.0 (Offer-Detail, Suche, Unread-Badges, Wunsch-Abo UX)

**Neu in v0.5.0**
- **Offer-Detailseite** (`/offers/:slug`) mit Preis, Bedingungen, FAQ & CTA „Dieses Abo anfragen“.
- **Katalog-Suche** (Titel/Beschreibung/Bedingungen).
- **Wunsch-Abo UX**: Im Formular ist Standard jetzt **Wunsch-Abo** (sofern nicht aus Katalog gekommen).
- **Unread-Badge** am Support-Tab + pro Ticket; **gelesen** wird beim Öffnen des Tickets.
- **Supabase**: Neue Tabelle `ticket_reads` (RLS-Policies) zur Lesestatus-Verfolgung.

**Migrationen (falls Supabase aktiv):**
- `0001_init.sql` → `0002_events_policies.sql` → **`0003_ticket_reads.sql`** in dieser Reihenfolge ausführen.

**Hinweis zur Performance:** Die Unread-Berechnung in Supabase ist bewusst simpel (einfach & robust).
