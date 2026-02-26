# BauPreis AI SaaS — Project Guidelines

## Проект
**Название:** BauPreis AI SaaS
**Тип:** B2B SaaS — мониторинг цен на стройматериалы в Германии с AI-прогнозами
**Планы:** Basis (49), Pro (149), Team (299 EUR/мес) | Multi-tenant

---

## Документация проекта

| Файл | Назначение | Когда читать |
|------|-----------|--------------|
| `CLAUDE.md` | Главный управляющий документ | Всегда (загружается автоматически) |
| `TEAM.md` | 10 специалистов команды | При запуске любого агента |
| `DEVLOG.md` | Журнал сессий | В начале сессии (последняя запись) |
| `CREDENTIALS.md` | Все доступы (НЕ в git) | При деплое, интеграциях |
| `ROADMAP.md` | План спринтов | При планировании работы |
| `USER_PERSONAS.md` | Тестовая группа | При UX-решениях |
| `BauPreis_AI_SaaS_Claude_Code_Guide.md` | Мастер-документ (60KB) | Для глубокого контекста |

---

## ПРИНЦИП РАБОТЫ С АГЕНТАМИ


**Фундаментальное правило. Нарушение недопустимо.**

1. **Любая задача = агент из TEAM.md.** Агент принимает роль одного из 11 специалистов (#1-#11), читает TEAM.md, работает в рамках зоны ответственности с quality level 15+ лет опыта
2. **Никаких «абстрактных помощников».** Всегда конкретный специалист из TEAM.md
3. **Новый специалист** — только по стандарту TEAM.md, решение #9 EM + #1 PA
4. **Формат вызова:** `Роль: #N — Название` | `Контекст: файлы` | `Задача: что сделать`
5. **Совместная работа:** #1(PRD) -> #2(дизайн) -> #4(API)+#3(UI) -> #8(тесты) -> #7(деплой) -> #9(DEVLOG)

---

## ПРОТОКОЛ ФОРМАЛИЗАЦИИ ЗАДАЧ

### Пайплайн: КЛАССИФИКАЦИЯ -> ФОРМАЛИЗАЦИЯ -> ИСПОЛНЕНИЕ -> ВЕРИФИКАЦИЯ

### Маршрутизация по 10 ролям BauPreis

| Домен задачи | Формализует |
|-------------|-------------|
| Продукт, фичи, исследования | #1 Product Architect |
| UX/UI, дизайн, flow | #2 UX/UI Engineer |
| Frontend (Next.js, компоненты, PWA) | #3 Frontend Engineer |
| Backend (API, DB, cron, webhooks) | #4 Backend Engineer |
| Данные, ETL, BauPreis Index, сплавы | #5 Data Pipeline Engineer |
| AI, Claude API, прогнозы, NLP | #6 AI/ML Engineer |
| Инфраструктура, Docker, деплой | #7 SRE Engineer |
| Тесты, QA, баги | #8 QA Engineer |
| Планирование, координация, релизы | #9 Engineering Manager |
| Clerk, Stripe, Telegram, Resend | #10 Integration & Payments |
| Кросс-домен (2+ области) | #9 EM (координация) |

### Шаблон ТС (задачи M/L/XL)

| Поле | Содержание |
|------|-----------|
| ID | TASK-NNN |
| Название | Краткое название |
| Домен | backend / frontend / data / ai / infra / product / design / integration |
| Размер | S / M / L / XL |
| Исполнитель | #N — Роль |
| Контекст | Какие файлы прочитать |
| Задача | Что конкретно сделать |
| Критерии готовности | Как проверить |
| Ограничения | Чего НЕ делать |

Задачи S: `Задача` + `#N` + `Готовность` (3 поля). Тривиальные (1 строка): без ТС, но исполнитель определяется.

---

## ЖУРНАЛ РАЗРАБОТКИ (DEVLOG)

1. **Каждая сессия** завершается записью в DEVLOG.md
2. **Маркер:** в конце ответа агента — `> DEVLOG updated: SNNN`
3. **Новые записи — сверху** (newest-first)
4. **Максимум 15 строк** на запись
5. **Нумерация:** S001, S002, ..., S999
6. **Владелец процесса:** #9 Engineering Manager
7. **Фиксировать:** что сделано, решения + причины, файлы, следующие шаги, блокеры
8. **НЕ фиксировать:** промежуточные рассуждения, листинги кода

---

## ПОЛИТИКА CREDENTIALS

1. `CREDENTIALS.md` — единое хранилище всех доступов (НЕ в git, в .gitignore)
2. Каждый новый ключ/пароль/токен НЕМЕДЛЕННО записывается в этот файл
3. Production: environment variables через docker-compose.yml
4. **Ответственные:** серверы/CI/CD/мониторинг — #7 SRE | API-ключи/платежи — #4 Backend + #10 Payments | тестовые аккаунты — #8 QA
5. **Источник истины:** `cat /root/baupreis/.env` на сервере (187.33.159.205)

---

## Tech Stack

| Слой | Технология | Статус |
|------|-----------|--------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui | Закреплён |
| Auth | Clerk (Google OAuth + Email) | Production (pk_live_) |
| Billing | Stripe (subscriptions, test mode) | Production |
| Database | PostgreSQL 16 (multi-tenant) | Production |
| AI | Claude API (Haiku/Sonnet) | No credits |
| Cron | Next.js API routes + system crontab (7 jobs) | Production |
| Proxy | Caddy (auto SSL) | Production |
| Hosting | Hetzner Cloud CX32 (Nuremberg, GDPR) | Production |
| Email | Resend.com | Production |
| PWA | manifest.json + Service Worker | Production |

---

## Architecture Principles
- Data (materials, prices, analysis) — SHARED across all tenants
- Settings (alert_rules, reports, telegram) — PER-ORG
- Auth: Clerk webhooks -> auto-create org + user
- Billing: Stripe webhooks -> update org plan + feature flags
- Feature gating: `canAccess(org, feature)` перед Pro/Team фичами

## Key Conventions
- **Язык UI:** ВСЕ тексты на НЕМЕЦКОМ (Deutsch), i18n: de/en/ru (cookie-based)
- **Код:** TypeScript strict mode, English переменные/функции
- **Стиль:** Tailwind CSS + shadcn/ui, mobile-first
- **SQL:** ТОЛЬКО параметризованные запросы ($1, $2...) — НИКАКОЙ интерполяции
- **API routes:** всегда `requireOrg()` для auth + subscription
- **Plan checks:** `canAccess(org, feature)` перед Pro/Team фичами

## Folder Structure
```
/                           # Project root
├── CLAUDE.md               # Этот файл (guidelines)
├── TEAM.md                 # 11 специалистов команды
├── DEVLOG.md               # Журнал сессий (S001-S999)
├── USER_PERSONAS.md        # 10 B2B персон
├── CREDENTIALS.md          # Доступы (НЕ в git)
├── CLAUDE_CODE_PLAYBOOK.md # Методология v1.0
├── README.md, ACCESS.md, COMMON_ERRORS.md
├── docker-compose.yml, init.sql, .env.example
├── app/                    # Next.js 14 (52 pages, 46 API routes)
├── docs/                   # Исследования, бизнес, legal
│   └── archive/            # Исторические документы
├── migrations/             # SQL-миграции (001-004)
├── presentation/           # Pitch-деки (DE/EN/RU)
└── scripts/                # Утилиты (telegram webhook)
```

## Multi-tenant Data Model
- `organizations` — tenants (plan, Stripe IDs, features)
- `users` — org_id + clerk_user_id
- `materials` (16) / `prices` (3000+) / `analysis` — SHARED
- `org_materials` / `alert_rules` / `alerts_sent` / `reports` — PER-ORG

## Plan Limits
| Feature | Basis | Trial (7d) | Pro | Team |
|---------|-------|------------|-----|------|
| Materials | 5 | All | All | All |
| Users | 1 | 1 | 1 | 5 |
| Alerts | 3 | Unlimited | Unlimited | Unlimited |
| Telegram / AI Forecast | No | Yes | Yes | Yes |
| API Access / PDF Reports | No | No | No | Yes |

---

## ПРАВИЛА РАЗРАБОТКИ

### Код
- TypeScript strict mode, без `any` — типы, интерфейсы, generics
- Коммиты: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`)
- Ветвление: main (production), feature/*, fix/*

### Безопасность
- Все входные данные валидируются (Zod или ручная валидация)
- Секреты — только через environment variables
- CORS: whitelist доменов
- Rate limiting на API (`rate-limit.ts`)
- DSGVO / BDSG compliance

### Тестирование
- Unit-тесты на бизнес-логику: обязательно (plans.ts, alloys.ts, baupreis-index.ts)
- E2E тесты (Playwright): критичные flow (регистрация -> dashboard -> subscribe)
- Plan matrix: 3 плана x все фичи = полная матрица доступа

### Деплой
- Server: 187.33.159.205 (root SSH)
- Deploy: `git pull && docker-compose up -d --build`
- После деплоя: smoke tests (#8 QA)
- DEVLOG запись обязательна (#9 EM)
