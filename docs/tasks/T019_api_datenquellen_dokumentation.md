# T019 — API-Datenquellen: Material-Plattform-Zugangsdaten Dokumentation

**Datum:** 2026-03-27
**Status:** Abgeschlossen (ТС2, Landa Review: CONDITIONAL PASS → korrigiert)
**Verantwortlich:** #5 Stefan Hartmann — Backend Engineer
**Groesse:** S
**Skill:** verification-before-completion

---

## Ziel

Dokumentation aller externen API-Datenquellen: welches Material kommt von welcher Plattform, mit welchen Zugangsdaten (Login/API-Key).

---

## Ist-Zustand: 15 aktive Materialien + 1 inaktiv (Diesel), 4 Datenquellen

> **Hinweis:** Diesel (Tankerkoenig) ist im Code implementiert, aber auf dem Server fehlt der API-Key.
> Daher werden in Production nur **15 von 16** Materialien gesammelt.

### 1. metals.dev (LME-Metallpreise)

| Parameter | Wert |
|-----------|------|
| **Website** | https://metals.dev |
| **API-Endpoint** | `https://api.metals.dev/v1/latest?api_key={KEY}&currency=EUR&unit=mt` |
| **Authentifizierung** | API-Key als Query-Parameter |
| **Env-Variable** | `METALS_DEV_API_KEY` |
| **Aktueller Key (Server)** | → siehe `CREDENTIALS.md` |
| **Free Tier** | Ja (100 Requests/Monat) |
| **Timeout** | 10s |

**Materialien:**

| Material-Code | Name (DE) | Einheit | Mapping |
|---------------|-----------|---------|---------|
| `copper_lme` | Kupfer (LME 3-Monats) | EUR/t | response.metals.copper |
| `aluminum_lme` | Aluminium (LME 3-Monats) | EUR/t | response.metals.aluminum |
| `zinc_lme` | Zink (LME 3-Monats) | EUR/t | response.metals.zinc |
| `nickel_lme` | Nickel (LME 3-Monats) | EUR/t | response.metals.nickel |

---

### 2. Eurostat API (Erzeugerpreisindizes Deutschland)

| Parameter | Wert |
|-----------|------|
| **Website** | https://ec.europa.eu/eurostat |
| **API-Endpoint** | `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sts_inppd_m` |
| **Authentifizierung** | Keine (oeffentliche API) |
| **Env-Variable** | Keine |
| **Free Tier** | Ja (unbegrenzt, keine Registrierung) |
| **Timeout** | 15s |

**Berechnung:** `Preis = Basispreis x Index / 100` (Basis: 2015=100)

**Materialien:**

| Material-Code | Name (DE) | Einheit | NACE-Sektor | Basispreis |
|---------------|-----------|---------|-------------|------------|
| `steel_rebar` | Bewehrungsstahl BSt 500 | EUR/t | C24 (Metallerzeugung) | 540 |
| `steel_beam` | Stahltraeger HEB/IPE | EUR/t | C24 (Metallerzeugung) | 780 |
| `wood_kvh` | Konstruktionsvollholz C24 | EUR/m3 | C16 (Holzwaren) | 220 |
| `wood_bsh` | Brettschichtholz GL24h | EUR/m3 | C16 (Holzwaren) | 310 |
| `wood_osb` | OSB/3 Platten 18mm | EUR/m2 | C16 (Holzwaren) | 7.8 |
| `concrete_c25` | Transportbeton C25/30 | EUR/m3 | C23 (Nichtmetallisch) | 72 |
| `cement_cem2` | Zement CEM II/B-LL | EUR/t | C23 (Nichtmetallisch) | 78 |
| `insulation_eps` | EPS WLG 035 | EUR/m3 | C23 (Nichtmetallisch) | 32 |

> **Bug:** Code-Kommentar `data-sources.ts:116` sagt `EUR/m²` — falsch, korrekt ist `EUR/m3`.
| `insulation_xps` | XPS 300kPa | EUR/m3 | C23 (Nichtmetallisch) | 40 |
| `insulation_mw` | Mineralwolle WLG 035 | EUR/m3 | C23 (Nichtmetallisch) | 27 |

---

### 3. Tankerkoenig API (Dieselpreise Echtzeit)

| Parameter | Wert |
|-----------|------|
| **Website** | https://creativecommons.tankerkoenig.de |
| **API-Endpoint** | `https://creativecommons.tankerkoenig.de/json/list.php?lat={LAT}&lng={LNG}&rad=10&sort=price&type=diesel&apikey={KEY}` |
| **Authentifizierung** | API-Key als Query-Parameter (UUID-Format) |
| **Env-Variable** | `TANKERKOENIG_API_KEY` |
| **Aktueller Key** | **NICHT KONFIGURIERT** — kein Key im Server-`.env`. Diesel wird uebersprungen. |
| **Registrierungs-URL** | <https://onboarding.tankerkoenig.de> (kostenlos, UUID-Key) |
| **TODO** | API-Key registrieren und in Server-`.env` als `TANKERKOENIG_API_KEY` eintragen |
| **Free Tier** | Ja (unbegrenzt, kostenlose Registrierung) |
| **Registrierung** | https://onboarding.tankerkoenig.de |
| **Timeout** | 10s |

