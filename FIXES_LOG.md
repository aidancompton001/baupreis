# BauPreis AI SaaS — Fix Log

**Дата первого аудита:** 2026-02-08
**Оценка до исправлений:** 42/100
**Оценка после первого раунда:** ~65-70/100
**Оценка после второго раунда:** ~80/100

---

## CRITICAL — Критические ошибки

### CRITICAL-01: SQL-инъекция в API цен
- **Файл:** `app/src/app/api/prices/route.ts`
- **Проблема:** Параметр `days` подставлялся через шаблонную строку (`INTERVAL '${days} days'`), что позволяло SQL-инъекцию через GET-параметр.
- **Исправление:** Параметризация через `make_interval(days => $N::int)` с валидацией диапазона 1–365.
- **Риск:** Полный доступ к БД для злоумышленника.

### CRITICAL-02: Webhook Clerk без верификации подписи
- **Файл:** `app/src/app/api/webhook/clerk/route.ts`
- **Проблема:** Любой мог отправить поддельный POST с событием `user.created`/`user.deleted` и создать/удалить организации.
- **Исправление:** Добавлена проверка подписи через библиотеку `svix` с заголовками `svix-id`, `svix-timestamp`, `svix-signature`. Добавлена переменная `CLERK_WEBHOOK_SECRET` в `.env.example`.
- **Риск:** Полная подделка событий аутентификации.

### CRITICAL-03: Устаревший `authMiddleware` (Clerk v5)
- **Файл:** `app/src/middleware.ts`
- **Проблема:** Использовался `import { authMiddleware } from "@clerk/nextjs"` — deprecated в Clerk v5, не работает.
- **Исправление:** Миграция на `clerkMiddleware` + `createRouteMatcher` из `@clerk/nextjs/server`.
- **Риск:** Middleware не запускается → все маршруты открыты без авторизации.

### CRITICAL-04: Отсутствующая таблица `telegram_pending_connections`
- **Файл:** `init.sql`
- **Проблема:** API `telegram/connect/route.ts` обращается к таблице `telegram_pending_connections`, но её не было в схеме БД.
- **Исправление:** Добавлена таблица с колонками `code`, `chat_id`, `expires_at` (TTL 5 минут), индекс по `code`.
- **Риск:** Ошибка 500 при любой попытке подключить Telegram.

### CRITICAL-05: Отсутствующий `offline.html` для PWA
- **Файл:** `app/public/offline.html`
- **Проблема:** Service Worker (`sw.js`) вызывал `cache.addAll(["/offline.html"])`, но файл не существовал — SW не мог зарегистрироваться.
- **Исправление:** Создан `offline.html` с немецким текстом и кнопкой «Erneut versuchen».
- **Риск:** Полный отказ PWA-функциональности.

---

## HIGH — Серьёзные ошибки

### HIGH-01: Отсутствие обработчика `manage_billing` в Org API
- **Файл:** `app/src/app/api/org/route.ts`
- **Проблема:** Страница подписки отправляла `{ action: "manage_billing" }`, но POST-обработчик всегда создавал новую checkout-сессию вместо портала управления.
- **Исправление:** Добавлена ветка `body.action === "manage_billing"`, вызывающая `createBillingPortalSession()`.
- **Влияние:** Пользователь не мог управлять своей подпиской (отмена, смена плана).

### HIGH-02: Устаревший `images.domains` в Next.js конфигурации
- **Файл:** `app/next.config.js`
- **Проблема:** `images.domains` deprecated в Next.js 14.
- **Исправление:** Замена на `images.remotePatterns` с объектом `{ protocol: 'https', hostname: 'img.clerk.com' }`.
- **Влияние:** Warning при сборке, потенциальный отказ в будущих версиях.

### HIGH-03: Утечка данных в Analysis API для Basis-плана
- **Файл:** `app/src/app/api/analysis/route.ts`
- **Проблема:** В отличие от Prices API, не было фильтрации по `org_materials` для планов Basis/Trial. Пользователи видели анализ всех материалов.
- **Исправление:** Добавлен `orgFilter` с параметризованным запросом `AND m.id IN (SELECT material_id FROM org_materials WHERE org_id = $N)` для Basis/Trial.
- **Влияние:** Нарушение тарифных ограничений, пользователи Basis получали данные Pro-уровня.

### HIGH-04: Отсутствие валидации входных данных в Alerts API
- **Файл:** `app/src/app/api/alerts/route.ts`
- **Проблема:** POST-запрос принимал произвольные значения для `rule_type`, `channel`, `priority`, `threshold_pct` без проверки.
- **Исправление:** Добавлены массивы допустимых значений:
  - `VALID_RULE_TYPES`: `price_change`, `price_above`, `price_below`, `daily_summary`
  - `VALID_CHANNELS`: `email`, `telegram`, `both`
  - `VALID_PRIORITIES`: `low`, `medium`, `high`
  - `VALID_TIME_WINDOWS`: `1h`, `6h`, `24h`, `7d`, `30d`
  - `threshold_pct`: числовая проверка 0–100
