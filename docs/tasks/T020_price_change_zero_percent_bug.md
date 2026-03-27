# T020 — Bug: Alle Materialien zeigen 0.00% Preisaenderung

**Datum:** 2026-03-27
**Status:** Analyse (P0)
**Verantwortlich:** #5 Stefan Hartmann — Backend Engineer
**Groesse:** M
**Skill:** systematic-debugging

---

## Symptom

Auf `/dashboard/materialien` zeigen ALLE Material-Karten:
- 7 DAYS: **0.00%**
- 30 DAYS: **0.00%**

Screenshot bestaetigt: Bewehrungsstahl BSt 500 (786,78 EUR/t) und Stahltraeger HEB/IPE (1.136,46 EUR/t) — beide 0.00%.

---

## Root Cause Analysis (Phase 1-2 abgeschlossen)

### Datenfluss

```
collect-prices (alle 6h) → prices-Tabelle → analyze (alle 12h) → analysis-Tabelle → /api/analysis → Materialien-Karten
```

### 3 Root Causes identifiziert

#### RC1: Eurostat-Preise sind MONATLICH identisch (10 von 16 Materialien)

**Datei:** `app/src/lib/data-sources.ts:123-152`

Eurostat liefert MONATLICHE Indizes. `collect-prices` laeuft alle 6 Stunden.
Innerhalb eines Monats liefert Eurostat den GLEICHEN Index → gleicher berechneter Preis.

**Beispiel:** steel_rebar base=540, Index=145.7
- Jede Abfrage: `540 * 145.7 / 100 = 786.78` → identisch
- 90 Tage Preisdaten: hunderte Zeilen, ALLE 786.78 EUR/t
- 7d-Aenderung: `(786.78 - 786.78) / 786.78 * 100 = 0.00%` ← korrekt berechnet, aber nutzlos

**Betroffene Materialien (Eurostat):**
`steel_rebar`, `steel_beam`, `wood_kvh`, `wood_bsh`, `wood_osb`,
`concrete_c25`, `cement_cem2`, `insulation_eps`, `insulation_xps`, `insulation_mw`

#### RC2: Synthetic Fallback berechnet change_pct falsch

**Datei:** `app/src/app/api/cron/analyze/route.ts:96-104`

```typescript
// BUG: Nimmt prices[6] (7. Eintrag) statt den Preis von vor 7 TAGEN
const oldPrice = prices[Math.min(prices.length - 1, 6)]?.price_eur;
```

- `prices` ist nach timestamp DESC sortiert → `prices[6]` = 7. neuester Eintrag
- Bei 6h-Intervall: `prices[6]` = Preis von vor ~42 Stunden, NICHT 7 Tage
- Ausserdem: alle Eurostat-Preise sind identisch → oldPrice == latestPrice → 0%

**Zweiter Bug Zeile 104:**
```typescript
const change30d = change7d * 1.8;  // Heuristik, keine echte Berechnung
```

#### RC3: Claude AI Prompt definiert change_pct nicht

**Datei:** `app/src/app/api/cron/analyze/route.ts:186-191`

System-Prompt listet:
```
"change_pct_7d": number,
"change_pct_30d": number,
```

**ABER:** Keine Definition was diese Werte bedeuten. Keine Berechnungsanweisung.
Claude erhaelt zwar 10 Preispunkte + MA7/MA30, aber ohne explizite Anweisung:
- "Berechne prozentuale Aenderung gegenueber dem Preis vor 7/30 Tagen"

Claude gibt wahrscheinlich 0 zurueck wenn alle Preise identisch sind.

---

## Was WURDE → Was MUSS werden

| Aspekt | IST | SOLL |
|--------|-----|------|
| Eurostat-Preise innerhalb Monat | Alle identisch → 0% | Vergleich mit letztem VERSCHIEDENEN Index |
| Synthetic oldPrice | `prices[6]` (falscher Index) | Preis mit timestamp >= 7 Tage zurueck |
| change30d (Synthetic) | `change7d * 1.8` (Heuristik) | Preis mit timestamp >= 30 Tage zurueck |
| Claude Prompt | Keine Definition von change_pct | Explizite Berechnungsanweisung |
| Eurostat Index-Vergleich | Aktueller Index vs gleicher Index | Aktueller Index vs Index von Vormonat |

