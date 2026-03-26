# T001 — Аудит сайта baupreis.ais152.com перед ревью

**Дата:** 2026-03-26
**Статус:** АНАЛИЗ ЗАВЕРШЁН, ОЖИДАЕТ ОК CEO
**Ответственный:** #7 Marina Schulz — QA Engineer
**Координация:** #1 Markus Lehmann — PA
**Размер:** L

---

## 1. Результаты проверки живого сайта

### ✅ ЧТО РАБОТАЕТ

| # | Компонент | Статус | Детали |
|---|-----------|--------|--------|
| 1 | **Build** | ✅ OK | 52 страницы, 0 ошибок TypeScript |
| 2 | **Health API** | ✅ OK | `{"status":"ok","checks":{"database":true,"app":true}}` |
| 3 | **Landing `/`** | ✅ 200 | Работает, маркетинговая страница |
| 4 | **Pricing `/preise`** | ✅ 200 | Публичная, SEO-метаданные |
| 5 | **Impressum** | ✅ 200 | Правовая страница |
| 6 | **Datenschutz** | ✅ 200 | DSGVO-страница |
| 7 | **AGB** | ✅ 200 | Условия использования |
| 8 | **Auth redirect** | ✅ 307 | Dashboard/protected → sign-in (корректно) |
| 9 | **HSTS** | ✅ | `max-age=63072000; includeSubDomains; preload` |
| 10 | **X-Frame-Options** | ✅ | `DENY` |
| 11 | **X-Content-Type-Options** | ✅ | `nosniff` |
| 12 | **Referrer-Policy** | ✅ | `strict-origin-when-cross-origin` |
| 13 | **Permissions-Policy** | ✅ | camera/mic/geo отключены |
| 14 | **PWA manifest** | ✅ | Валидный, иконки 192+512px |
| 15 | **robots.txt** | ✅ | Правильно: public разрешены, protected запрещены |
| 16 | **sitemap.xml** | ✅ | 8 URL, priorities корректны |
| 17 | **X-Robots-Tag** | ✅ | noindex/nofollow на всех dashboard/API маршрутах |
| 18 | **Reverse proxy** | ✅ | Caddy (`Via: 1.1 Caddy`) |
| 19 | **SSL** | ✅ | Auto-SSL через Caddy |
| 20 | **Standalone output** | ✅ | Docker-ready |

### ❌ ЧТО НЕ РАБОТАЕТ / СЛАБЫЕ СТОРОНЫ

| # | Проблема | Критичность | Описание |
|---|----------|-------------|----------|
| **W1** | **CSP header отсутствует** | 🔴 HIGH | Content-Security-Policy не установлен. XSS-атаки не блокируются на уровне браузера. Аудитор точно отметит. |
| **W2** | **Auth-страницы без i18n** | 🟡 MEDIUM | `/sign-in` и `/sign-up` — немецкий захардкожен. Остальной сайт поддерживает de/en/ru. |
| **W3** | **CSRF-защита отсутствует** | 🔴 HIGH | Нет CSRF-токенов на формах. POST-эндпоинты уязвимы к CSRF-атакам. |
| **W4** | **CORS не настроен явно** | 🟡 MEDIUM | В `next.config.js` нет явной CORS-конфигурации. Полагается на Next.js defaults. |
| **W5** | **Тестовое покрытие — 11 тестов** | 🟡 MEDIUM | 5 unit (rate-limit, forecast, logger, plans, seo) + 6 E2E (auth, health, i18n, landing, nav, seo). Нет тестов для: alerts, billing, chat, alloy calculator, team, webhooks. |
| **W6** | **`/login` и `/registrieren` → 307** | 🟠 LOW-MED | Эти URL редиректят, но пользователи могут искать именно их. Нужны либо маршруты, либо правильные редиректы в next.config.js. |
| **W7** | **`/api/cron/health` → 405** | 🟢 LOW | Method Not Allowed при GET. Ожидает POST. Не проблема для cron, но путает при ручной проверке. |
| **W8** | **WhatsApp — не верифицирован** | 🟡 MEDIUM | Код интеграции есть, но WhatsApp Business API требует верифицированного бизнес-аккаунта. Статус неизвестен. |
| **W9** | **Нет глобального error logging** | 🟡 MEDIUM | `logger.ts` есть, но нет Sentry/LogRocket/подобного. Ошибки в production могут быть невидимы. |
| **W10** | **Нет OpenAPI / Swagger** | 🟢 LOW | 50 API-эндпоинтов без документации. Для Team-плана (API access) нужна документация. |
| **W11** | **Paddle → Stripe миграция** | 🟡 MEDIUM | В памяти: "Paddle: CODE COMPLETE, DOMAIN REJECTED". В CLAUDE.md: "Billing: Stripe (subscriptions)". Нужно верифицировать, что Stripe webhooks реально работают на production. |
| **W12** | **Synthetic data fallback** | 🟡 MEDIUM | `data-sources.ts` содержит synthetic fallback при отсутствии API ключей. Если ключи слетят — пользователь видит фейковые данные без предупреждения. |
| **W13** | **Clerk remnants в коде** | 🟢 LOW | Есть `ClerkProviderWrapper.tsx`, `ClerkSignIn.tsx`, `ClerkSignUp.tsx`, `webhook/clerk`. Auth = custom session. Мёртвый код. |

---

## 2. Инвентарь сайта (snapshot)

