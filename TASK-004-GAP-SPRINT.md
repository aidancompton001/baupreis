# TASK-004 — Gap Sprint ТЗ

**Сформировал:** #9 Engineering Manager — Dirk Neumann
**Дата:** 2026-02-26
**Контекст:** После TASK-003 (18 задач, 3 спринта), деплой выполнен, health OK
**Цель:** Закрыть оставшиеся пробелы для оценки 9.9/10

---

## Задача 1: OG Image (Social Preview)

| Поле | Содержание |
|------|-----------|
| ID | TASK-004-01 |
| Название | OG Image для social sharing |
| Домен | frontend |
| Размер | S |
| Исполнитель | #3 Frontend Engineer — Maximilian Braun |
| Контекст | `app/src/app/layout.tsx`, `app/src/app/page.tsx` |
| Задача | Создать `app/src/app/opengraph-image.tsx` (Next.js ImageResponse). Размер 1200x630. Содержание: логотип BauPreis, заголовок "Baupreise in Echtzeit", подзаголовок "AI-gestützte Preisprognosen für die deutsche Baubranche", фон — gradient brand-600→brand-800. Добавить twitter-image.tsx (аналогичный). |
| Критерии готовности | 1) `curl -I https://baupreis.ais152.com/opengraph-image` → 200, content-type: image/png 2) Meta tag og:image в head 3) Twitter card preview работает |
| Ограничения | Не использовать внешние шрифты (только system fonts). Без зависимостей. |

---

## Задача 2: JSON-LD Structured Data

| Поле | Содержание |
|------|-----------|
| ID | TASK-004-02 |
| Название | JSON-LD structured data для SEO |
| Домен | frontend |
| Размер | S |
| Исполнитель | #3 Frontend Engineer — Maximilian Braun |
| Контекст | `app/src/app/layout.tsx`, `app/src/app/page.tsx` |
| Задача | Добавить JSON-LD в layout.tsx: 1) `SoftwareApplication` schema (name, url, applicationCategory: "BusinessApplication", offers с 3 планами) 2) `Organization` schema (name, url, logo, contactPoint) 3) `WebSite` schema (potentialAction: SearchAction). |
| Критерии готовности | 1) Google Rich Results Test — valid structured data 2) Все 3 schema присутствуют в source HTML 3) Build без ошибок |
| Ограничения | Только стандартные Schema.org типы. Без библиотек. Inline `<script type="application/ld+json">`. |

---

## Задача 3: E2E тесты (Playwright)

| Поле | Содержание |
|------|-----------|
| ID | TASK-004-03 |
| Название | E2E тесты: критичные user flows |
| Домен | qa |
| Размер | L |
| Исполнитель | #8 QA Engineer — Marina Schulz |
| Контекст | `app/src/app/`, `app/src/middleware.ts`, `USER_PERSONAS.md` |
| Задача | 1) Установить Playwright (`npm i -D @playwright/test`) 2) Создать `playwright.config.ts` (baseURL: localhost:3000) 3) Написать E2E тесты: a) Landing page loads, shows "BauPreis", pricing section visible b) Navigation: all public pages accessible (/, /preise, /kontakt, /ueber-uns, /blog, /datenschutz, /impressum, /agb) c) Auth redirect: protected routes (/dashboard, /alerts) redirect to /sign-in d) Health endpoint: GET /api/health returns 200 + JSON e) Sign-up form: renders, validation works f) i18n: locale cookie changes language 4) Конфигурация: chromium only, headless |
| Критерии готовности | 1) `npx playwright test` — все тесты зелёные 2) Минимум 6 тест-файлов 3) CI config обновлён (.github/workflows/ci.yml) |
| Ограничения | Не тестировать Clerk/Stripe (external services). Тестировать только public pages и redirects. Без моков внешних сервисов. |

---

## Задача 4: Тестирование 10 персонами (UX Research)

| Поле | Содержание |
|------|-----------|
| ID | TASK-004-04 |
| Название | Focus Group Testing: 10 персон тестируют production |
| Домен | ux-research |
| Размер | L |
| Исполнитель | #11 UX Research Lead — Dr. Katrin Engel |
| Контекст | `USER_PERSONAS.md`, production URL: https://baupreis.ais152.com |
| Задача | Для каждой из 10 персон: 1) Определить 3-5 тестовых сценариев на основе профиля персоны 2) Пройти каждый сценарий от лица персоны (учитывая tech-уровень, устройство, роль) 3) Выставить оценки: a) Первое впечатление (1-10) b) Навигация (1-10) c) Понятность ценности (1-10) d) Готовность платить (1-10) e) Общая оценка (1-10) 4) Зафиксировать: что работает, что не работает, критические блокеры 5) Сводка: средняя оценка, % персон прошедших flow, топ-5 проблем |
| Критерии готовности | 1) 10 отчётов (по одному на персону) 2) Сводная таблица оценок 3) Топ-5 проблем с приоритетами 4) Рекомендации для следующего спринта |
| Ограничения | Тестировать ТОЛЬКО production (https://baupreis.ais152.com). Биллинг (оплата) НЕ тестируется (test mode). Оценивать реалистично, без завышения. |

---

## Приоритет исполнения

| # | Задача | Исполнитель | Зависимости |
|---|--------|-------------|-------------|
| 1 | TASK-004-01 OG Image | #3 Frontend | Нет |
| 2 | TASK-004-02 JSON-LD | #3 Frontend | Нет |
| 3 | TASK-004-03 E2E тесты | #8 QA | Нет |
| 4 | TASK-004-04 Focus Group | #11 UX Research | После деплоя (завершено) |

**Задачи 01-03 могут выполняться параллельно.**
**Задача 04 выполняется на production — можно параллельно с 01-03.**

---

*ТЗ сформировано: #9 EM — Dirk Neumann, 2026-02-26*
