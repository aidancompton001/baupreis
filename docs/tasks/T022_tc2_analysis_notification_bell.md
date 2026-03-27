# T022 — P0 Analyse: ТС2 Notification Bell (T021)

**Datum:** 2026-03-27
**Status:** Analyse (P0)
**Verantwortlich:** #1 Thomas Richter — Product Architect
**Groesse:** Analyse-Aufgabe
**Skill:** requesting-code-review

---

## Gegenstand der Analyse

ТС2 fuer T021 (Notification Bell im Header) — 12 Schritte, L-Aufgabe.
Pruefen: Vollstaendigkeit, Risiken, Abhaengigkeiten, Reihenfolge.

---

## Analyse: Dateien und Abhaengigkeiten

### Abhaengigkeitsgraph

```
Migration 006 (DB)
    ↓
Types (Notification interface)
    ↓
API Routes (notifications, unread-count)
    ↓
NotificationBell.tsx (Komponente)
    ↓
UnifiedHeader.tsx (Integration)
    ↓
send-alerts/route.ts (Cron-Erweiterung)
    ↓
i18n (de/en/ru)
    ↓
Tests
```

**Kritischer Pfad:** Migration → Types → API → Komponente → Header → Cron

### Datei-fuer-Datei Analyse

#### 1. Migration `006_notifications.sql`

**Fakten:**
- Letzte Migration: `005_user_preferences.sql` → naechste = 006 ✅
- Schema aus ТС2: `notifications` Tabelle mit `read_at TIMESTAMPTZ` ✅
- Partial Index `WHERE read_at IS NULL` → optimal fuer unread-count Query ✅
- `alerts_sent.is_read` wird NICHT hinzugefuegt (Landa-Entscheidung) ✅

**Risiko:** Migration muss auf Server manuell ausgefuehrt werden (`docker exec ... psql`). Kein automatisches Migrations-System vorhanden.

**WURDE → WIRD:**
- DB: keine `notifications` Tabelle → neue Tabelle mit 8 Spalten + Index

#### 2. Type `Notification` in `types/index.ts`

**Fakten:**
- Datei hat bereits `AlertRule` (Zeile 61), `AlertSent` (Zeile 74), `MaterialOption` (Zeile 84)
- Neues Interface passt zum Pattern ✅
- ТС2 spezifiziert `read_at: string | null` statt `is_read: boolean` ✅

**WURDE → WIRD:**
- `types/index.ts`: +10 Zeilen am Ende (Notification interface)

#### 3. API `GET /api/notifications/unread-count`

**Fakten:**
- `requireOrg()` in `auth.ts:21-33` gibt Org zurueck mit `session.oid` ✅
- SQL: `SELECT COUNT(*) FROM notifications WHERE org_id=$1 AND read_at IS NULL` — schnell mit Partial Index
- ТС2: `Cache-Control: private, max-age=30` ✅
- Polling 60s + Cache 30s = max 2 DB-Queries/Minute/User ✅

**Risiko:** Kein Risiko. Leichtgewichtiger Endpoint.

**WURDE → WIRD:**
- `/api/notifications/unread-count/`: nicht existent → neuer Ordner + route.ts

#### 4. API `GET /api/notifications` + `POST`

**Fakten:**
- GET: `LIMIT 20 ORDER BY created_at DESC` — unkompliziert
- POST: `{ id: "uuid" }` oder `{ all: true }` → UPDATE `SET read_at = NOW()`
- Auth: `requireOrg()` ✅
- Kein `user_id` Filtering (per-org, MVP) — ТС2 Entscheidung ✅

**Risiko:** Team-Plan (5 User): User A liest → fuer alle gelesen. ТС2 akzeptiert das fuer MVP.

**WURDE → WIRD:**
- `/api/notifications/`: nicht existent → neuer Ordner + route.ts

#### 5. Komponente `NotificationBell.tsx`

**Fakten aus Code-Analyse:**
- Pattern: `AccountDropdown.tsx` (79 Zeilen) — gleiche Struktur: `useState(open)`, `useRef`, click-outside
- Bauhaus-Stil: `border-2 border-[#1A1A1A] shadow-[4px_4px_0_#C1292E]` (AccountDropdown:46) ✅
- Polling: `useEffect` mit `setInterval(60000)` + `fetch("/api/notifications/unread-count")`
- Badge: `motion-safe:animate-pulse` fuer `prefers-reduced-motion` ✅
- Badge cap: `count > 99 ? "99+" : count` ✅