### Страницы: 52
- **Public (7):** `/`, `/preise`, `/ueber-uns`, `/kontakt`, `/blog`, `/datenschutz`, `/agb`, `/impressum`
- **Auth (2):** `/sign-in`, `/sign-up`
- **Onboarding (1):** `/onboarding`
- **Dashboard (8):** `/dashboard`, `/alerts`, `/chat`, `/berichte`, `/prognose`, `/preisgleitklausel`, `/legierungsrechner`, `/material/[code]`
- **Account (4):** `/account`, `/account/profile`, `/account/billing`, `/account/security`, `/account/data`
- **Settings (7):** `/einstellungen`, `/einstellungen/abo`, `/einstellungen/team`, `/einstellungen/telegram`, `/einstellungen/whatsapp`, `/einstellungen/api`, `/einstellungen/materialien`

### API: ~50 эндпоинтов
- Auth (6), Account (4), Org (3), Team (5), Billing (3), Materials (2), Prices (5), Analysis (3), Alerts (3), Reports (3), Export (2), Integrations (6), API Keys (3), Alloy (5), Chat (1), Cron (5), Health (1), Contact (1)

### Тесты: 11
- Unit (5): rate-limit, forecast-baseline, logger, plans, seo
- E2E (6): auth-redirect, health, i18n, landing, navigation, seo

---

## 3. Анализ последствий для аудита

### Что аудитор ТОЧНО проверит:

| Область | Наш статус | Риск |
|---------|-----------|------|
| **DSGVO/GDPR compliance** | Datenschutz страница ✅, Cookie Consent ✅, Data Export API ✅, Account Delete API ✅, Hetzner DE ✅ | 🟢 Низкий |
| **Security headers** | HSTS ✅, X-Frame ✅, X-Content-Type ✅, Referrer ✅, Permissions ✅, **CSP ❌** | 🔴 CSP = пробел |
| **Authentication** | Custom session (HMAC-SHA256) ✅, Google OAuth ✅ | 🟢 OK |
| **Input validation** | Parameterized SQL ✅, Form validation ✅, **CSRF ❌** | 🔴 CSRF = пробел |
| **API security** | Rate limiting ✅, API key hashing ✅, Webhook signatures ✅ | 🟢 OK |
| **Error handling** | Error boundaries ✅, Try-catch ✅, **No Sentry ❌** | 🟡 Средний |
| **Test coverage** | 11 тестов / 52 страницы / 50 API = ~10% | 🟡 Средний |
| **Code quality** | TypeScript strict ✅, 0 TS errors ✅, Build clean ✅ | 🟢 OK |
| **Accessibility** | Не проверено | 🟡 Неизвестно |
| **Performance** | First Load JS: 87.5 KB shared | 🟢 OK |

---

## 4. Roadmap: Устранение слабых сторон

### Приоритет 1 — КРИТИЧНЫЕ (до аудита обязательно)

| # | Действие | Файлы | Оценка |
|---|----------|-------|--------|
| **R1** | Добавить Content-Security-Policy header в Caddy | `Caddyfile` на сервере | S |
| **R2** | Добавить CSRF-защиту на POST-формы | `middleware.ts`, все формы с POST | M |
| **R3** | Верифицировать Stripe webhooks на production | SSH → проверить `STRIPE_WEBHOOK_SECRET` и тест-event | S |

### Приоритет 2 — ВАЖНЫЕ (желательно до аудита)

| # | Действие | Файлы | Оценка |
|---|----------|-------|--------|
| **R4** | i18n для auth-страниц (`sign-in`, `sign-up`) | `(auth)/sign-in/page.tsx`, `(auth)/sign-up/page.tsx`, `i18n/de.ts`, `en.ts` | M |
| **R5** | Удалить Clerk-remnants (мёртвый код) | `ClerkProviderWrapper.tsx`, `ClerkSignIn.tsx`, `ClerkSignUp.tsx`, `webhook/clerk/route.ts` | S |
| **R6** | Добавить индикатор synthetic data | `data-sources.ts`, dashboard UI | M |
| **R7** | CORS whitelist в `next.config.js` | `next.config.js` | S |
| **R8** | Настроить `/login` → `/sign-in` и `/registrieren` → `/sign-up` redirects | `next.config.js` (redirects) | S |

### Приоритет 3 — УЛУЧШЕНИЯ (после аудита)

| # | Действие | Файлы | Оценка |
|---|----------|-------|--------|
| **R9** | Интегрировать Sentry для error tracking | `layout.tsx`, `next.config.js`, новый пакет | M |
| **R10** | Увеличить тестовое покрытие (alerts, billing, chat, webhooks) | `__tests__/`, `e2e/` | L |
| **R11** | Добавить OpenAPI docs для v1 API | `api/v1/`, новый файл | M |
| **R12** | Accessibility audit (WCAG 2.1 AA) | Все компоненты | L |
| **R13** | Верифицировать WhatsApp Business API | Интеграция | M |

---

## 5. Чеклист приёмки

- [ ] CSP header установлен и проверен (curl -sI → Content-Security-Policy)
- [ ] CSRF-токены на всех POST-формах
- [ ] Stripe webhook: тест-event проходит на production
- [ ] Auth-страницы поддерживают de/en/ru
- [ ] Clerk-код удалён
- [ ] `/login` → `/sign-in` redirect работает
- [ ] CORS whitelist в next.config.js
- [ ] Synthetic data показывает предупреждение
- [ ] Build проходит после всех изменений
- [ ] Все существующие 11 тестов проходят
