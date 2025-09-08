
# v0.7.7 – UI Fix + Auto-Redirect
- Entfernt doppelte E‑Mail-Eingabe: ein gemeinsames Feld oben.
- Code-Eingabe erscheint erst nach "Code schicken" oder via "Ich habe bereits einen Code".
- Automatischer Redirect auf **/offers**, sobald `user` gesetzt ist.

## Einbau
1) Datei ersetzen: `src/pages/SignIn.tsx`
2) Prüfe, dass deine Abo-Seite unter `/offers` erreichbar ist; andernfalls die Route im Code anpassen.
