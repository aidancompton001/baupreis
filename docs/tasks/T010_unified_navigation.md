# T010 — Unified Navigation: Сайт + Dashboard = единое целое

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #1 Markus Lehmann — Product Architect + #2 Lena Hoffmann — UX/UI + #3 Maximilian Braun — Frontend
**Скилл:** brainstorming → writing-plans
**Размер:** XL (архитектурная реорганизация навигации)
**Референс:** Mockup из Brand Identity — секция MOCKUP (header с tabs)

---

## ИДЕЯ CEO

Сейчас сайт и дашборд — два отдельных мира:
- Сайт (landing): свой header (белый, с "Preise / Über uns / Sign In")
- Dashboard: свой header (чёрный) + sidebar (9 пунктов)
- Перейти с dashboard на сайт — нужно открыть новый URL
- Перейти с сайта на dashboard — нужно залогиниться

**CEO хочет:** Единый header на ВЕСЬ сайт. Как в макапе:

```
[ Лого-иконка ]  Dashboard  Preise  Datinger  Contact  ...  [ язык ] [ аккаунт ]
```

- Из дашборда можно перейти на "Preise", "Über uns", "Kontakt"
- С сайта можно перейти на "Dashboard" (если залогинен)
- Sidebar УБИРАЕТСЯ. Всё через tabs сверху.
- Лого — только иконка (без текста "BauPreis AI")
- Справа — смена языка (стильная) + аватар/аккаунт (кружочек)

---

## ЧАСТЬ 1: ЧТО СЕЙЧАС (ТЕКУЩАЯ АРХИТЕКТУРА)

### Навигационная структура

```
СЕЙЧАС:

Сайт (не залогинен):
┌─────────────────────────────────────────────────┐
│ [Logo horizontal]  Preise  Über uns  Anmelden  [CTA]  [Lang] │  ← MarketingHeader.tsx / page.tsx nav
└─────────────────────────────────────────────────┘
│                    Landing page content                      │
│                    /preise, /ueber-uns, /kontakt             │

Dashboard (залогинен):
┌─────────────────────────────────────────────────┐
│ [Logo icon+text]                    [Lang] [Logout]         │  ← (dashboard)/layout.tsx header
├────────────┬────────────────────────────────────┤
│  Sidebar   │                                    │
│  9 items   │     Dashboard content              │  ← DashboardNav.tsx (sidebar)
│  w-64      │     /dashboard, /material/*, etc.  │
│            │                                    │
└────────────┴────────────────────────────────────┘
```

### Файлы навигации

| Файл | Что делает | Где |
|------|-----------|-----|
| `app/src/app/page.tsx` | Landing page + свой inline nav | Главная `/` |
| `app/src/components/marketing/MarketingHeader.tsx` | Header для marketing pages | `/preise`, `/ueber-uns`, `/kontakt`, `/blog` |
| `app/src/app/(marketing)/layout.tsx` | Wrapper для marketing | Все (marketing) pages |
| `app/src/app/(dashboard)/layout.tsx` | Dashboard layout: чёрный header + sidebar | Все dashboard pages |
| `app/src/components/layout/DashboardNav.tsx` | Sidebar (9 items) + mobile bottom nav | Dashboard |
| `app/src/components/MobileNav.tsx` | Hamburger menu для сайта | Landing + marketing |

### Routing