- **Влияние:** Некорректные данные в БД, потенциальные ошибки в логике уведомлений.

### HIGH-05: XSS через `dangerouslySetInnerHTML` в отчётах
- **Файл:** `app/src/app/(dashboard)/berichte/page.tsx`
- **Проблема:** HTML-контент отчётов (`content_html`) рендерился без санитизации.
- **Исправление:** Добавлена функция `sanitizeHtml()`, удаляющая теги `<script>`, `<iframe>`, `<object>`, `<embed>`, обработчики событий (`onload=`, `onclick=`...) и `javascript:` URI.
- **Влияние:** Злоумышленник мог внедрить JS-код через содержимое отчёта.

### HIGH-06: Несовместимая версия Stripe SDK
- **Файлы:** `app/package.json`, `app/src/lib/stripe.ts`
- **Проблема:** `stripe: "^14"` не поддерживает `apiVersion: "2024-11-20.acacia"` — ошибка TypeScript при сборке.
- **Исправление:** Обновление до `stripe: "^17"`, удаление явного `apiVersion` (SDK использует свой дефолт).
- **Влияние:** Проект не собирается.

---

## MEDIUM — Средние ошибки

### MEDIUM-01: Неправильные HTTP-коды ошибок
- **Файлы:** Все API-маршруты (`prices`, `analysis`, `alerts`, `org`, `telegram`)
- **Проблема:** Все catch-блоки возвращали статус 401 вместо корректных кодов.
- **Исправление:**
  - `400` — невалидные входные данные
  - `403` — нет организации, триал истёк, подписка отменена
  - `500` — внутренняя ошибка сервера
- **Влияние:** Некорректная обработка ошибок на фронтенде, путаница при отладке.

### MEDIUM-02: Отсутствие плагина `@tailwindcss/typography`
- **Файлы:** `app/package.json`, `app/tailwind.config.ts`
- **Проблема:** Маркетинговые страницы используют класс `prose`, но плагин не был установлен.
- **Исправление:** Добавлен `@tailwindcss/typography: "^0.5"` в devDependencies, `require("@tailwindcss/typography")` в plugins.
- **Влияние:** Класс `prose` не применялся, текст на маркетинговых страницах без стилей.

### MEDIUM-03: Deprecated `version` в docker-compose.yml
- **Файл:** `docker-compose.yml`
- **Проблема:** `version: '3.8'` deprecated в Docker Compose V2.
- **Исправление:** Строка удалена.
- **Влияние:** Warning при запуске `docker compose up`.

### MEDIUM-04: Отсутствие `CLERK_WEBHOOK_SECRET` в `.env.example`
- **Файл:** `.env.example`
- **Проблема:** После добавления верификации подписи (CRITICAL-02) переменная не была задокументирована.
- **Исправление:** Добавлена `CLERK_WEBHOOK_SECRET=whsec_...` в секцию Clerk.
- **Влияние:** Разработчик мог забыть установить переменную → 500 на webhook.

---

## Сводная таблица

| # | Уровень | Описание | Файл(ы) | Статус |
|---|---------|----------|----------|--------|
| C-01 | CRITICAL | SQL-инъекция в prices API | prices/route.ts | Исправлено |
| C-02 | CRITICAL | Webhook без верификации | webhook/clerk/route.ts | Исправлено |
| C-03 | CRITICAL | Deprecated authMiddleware | middleware.ts | Исправлено |
| C-04 | CRITICAL | Отсутствующая таблица | init.sql | Исправлено |
| C-05 | CRITICAL | Отсутствующий offline.html | public/offline.html | Исправлено |
| H-01 | HIGH | Нет manage_billing | org/route.ts | Исправлено |
| H-02 | HIGH | Deprecated images.domains | next.config.js | Исправлено |
| H-03 | HIGH | Утечка данных analysis API | analysis/route.ts | Исправлено |
| H-04 | HIGH | Нет валидации alerts | alerts/route.ts | Исправлено |
| H-05 | HIGH | XSS в отчётах | berichte/page.tsx | Исправлено |
| H-06 | HIGH | Версия Stripe SDK | package.json, stripe.ts | Исправлено |
| M-01 | MEDIUM | Неправильные HTTP-коды | Все API | Исправлено |
| M-02 | MEDIUM | Отсутствие typography | package.json, tailwind | Исправлено |
| M-03 | MEDIUM | Deprecated docker version | docker-compose.yml | Исправлено |
| M-04 | MEDIUM | Нет CLERK_WEBHOOK_SECRET | .env.example | Исправлено |

---

