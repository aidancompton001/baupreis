# DEVLOG — BauPreis AI SaaS

## Журнал разработки (Development Log)

Хронологический лог всех рабочих сессий.
Обновляется в конце каждой сессии. Записи — от новых к старым.

**Формат записи:** коротко, только суть. Каждая запись сканируется за 10 секунд.

---

### [S032] — 2026-03-26 — T011: Bauhaus Geometric Decorations System

**Роли:** #2 Lena Hoffmann (UX/UI), #14 Hans Landa (ревью ТС)
**Статус:** завершено

**Что сделано:**
- 5 SVG-примитивов: BauCircle, BauTriangle, BauRect, BauDiamond, BauHalfCircle
- 4 композиции: CompositionCornerTL, CompositionCornerBR, CompositionStripe, CompositionGrid
- BauhausOverlay: бесшовный SVG-паттерн (sparse/medium/dense), тайл 120×120
- grid.svg создан (починены 4 страницы с битыми ссылками)
- Landing page: inline div-декорации → SVG-компоненты + новые элементы (Triangle, Stripe, Overlay)
- Preise: добавлены декорации (была пустая)
- Über Uns, Kontakt, Blog, Legal: BauhausOverlay поверх grid.svg
- Footer: CompositionGrid фон
- Accessibility: `@media (prefers-reduced-motion: reduce)` в globals.css

**Ключевые решения:**
- Тайл 120×120 вместо 80×80 — по замечанию Ланды (менее заметный повтор)
- BauDiamond как `<polygon>` вместо rotated rect — чище SVG
- grid.svg упрощён до линий + точек (без треугольников) — subpixel артефакты на mobile

**Артефакты:**
- `app/src/components/decorations/` (4 файла)
- `app/public/grid.svg`
- Изменены: page.tsx, PreiseClient, UeberUnsClient, KontaktClient, BlogClient, LegalPageShell, globals.css

**Следующие шаги:**
- Проверка в браузере desktop + mobile
- Визуальное подтверждение CEO

---

### [S025] — 2026-03-26 — T010: Unified Navigation (сайт + dashboard = единое целое)

**Роли:** #1 Markus Lehmann — PA, #2 Lena Hoffmann — UX/UI, #3 Maximilian Braun — Frontend, #14 Hans Landa — Review
**Статус:** завершено

**Что сделано:**
- UnifiedHeader: единый чёрный header для всего сайта (лого-иконка, tabs, аккаунт, язык)
- DashboardSubNav: горизонтальные sub-tabs вместо sidebar
- AccountDropdown: аватар → dropdown (Einstellungen, Abo, Account, Abmelden)
- LanguageDropdown: стильный (DE ▼) вместо <select>
- Sidebar УДАЛЁН, MarketingHeader УДАЛЁН, inline nav из landing УДАЛЁН
- Жёлтые KPI блоки на dashboard (как в макапе)
- Landa Review: auth detection cookie, /onboarding exclusion, data-tour, click-outside

**Артефакты:** UnifiedHeader.tsx, DashboardSubNav.tsx, AccountDropdown.tsx, LanguageDropdown.tsx

---

### [S024] — 2026-03-26 — T008: Официальные логотипы на сайте

**Роли:** #2 Lena Hoffmann — UX/UI
**Статус:** завершено

**Что сделано:**
- Horizontal лого → landing nav, marketing header, dashboard header, landing footer
- Vertical лого → sign-in, sign-up pages
- PWA icons сгенерированы (icon-192.png, icon-512.png) из logo-icon.png
- manifest.json: theme_color #C1292E, bg_color #1A1A1A
- Старый logo-bauhaus.png удалён, 0 ссылок

**Артефакты:** icon-192.png, icon-512.png, page.tsx, MarketingHeader, dashboard/layout, sign-in, sign-up

---

### [S023] — 2026-03-26 — T007: Brand Identity Full Compliance

**Роли:** #2 Lena Hoffmann — UX/UI, #3 Maximilian Braun — Frontend
**Статус:** завершено

**Что сделано:**
- Только 5 цветов Bauhaus: #C1292E, #1A1A1A, #BC8279, #FFFFFF, #F5C518
- Убраны ВСЕ запрещённые: emerald, green, blue, amber, orange, rose, slate, stone, purple = 0
- Убраны ВСЕ скругления: 295 rounded-* → rounded-none в 49 файлах = 0
- Bebas Neue подключён для Hero H1
- Dashboard categories = 5 Bauhaus цветов
- Trend up = жёлтый, down = красный, badges = yellow/salmon

**Верификация:**
- `grep rounded-(xl|lg|2xl|md|3xl)` → 0 results
- `grep (emerald|green|blue|amber|orange|rose|slate|stone|purple)` → 0 results
- `npm run build` → 0 errors

---

### [S022] — 2026-03-26 — T006: Landing = Прототип (структура, не только цвета)

**Роли:** #2 Lena Hoffmann — UX/UI, #3 Maximilian Braun — Frontend
**Статус:** завершено

**Что сделано:**
- Hero: centered → 2 колонки (текст лево + Bauhaus-композиция право)
- Заголовок: "BauPreis AI" → "MATERIALPREISE. DIGITAL." с жёлтыми точками
- Bauhaus-композиция: dashboard card + геометрия (круги, квадраты, salmon rect)
- Убрано 7 feature sections + Grid + Tech Stack (лендинг компактный)
- Добавлен Dashboard mockup с browser frame, KPI, SVG charts
- Bauhaus-логотип SVG (красные геометрические квадраты)
- Footer: Bauhaus color bar (красный + жёлтый + salmon)
- Лого обновлён: page.tsx, MarketingHeader, Dashboard layout

**Артефакты:** `page.tsx` (полная перезапись), `MarketingHeader.tsx`, `(dashboard)/layout.tsx`

---

### [S021] — 2026-03-26 — T004: Bauhaus Bold Full Redesign (50+ файлов)

**Роли:** #2 Lena Hoffmann — UX/UI, #3 Maximilian Braun — Frontend, #14 Hans Landa — Review
**Статус:** завершено

**Что сделано:**
- Полный редизайн: brand palette #2563eb→#C1292E, добавлены bauhaus-yellow/salmon/black
- Space Grotesk подключён как headline font
- Glassmorphism → solid borders + Bauhaus hard shadows (4px 4px 0)
- Landing page: geometric shapes, Bauhaus typography, red/yellow/black theme
- Dashboard: solid sidebar, black index banner с red shadow
- Все 50+ файлов обновлены: 0 indigo, 0 #4F46E5, 0 backdrop-blur