| Route | Layout | Header |
|-------|--------|--------|
| `/` | Root | Inline nav в page.tsx |
| `/preise` | (marketing) | MarketingHeader |
| `/ueber-uns` | (marketing) | MarketingHeader |
| `/kontakt` | (marketing) | MarketingHeader |
| `/blog` | (marketing) | MarketingHeader |
| `/agb`, `/datenschutz`, `/impressum` | (marketing) | MarketingHeader |
| `/dashboard` | (dashboard) | Dashboard header + sidebar |
| `/material/*` | (dashboard) | Dashboard header + sidebar |
| `/prognose` | (dashboard) | Dashboard header + sidebar |
| `/chat` | (dashboard) | Dashboard header + sidebar |
| `/alerts` | (dashboard) | Dashboard header + sidebar |
| `/berichte` | (dashboard) | Dashboard header + sidebar |
| `/einstellungen/*` | (dashboard) | Dashboard header + sidebar |
| `/account/*` | (dashboard) | Dashboard header + sidebar |
| `/sign-in` | (auth) | Свой minimal header |
| `/sign-up` | (auth) | Свой minimal header |

---

## ЧАСТЬ 2: ЧТО ДОЛЖНО БЫТЬ (НОВАЯ АРХИТЕКТУРА)

### Макап (что CEO хочет)

```
СТАНЕТ:

Единый header на ВСЁ:
┌─────────────────────────────────────────────────────────────┐
│ [Logo icon]  Dashboard  Preise  Über uns  Kontakt  ...  [🌐] [👤] │
└─────────────────────────────────────────────────────────────┘

ЕСЛИ залогинен:
  - "Dashboard" tab → /dashboard (с dropdown: Übersicht, Prognosen, Chat, Alerts, etc.)
  - "Preise" → /preise
  - "Über uns" → /ueber-uns
  - "Kontakt" → /kontakt
  - Справа: [Language switcher стильный] + [Avatar кружочек → dropdown: Einstellungen, Account, Abmelden]

ЕСЛИ не залогинен:
  - "Preise" → /preise
  - "Über uns" → /ueber-uns
  - "Kontakt" → /kontakt
  - Справа: [Language] + [Anmelden] + [CTA: Kostenlos testen]

Sidebar → УБИРАЕТСЯ полностью.
Dashboard items (Prognosen, Chat, Alerts, etc.) → dropdown menu из "Dashboard" tab.
Или → sub-nav (вторая строка tabs под header) на dashboard pages.
```

### Два варианта для Dashboard навигации (9 items)

**Вариант A: Dropdown из "Dashboard" tab**
```
[ Logo ]  [Dashboard ▼]  Preise  Über uns  Kontakt    [🌐] [👤]
              │
              ├─ Übersicht
              ├─ KI-Prognosen
              ├─ KI-Chat
              ├─ Preisgleitklausel
              ├─ Legierungsrechner
              ├─ Alarme
              ├─ Berichte
              └─ Einstellungen
```

**Вариант B: Sub-tabs (вторая строка) на dashboard pages**
```
[ Logo ]  Dashboard  Preise  Über uns  Kontakt    [🌐] [👤]
  ────────────────────────────────────────────────
  Übersicht | Prognosen | Chat | Alarme | Berichte | Einstellungen
```

**Рекомендация:** Вариант B — sub-tabs. Причины:
1. Как в макапе — tabs видны сразу, не спрятаны
2. Не нужен click → dropdown → click (2 клика vs 1)
3. На мобильном sub-tabs скроллятся горизонтально

---

## ЧАСТЬ 3: ФАЙЛЫ ЗАТРОНУТЫ

### НОВЫЕ ФАЙЛЫ (СОЗДАТЬ)

| Файл | Назначение |
|------|-----------|
| `app/src/components/layout/UnifiedHeader.tsx` | Единый header для ВСЕГО сайта. Лого, tabs, язык, аккаунт. |
| `app/src/components/layout/DashboardSubNav.tsx` | Sub-tabs для dashboard pages (Übersicht, Prognosen, Chat...) |
| `app/src/components/layout/AccountDropdown.tsx` | Dropdown аккаунта: Einstellungen, Account, Abmelden |
| `app/src/components/layout/LanguageDropdown.tsx` | Стильный language switcher (не <select>) |

### ИЗМЕНЯЕМЫЕ ФАЙЛЫ

