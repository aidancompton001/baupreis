# T023 — Bug: Keine Preisanzeige in Material-Karten (nur %)

**Datum:** 2026-03-27
**Status:** Analyse (P0)
**Verantwortlich:** #5 Stefan Hartmann — Backend Engineer
**Groesse:** S
**Skill:** systematic-debugging

---

## Symptom

Screenshot: Material-Karten (METALS) zeigen change_pct (7 DAYS +1.52%, 30 DAYS +18.33% etc.) und Empfehlungen (Buy Now / Wait), aber **KEINE PREISE** (z.B. "2.847,50 EUR/t").

---

## Root Cause Analysis

### Datenfluss

```
/api/prices?days=1  →  priceMap  →  {latestPrice && (<Preis>)}
/api/analysis       →  analysis  →  Name, %, Empfehlung
```

### RC1: `days=1` ist zu restriktiv

**Datei:** `app/src/app/(dashboard)/dashboard/materialien/page.tsx:65`
```typescript
fetch("/api/prices?days=1")
```

**Datei:** `app/src/app/api/prices/route.ts:40`
```sql
AND p.timestamp > NOW() - make_interval(days => 1)
```

**Problem:** Wenn `collect-prices` Cron nicht in den letzten 24 Stunden gelaufen ist (oder Eurostat-Preise nur mit Tages-Granularitaet gespeichert werden), liefert `days=1` KEINE Ergebnisse.

**Zusaetzlich:** `date_trunc('day', p.timestamp)` (Zeile 33) gruppiert nach Tag. Wenn Preise gestern gesammelt wurden und `NOW() - 1 day` gerade die Grenze ueberschreitet (Zeitzone CET vs UTC), fallen gestrige Preise raus.

### RC2: Preis wird nur bei `latestPrice && (...)` angezeigt

**Datei:** `page.tsx:143`
```typescript
{latestPrice && (
  <div className="mb-2">
    <p className="text-lg font-bold text-gray-900 font-oswald">
      {formatPrice(latestPrice.price_eur, latestPrice.unit)}
    </p>
  </div>
)}
```

Wenn `priceMap.get(item.code)` undefined ist → kein Preis-Block, kein Fallback, kein "N/A".

### Beweis

- Analysis-Daten (change_pct, trend, recommendation) sind vorhanden → `/api/analysis` funktioniert
- Preise fehlen → `/api/prices?days=1` liefert leeres Array oder die `code`-Keys matchen nicht
- Wahrscheinlichste Ursache: `collect-prices` Cron hat keine frischen Preise (<24h) in der DB

---

## Dateien betroffen

| Datei | Zeile | Aenderung |
|-------|-------|-----------|
| `app/src/app/(dashboard)/dashboard/materialien/page.tsx` | 65 | `days=1` → `days=2` oder `days=3` (Sicherheitspuffer) |
| `app/src/app/(dashboard)/dashboard/materialien/page.tsx` | 143-154 | Optional: Fallback "—" wenn kein Preis |

### NICHT AENDERN
- `prices/route.ts` — API ist korrekt, das Frontend fragt zu wenig Tage an
- `analysis/route.ts` — funktioniert korrekt
- `data-sources.ts` — nicht betroffen

---

## Was WURDE → Was WIRD

| Aspekt | IST | SOLL |
|--------|-----|------|
| Tage-Parameter | `days=1` (nur letzte 24h) | `days=2` (48h Puffer fuer Cron-Verzoegerung) |
| Kein Preis | Nichts angezeigt (Block ausgeblendet) | Fallback "—" oder letzten verfuegbaren Preis |

---

## Was kann brechen

- Layout: KEIN Risiko (Preis-Block ist bereits optional)
- API-Last: KEIN Risiko (2 statt 1 Tag = minimal mehr Daten)
- Breakpoints: NICHT betroffen (reine Datenlogik)
- Navigation/Anker/Animationen: NICHT betroffen

---

## Roadmap

1. `page.tsx:65` aendern: `fetch("/api/prices?days=1")` → `fetch("/api/prices?days=2")`
2. Optional: Fallback in `page.tsx:143` wenn kein Preis → "—" anzeigen
3. Build pruefen
4. Verifizieren: `collect-prices` Cron Status auf Server pruefen (wann lief er zuletzt?)

---

## Checkliste Abnahme

- [ ] Material-Karten zeigen Preise (EUR/t, EUR/m3 etc.)
- [ ] `days=2` als Parameter
- [ ] Kein Layout-Bruch auf 375/768/1440
- [ ] Build OK
- [ ] Wenn Cron nicht laeuft: manuell triggern
