# T025 — Cron 3x/Tag + days=90 fuer Preisanzeige

**Datum:** 2026-03-27
**Status:** Analyse (P0)
**Verantwortlich:** #6 Dirk Schneider — SRE + #3 Erik Zimmermann — Frontend
**Groesse:** S
**Skill:** systematic-debugging

---

## Root Cause (verifiziert)

1. **metals.dev Free Tier: 100 req/Monat**
   - Cron: 4x/Tag x 31 Tage = **124 req → Quota exhausted**
   - API-Antwort: `{"status":"failure","error_code":1203,"error_message":"Your plan quota for the month is exhausted."}`
   - Letzte LME-Preise in DB: **2026-03-13** (14 Tage alt)

2. **Frontend: `days=7` zu kurz**
   - LME-Preise 14 Tage alt → `days=7` findet sie nicht
   - Karte zeigt keinen Preis

---

## Fix (2 Aenderungen)

### 1. Cron: 4x → 3x pro Tag (Server crontab)

**WURDE:** `0 0,6,12,18 * * *` (4x = 124 req/mo)
**WIRD:** `0 1,9,17 * * *` (3x = 93 req/mo < 100 Limit)

Berechnung: 3 x 31 = 93 < 100 ✅

Alle API-Quellen (Eurostat, SMARD, Tankerkoenig) sind nicht betroffen — sie haben kein Monats-Limit.

### 2. Frontend: `days=7` → `days=90`

**WURDE:** `fetch("/api/prices?days=7")`
**WIRD:** `fetch("/api/prices?days=90")`

Damit werden auch 14 Tage alte LME-Preise angezeigt. Die `priceMap` nimmt den neuesten Preis pro Material (`if (!map.has(p.code))`), also keine Duplikate.

API-Last: 16 Materialien x 90 Tage = max ~1440 Zeilen — vernachlaessigbar.

---

## Dateien

| Datei | Aenderung |
|-------|-----------|
| Server: `crontab -e` | `0 0,6,12,18` → `0 1,9,17` |
| `app/src/app/(dashboard)/dashboard/materialien/page.tsx:65` | `days=7` → `days=90` |

## Was kann brechen

- **Nichts.** Cron-Aenderung ist Server-only (kein Code). Frontend-Aenderung ist 1 Zahl.
- Eurostat/SMARD: unaffected (kein Rate Limit)
- Breakpoints: nicht betroffen
- Navigation/Animationen: nicht betroffen
- Tests: nicht betroffen

---

## Roadmap

1. Frontend: `page.tsx:65` aendern — `days=7` → `days=90`
2. Build pruefen
3. Git commit + push
4. Server: `crontab -e` — `0 0,6,12,18` → `0 1,9,17`
5. Server: docker build + restart
6. Smoke test: Material-Karten zeigen Preise

---

## Checkliste Abnahme

- [ ] `days=90` in `page.tsx`
- [ ] Crontab: 3x/Tag (`0 1,9,17 * * *`)
- [ ] METALS-Karten zeigen Preis (auch alte LME-Daten)
- [ ] Eurostat-Karten zeigen Preis
- [ ] Build OK
- [ ] Deploy OK
