
# Giannicorp Member — v0.3.0 (Auth: E-Mail Magic Link)

**Neu in v0.3.0**
- Supabase Auth (E-Mail Magic-Link) mit **Demo-Fallback**, falls keine Env-Keys gesetzt sind.
- Geschützte Routen (Home, Katalog, Anfragen, Tickets, Profil).
- Seiten: `/auth` (Anmelden), `/auth/callback` (Rückkehr-Link).

## So nutzt du es ohne Backend
- Nichts weiter tun. Beim Start bist du automatisch im **Demo-Modus**.
- `/auth` zeigt einen Button „Als Demo fortfahren“.

## Mit Supabase (kostenlos)
1) `.env` füllen (wie in vorheriger Version).
2) In der Supabase-Konsole unter Authentication > URLS **Site URL** auf deine Dev-URL setzen (z. B. `http://localhost:5173`) und **Redirect URLs** `http://localhost:5173/auth/callback` hinzufügen.
3) In der App auf `/auth` deine E-Mail eingeben → Magic Link kommt → anklicken → zurück zur App.

## Geschützte Routen
- Nicht angemeldet → Redirect zu `/auth`.
- Nach Login → alle Tabs nutzbar.
