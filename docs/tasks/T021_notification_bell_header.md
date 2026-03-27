# T021 — Notification Bell im Header (Benachrichtigungsglocke)

**Datum:** 2026-03-27
**Status:** Analyse (P0)
**Verantwortlich:** #2 Katarina Weiss — UX/UI + #3 Erik Zimmermann — Frontend
**Groesse:** L
**Skill:** brainstorming

---

## Ziel

Benachrichtigungsglocke rechts im Header (vor AccountDropdown), die:
1. Ungelesene Benachrichtigungen als Badge (Zahl) anzeigt
2. Dropdown mit Liste der Benachrichtigungen oeffnet
3. Preis-Alerts, Systemupdates und Aenderungen anzeigt
4. Badge verschwindet wenn Nutzer alle Benachrichtigungen gelesen hat
5. Im Bauhaus Bold Stil des Projekts

---

## Ist-Zustand

### Header (`UnifiedHeader.tsx:74-88`)
```
[Logo] — [Tabs] — ... — [LangDropdown] [AccountDropdown] [Hamburger]
```
- Kein Notification-Element vorhanden
- Rechte Seite: `LanguageDropdown` + `AccountDropdown` (wenn eingeloggt)
- Header-Hoehe: `h-14` (56px), feste Position `fixed top-0 z-50`

### Alert-System (bestehend)
- `alert_rules` Tabelle: Nutzer konfiguriert Regeln
- `alerts_sent` Tabelle: Gesendete Alerts (Email/Telegram/WhatsApp)
- Cron `/api/cron/send-alerts` laeuft stuendlich
- **KEIN** `is_read` / `read_at` Feld in `alerts_sent`
- **KEIN** In-App-Notification-Kanal — nur externe Kanaele (Email, Telegram, WhatsApp)

### Datenquellen fuer Benachrichtigungen
1. **Preis-Alerts** (`alerts_sent`): Existiert bereits, braucht `is_read`-Feld
2. **System-Updates** (Changelog): Existiert als `/changelog` Seite — braucht DB-Tracking "last seen"
3. **Preis-Aenderungen** fuer Org-Materialien: Berechenbar aus `prices` + `org_materials`

---

## Soll-Zustand

### Header (NEU)
```
[Logo] — [Tabs] — ... — [LangDropdown] [NotificationBell] [AccountDropdown] [Hamburger]
```

### NotificationBell Komponente
- **Icon:** SVG Glocke (Bauhaus-geometrisch, kein Rundung, kantig)
- **Badge:** Rote Zahl (brand-600) oben rechts, wenn ungelesene > 0
- **Dropdown:** Bauhaus-Stil (border-2, shadow-[4px_4px_0], wie AccountDropdown)
- **Items im Dropdown:**
  - Preis-Alert: "[Material] +5.2% in 7 Tagen" mit Zeitstempel
  - System-Update: "Neue Funktion: Legierungsrechner" mit Datum
  - Aktion: Klick → markiert als gelesen, navigiert zu /alerts oder /changelog
- **"Alle lesen" Button** am Ende des Dropdowns
- **Max 20 Items** anzeigen, Link zu /alerts fuer alle

### Nur fuer eingeloggte Nutzer
- Gaeste sehen keinen Bell
- Polling: alle 60s `/api/notifications/unread-count`

---

## Dateien betroffen

### NEU erstellen
| Datei | Zweck |
|-------|-------|
| `app/src/components/layout/NotificationBell.tsx` | Bell-Komponente mit Dropdown |
| `app/src/app/api/notifications/route.ts` | GET: ungelesene Benachrichtigungen, POST: als gelesen markieren |
| `app/src/app/api/notifications/unread-count/route.ts` | GET: nur Anzahl (leichtgewichtig fuer Polling) |

### AENDERN
| Datei | Aenderung |
|-------|-----------|
| `app/src/components/layout/UnifiedHeader.tsx:75-76` | NotificationBell einfuegen zwischen LangDropdown und AccountDropdown |
| `app/src/types/index.ts` | `Notification` Interface hinzufuegen |
| `app/src/i18n/de.ts` | 8-10 neue Keys (notifications.*) |
| `app/src/i18n/en.ts` | 8-10 neue Keys |
| `app/src/i18n/ru.ts` | 8-10 neue Keys |
| `init.sql` | `notifications` Tabelle + `alerts_sent.is_read` Feld (oder Migration) |
| `migrations/` | Neue Migration: `007_notifications.sql` |

### NICHT AENDERN
- `alerts/page.tsx` — bestehende Alerts-Seite bleibt unberuehrt
- `send-alerts/route.ts` — Cron bleibt, wird erweitert um in-app Kanal
- `DashboardNav.tsx` — keine Aenderung
- `AccountDropdown.tsx` — keine Aenderung

---

## DB-Schema (neue Migration 007)