## Второй аудит — Новые находки (2026-02-08)

### NEW-HIGH-01: Обходимая regex-санитизация HTML
- **Файл:** `app/src/app/(dashboard)/berichte/page.tsx`
- **Проблема:** `sanitizeHtml()` на основе regex обходилась через: вложенные теги (`<scr<script>ipt>`), unquoted атрибуты (`onerror=alert(1)`), SVG/HTML5 элементы (`<svg onload=...>`), HTML-entity bypass (`jav&#x61;script:`).
- **Исправление:** Regex-функция заменена на библиотеку `isomorphic-dompurify` (DOMPurify). Добавлен `isomorphic-dompurify: "^2"` в package.json.
- **Риск:** XSS через обход regex-санитизации.

### NEW-HIGH-02: Telegram API утекает внутренние ошибки
- **Файл:** `app/src/app/api/telegram/connect/route.ts`
- **Проблема:** Catch-блок возвращал `{ error: error.message }` со статусом 401, утекая детали БД-ошибок, connection errors и т.д. клиенту. Все остальные API были исправлены в M-01, но этот файл был пропущен.
- **Исправление:** Стандартизирован обработчик ошибок: 403 для auth/subscription ошибок, 500 с `"Interner Serverfehler"` для остальных.
- **Риск:** Утечка внутренней информации (имена таблиц, ошибки соединения).

### NEW-HIGH-03: Отсутствующий `/api/reports` endpoint
- **Файл:** `app/src/app/api/reports/route.ts` (создан)
- **Проблема:** Страница Berichte имела `// TODO: Create /api/reports endpoint` и не загружала данные. Таблица `reports` в БД существовала, но API для неё не было.
- **Исправление:** Создан GET-эндпоинт с `requireOrg()`, фильтрацией по `org_id`, лимитом 50 записей. Страница berichte подключена к новому API.
- **Влияние:** Страница отчётов была полностью нефункциональна.

### NEW-MEDIUM-01: Нет валидации `material_id` в Alerts POST
- **Файл:** `app/src/app/api/alerts/route.ts`
- **Проблема:** `body.material_id` вставлялся в БД без проверки. Пользователь Basis/Trial мог создать алерт на материал, не входящий в его план. Произвольные UUID принимались.
- **Исправление:** Для Basis/Trial — проверка через `org_materials`. Для Pro/Team — проверка существования в таблице `materials`.
- **Влияние:** Нарушение тарифных ограничений на уровне алертов.

### NEW-MEDIUM-02: Org GET возвращает Stripe ID на фронтенд
- **Файл:** `app/src/app/api/org/route.ts`
- **Проблема:** `SELECT o.*` возвращал все колонки организации, включая `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`, `telegram_chat_id`.
- **Исправление:** Явный SELECT только нужных полей: `id, name, plan, max_materials, max_users, max_alerts, features_*, trial_ends_at, is_active, created_at`.
- **Влияние:** Утечка Stripe-идентификаторов на клиент.

### NEW-MEDIUM-03: DB pool без настроек
- **Файл:** `app/src/lib/db.ts`
- **Проблема:** `new Pool({ connectionString })` без `max`, `idleTimeoutMillis`, `connectionTimeoutMillis`. Дефолт pg — 10 соединений, без таймаутов. В Next.js может привести к исчерпанию соединений.
- **Исправление:** Добавлены настройки: `max: 20`, `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 5000`.
- **Влияние:** Потенциальное исчерпание соединений под нагрузкой.

### NEW-MEDIUM-04: `CLERK_WEBHOOK_SECRET` не передаётся в docker-compose
- **Файл:** `docker-compose.yml`
- **Проблема:** Переменная `CLERK_WEBHOOK_SECRET` была в `.env.example`, но не передавалась в контейнер `app` через `environment`.
- **Исправление:** Добавлено `- CLERK_WEBHOOK_SECRET=${CLERK_WEBHOOK_SECRET}` в секцию environment сервиса app.
- **Влияние:** Webhook-верификация не работала бы в Docker-окружении.

### NEW-LOW-01: Отсутствие Error Boundaries
- **Файлы:** Создано 4 файла:
  - `app/src/app/error.tsx` — глобальный error boundary
  - `app/src/app/loading.tsx` — глобальный loading state
  - `app/src/app/(dashboard)/error.tsx` — dashboard error boundary
  - `app/src/app/(dashboard)/loading.tsx` — dashboard loading state
- **Проблема:** Необработанные ошибки в компонентах крашили страницу без fallback-UI.
- **Исправление:** Добавлены error.tsx с кнопкой «Erneut versuchen» и loading.tsx с анимированным спиннером. Весь текст на немецком.
- **Влияние:** Плохой UX при ошибках.