| Файл | Что меняется |
|------|-------------|
| `app/src/app/layout.tsx` | Вставить UnifiedHeader в ROOT layout (не в page-specific layouts) |
| `app/src/app/(dashboard)/layout.tsx` | УБРАТЬ header полностью. УБРАТЬ DashboardNav. Оставить только main content + DashboardSubNav |
| `app/src/app/(marketing)/layout.tsx` | УБРАТЬ MarketingHeader (header теперь в root layout) |
| `app/src/app/page.tsx` | УБРАТЬ inline nav из landing page (header теперь в root layout) |
| `app/src/components/marketing/MarketingHeader.tsx` | УДАЛИТЬ или сделать пустым |
| `app/src/components/layout/DashboardNav.tsx` | УДАЛИТЬ sidebar. Mobile bottom nav → может остаться как альтернатива |
| `app/src/components/MobileNav.tsx` | Рефактор: hamburger menu для unified header |

### НЕ МЕНЯЮТСЯ

Все dashboard page files (dashboard/page.tsx, material/[code]/page.tsx, etc.) — НЕ меняются. Только layout вокруг них.

---

## ЧАСТЬ 4: ЧТО БЫЛО → ЧТО СТАНЕТ

### Root layout.tsx

```
БЫЛО:
  <body>
    <LocaleProvider>
      {children}           ← каждая page group имеет свой header
      <CookieConsent />
    </LocaleProvider>
  </body>

СТАНЕТ:
  <body>
    <LocaleProvider>
      <UnifiedHeader />    ← ОДИН header для всего
      {children}
      <CookieConsent />
    </LocaleProvider>
  </body>
```

### Dashboard layout.tsx

```
БЫЛО:
  <div className="min-h-screen bg-gray-50">
    <header>чёрный header + logo + lang + logout</header>
    <div className="pt-16 flex">
      <DashboardNav />                    ← sidebar w-64
      <main className="flex-1 md:ml-64"> ← offset для sidebar
        {children}
      </main>
    </div>
  </div>

СТАНЕТ:
  <div className="min-h-screen bg-gray-50 pt-16">   ← offset для unified header
    <DashboardSubNav />                               ← sub-tabs (Übersicht, Prognosen, etc.)
    <main className="max-w-[1400px] mx-auto p-6">    ← full width, no sidebar offset
      <TrialBanner />
      {children}
    </main>
  </div>
```

### Landing page.tsx nav

```
БЫЛО:
  <nav className="fixed top-0 ...">
    logo + Preise + Über uns + Sign In + CTA + Lang
  </nav>

СТАНЕТ:
  (nav УДАЛЁН из page.tsx — UnifiedHeader в root layout)
```

### UnifiedHeader (НОВЫЙ)

```tsx
// Как в макапе:
<header className="fixed top-0 w-full bg-[#1A1A1A] border-b-[3px] border-brand-600 z-50 h-14">
  <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center justify-between">

    {/* LEFT: Logo icon only */}
    <Link href="/">
      <img src="/logo/logo-icon.png" className="h-8 w-8" />
    </Link>

    {/* CENTER: Tabs */}
    <div className="hidden md:flex items-center gap-1">
      {isLoggedIn && <Tab href="/dashboard" active={onDashboard}>Dashboard</Tab>}
      <Tab href="/preise">Preise</Tab>
      <Tab href="/ueber-uns">Über uns</Tab>
      <Tab href="/kontakt">Kontakt</Tab>
    </div>

    {/* RIGHT: Lang + Account */}
    <div className="flex items-center gap-3">
      <LanguageDropdown />       ← стильный, не <select>
      {isLoggedIn
        ? <AccountDropdown />    ← аватар кружочек + dropdown
        : <Link href="/sign-in">Anmelden</Link>
      }
    </div>
  </div>
</header>
```

### DashboardSubNav (НОВЫЙ)