---

## Dateien betroffen

| Datei | Aenderung |
|-------|-----------|
| `app/src/app/api/cron/analyze/route.ts:96-104` | Synthetic: timestamp-basierte Berechnung |
| `app/src/app/api/cron/analyze/route.ts:180-206` | Claude Prompt: change_pct Definition |
| `app/src/lib/data-sources.ts:123-152` | Optional: Eurostat vorherigen Monat mitliefern |
| `app/src/app/(dashboard)/dashboard/materialien/page.tsx` | Keine Aenderung noetig (Display korrekt) |
| `app/src/app/api/analysis/route.ts` | Keine Aenderung noetig (API korrekt) |

---

## Was kann brechen

- Dashboard-Karten: KEIN Risiko (lesen nur aus analysis-Tabelle)
- Alerting (`send-alerts`): nutzt `change_pct` indirekt → pruefen
- BauPreis Index: KEIN Risiko (berechnet aus prices, nicht analysis)
- Breakpoints: NICHT betroffen (reine Backend-Aenderung)
- Navigation/Anker/JS/Animationen: NICHT betroffen

---

## Tests noetig

1. Unit: Synthetic change_pct Berechnung mit verschiedenen Preishistorien
2. Unit: Korrekte Erkennung von Monatswechsel in Eurostat-Daten
3. Integration: analyze-Cron gibt non-zero change_pct zurueck bei realen Preisdaten

---

## Roadmap

1. **Synthetic Fallback fixen** (`analyze/route.ts:96-104`):
   - `oldPrice` = Preis mit `timestamp <= now - 7 Tage` (nicht Array-Index)
   - `change30d` = Preis mit `timestamp <= now - 30 Tage` (nicht Heuristik)
   - Fallback wenn kein alter Preis: `0` mit `null`-Markierung

2. **Claude Prompt erweitern** (`analyze/route.ts:186-206`):
   - Explizite Regel hinzufuegen:
     ```
     - change_pct_7d = prozentuale Aenderung gegenueber dem Preis vor 7 Tagen
     - change_pct_30d = prozentuale Aenderung gegenueber dem Preis vor 30 Tagen
     - Formel: ((aktuell - alt) / alt) * 100
     - Wenn alle Preise identisch: trotzdem 0.00 (korrekt)
     ```

3. **Eurostat: vorherigen Monat mitliefern** (optional, `data-sources.ts`):
   - Zweiten Eurostat-Abfrage fuer Vormonats-Index
   - Oder: In `analyze/route.ts` die aeltesten Preise im 90-Tage-Fenster nutzen
   - Damit change_pct bei Monatswechsel korrekte Werte zeigt

4. **Unit-Tests schreiben**:
   - Test: prices mit verschiedenen Werten → korrekte Prozent
   - Test: prices alle identisch → 0.00%
   - Test: prices mit nur 1 Eintrag → null/0
   - Test: timestamp-basierte Auswahl statt Index

5. **Tests ausfuehren und verifizieren**

6. **Manuell testen**: analyze-Cron lokal ausfuehren, Ergebnis pruefen

---

## Checkliste Abnahme

- [ ] Synthetic: `change_pct_7d` basiert auf Timestamp, nicht Array-Index
- [ ] Synthetic: `change_pct_30d` ist echte Berechnung, keine Heuristik
- [ ] Claude Prompt: Definition von `change_pct_7d/30d` explizit
- [ ] Eurostat-Materialien zeigen korrekte % bei Monatswechsel
- [ ] metals.dev-Materialien zeigen taeglich wechselnde %
- [ ] Unit-Tests geschrieben und bestanden
- [ ] Build OK
- [ ] Keine Regression bei Alerts/Index