### NEW-LOW-02: Service Worker не регистрировался
- **Файлы:** `app/src/components/ServiceWorkerRegister.tsx` (создан), `app/src/app/layout.tsx` (обновлён)
- **Проблема:** `manifest.json` подключён, `sw.js` существует, но `navigator.serviceWorker.register()` нигде не вызывался.
- **Исправление:** Создан клиентский компонент `ServiceWorkerRegister`, добавлен в root layout.
- **Влияние:** PWA оффлайн-режим не работал.

---

## Сводная таблица — Второй раунд

| # | Уровень | Описание | Файл(ы) | Статус |
|---|---------|----------|----------|--------|
| NH-01 | HIGH | Обходимая regex-санитизация → DOMPurify | berichte/page.tsx | Исправлено |
| NH-02 | HIGH | Telegram API утечка ошибок | telegram/connect/route.ts | Исправлено |
| NH-03 | HIGH | Нет /api/reports endpoint | reports/route.ts | Исправлено |
| NM-01 | MEDIUM | Нет валидации material_id | alerts/route.ts | Исправлено |
| NM-02 | MEDIUM | Org GET утекает Stripe ID | org/route.ts | Исправлено |
| NM-03 | MEDIUM | DB pool без настроек | db.ts | Исправлено |
| NM-04 | MEDIUM | CLERK_WEBHOOK_SECRET не в docker | docker-compose.yml | Исправлено |
| NL-01 | LOW | Нет error boundaries | error.tsx, loading.tsx | Исправлено |
| NL-02 | LOW | SW не регистрируется | ServiceWorkerRegister.tsx | Исправлено |

---

## Третий раунд — Фиксы 2026-02-18

### FIX-01: Middleware перезаписывал Clerk session cookies
- **Файл:** `app/src/middleware.ts`
- **Проблема:** `const response = NextResponse.next()` создавал новый response на КАЖДЫЙ запрос, перезаписывая Set-Cookie заголовки Clerk (`__session`, `__client_uat`). Сессия терялась при закрытии вкладки.
- **Исправление:** Возврат custom response только когда нужно установить locale cookie. В остальных случаях clerkMiddleware управляет response сам.
- **Влияние:** Потеря сессии при закрытии/открытии вкладки.

### FIX-02: send-alerts не проверял features_telegram
- **Файл:** `app/src/app/api/cron/send-alerts/route.ts`
- **Проблема:** Строка 170 проверяла только `rule.telegram_chat_id`, но не `features_telegram`. Пользователь Basis мог получать Telegram-алерты после даунгрейда с Pro.
- **Исправление:** Добавлен `o.features_telegram` в SELECT и `&& rule.features_telegram` в условие отправки.
- **Влияние:** Нарушение тарифных ограничений.

### FIX-03: alerts API не проверял подключение Telegram
- **Файл:** `app/src/app/api/alerts/route.ts`
- **Проблема:** Можно было создать алерт с каналом "telegram"/"both"/"all" даже без подключенного бота или без фичи в плане.
- **Исправление:** Валидация: если канал включает telegram → проверка `features_telegram` + `telegram_chat_id`.
- **Влияние:** Алерт создавался, но никогда не отправлялся.

### FIX-04: Telegram bot — полная интеграция
- **Файлы:** Создано 2 файла, переписано 2 файла
- **Проблема:** Telegram подключение было сломано: не было webhook-эндпоинта, код генерировался несуществующим n8n workflow, UX требовал ручного копирования кода.
- **Исправление:**
  - `/api/webhook/telegram/route.ts` — вебхук с timing-safe secret verification
  - `/api/telegram/connect/route.ts` — deep link генерация + disconnect
  - `/api/telegram/status/route.ts` — polling для фронтенда
  - Страница Telegram — one-click deep link, автоматический polling, disconnect
  - i18n (de/en/ru) — новые ключи
  - init.sql — `org_id` вместо `chat_id` в `telegram_pending_connections`

### FIX-05: TELEGRAM_WEBHOOK_SECRET не в docker-compose
- **Файл:** `docker-compose.yml`
- **Проблема:** Env var добавлен в `.env`, но не передавался в контейнер. Webhook отклонял все запросы (403).
- **Исправление:** Добавлен `- TELEGRAM_WEBHOOK_SECRET=${TELEGRAM_WEBHOOK_SECRET}` в environment.

| # | Описание | Файл(ы) | Статус |
|---|----------|----------|--------|
| FIX-01 | Middleware убивал Clerk cookies | middleware.ts | Исправлено |
| FIX-02 | send-alerts без features_telegram | send-alerts/route.ts | Исправлено |
| FIX-03 | alerts API без валидации telegram | alerts/route.ts | Исправлено |
| FIX-04 | Telegram bot — полная интеграция | 6 файлов | Исправлено |
| FIX-05 | Docker env var не передавался | docker-compose.yml | Исправлено |