**Верификация:**
- `npm run build` → 0 errors
- `grep indigo app/src/` → 0 results
- `grep #4F46E5 app/src/` → 0 results

**Артефакты:** T004 roadmap, tailwind.config.ts, globals.css, layout.tsx, page.tsx, 50+ component/page files

---

### [S020] — 2026-03-26 — Прототипы: Landing + Dashboard (Bauhaus Bold)

**Роли:** #2 Lena Hoffmann — UX/UI, #14 Hans Landa — Review
**Статус:** завершено

**Что сделано:**
- 2 landing прототипа (Dark Professional + Bauhaus Bold) — CEO выбрал Bauhaus Bold
- Dashboard прототип Bauhaus Bold: sidebar, index banner, 16 материалов по 6 категориям
- Все данные реальные (de.ts + цены), responsive 375/768/1440
- 3 standalone HTML файла, app/ не затронут

**Артефакты:** `design/prototypes/variant-1-dark-professional.html`, `variant-2-bauhaus-bold.html`, `variant-2-dashboard.html`

**Решение CEO:** Bauhaus Bold (#C1292E / #1A1A1A / #F5C518) — направление дизайна

---

### [S019] — 2026-03-26 — 8 Creative Briefs для Luma Labs инфографик

**Роли:** #2 Lena Hoffmann — UX/UI, #1 Markus Lehmann — PA, #14 Hans Landa — Review
**Статус:** завершено

**Что сделано:**
- 8 copy-paste ready промптов для Luma Labs AI (4 темы x 2 стиля)
- Темы: Product, Market, Dashboard, Marketing (pain→solution)
- Стили: Dark Tech (#0A1528 палитра) + Bauhaus (#C1292E палитра)
- Формат: 16:9 для сайта, язык EN, немецкие тексты внутри

**Ключевые решения:**
- Убраны неверифицируемые цифры (73%, 15% Einsparung) по замечанию Ланды
- Рыночные данные только из Destatis/Hauptverband/ifo
- Округлено 398K→~400K Bauunternehmen

**Артефакты:** `design/briefs/01-product-dark.md` ... `design/briefs/08-marketing-bauhaus.md`

**Следующие шаги:**
- CEO копирует briefs в Luma Labs → генерация → выбор лучших

---

### [S018] — 2026-03-26 — 2 прототипа дизайна из Luma Brand Identity

**Роли:** #2 Lena Hoffmann — UX/UI, #1 Markus Lehmann — PA, #14 Hans Landa — Review
**Статус:** завершено

**Что сделано:**
- Исследование Figma MCP + Claude Code интеграции (T002)
- Анализ 2 brand identity вариантов из Luma Labs (Dark Professional + Bauhaus Bold)
- 2 standalone HTML-прототипа с SVG-графиками, pricing, responsive
- Тексты на Deutsch из de.ts

**Ключевые решения:**
- Standalone HTML — zero risk для prod, мгновенный просмотр
- SVG-графики inline — self-contained, no dependencies

**Артефакты:** `design/prototypes/variant-1-dark-professional.html`, `design/prototypes/variant-2-bauhaus-bold.html`, `docs/tasks/T002_*`, `docs/tasks/T003_*`

**Следующие шаги:**
- CEO выбирает вариант → применяем к сайту

---

## Записи

---

### S033 — 2026-03-26 — Site Audit Fixes: Wave 1+2 (8 задач)

**Роли:** #6 SRE, #5 Backend, #3 Frontend, #7 QA, #14 Landa (ревью)
**Статус:** завершено

**Что сделано:**
- T1: CSP header добавлен в Caddy (без unsafe-eval, замечание Ланды)
- T2: CSRF lib создан (HMAC-SHA256, 1h TTL), 6 unit тестов
- T3: Stripe verify — пропущен (CEO), обнаружено: на сервере нет Stripe, только PayPal+Paddle
- T4: i18n auth pages — sign-in/sign-up локализованы (de/en), 30 ключей
- T5: Clerk cleanup — удалены 4 компонента, 1 webhook, очищены 6 API routes + auth.ts, security page переписан
- T6: URL redirects — /login→/sign-in, /registrieren→/sign-up (permanent)
- T7: CORS whitelist — API headers, conditional dev/prod origin
- T8: Synthetic data indicator — оранжевый badge "Simuliert" на dashboard

**Ключевые решения:**
- Clerk полностью удалён, auth = custom session only
- CSP без unsafe-eval (Ланда: "иначе бесполезен")
- CSRF в lib (не middleware) — Edge Runtime не поддерживает crypto.createHmac
- Billing на сервере = PayPal+Paddle, НЕ Stripe (CREDENTIALS.md drift)
- TANKERKOENIG_API_KEY отсутствует на сервере → Diesel не показывается

**Артефакты:** `lib/csrf.ts`, `next.config.js`, `auth.ts`, `i18n/de.ts`, `i18n/en.ts`, sign-in/sign-up pages, security page, 4 API routes

**Верификация:** Build ✅ 0 errors, TypeScript ✅ 0 errors, Tests ✅ 78/78 pass, CSP ✅ curl verified

**Следующие шаги:**
- Wave 3: Sentry, тесты, OpenAPI, a11y, WhatsApp (после аудита)
- Зарегистрировать TANKERKOENIG_API_KEY для Diesel
- Деплой на production

---

### S032 — 2026-03-24 — Переписка: HWK Schneider + STARTUP PROFI Vertrag

**Роли:** #8 Chief of Staff, #14 Landa (ревью)
**Статус:** завершено

**Что сделано:**
- HWK München (Ana Schneider): исследование контакта, Online-Termin 10.04 14:00 подтверждён
- STARTUP PROFI: Coaching-Vertrag повторно подписан (reminder 23.03 — первая подпись 13.03 не дошла), подтверждение получено, email отправлен
- Coaching-Start сдвинулся: 23.03 → 30.03 → 07.04.2026
- Создана папка `docs/inbox/unsorted/` для несортированных писем
- CORRESPONDENCE.md обновлён (контакты #3 и #10)

**Ключевые решения:**
- Красный флаг: AVGS до 10.04, coaching-start 07.04 — 3 дня зазора. Уточнить у STARTUP PROFI

**Артефакты:** `docs/CORRESPONDENCE.md`, `docs/inbox/unsorted/`

**Следующие шаги:**
- Ждать подтверждение от STARTUP PROFI по email
- Подготовить демо к звонку HWK 10.04
- Проверить Digitalbonus Bayern (актуальность)

---

### S031 — 2026-03-18 — SEO Phase 1+2: metadata, trial fix, schemas

**Роли:** #3 Frontend (SEO), #14 Landa (верификация аудита)
**Статус:** завершено

**Что сделано:**
- Trial period унифицирован: 7→14 Tage во всех 3 языках (27 мест) + sign-up page
- "Ab €1/Monat" → "Ab €49/Monat" во всех языках (5 мест)
- Уникальные Title/Description для 7 маркетинг-страниц (de/en/ru = 42 новых i18n-ключа)
- FAQPage Schema JSON-LD (6 Q&A) в root layout
- BreadcrumbList Schema для маркетинг-страниц
- Оптимизация root Title (keyword-first, ≤60 символов) и Description (конкретика: 16 Baustoffe)
- 51 SEO-тест написан и пройден (vitest). Все 72 теста проекта зелёные.
- SEO-аудит из docx разобран, перекрёстно верифицирован с кодом

**Ключевые решения:**
- Trial = 14 Tage (из бизнес-плана, строка 247/295/378)
- Client pages split: page.tsx → ServerWrapper + ClientComponent (для generateMetadata)
- "7 Tage" в dashboard/alerts/tooltip НЕ тронуты (это фильтры, не trial)

**Артефакты:** `de.ts`, `en.ts`, `ru.ts`, `layout.tsx`, 7 marketing pages, `BreadcrumbSchema.tsx`, `seo.test.ts`

**Следующие шаги:**
- Коммит + деплой
- Hreflang (Phase 3 — архитектурное решение: URL-based i18n)
- GTM tag coverage (4 страницы)
- Блог-контент (8 статей по keyword-стратегии)

---

### S030 — 2026-03-18 — Обновление методологии до V7.0 (MainCore)

**Роли:** #8 Chief of Staff
**Статус:** завершено

**Что сделано:**
- CLAUDE.md переписан по CLAUDE_TEMPLATE V7.0: компактный формат, все BauPreis-данные заполнены
- TEAM.md переписан по TEAM_TEMPLATE V7.0: 8 специалистов вместо 15, детальные профили
- Команда оптимизирована: #4/#5/#6/#10 объединены в #5 Backend, #9 EM → #8 Chief of Staff, #11/#12/#13/#15 удалены
- #14 Hans Landa сохранён без изменений (untouchable)
- Реестр увольнений перенесён полностью (6 записей)
- STATUS.md обновлён

**Ключевые решения:**
- V7.0 = компактнее + сильнее: меньше ролей, больше ответственности на каждого
- Backend (#5) объединяет API, Data, AI, Payments — соответствует реальной архитектуре (один Next.js monolith)

**Артефакты:** `CLAUDE.md`, `TEAM.md`, `DEVLOG.md`, `STATUS.md`

**Следующие шаги:**
- Верификация: агенты работают по новой методологии
- При необходимости — добавить роли #9, #10 по решению #1 + CEO

---

### S029 — 2026-03-15 — Hotfix: белый экран /sign-in, пересборка сервера

**Роли:** #7 SRE
**Статус:** завершено

**Что сделано:**
- Диагностирован белый экран на baupreis.ais152.com/sign-in
- Root cause: контейнер не пересобирался 3+ дня → стали Next.js Server Action хэши → браузерный кеш не совпадал → React crash
- Логи показали: "Failed to find Server Action 'x'" и metals.dev 400
- Выполнено: `docker compose up -d --build` → контейнер пересоздан → сайт 200 OK

**Артефакты:** нет (infra-only action)

**Следующие шаги:**
- Настроить автоматический rebuild по расписанию (или webhook) чтобы предотвратить повтор
- UX Overhaul: интеграция HelpIcon + кнопка Tour в /einstellungen

---

### S028 — 2026-03-14 — UX Overhaul: ТС v4.0 исполнение (Волны 1–5 COMPLETE)

**Роли:** #3 Frontend, #4 Backend, #2 UX
**Статус:** завершено

**Что сделано:**
- **Wave 1 (bugfixes):** max_materials 99→999, CATEGORY_LABELS mismatch (metals→metal, +steel), onboarding dynamic limits
- **Wave 2 (API):** analysis API +category в SQL, /api/user/preferences (GET/PATCH), migration 005_user_preferences
- **Wave 3 (UI):** Custom Tooltip, HelpIcon, CategoryIcon (6 SVG), DashboardNav rewrite (Lucide icons + data-tour)
- **Wave 4 (dashboard):** Dashboard grouped by 6 categories, color-coded borders, CATEGORY_ORDER sorting
- **Wave 5 (content):** 22 tooltip i18n keys (DE/EN/RU) — BauPreis Index, LME, Preisgleitklausel, Legierungsrechner, trends, recommendations, categories
- **Fix:** @types/react-dom declaration, removed stale @ts-expect-error in MobileNav
- **Build:** 0 errors, compiled successfully

**Артефакты:** `de.ts/en.ts/ru.ts` (+22 tooltip keys), `CategoryIcon.tsx`, `WelcomeTour.tsx`, `Tooltip.tsx`, `HelpIcon.tsx`, `DashboardNav.tsx`, `dashboard/page.tsx`, `preferences/route.ts`, `005_user_preferences.sql`, `react-dom.d.ts`

**Следующие шаги:**
- Интеграция HelpIcon в dashboard/settings pages у конкретных элементов
- Кнопка «Tour neu starten» в /einstellungen

---

### S027 — 2026-03-14 — UX Overhaul: Фидбек тестировщика → ТС v4.0 (3 раунда Landa)

**Роли:** #9 EM, #11 UX Research, #1 PA, #2 UX, #14 Landa (3 раунда аудита), #3/#4 (предварительно)
**Статус:** завершено — CEO утвердил, исполнено в S028

**Что сделано:**

- Фидбек тестировщика (стройка/закупки): «сырой, нужны объяснялки, иконки, почему 99 материалов»
- Глубокий аудит: 4 параллельных исследования кода (categories, max_materials, UI components, analysis API)
- 3 раунда Landa: ТС v1→FAIL → v2→FAIL → v3→CONDITIONAL PASS → **v4.0 READY**

**Критичные находки Landa:**

- CATEGORY_LABELS: `metals`≠`metal` (plural/singular mismatch), `steel` отсутствует
- shadcn/ui **не установлен** (директория пуста) — tooltip будет custom на Tailwind
- Analysis API не возвращает category — нужен data contract change
- Onboarding hardcodes maxMaterials=5
- Clerk webhook даёт Team features trial'у (зафиксировано, вне скоупа)

**Ключевые решения v4:**

- Custom Tooltip (без shadcn/ui init — не ломать кастомную архитектуру)
- users.preferences JSONB + новый endpoint /api/user/preferences
- 9 подзадач, 5 волн исполнения

**Артефакты:** ТС v4.0 в чате, memory files обновлены

---

### S026 — 2026-03-13 — GTM Outreach: 5 Branchenverbände + Email-Signatur + CORRESPONDENCE.md

**Роли:** #1 PA (стратегия, письма), #15 Draganov (оценка каналов)
**Статус:** завершено

**Что сделано:**
- Анализ письма IHK (Kullnigg): вежливый отказ с 4 рекомендациями (Verbände, Messen, HWK, Standortportal)
- Ответ IHK отправлен: спасибо + 2 уточняющих вопроса (конкретные Verbände, Messeübersicht)
- Найдены 5 Branchenverbände Bau в München/Bayern (research)
- Составлены и отправлены 3 outreach-письма: Bauindustrieverband, LBB, Bauinnung München
- 2 черновика готовы: BIV Bayern, HWK München
- STARTUP PROFI: Erstgespräch с Patrick Schäfer проведён, ждём контракт, старт 23.03
- Создана профессиональная email-подпись (HTML, фирменный стиль #C8FF00): `docs/email-signature.html`
- Создан `docs/CORRESPONDENCE.md` — реестр всех переписок (10 контактов, статусы, хронология)

**Ключевые решения:**
- GTM-стратегия: Branchenverbände = главный канал выхода на ЦА (1.300+ компаний через один контакт)
- Email-подпись: двойной бренд (BauPreis AI + AiS152)

**Артефакты:** `docs/email-signature.html`, `docs/CORRESPONDENCE.md`

**Следующие шаги:**
- Отправить письма BIV Bayern + HWK München
- Ждать ответы от 5 контактов
- При ответах — обновить CORRESPONDENCE.md

---

### S025 — 2026-03-12 — Gründerfragebogen STARTUP PROFI отправлен

**Роли:** #12 BA (Dr. Michael Brandt)
**Статус:** завершено

**Что сделано:**
- Заполнен и отправлен Gründerfragebogen на startup-profi.de
- AVGS Nr. 843E328369-1 загружен (4 фото, переснять в лучшем качестве если попросят)
- Исправлена ошибка: Berufserfahrung = `bis zwei Jahre` (IT only), не `mehr als zehn Jahre`
- Schulabschluss = Hochschulabschluss, Berufsausbildung = Master/Diplom (Tourismusmanagement)
- Kategorie = IT, Telekommunikation / digitales Geschäftsmodell
- Coachingbeginn = 23.03.2026, Gründungszeitpunkt = 01.04.2026
- Datenschutzerklärung подтверждена, форма отправлена

**Результат:**
- Подтверждение получено от notifications@cognitoforms.com
- Patrick Schäfer (Patrick@startup-profi.com) ответил: старт 23.03.2026 возможен при подаче AVGS до 13.03.2026
- Ответное письмо отправлено, запрошен Erstgespräch-терmin

**Следующие шаги:**
- Ждать звонка/письма от STARTUP PROFI (в течение 2 дней)
- Erstgespräch с Patrick Schäfer — согласовать дату
- Дедлайн AVGS: 10.04.2026

---

### S024 — 2026-03-12 — STARTUP PROFI найден / Письмо готово

**Роли:** #12 Dr. Michael Brandt (BA), #13 Dr. Petra Hoffmann (Legal)
**Статус:** завершено (ожидание ответа от провайдера)

**Что сделано:**
- Найден AZAV-аккредитованный провайдер: **STARTUP PROFI GmbH**, München
- AZAV-сертификат: M-23-23802-5 (проверено в официальном реестре KURSNET)
- Адрес: Maximilianstraße 35, München — в зоне действия AVGS (только München)
- Modul 4 (Businessplan + Einstiegsgeld §16b) + Modul 7 (Tragfähigkeitsprüfung) — подходят
- Подготовлено письмо: info@startup-profi.de — ссылка на AVGS Nr. 843E328369-1

**Следующие шаги:**
- Eduard отправляет письмо на info@startup-profi.de
- Ждать ответа (дедлайн AVGS: 10.04.2026)
- После подтверждения — заполнить Trägerbestätigung (стр. 4 AVGS)

---

### S023 — 2026-03-12 — УВОЛЬНЕНИЕ #12 и #13 / Конфликт AVGS-AktivSenioren

**Роли:** #9 EM (Viktor Hartmann)
**Статус:** завершено / критический инцидент

**Что произошло:**
- Jobcenter (I. Schulz) сообщил: AktivSenioren не является AVGS-аккредитованным провайдером
- #12 Dr. Müller рекомендовал AktivSenioren с пометкой "AVGS? prüfen" но не верифицировал до отправки
- #13 Dr. Fischer со-подписала документ без проверки
- Результат: Jobcenter отказал в оплате AktivSenioren через AVGS, Auftrag 26628 завис
- **#12 Dr. Stefan Müller — ГОЛОВА ОТРЕЗАНА. #13 Dr. Anna Fischer — ГОЛОВА ОТРЕЗАНА.**
- TEAM.md обновлён — позиции #12 и #13 открыты

**Что сделать следующим:**
- Ответить Jobcenter (I. Schulz) через портал: запросить список AVGS-аккредитованных провайдеров
- Дедлайн AVGS: 10.04.2026
- Нанять новых #12 BA и #13 Legal по стандарту TEAM.md

---

### S022 — 2026-03-11 — GründerRegio M отказ + AktivSenioren 130€ подтверждён

**Роли:** #12 BA, #13 Legal
**Статус:** завершено

**Что сделано:**
- GründerRegio M (Bettina Wenzel): отказ — не сертифицированы для AVGS
- Рекомендовали: salutavita.de (Verena Weihbrecht) — резерв
- AktivSenioren Bayern подтвердили: 130€ оплачивает Jobcenter напрямую, счёт не придёт
- Businessplan PDF готов: `docs/businessplan/Businessplan — BauPreis AI SaaS.pdf`

**Следующие шаги:**
- Ждать коуча от AktivSenioren (Auftrag 26628)
- При звонке — спич готов, businessplan PDF отправить по запросу

---

### S021 — 2026-03-11 — AVGS-письмо отправлено, сессия закрыта

**Роли:** #12 BA, #13 Legal
**Статус:** завершено

**Что сделано:**
- Письмо про AVGS Nr. 843E328369-1 отправлено на info@aktivsenioren.de
- Уточнено: 130€ должен оплатить Jobcenter, не клиент

**Следующие шаги:**
- Ждать ответа AktivSenioren (коуч свяжется по телефону или email)
- При ответе от GründerRegio M — сравнить условия

---

### S020 — 2026-03-11 — AktivSenioren Bayern: Auftragsbestätigung получена

**Роли:** #12 BA, #13 Legal
**Статус:** завершено

**Что сделано:**
- Получена Auftragsbestätigung Nr. 26628
- PDF сохранён: `docs/businessplan/aktivsenioren/26628_Auftrag.pdf`
- Подготовлено письмо на info@aktivsenioren.de про AVGS Nr. 843E328369-1

**Следующие шаги:**
- Отправить письмо про AVGS на info@aktivsenioren.de
- Если придёт ответ от GründerRegio M — сравнить условия, выбрать лучший

---

### S019 — 2026-03-11 — AktivSenioren Bayern: заявка подана успешно

**Роли:** #12 BA, #13 Legal
**Статус:** завершено

**Что сделано:**
- Заявка на сайте aktivsenioren.de/auftrag успешно отправлена
- Выбрано: Existenzgründung + темы: Business/Finanzplanung, Tragfähigkeitsbescheinigung, Digitalisierung, Geschäftsmodell-Analyse, Vertrieb
- Регион: München und Umland
- Ждать Auftragsbestätigung + счёт на ebaias.muc@gmail.com
- При получении счёта — уточнить оплату через AVGS Nr. 843E328369-1

**Следующие шаги:**
- Ждать письмо от AktivSenioren (Auftragsbestätigung)
- При счёте — написать про AVGS, не платить самому

---

### S018 — 2026-03-11 — AktivSenioren Bayern ответили: AVGS подтверждён

**Роли:** #12 BA, #13 Legal
**Статус:** завершено

**Что сделано:**
- AktivSenioren Bayern (Roswitha Heiß) ответили через 6 минут на письмо
- Подтвердили: принимают AVGS, 130€ оплачивает Jobcenter
- Следующий шаг: создать заявку на aktivsenioren.de/auftrag/unterstuetzung-beauftragen
- Указать AVGS Nr. 843E328369-1, gültig bis 10.04.2026

**Артефакты:** `docs/businessplan/IHK_FACHKUNDIGE_STELLE.md` (обновлён)

**Следующие шаги:**
- Подать заявку на сайте AktivSenioren Bayern с данными AVGS
- Ждать подтверждения начала коучинга (до 10.04.2026)

---

### S017 — 2026-03-11 — Legal: AVGS-Gutschein Jobcenter + письма Träger

**Роли:** #13 Legal (анализ, письма), #12 BA (финансовый анализ)
**Статус:** завершено

**Что сделано:**
- Проанализирована переписка с IHK München — отказ по SGB II (IHK работает только с ALG I)
- Jobcenter München-Giesing выдал **AVGS-Gutschein Nr. 843E328369** (11.03–10.04.2026)
- Содержание AVGS: Gründungscoaching + Businessplan-Prüfung + Tragfähigkeitsbescheinigung — **бесплатно**
- Составлены и отправлены письма в AktivSenioren Bayern + GründerRegio M
- Создан документ `docs/businessplan/IHK_FACHKUNDIGE_STELLE.md`

**Ключевые решения:**
- AVGS покрывает Tragfähigkeitsbescheinigung (0 € вместо 130–199 €) + коучинг по бизнес-плану
- Срок: маршрут должен начаться до 10.04.2026

**Артефакты:** `docs/businessplan/IHK_FACHKUNDIGE_STELLE.md`, `docs/businessplan/jobcenter/` (4 фото)

**Следующие шаги:**
- Ждать ответа от AktivSenioren / GründerRegio M
- При подтверждении: передать Businessplan PDF + Trägerbestätigungsformular

---

### S016 — 2026-03-11 — Fix: AI Chat не работал (Caddy SSE + API key rotation)

**Роли:** #7 SRE (ротация ключа, деплой, Caddy), #4 Backend (диагностика), #8 QA (верификация)
**Статус:** завершено

**Что сделано:**
- Ротация ANTHROPIC_API_KEY: `sk-ant-api03-0Jc...cwAA` → `sk-ant-api03-m1vc...QAA`
- Обновлён `CREDENTIALS.md` + `/root/baupreis/.env` на сервере
- **Корневая причина AI Chat:** Caddy отсутствовал `flush_interval -1` для `/api/chat*` → SSE-стрим буферизировался, браузер видел только spinner, ответ никогда не доходил
- Добавлен `@sse { path /api/chat* }` блок с `flush_interval -1` в `/etc/caddy/Caddyfile`
- Caddy перезагружен (`caddy reload`), конфиг валиден

**Ключевые решения:**
- `docker compose restart` НЕ перечитывает `.env` → нужен `--force-recreate`
- SSE через Caddy требует явного `flush_interval -1`, иначе стрим буферизируется

**Артефакты:** `CREDENTIALS.md`, `/root/baupreis/.env`, `/etc/caddy/Caddyfile`

**Следующие шаги:**
- Нанять нового #7 SRE (текущий уволен за неполное выполнение деплоя)
- IHK Excel Finanzplan

---

### S015 — 2026-03-10 — Feat: 5 выставок в бизнес-план + полный пересчёт Kapitalbedarfsplan

**Роли:** #12 BA (формализация, расчёт), #14 Landa (аудит), #9 EM (координация)
**Статус:** завершено

**Что сделано:**
- Добавлены 5 выставок: DACH+HOLZ (850€), digitalBAU Köln (500€), ARCHITECT@WORK München (42€), Construction Summit Hamburg (560€), Zukunft Bau Stuttgart (105€)
- Создан `scripts/calc_exhibitions.py` — детальный расчёт бюджетов (вход, проезд, проживание, питание, печатные материалы)
- Kapitalbedarfsplan пересчитан: A.Grundkosten 771 + B.Marketing 3.587 + C.Infrastruktur 1.142 = **5.500 €**
- Finanzierungsplan: Überdeckung +3.084 € (Eigenkapital 200 + Einstiegsgeld 3.384 + Investitionszuschuss 5.000 = 8.584)
- Обновлён `scripts/verify_businessplan.py` — **0 ошибок, 0 предупреждений**
- Пропагация во все 8 файлов: businessplan/ + gewerbe/ × {DE.md, DE.html, RU.md, RU.html}
- Исправлены остатки старых значений: 4.500→5.500 в risk-секциях, 905→5.500 в gewerbe
- Исправлена gewerbe/BUSINESSPLAN_RU.html: старая плоская структура → правильная A/B/C

**Ключевые решения:**
- Kapitalbedarf 5.500 € > max. Investitionszuschuss (5.000 €) — обосновывает полный грант § 16c

**Артефакты:** `scripts/calc_exhibitions.py`, `scripts/verify_businessplan.py`, 8 файлов BUSINESSPLAN, `SPEECH_JOBCENTER.html`

**Следующие шаги:**
- IHK Excel Finanzplan

---

### S014 — 2026-03-10 — Fix: выставки перенесены с Monat 7-12 на Monat 1-3

**Роли:** #12 BA (формализация), #9 EM (координация)
**Статус:** завершено

**Что сделано:**
- Коллизия: ARCHITECT@WORK = April 2026 = Month 2, но в маркетинге выставки были в Monat 7-12. Исправлено
- Добавлено «Bereits durchgeführt» (DACH+HOLZ Köln Feb.2026) перед Monat 1-3
- Monat 1-3: +ARCHITECT@WORK München. Monat 4-6: +Google Ads (с расчётом CPC). Monat 7-12: «Skalierung + weitere Messen»
- Бюджет: Messen M1-6 = 30€ (было 0€), Gesamt M1-6 = ~50€, M7-12 = ~100-150€
- Paddle-Checkout → Stripe-Checkout в Vertriebsprozess
- Пропагация во все 8 файлов: businessplan/ + gewerbe/ × {DE.md, DE.html, RU.md, RU.html}
- verify_businessplan.py: 0 ошибок, 0 предупреждений

**Артефакты:** 4 MD + 4 HTML в `docs/businessplan/` и `docs/gewerbe/`

**Следующие шаги:**
- IHK Excel Finanzplan
- Draganov: замена Paddle→Stripe в финансовых расчётах (отдельная задача)

---

### S013 — 2026-03-10 — Hotfix: дата приезда 2022→Feb.2025 + Telegram→WhatsApp

**Роли:** #14 Landa (аудит), #9 EM (координация), #12 BA (верификация)
**Статус:** завершено

**Что сделано:**
- КРИТИЧЕСКИЙ HOTFIX: Werdegang в бизнес-плане указывал «2022–2023 Ankunft in Deutschland» — ЛОЖЬ. Исправлено на «Feb. 2025» во всех 8 файлах (businessplan + gewerbe, MD + HTML + RU)
- Перестроен таймлайн: Videoproduktion 2020→2024, Programmierung 2022→2024 (Украина), Ankunft Feb. 2025
- LEBENSLAUF: «Eigene Projekte, München» для 01.2024 → «Remote / München»
- Telegram→WhatsApp: исправлено в gewerbe/ (BUSINESSPLAN DE/RU MD/HTML) + обоих LEBENSLAUF
- Полная верификация команды для JobCenter 11.03: verify_businessplan.py 0 ошибок, #14 кросс-проверка 4 документов — 0 расхождений

**Ключевые решения:**
- Источник ошибки: галлюцинация при генерации бизнес-плана, НЕ из резюме

**Артефакты:** 10 файлов в `docs/businessplan/` и `docs/gewerbe/`

**Следующие шаги:**
- Устранить коллизию выставок в маркетинг-плане (Messen в Monat 7-12, но ARCHITECT@WORK = April = Month 2)

---

### S012 — 2026-03-07 — Fix: Clerk → LocalSignIn (auth fix)

**Роли:** #7 SRE, #4 Backend Engineer
**Статус:** завершено

**Что сделано:**
- Clerk CDN не грузился → /sign-in показывал blank screen
- Переключили sign-in/sign-up на LocalSignIn (email + baupreis_session cookie)
- Удалили ClerkProviderWrapper из root layout (нет загрузки Clerk JS)
- Middleware → plainMiddleware (проверка baupreis_session cookie)
- Dashboard layout → LogoutButton вместо Clerk UserButton
- Деплой: --no-cache build, оба контейнера healthy

**Ключевые решения:**
- Clerk отключен на уровне UI/middleware — ADR-002 требует пересмотра

**Артефакты:** `sign-in/page.tsx`, `sign-up/page.tsx`, `middleware.ts`, `layout.tsx`, `(dashboard)/layout.tsx`

**Следующие шаги:**
- Проверить логин в браузере CEO (Ctrl+Shift+R)
- Решить: удалить Clerk полностью или оставить webhook для будущего

---

### S011 — 2026-03-07 — Premium visual upgrade: 6 dashboard pages

**Роли:** #3 Frontend Engineer
**Статус:** завершено

**Что сделано:**
- Alerts: hover-эффекты на карточках, ring badges, glassmorphism modal, eyebrow label
- Prognose: gradient left border на карточках, gradient confidence bar, hover/shadow transitions
- Chat: gradient user messages, enhanced starter chips с hover/-translate-y, subtle bg gradient
- Preisgleitklausel: полный визуальный overhaul — rounded-2xl, gradient result cards, focus shadows
- Berichte: grid layout вместо list, report cards с icon/gradient accent/hover, glassmorphism modal
- Legierungsrechner: rounded-2xl cards, gradient result section, hover transitions на всех блоках

**Артефакты:** `alerts/page.tsx`, `prognose/page.tsx`, `chat/page.tsx`, `preisgleitklausel/page.tsx`, `berichte/page.tsx`, `legierungsrechner/page.tsx`

---

### S010 — 2026-03-07 — Обновление методологии до MainCore V4.3

**Роли:** #8 Chief of Staff Engineering
**Статус:** завершено

**Что сделано:**
- CLAUDE.md: +9 секций V4.3 (Auto-Validation, DoD, Session Context, Restrictions, ADR, Contract-First, Chaos Testing, Complexity Budget, Agent Metrics)
- Failure Scenarios + Validation в шаблон ТС, Бюджет итераций в таблицу сложности
- Создан STATUS.md, METRICS.md, docs/adr/ (3 ретроспективных ADR)
- Реестр рисков #1-#14 добавлен в CLAUDE.md
- docker-compose.yml: восстановлены HOSTNAME, SESSION_SECRET, CONTACT_EMAIL, healthcheck

**Артефакты:** `CLAUDE.md`, `STATUS.md`, `METRICS.md`, `docs/adr/ADR-001..003`, `docker-compose.yml`

**Следующие шаги:** IHK Businessplan до 11 марта, деплой docker fix

---

### S009 — 2026-03-04 — Premium landing + Team plans + IHK analysis

**Роли:** #9 EM, #3 Frontend, #4 Backend, #12 Business Analyst
**Статус:** завершено

**Что сделано:**
- **Premium landing page:** `page.tsx` полностью переписан (562 строк) — showcase-стиль с IntersectionObserver анимациями, browser-frame mockups, 14 секций. i18n: 151 ключей `landing2.*` (de/en/ru)
- **Showcase HTML:** `presentation/showcase-en.html` (1776 строк) — standalone презентация с реальными скриншотами дашборда
- **Team plans для тестеров:** 4 юзера (clicksuckers, morochobayas, pashchenkoh, aidancompton001) → plan=team, все feature flags включены в PostgreSQL
- **IHK webinar анализ:** Checkliste + Handout (88 стр.) проанализированы, gap analysis vs BUSINESSPLAN.md → 5 пробелов (Business Model Canvas, Finanzplan Excel, "Auf einen Blick", Lieferanten, Annahmen)
- **IHK шаблоны:** Textteil (11 секций) + Finanzteil (7 Excel sheets) — структура сравнена с нашим бизнес-планом
- **docker-compose.yml:** восстановлены HOSTNAME=0.0.0.0, SESSION_SECRET, CONTACT_EMAIL, healthcheck→127.0.0.1

**Ключевые решения:**
- `landing2.*` prefix для i18n (не конфликтует с `landing.*`)
- Feature flags отдельно от plan field (Stripe webhook нормально ставит, ручная смена — нет)

**Артефакты:** `app/src/app/page.tsx`, `app/src/i18n/{de,en,ru}.ts`, `app/src/app/globals.css`, `presentation/showcase-en.html`, `app/public/img/`, `docker-compose.yml`

**Следующие шаги:**
- IHK: заполнить Finanzplan Excel, Business Model Canvas, "Auf einen Blick" до 11 марта (встреча с Berater)
- Деплой docker-compose.yml fix на сервер

---

### S008 — 2026-02-27 — TASK-007: Audit remediation sprint (11 fixes)

**Роли:** #9 EM (координация), #4 Backend, #3 Frontend, #7 SRE
**Статус:** завершено

**Что сделано:**
- Полный аудит 4 агентами → 6 Critical + 10 High → после верификации 4C + 7H (3 false positive)
- **Stream A (Security):** CRON_SECRET hardened, SESSION_SECRET отделён от CRON, Chat SQL regex→clean params, threshold_pct per rule_type
- **Stream B (Quality):** 19 console.*→logger в API, email→constants.ts (71 хардкод), i18n auth pages (de/en/ru), TypeScript any→types в lib/
- **Stream C (Infra):** pdfkit eval→serverExternalPackages, миграции 002-006 renumbered, Docker resource limits, HOSTNAME=0.0.0.0, healthcheck→127.0.0.1
- Build: 0 errors, 52 pages compiled

**Артефакты:** 20+ файлов, `docker-compose.yml`, `migrations/`, `app/src/lib/`, `app/src/app/api/`, `app/src/i18n/`
**Следующее:** деплой на сервер, генерация SESSION_SECRET, smoke test

---

### S007 — 2026-02-27 — CLAUDE.md усилен протоколом из RMS-проекта

**Роли:** #9 EM, #1 Product Architect
**Статус:** завершено

**Что сделано:**
- Диагностика: почему протокол нарушался в BauPreis, но работал в RMS
- Корень: BauPreis CLAUDE.md декларировал правила без примеров; RMS показывал конкретные образцы
- Добавлены: ASCII-диаграмма пайплайна, 2 шаблона ТС (полный + лёгкий S), определения S/M/L/XL
- Добавлены: 3 примера ТЗ (S, M, XL) адаптированных под BauPreis
- Добавлены: таблица особых случаев, правила исполнения, Шаг 4 Верификация
- DEVLOG: полный формат записи, таблица правил, маркер, «когда читать»
- Починка сайта: HOSTNAME=0.0.0.0 + health check 127.0.0.1 (IPv6 баг Alpine)

**Артефакты:** `CLAUDE.md`, `DEVLOG.md`
**Следующие шаги:** Зарегистрировать Tankerkoenig API ключ (diesel = 16/16)

---

### S006 — 2026-02-26 — TASK-005/006: DATA QUALITY + REAL PRICE SOURCES

**Роли:** #5 Data Pipeline, #9 EM | **Статус:** завершено

**TASK-005 — Data Quality:**
- Backfill 365 дней исторических данных (4240 записей, SQL PL/pgSQL)
- Price API: daily AVG aggregation вместо raw rows
- Удалены synthetic/historical записи (6922 шт.)

**TASK-006 — Replace Synthetic Data:**
- Исследование: 12+ источников по 4 категориям (сталь, дерево, энергия, изоляция)
- Документ: docs/MATERIAL_DATA_SOURCES.md — полный реестр источников
- Destatis GENESIS API сломан (HTML вместо CSV) → мигрировали на Eurostat
- **Eurostat sts_inppd_m** — 10 материалов (C24 сталь, C16 дерево, C23 бетон/изоляция)
- **SMARD.de** — электричество (Bundesnetzagentur, без ключа)
- **Tankerkoenig** — дизель (регистрация ключа временно закрыта)
- Результат: **15/16 реальных данных**, 0 synthetic. Только diesel ждёт API-ключ.

**Решения:** Eurostat > Destatis (стабильнее, JSON, без credentials)
**Файлы:** data-sources.ts, collect-prices/route.ts, docs/MATERIAL_DATA_SOURCES.md
**Следующий шаг:** Зарегистрировать Tankerkoenig ключ → дизель = 16/16

---



**Роли:** #9 EM (ТЗ), #3 Frontend, #8 QA, #11 UX Research | **Статус:** завершено

**Деплой TASK-003 → production:**
- Build fix: getSessionSecret() вместо const SESSION_SECRET (TS type narrowing)
- Middleware fix: /api/health добавлен в public routes (Clerk 307 redirect)
- Production: health OK, 78 pages, 0 errors

**TASK-004 Gap Sprint (4 задачи, формализованные ТЗ):**
- 004-01: OG Image — opengraph-image.tsx + twitter-image.tsx (1200x630)
- 004-02: JSON-LD — SoftwareApplication + Organization + WebSite в layout.tsx
- 004-03: E2E тесты — 6 Playwright specs (landing, nav, auth, health, seo, i18n) + CI
- 004-04: Focus Group — 10 персон, общая оценка **5.2/10**, 16 рекомендаций

**Ключевой вывод:** продукт лучше маркетинга. Топ-5 проблем: нет скриншотов, фичи невидимы, trust deficit (gmail), pricing mismatch, no plan in sign-up.

**Файлы:** TASK-004-GAP-SPRINT.md, FOCUS_GROUP_REPORT.md, opengraph/twitter-image.tsx, e2e/*.spec.ts
**Следующие шаги:** Sprint по 16 рекомендациям Focus Group (trust, features, pricing, content)

> DEVLOG updated: S005

---

### S004 — 2026-02-26 — TASK-003: MEGA-SPRINT 5.1→9.9 (3 спринта, 18 задач)

**Роли:** все специалисты | **Статус:** завершено

**Sprint 1 — CRITICAL (7 задач):**
- S1-01: Paddle удалён, Stripe only (package.json, CLAUDE.md, CREDENTIALS.md)
- S1-02: Цена €1→€49 на лендинге и /preise
- S1-03: Trial = Pro-level (не Team): api=false, pdf=false, users=1
- S1-04: Session secret: убран hardcoded fallback, env-only + throw
- S1-05: Rate limiting на login (10/мин) и register (5/мин) по IP
- S1-06: DB backup скрипт (scripts/backup-db.sh, pg_dump, 7 дней)
- S1-07: Vitest установлен, 21 тест (plans, rate-limit, forecast, logger)

**Sprint 2 — HIGH (6 задач):**
- S2-01: Статистический baseline (forecast-baseline.ts: MA, linreg) → analyze cron
- S2-02: Alloy calc: live DB prices (refreshMetalPrices перед расчётом)
- S2-03: CI/CD: .github/workflows/ci.yml (test → tsc → build)
- S2-04: Docker: health check (wget /api/health) в docker-compose
- S2-05: Public /api/health endpoint (DB check, no auth)
- S2-06: Structured logging (logger.ts: JSON stdout)

**Sprint 3 — MEDIUM (5 задач):**
- S3-01: Mobile tables: min-w + overflow-x-auto padding fix
- S3-02: Error boundary: enhanced (error.tsx + not-found.tsx)
- S3-03: SEO: keywords, twitter cards, hreflang, sitemap +2 pages
- S3-04: ESLint + Prettier + configs
- S3-05: Real data: baseline forecasts заменяют sin() synthetic

**Артефакты:** 8 новых файлов, 15+ изменённых, 21 тест
**Следующие шаги:** Деплой на сервер, полный ре-аудит для новой оценки

---

### S003 — 2026-02-26 — TASK-001: Cleanup + TASK-002: Full System Audit

**Роли:** все 11 специалистов
**Статус:** завершено

**Что сделано:**
- TASK-001 Cleanup: удалено 10 элементов, архивировано 4 в docs/archive/
- TASK-002 Full System Audit: все 11 специалистов, 5 параллельных агентов
- **Общая оценка системы: 5.1 / 10**
- 8 критических проблем, 7 высоких, 5 средних
- Фокус-группа (10 персон): 0/10 завершают flow (биллинг), 7/10 без биллинга
- Сформирован Sprint Task List: 3 спринта, 19 задач

**Критические находки:** 0 тестов, биллинг нерабочий (Stripe vs Paddle), €1 на лендинге, trial=всё, hardcoded session secret, нет бэкапов БД, нет rate limiting

**Оценки по доменам:** PA 6.5 | UX 6.0 | FE 6.0 | BE 7.0 | Data 5.5 | AI 5.0 | SRE 3.5 | QA 0.5 | EM 5.0 | Pay 5.0 | Research 6.0

**Артефакты:** Scorecard + Sprint Task List (в чате)
**Следующие шаги:** Sprint 1 — исправление 7 блокеров (P0)

---

### S002 — 2026-02-26 — Внедрение CLAUDE_CODE_PLAYBOOK v1.0

**Роли:** #9 EM (Dirk Neumann), #1 PA (Eduard Baias)
**Статус:** завершено

**Что сделано:**
- Внедрена методология CLAUDE_CODE_PLAYBOOK v1.0
- TEAM.md: 11 специалистов, USER_PERSONAS.md: 10 персон
- CLAUDE.md: обновлён (6 секций из playbook, 188 строк)
- DEVLOG.md: создан (S001 ретроспектива + S002)
- Anthropic API ключ обновлён ("BauPreise"), $4.78, AI работает

**Ключевые решения:**
- Методология playbook: каждая задача = ТС + агент из TEAM.md
- #1 PA переименован: Eduard Baias

**Артефакты:** `TEAM.md`, `DEVLOG.md`, `USER_PERSONAS.md`, `CLAUDE.md`

---

### S001 — 2026-01 / 2026-02-25 — Фазы 1-6: от нуля до рабочего SaaS

**Роли:** все (до формализации команды)
**Статус:** завершено

**Что сделано:**
- **Phase 1:** Docker, PostgreSQL 16, Clerk auth (pk_live_), Next.js 14 App Router
- **Phase 2:** Dashboard UI (52 страницы), Recharts-графики, 16 материалов
- **Phase 3:** Multi-tenant (organizations, plan gating Basis/Pro/Team), requireOrg/canAccess
- **Phase 4:** Claude API (Haiku): AI-анализ, прогнозы, чат (de/en/ru), token tracking
- **Phase 5:** 7 cron jobs (collect-prices, analyze, alerts, reports, health, downgrade-trials, index)
- **Phase 6:** Landing, SEO, Telegram bot, i18n (de/en/ru), Legierungsrechner (15 сплавов), PWA
- Paddle интеграция: 24 файла, миграция с PayPal — код полный, домен rejected
- Безопасность: fail2ban, SSH hardened, security headers (Caddy)
- Баги исправлены: middleware auth (redirect вместо protect), JSON parse (markdown fences)

**Ключевые решения:**
- Caddy вместо Traefik (проще, auto SSL)
- Shared data + per-org settings (multi-tenant паттерн)
- Cookie-based i18n без библиотеки (de/en/ru)
- Synthetic fallback при недоступности API-источников цен

**Артефакты:** 52 страницы, 46 API routes, 7 cron jobs, `init.sql`, `docker-compose.yml`

**Техдолг на момент завершения:**
- 0 автоматических тестов
- Ручной деплой (git pull + docker-compose up), нет CI/CD
- Нет automated backups PostgreSQL
- Paddle домен не одобрен — billing заблокирован
- Destatis API нестабилен (302 redirects)