**Strategie:** Median von 5 Tankstellen in 5 Staedten (Berlin, Muenchen, Hamburg, Koeln, Frankfurt) → nationaler Durchschnitt.

**Materialien:**

| Material-Code | Name (DE) | Einheit |
|---------------|-----------|---------|
| `diesel` | Diesel (Grosshandel) | EUR/l |

---

### 4. SMARD.de API (Strompreise Day-Ahead)

| Parameter | Wert |
|-----------|------|
| **Website** | https://www.smard.de |
| **API-Endpoints** | Index: `https://www.smard.de/app/chart_data/4169/DE/index_day.json` |
| | Daten: `https://www.smard.de/app/chart_data/4169/DE/4169_DE_day_{TIMESTAMP}.json` |
| **Authentifizierung** | Keine (oeffentliche Bundesnetzagentur-Daten) |
| **Env-Variable** | Keine |
| **Free Tier** | Ja (unbegrenzt, keine Registrierung) |
| **Timeout** | 15s |
| **Filter-ID** | 4169 = Day-Ahead-Marktpreis (DE/LU Gebotszone) |

**Materialien:**

| Material-Code | Name (DE) | Einheit |
|---------------|-----------|---------|
| `electricity` | Industriestrom | EUR/MWh |

---

## Zusammenfassung: Material → Plattform → Zugang

| # | Material | Plattform | Auth-Typ | API-Key noetig? |
|---|----------|-----------|----------|-----------------|
| 1 | Kupfer LME | metals.dev | API-Key | Ja |
| 2 | Aluminium LME | metals.dev | API-Key | Ja |
| 3 | Zink LME | metals.dev | API-Key | Ja |
| 4 | Nickel LME | metals.dev | API-Key | Ja |
| 5 | Bewehrungsstahl | Eurostat | Keine | Nein |
| 6 | Stahltraeger | Eurostat | Keine | Nein |
| 7 | KVH C24 | Eurostat | Keine | Nein |
| 8 | BSH GL24h | Eurostat | Keine | Nein |
| 9 | OSB/3 18mm | Eurostat | Keine | Nein |
| 10 | Transportbeton | Eurostat | Keine | Nein |
| 11 | Zement CEM II | Eurostat | Keine | Nein |
| 12 | EPS WLG 035 | Eurostat | Keine | Nein |
| 13 | XPS 300kPa | Eurostat | Keine | Nein |
| 14 | Mineralwolle | Eurostat | Keine | Nein |
| 15 | Diesel | Tankerkoenig | API-Key | **INAKTIV — kein Key auf Server** |
| 16 | Industriestrom | SMARD.de | Keine | Nein |

---

## Zugangsdaten-Status

| Plattform | Status | Env-Variable | Konfiguriert? |
|-----------|--------|--------------|---------------|
| metals.dev | Aktiv | `METALS_DEV_API_KEY` | Ja (Server) |
| Eurostat | Offen | — | Nicht noetig |
| Tankerkoenig | **INAKTIV** | `TANKERKOENIG_API_KEY` | **Nein — Key fehlt auf Server** |
| SMARD.de | Offen | — | Nicht noetig |

---

## Deaktivierte / Geplante Quellen

| Plattform | Status | Grund |
|-----------|--------|-------|
| Destatis GENESIS | Ersetzt durch Eurostat | Haeufige Wartung, unzuverlaessig. **TODO:** `DESTATIS_USER`/`DESTATIS_PASSWORD` aus Server-`.env` entfernen (Hygiene). |
| FRED (Federal Reserve) | Nicht integriert | Geplant als Backup fuer LME-Metalle |
| Energy-Charts (Fraunhofer) | Nicht integriert | SMARD.de bevorzugt |

---

## Code-Referenzen

| Komponente | Datei |
|------------|-------|
| Datenquellen (alle 4 APIs) | `app/src/lib/data-sources.ts` |
| Cron: Preise sammeln | `app/src/app/api/cron/collect-prices/route.ts` |
| Cron: AI-Analyse | `app/src/app/api/cron/analyze/route.ts` |
| Statistik-Fallback | `app/src/lib/forecast-baseline.ts` |
| Benachrichtigungen | `app/src/lib/notifications.ts` |
| BauPreis Index | `app/src/lib/baupreis-index.ts` |
| Typ-Definitionen | `app/src/types/index.ts` |

---

## Cron-Schedule

| Job | Intervall | Was |
|-----|-----------|-----|
| collect-prices | alle 6h | Preise von 4 APIs holen |
| analyze | alle 12h | AI-Analyse + Prognosen |
| send-alerts | jede 1h | Preis-Alarme pruefen + senden |
| generate-reports | taeglich 06:00 | Tages-/Wochen-/Monatsberichte |
| index/calculate | taeglich 07:00 | BauPreis Index berechnen |
| health | alle 5min | DB + Datenfreshness pruefen |
| downgrade-trials | taeglich 00:00 | Abgelaufene Trial-Orgs auf Basis zurueckstufen |
