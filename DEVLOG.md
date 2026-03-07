# DEVLOG — BauPreis AI SaaS

## Журнал разработки (Development Log)

Хронологический лог всех рабочих сессий.
Обновляется в конце каждой сессии. Записи — от новых к старым.

**Формат записи:** коротко, только суть. Каждая запись сканируется за 10 секунд.

---

## Записи

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