```tsx
// Вторая строка tabs на dashboard pages
<nav className="bg-white border-b-2 border-[#1A1A1A]">
  <div className="max-w-[1400px] mx-auto px-4 flex gap-1 overflow-x-auto">
    <SubTab href="/dashboard" icon={<IconDashboard/>}>Übersicht</SubTab>
    <SubTab href="/prognose" icon={<IconForecasts/>}>Prognosen</SubTab>
    <SubTab href="/chat" icon={<IconChat/>}>Chat</SubTab>
    <SubTab href="/preisgleitklausel" icon={<IconEscalation/>}>Gleitklausel</SubTab>
    <SubTab href="/legierungsrechner" icon={<IconAlloy/>}>Legierungen</SubTab>
    <SubTab href="/alerts" icon={<IconAlerts/>}>Alarme</SubTab>
    <SubTab href="/berichte" icon={<IconReports/>}>Berichte</SubTab>
    <SubTab href="/einstellungen" icon={<IconSettings/>}>Einstellungen</SubTab>
  </div>
</nav>
```

### AccountDropdown (НОВЫЙ)

```tsx
// Аватар кружочек → dropdown
<div className="relative">
  <button className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold">
    MM  {/* инициалы пользователя */}
  </button>
  {open && (
    <div className="absolute right-0 mt-2 bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#C1292E]">
      <Link href="/einstellungen">Einstellungen</Link>
      <Link href="/account">Mein Konto</Link>
      <button onClick={logout}>Abmelden</button>
    </div>
  )}
</div>
```

### LanguageDropdown (НОВЫЙ — стильный)

```tsx
// Вместо <select> — кнопка с dropdown
<div className="relative">
  <button className="text-white text-xs font-grotesk uppercase tracking-wide">
    DE ▼
  </button>
  {open && (
    <div className="absolute right-0 mt-2 bg-white border-2 border-[#1A1A1A]">
      <button>Deutsch</button>
      <button>English</button>
      <button>Русский</button>
    </div>
  )}
</div>
```

---

## ЧАСТЬ 5: ПОСЛЕДСТВИЯ

### Что может сломаться

| # | Риск | Вероятность | Митигация |
|---|------|------------|-----------|
| 1 | **Двойной header:** Root layout рендерит UnifiedHeader, но auth pages (/sign-in, /sign-up) тоже получат его — не нужно | Высокая | Auth layout: скрыть UnifiedHeader или обернуть условием |
| 2 | **Landing page nav дублируется:** page.tsx inline nav + UnifiedHeader | Высокая | Удалить nav из page.tsx |
| 3 | **Sidebar removal → dashboard content shift:** Сейчас main имеет `md:ml-64`, без sidebar контент сместится | Высокая | Убрать ml-64, сделать max-w-[1400px] mx-auto |
| 4 | **Mobile:** Sidebar → bottom nav. Если убрать sidebar, нужен mobile sub-nav | Средняя | DashboardSubNav скроллится горизонтально на мобильном |
| 5 | **SEO:** Landing page теряет inline nav — может повлиять на crawl | Низкая | UnifiedHeader рендерится server-side, ссылки те же |
| 6 | **Auth state в UnifiedHeader:** Header в root layout = server component. Проверка isLoggedIn нужна на клиенте | Средняя | UnifiedHeader = "use client", проверка через useOrg() hook |
| 7 | **Legal pages (AGB, Datenschutz, Impressum):** Сейчас в (marketing) layout с MarketingHeader | Средняя | Работают через root UnifiedHeader, MarketingHeader удалён |

### Breakpoints

| Breakpoint | Что проверить |
|-----------|--------------|
| 375px | UnifiedHeader: logo + hamburger. SubNav: horizontal scroll. No sidebar. |
| 768px | UnifiedHeader: logo + tabs + lang + account. SubNav: all tabs visible. |
| 1440px | Full layout. SubNav. Content max-w-[1400px] centered. |

### Якоря, навигация, JS, анимации