```sql
-- In-App Notifications
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),       -- NULL = alle Nutzer der Org
    type            VARCHAR(30) NOT NULL,             -- 'price_alert', 'system_update', 'price_change'
    title           TEXT NOT NULL,
    message         TEXT NOT NULL,
    link            VARCHAR(255),                     -- z.B. '/material/steel_rebar' oder '/changelog'
    is_read         BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_org_unread ON notifications(org_id, is_read) WHERE is_read = false;

-- Bestehende alerts_sent erweitern
ALTER TABLE alerts_sent ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
```

---

## Was WURDE → Was WIRD

| Aspekt | IST | SOLL |
|--------|-----|------|
| Header rechts | Lang + Account | Lang + **Bell** + Account |
| Alert-Kanal | Email, Telegram, WhatsApp | + **In-App** |
| Ungelesene Alerts | Kein Tracking | `is_read` Feld + Badge-Zaehler |
| System-Updates | `/changelog` Seite | + Notification bei neuem Eintrag |
| Preis-Aenderungen | Nur via konfigurierter Regel | + Automatisch fuer org_materials |
| Bell Badge | Nicht vorhanden | Rote Zahl (unread count) |

---

## Was kann brechen

- **Header-Layout:** Bell zwischen Lang und Account → testen auf 375px (mobilMenu), 768px, 1440px
- **z-index Konflikte:** Bell-Dropdown z-50 vs Header z-50 vs AccountDropdown z-50
- **Polling Performance:** 60s Intervall x N Nutzer → DB-Last fuer unread-count Query
- **Mobile:** Bell muss auch in mobile nav sichtbar sein (aktuell nur Hamburger)
- **SSR Hydration:** Bell ist client-only (useEffect fuer polling) → kein Server-Rendering
- **Auth:** Notification-API muss `requireOrg()` verwenden
- **i18n:** Neue Keys muessen in alle 3 Sprachen (de/en/ru)

### Breakpoints
- **375px (mobile):** Bell-Icon 24x24, Dropdown wird full-width overlay
- **768px (tablet):** Bell normal, Dropdown 320px breit
- **1440px (desktop):** Bell normal, Dropdown 360px breit, max-h-[400px] scrollbar

### Navigation/Anker
- Klick auf Notification → navigiert zu Link (z.B. `/material/steel_rebar`)
- "Alle anzeigen" → `/alerts`
- KEINE Aenderung an bestehender Navigation

### Animationen
- Bell: sanftes Wackeln (CSS animation) wenn neue Notification eintrifft
- Badge: fade-in bei count > 0, fade-out bei 0
- `prefers-reduced-motion`: Animationen deaktivieren

---

## Tests

1. **Unit:** `NotificationBell` rendert Badge mit count > 0
2. **Unit:** `NotificationBell` rendert kein Badge bei count = 0
3. **Unit:** Dropdown oeffnet/schliesst korrekt
4. **Unit:** "Alle lesen" setzt count auf 0
5. **Integration:** `/api/notifications` liefert nur Org-eigene Notifications
6. **Integration:** `/api/notifications/unread-count` liefert korrekte Zahl
7. **Integration:** POST markiert Notifications als gelesen
8. **E2E:** Gast sieht keinen Bell, eingeloggt sieht Bell

---

## Roadmap

1. Migration `007_notifications.sql` erstellen (notifications Tabelle + alerts_sent.is_read)
2. TypeScript Interface `Notification` in `types/index.ts` definieren
3. API Route `GET /api/notifications/unread-count` erstellen (leichtgewichtig)
4. API Route `GET /api/notifications` erstellen (letzte 20 ungelesene)
5. API Route `POST /api/notifications` erstellen (mark as read: single + all)
6. Komponente `NotificationBell.tsx` erstellen (Bell-Icon + Badge + Dropdown)
7. `UnifiedHeader.tsx` aendern: NotificationBell zwischen LangDropdown und AccountDropdown
8. i18n Keys in `de.ts`, `en.ts`, `ru.ts` hinzufuegen
9. `send-alerts/route.ts` erweitern: In-App-Notification bei jedem Alert erstellen
10. Unit-Tests fuer NotificationBell schreiben
11. Integration-Tests fuer Notification-API schreiben
12. Build + visuelle Pruefung (375 / 768 / 1440)

---

## Checkliste Abnahme

- [ ] Bell-Icon im Header sichtbar (nur wenn eingeloggt)
- [ ] Badge zeigt korrekte Anzahl ungelesener Notifications
- [ ] Dropdown oeffnet sich beim Klick auf Bell
- [ ] Preis-Alerts erscheinen als Notifications
- [ ] "Alle lesen" markiert alle als gelesen, Badge verschwindet
- [ ] Klick auf Notification navigiert zum richtigen Ziel
- [ ] Mobile: Bell sichtbar und funktional auf 375px
- [ ] Tablet: Dropdown korrekt positioniert auf 768px
- [ ] Desktop: Dropdown korrekt auf 1440px
- [ ] Gast sieht keinen Bell
- [ ] i18n: Alle Texte in de/en/ru
- [ ] Build OK, keine Regression
- [ ] Tests geschrieben und bestanden