**Risiko: Mutual Exclusion**
- `LanguageDropdown.tsx:9` — eigener `useState(open)` + click-outside
- `AccountDropdown.tsx:9` — eigener `useState(open)` + click-outside
- Beide schliessen sich per click-outside automatisch ✅
- NotificationBell click-outside schliesst auch andere Dropdowns (DOM-Event-Propagation) ✅
- **KEIN zusaetzlicher State noetig** — click-outside Pattern reicht aus

**WURDE → WIRD:**
- Neuer File: `NotificationBell.tsx` (~100 Zeilen)

#### 6. `UnifiedHeader.tsx` Integration

**Fakten:**
- Einfuegestelle: Zeile 76-78, zwischen `<LanguageDropdown />` und `<AccountDropdown />`
- Bedingung: `{isLoggedIn && <NotificationBell />}` ✅
- Import: +1 Zeile
- Header-Hoehe `h-14` (56px) — Bell 32x32 passt ✅
- `gap-3` zwischen Elementen — ausreichend Platz ✅

**Mobile (375px):**
- Bell bleibt im Header-Bar sichtbar (neben Hamburger) ✅
- Dropdown: fixed overlay statt absolute ✅
- Hamburger-Menu hat KEINE Notifications (ТС2 entscheidet: Bell im Header reicht)

**WURDE → WIRD:**
- `UnifiedHeader.tsx:76`: `<LanguageDropdown />` → `<LanguageDropdown /> {isLoggedIn && <NotificationBell />}`

#### 7. i18n Keys

**Fakten:**
- Struktur: `de.ts` = `Record<string, string>` (flache Map)
- Neue Keys: ~10 pro Sprache
- `notifications.title`, `.empty`, `.markAllRead`, `.showAll`, `.priceAlert`, `.systemUpdate`

**WURDE → WIRD:**
- `de.ts`, `en.ts`, `ru.ts`: je +10 Zeilen

#### 8. `send-alerts/route.ts` Erweiterung

**Fakten:**
- Einfuegestelle: nach Zeile 200 (INSERT INTO alerts_sent)
- Zusaetzlicher INSERT: `INSERT INTO notifications (org_id, type, title, message, link)`
- Retention: `DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '90 days'` am Ende des Crons
- Keine Aenderung an bestehender Alert-Logik ✅

**Risiko:** Doppelter INSERT (alerts_sent + notifications) in gleicher Cron-Iteration. Wenn notifications INSERT fehlschlaegt, wird Alert trotzdem gesendet (alerts_sent already committed). Kein Transaction — aber akzeptabel (Notification ist nice-to-have, Alert ist kritisch).

**WURDE → WIRD:**
- `send-alerts/route.ts:200`: +8 Zeilen INSERT + +3 Zeilen DELETE retention

#### 9. Tests

**Fakten:**
- Bestehende Tests: 93/93 (7 Dateien) — alle unit tests
- Neue Tests:
  - `NotificationBell.test.tsx` — Rendering, Badge, Dropdown, Mark-Read
  - Schwierigkeit: Client-Component → braucht `@testing-library/react` (moeglicherweise nicht installiert)

**Risiko:** Frontend-Component-Tests erfordern zusaetzliche Test-Infrastruktur (`jsdom`, `@testing-library/react`). Pruefen ob vorhanden.

---

## Analyse: Was kann brechen

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Header-Layout bricht auf 375px | Mittel | Hoch | Bell 24x24 statt 32x32 auf mobile |
| z-index Dropdown-Overlap | Niedrig | Mittel | Click-outside Pattern reicht |
| DB Migration auf Server vergessen | Hoch | Kritisch | Expliziter Deploy-Schritt |
| Polling Last bei vielen Usern | Niedrig | Niedrig | Cache-Control + Partial Index |
| Team-User sieht "gelesen" von anderem | Mittel | Niedrig | MVP akzeptiert, Phase 2 |
| Frontend Test Infra fehlt | Mittel | Mittel | Ohne Component-Tests, nur API-Tests |

---

## Analyse: Breakpoints

| Breakpoint | Bell | Dropdown | Getestet? |
|------------|------|----------|-----------|
| 375px (mobile) | 24x24 im Header, sichtbar neben Hamburger | Fixed overlay, `inset-x-4 top-14 max-h-[60vh]` | Muss |
| 768px (tablet) | 32x32, normal | `absolute right-0 w-80` | Muss |
| 1440px (desktop) | 32x32, normal | `absolute right-0 w-80 max-h-[400px]` | Muss |