| Элемент | Затронут? | Детали |
|---------|----------|--------|
| **URL routing** | НЕТ | Все URL остаются: /dashboard, /preise, /material/*, etc. |
| **Auth flow** | НЕТ | Sign-in/sign-up pages не меняются. Auth logic та же. |
| **Dashboard data fetching** | НЕТ | Все API calls остаются. |
| **Sidebar → Sub-tabs** | ДА | Навигация из вертикальной → горизонтальная. Те же ссылки. |
| **Mobile bottom nav** | ДА | Может быть заменён на horizontal scroll sub-nav |
| **Анимации** | НЕТ | dash-appear и прочие остаются |

### Тесты

| # | Тест | Что проверяет |
|---|------|-------------|
| 1 | Не залогинен → / → видит landing + UnifiedHeader без "Dashboard" tab | Auth state |
| 2 | Залогинен → / → видит landing + UnifiedHeader С "Dashboard" tab | Auth state |
| 3 | Залогинен → /dashboard → видит sub-tabs + content БЕЗ sidebar | Layout |
| 4 | /sign-in → НЕТ UnifiedHeader (чистая auth page) | Auth exclusion |
| 5 | /preise → UnifiedHeader + pricing content | Marketing page |
| 6 | Mobile 375px → hamburger menu + sub-nav scrollable | Responsive |
| 7 | `npm run build` → 0 errors | Build |

---

## ЧАСТЬ 6: ROADMAP (6 ФАЗ, 25 ШАГОВ)

### Phase 0: Новые компоненты (ИСПРАВЛЕНО по Landa Review)
1. Создать `UnifiedHeader.tsx` — "use client", logo icon, tabs (conditional Dashboard), lang dropdown, account dropdown. Auth check: НЕ useOrg(), а лёгкая проверка session cookie `document.cookie.includes("session=")`. Скрывается на /sign-in, /sign-up, /onboarding (проверка pathname).
2. Создать `DashboardSubNav.tsx` — horizontal tabs для dashboard pages. ДОБАВИТЬ data-tour атрибуты (nav-prognose, nav-alerts, nav-berichte, nav-einstellungen) — для WelcomeTour.
3. Создать `AccountDropdown.tsx` — аватар кружочек + dropdown: Einstellungen (/einstellungen), Abonnement (/einstellungen/abo), Mein Konto (/account), Abmelden. ДОБАВИТЬ click-outside-to-close (useEffect + document mousedown listener).
4. Создать `LanguageDropdown.tsx` — стильный switcher (DE ▼). ДОБАВИТЬ click-outside-to-close.

### Phase 1: Root layout → UnifiedHeader
5. `app/src/app/layout.tsx` — добавить `<UnifiedHeader />` в Shell компонент (ПЕРЕД {children})
6. UnifiedHeader СКРЫВАЕТСЯ на: /sign-in, /sign-up, /onboarding (проверка usePathname())

### Phase 2: Landing page — убрать inline nav
7. `app/src/app/page.tsx` — УДАЛИТЬ всю секцию `<nav>...</nav>` (строки 62-78)
8. `app/src/app/page.tsx` — УДАЛИТЬ `<MobileNav />` import и вызов
9. `app/src/app/page.tsx` — ПРОВЕРИТЬ pt-offset hero section (сейчас pt-20, UnifiedHeader h-14 → может потребоваться pt-14 или pt-16)
10. Landing inline footer — ОСТАВИТЬ как есть

### Phase 3: Marketing pages — убрать MarketingHeader, ОСТАВИТЬ Footer
11. `app/src/app/(marketing)/layout.tsx` — УБРАТЬ `<MarketingHeader />` (header теперь UnifiedHeader в root)
12. `app/src/app/(marketing)/layout.tsx` — ОСТАВИТЬ `<MarketingFooter />` и `<BreadcrumbSchema />`
13. `app/src/components/marketing/MarketingHeader.tsx` — УДАЛИТЬ файл

### Phase 4: Dashboard — убрать sidebar, добавить sub-tabs
14. `app/src/app/(dashboard)/layout.tsx` — УБРАТЬ header полностью (теперь UnifiedHeader в root)
15. `app/src/app/(dashboard)/layout.tsx` — УБРАТЬ `<DashboardNav />` (sidebar)
16. `app/src/app/(dashboard)/layout.tsx` — ДОБАВИТЬ `<DashboardSubNav />`
17. `app/src/app/(dashboard)/layout.tsx` — main: УБРАТЬ `md:ml-64`, сделать `max-w-[1400px] mx-auto`
18. `app/src/app/(dashboard)/layout.tsx` — pt offset: `pt-14` для UnifiedHeader + DashboardSubNav высота
19. `app/src/components/layout/DashboardNav.tsx` — УДАЛИТЬ файл (sidebar больше не нужен)

### Phase 5: Жёлтые KPI блоки на dashboard
20. `app/src/app/(dashboard)/dashboard/page.tsx` — добавить жёлтые (#F5C518) блоки для ключевых цифр (как в макапе: "+12.5%", "-30.5%", "€450.00")
21. Стиль: `bg-[#F5C518] p-6 border-2 border-[#1A1A1A]`, текст `font-oswald text-4xl text-[#1A1A1A]`

### Phase 6: Verification (РАСШИРЕНО по Landa)
22. `npm run build` → 0 errors
23. / (не залогинен) → UnifiedHeader без Dashboard tab, ЕСТЬ Anmelden + CTA
24. / (залогинен) → UnifiedHeader С Dashboard tab, БЕЗ Anmelden
25. /dashboard → sub-tabs + content, БЕЗ sidebar, data-tour атрибуты присутствуют
26. /sign-in → БЕЗ UnifiedHeader
27. /sign-up → БЕЗ UnifiedHeader
28. /onboarding → БЕЗ UnifiedHeader
29. /preise → UnifiedHeader + content + MarketingFooter
30. Mobile 375px → hamburger + sub-nav horizontal scroll
31. AccountDropdown → click outside → закрывается
32. LanguageDropdown → click outside → закрывается
33. Grep: MarketingHeader import → 0
34. Grep: DashboardNav import → 0 (кроме возможных комментариев)

---

## ЧАСТЬ 7: ЧЕКЛИСТ ПРИЁМКИ

### Навигация
- [ ] Единый header на ВЕСЬ сайт (чёрный, как в макапе)
- [ ] Лого — ТОЛЬКО иконка (без текста "BauPreis AI")
- [ ] Tabs: Dashboard (если залогинен), Preise, Über uns, Kontakt
- [ ] Sidebar УБРАН полностью
- [ ] Dashboard sub-tabs: Übersicht, Prognosen, Chat, Alarme, Berichte, Einstellungen
- [ ] Аккаунт dropdown: кружочек → Einstellungen, Account, Abmelden
- [ ] Language dropdown: стильный (DE ▼), не <select>
- [ ] Из dashboard можно перейти на Preise, Über uns, Kontakt
- [ ] С сайта можно перейти на Dashboard (если залогинен)

### Жёлтые KPI блоки
- [ ] Как в макапе: жёлтый фон, чёрный текст, огромные цифры
- [ ] "+12.5%", "-30.5%", "€450.00" — font-oswald, text-4xl

### Auth
- [ ] /sign-in, /sign-up — БЕЗ UnifiedHeader
- [ ] Не залогинен → нет "Dashboard" tab, есть "Anmelden" + CTA

### Техническое
- [ ] `npm run build` → 0 errors
- [ ] Desktop 1440px: header + sub-tabs + full width content
- [ ] Mobile 375px: hamburger menu + horizontal scroll sub-tabs
- [ ] Все URL работают: /, /dashboard, /preise, /material/*, etc.
