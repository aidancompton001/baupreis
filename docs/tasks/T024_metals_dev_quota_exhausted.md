# T024 — metals.dev API Quota Exhausted + Fallback fuer LME Metalle

**Datum:** 2026-03-27
**Status:** Analyse
**Verantwortlich:** #5 Stefan Hartmann — Backend Engineer
**Groesse:** M
**Skill:** systematic-debugging

---

## Symptom

Material-Karten fuer METALS (Kupfer, Aluminium, Zink, Nickel) zeigen keine Preise.

## Root Cause (verifiziert)

```
curl 'https://api.metals.dev/v1/latest?api_key=P0JUQKUENWJEUMUTOGAC689UTOGAC&currency=EUR&unit=mt'
→ {"status":"failure","error_code":1203,"error_message":"Your plan quota for the month is exhausted."}
```

- metals.dev Free Tier: **100 Requests/Monat** — aufgebraucht
- Letzte Preise in DB: **2026-03-13** (14 Tage alt)
- `days=7` reicht nicht → 0 Preise fuer LME-Metalle
- Quota Reset: 1. April (Monatsanfang)

## Sofort-Fix

`materialien/page.tsx:65`: `days=7` → `days=30` fuer LME-Metalle (oder global).

**ABER:** `days=30` fuer alle ist suboptimal. Besser: die Materialien-Seite soll den LETZTEN verfuegbaren Preis anzeigen, unabhaengig vom Alter.

## Langfrist-Loesungen

| Option | Aufwand | Risiko |
|--------|---------|--------|
| A: `days=90` in prices query | S | Mehr Daten, aber einfach |
| B: Separater "latest price" API | M | Sauber, aber neue Route |
| C: metals.dev upgraden (Paid Plan) | 0 Code | Kosten: ~$30/mo |
| D: FRED API als Backup integrieren | L | Kostenlos, aber monthly data |

## Empfehlung

**Sofort:** `days=7` → `days=90` (1 Zeile, deckt alle Luecken ab)
**Mittelfristig:** metals.dev Paid Plan oder FRED Backup

## Dateien

| Datei | Aenderung |
|-------|-----------|
| `page.tsx:65` | `days=7` → `days=90` |

## Checkliste

- [ ] `days=90` gesetzt
- [ ] LME-Metalle zeigen Preis (auch wenn 14 Tage alt)
- [ ] Build OK
- [ ] Deploy