---

## Analyse: Anker, Navigation, JS, Animationen

| Element | Betroffen? | Detail |
|---------|-----------|--------|
| Anker / Hash-Links | Nein | Keine Aenderung |
| Navigation (Tabs) | Nein | Bell ist kein Tab |
| DashboardNav | Nein | Bestehender `/alerts` Link bleibt |
| JS (Hydration) | Ja | Bell ist Client-Component mit useEffect — SSR-safe durch bedingte Darstellung |
| Animationen | Ja | Badge `animate-pulse`, `prefers-reduced-motion` beachtet |

---

## Roadmap: Ausfuehrungsreihenfolge

### Phase A: Backend (Schritte 1-5)

1. **Migration `006_notifications.sql` schreiben** — CREATE TABLE + INDEX
2. **Type `Notification` in `types/index.ts` hinzufuegen** — Interface definieren
3. **API Route `GET /api/notifications/unread-count/route.ts` erstellen** — COUNT Query + Cache-Control
4. **API Route `GET+POST /api/notifications/route.ts` erstellen** — List (LIMIT 20) + Mark Read
5. **Build pruefen** — `npx next build` muss 0 Fehler zeigen

### Phase B: Frontend (Schritte 6-9)

6. **Komponente `NotificationBell.tsx` erstellen** — Bell SVG + Badge + Dropdown + Polling
7. **`UnifiedHeader.tsx` aendern** — Bell zwischen Lang und Account einfuegen
8. **i18n Keys in `de.ts`, `en.ts`, `ru.ts` hinzufuegen** — 10 Keys pro Sprache
9. **Build + visuelle Pruefung** — 375 / 768 / 1440 Screenshots

### Phase C: Integration (Schritte 10-12)

10. **`send-alerts/route.ts` erweitern** — INSERT notification + DELETE retention (90 Tage)
11. **Tests schreiben und ausfuehren** — API Integration Tests (NotificationBell Component-Tests nur wenn Infra vorhanden)
12. **Migration auf Server ausfuehren** — `docker exec baupreis-postgres-1 psql -U baupreis -d baupreis -f /path/006_notifications.sql`

---

## Checkliste Abnahme

- [ ] Migration 006 erstellt und auf Server ausgefuehrt
- [ ] Notification Interface in types/index.ts
- [ ] GET /api/notifications/unread-count liefert `{ count: N }` mit Cache-Control
- [ ] GET /api/notifications liefert max 20 Eintraege, neueste zuerst
- [ ] POST /api/notifications markiert einzeln oder alle als gelesen
- [ ] NotificationBell.tsx: Bell + Badge + Dropdown im Bauhaus-Stil
- [ ] UnifiedHeader: Bell sichtbar nur fuer eingeloggte Nutzer
- [ ] Mobile 375px: Bell + Dropdown funktional
- [ ] Tablet 768px: korrekt positioniert
- [ ] Desktop 1440px: korrekt positioniert
- [ ] i18n: de/en/ru Keys vorhanden
- [ ] send-alerts Cron erstellt In-App-Notifications
- [ ] Retention: alte Notifications (>90 Tage) werden geloescht
- [ ] Badge zeigt "99+" bei count > 99
- [ ] `prefers-reduced-motion` beachtet
- [ ] Build OK (0 Fehler)
- [ ] Alle bestehenden Tests bestehen (93/93 + neue)
- [ ] Keine Regression in bestehenden Komponenten

---

## Bewertung der ТС2

| Aspekt | Bewertung | Kommentar |
|--------|-----------|-----------|
| Vollstaendigkeit | ✅ Gut | Alle 7 Landa-Punkte adressiert |
| Reihenfolge | ⚠️ Anpassen | Migration ZUERST, Tests ZULETZT |
| Risiken | ✅ Erkannt | Mobile, z-index, Team-User dokumentiert |
| Groesse | ⚠️ L korrekt | 12 Schritte, 4 neue Dateien, 7 Aenderungen |
| Abhaengigkeiten | ✅ Linear | Kein paralleler Pfad noetig |
| Blocker | ⚠️ 1 Pruefung | Frontend Test Infra (`@testing-library/react`) — pruefen vor Schritt 11 |

**Gesamtbewertung: ТС2 ist ausfuehrbar.** 3 Phasen (Backend → Frontend → Integration) sind korrekt sequenziert. Einzige Unsicherheit: Frontend Component-Tests.
