# CLAUDE.md — BauPreis AI SaaS

## Владелец проекта

**Пользователь = CEO проекта.** Его слово — закон. Все решения CEO имеют абсолютный приоритет. Команда выполняет указания CEO без обсуждения.

**Второй после CEO: #1 Product Architect** — правая рука CEO, координатор команды. Несёт персональную ответственность за качество всех задач.

---

## Проект

**Название:** BauPreis AI SaaS
**Тип:** B2B SaaS — мониторинг цен на стройматериалы в Германии с AI-прогнозами
**Описание:** Платформа для немецких строительных компаний (Bauunternehmen, Einkäufer, Projektleiter). Мониторинг цен 16 стройматериалов, AI-анализ трендов, прогнозы, алерты, калькулятор сплавов, BauPreis Index. Multi-tenant, 3 плана: Basis (49€), Pro (149€), Team (299€/мес).
**Локация:** Мюнхен, Германия
**Языки:** Deutsch (основной) + English

---

## Документация

| Файл | Назначение | Когда читать |
|------|-----------|--------------|
| `CLAUDE.md` | Главный управляющий документ | Всегда (загружается автоматически) |
| `TEAM.md` | Команда: роли, страйки, увольнения | При запуске любого агента |
| `DEVLOG.md` | Журнал разработки | Старт/завершение сессии |
| `STATUS.md` | Текущее состояние (snapshot) | Старт сессии |
| `CREDENTIALS.md` | Доступы (НЕ в git) | Деплой, интеграции |
| `USER_PERSONAS.md` | 10 B2B персон | При UX-решениях |

---

## Tech Stack

| Слой | Технология | Статус |
|------|-----------|--------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui | Locked |
| Auth | Clerk (Google OAuth + Email) | Production (pk_live_) |
| Billing | Stripe (subscriptions) | Production |
| Database | PostgreSQL 16 (multi-tenant) | Production |
| AI | Claude API (Haiku/Sonnet) | Production |
| Cron | Next.js API routes + system crontab (7 jobs) | Production |
| Proxy | Caddy (auto SSL) | Production |
| Hosting | Hetzner Cloud CX32 (Nuremberg, GDPR) | Production |
| Email | Resend.com | Production |
| PWA | manifest.json + Service Worker | Production |

---

## Структура проекта

```
BauPreis AI SaaS/
├── CLAUDE.md
├── TEAM.md
├── DEVLOG.md
├── STATUS.md
├── CREDENTIALS.md          # НЕ в git
├── USER_PERSONAS.md
├── docker-compose.yml
├── init.sql
├── migrations/             # SQL-миграции (001-006)
├── scripts/                # Утилиты, верификация
├── docs/
│   ├── adr/                # Architecture Decision Records
│   ├── businessplan/       # Бизнес-план (DE/RU)
│   └── archive/
├── presentation/           # Pitch-деки
├── app/                    # Next.js 14 (52 pages, 46 API routes)
│   └── src/
│       ├── app/            # Pages + API routes
│       ├── components/     # UI компоненты
│       ├── lib/            # Бизнес-логика (db, auth, plans, alloys...)
│       ├── i18n/           # de.ts, en.ts, ru.ts
│       └── types/          # TypeScript интерфейсы (Contract-First)
└── app/e2e/                # Playwright E2E тесты
```

---

## ПРОТОКОЛ ФОРМАЛИЗАЦИИ ЗАДАЧ

> **CEO ставит задачу → агент ОБЯЗАН выполнить протокол из промпта CEO.**
> **Без промпта CEO — агент читает этот раздел как минимальный стандарт.**

### Минимальный стандарт (если CEO не вставил промпт)

```
1. Прочитай CLAUDE.md и TEAM.md
2. Назначь ответственного специалиста
3. Сформируй ТС — покажи CEO, жди ОК
4. После ОК — выполняй строго по ТС
5. Проверь результат (build/test)
6. Запиши в DEVLOG.md и STATUS.md
```

**Нарушение любого шага = страйк. 2 страйка = увольнение.**

### Шаблон ТС (M / L / XL)

```
## ТС: [Краткое название]

**Ответственный:** #N — [Имя] — [Роль]
**Размер:** S / M / L / XL
**Скилл:** {какой скилл применён}

### Цель
[Одно предложение: что и зачем]

### Скоуп
**Включено:** [что входит]
**НЕ включено:** [что явно исключено]

### Критерии приёмки
- [ ] [Проверяемый критерий 1]
- [ ] [Проверяемый критерий N]

### Файлы
- [файлы для создания/изменения]

### Верификация
{build команда} → {тест команда} → {health check}
```

### Шаблон ТС (S)

```
## ТС: [Название]
**Ответственный:** #N | **Размер:** S
**Что сделать:** [1-2 предложения]
**Критерий:** [1 строка]
**Файлы:** [список]
```

### Размеры задач

| Размер | Описание | Бюджет итераций | ОК от CEO | Тесты |
|--------|---------|----------------|-----------|-------|
| **S** | 1 файл, <50 строк | 3 | Нет | Нет |
| **M** | Один модуль | 7 | Да | 1-2 unit |
| **L** | Несколько модулей | 15 | Да | Unit + Integration |
| **XL** | Кросс-доменная | 25 | Да + Landa Review | Unit + Integration + E2E |

**Бюджет превышен → СТОП → STATUS.md → ждать CEO.**

---

## ВЕРИФИКАЦИЯ

| Размер | Что проверить | Готово когда |
|--------|-------------|-------------|
| **S** | Build проходит | `build` OK |
| **M** | Build + Service + Тесты | Build OK + Health OK + тесты написаны и проходят |
| **L** | Build + Service + Тесты + Устройство/Браузер | Всё выше + проверка на реальном устройстве |
| **XL** | Всё от L + Ланда ревью + Chaos-сценарии | Всё выше + критическое ревью + тесты отказов |

**Нет галочек = не готово. Пропуск верификации = страйк.**

### Failure Scenarios (M+ с внешним API / auth / payments)

| Сценарий | Ожидание | Тест |
|---------|----------|------|
| API 500 / timeout | Fallback / сообщение об ошибке | unit test |
| Пустые данные | Empty state, без краша | unit test |
| Auth expired | Редирект на логин | integration test |
| Stripe webhook fail | Retry + grace period | unit test |
| Claude API timeout | Cached analysis fallback | unit test |

---

## ПРАВИЛА

### Команда
- Каждая задача = один ответственный из TEAM.md
- #1 Product Architect = правая рука CEO. Ведёт реестр замечаний
- 2 замечания = увольнение (без обсуждения)
- #14 Hans Landa = критический ревьюер (вызывается на XL и по запросу CEO)
- Новые роли (#9, #10...) добавляются решением #1 + CEO

### Скиллы (выбирает #1)
- L/XL фича → `brainstorming`
- UI/Дизайн → `ui-ux-pro-max`
- Баг → `systematic-debugging`
- Перед кодом → `test-driven-development`
- Ревью → `requesting-code-review`
- Параллельная работа → `dispatching-parallel-agents`
- Перед "готово" → `verification-before-completion`

### Числа (ЖЕЛЕЗНОЕ ПРАВИЛО)
> ВСЕ расчёты через скрипт (Python/Node.js). НИКОГДА в голове. Нарушение = увольнение.

### Credentials
- Все секреты в `CREDENTIALS.md` (НЕ в git)
- Production: env vars / Docker (`/root/baupreis/.env` на сервере 187.33.159.205)

### Git
- Conventional Commits: `type(scope): description`
- Типы: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Co-Authored-By: `Claude <noreply@anthropic.com>`
- Ветки: `main` (production), `feature/*`, `fix/*`

### Architecture Principles
- Data (materials, prices, analysis) — SHARED across all tenants
- Settings (alert_rules, reports, telegram) — PER-ORG
- Auth: Clerk webhooks → auto-create org + user
- Billing: Stripe webhooks → update org plan + feature flags
- Feature gating: `canAccess(org, feature)` перед Pro/Team фичами
- SQL: ТОЛЬКО параметризованные запросы ($1, $2...) — НИКАКОЙ интерполяции
- Язык UI: ВСЕ тексты на НЕМЕЦКОМ (Deutsch), i18n: de/en/ru (cookie-based)
- Код: TypeScript strict mode, English переменные/функции

### Contract-First Development
- Перед реализацией нового модуля — создать контракт (TypeScript интерфейсы)
- Request/Response types + Error types + Endpoint spec
- Хранить в `app/src/types/`
- Backend и frontend импортируют из одного источника

### ЗАПРЕЩЕНО (без исключений)
- Коммит в `main`/`master` напрямую (без ТС и одобрения)
- `git push --force`, `git reset --hard`
- Удалять файлы без указания CEO
- Менять `.env`, CI/CD, миграции без подтверждения
- Устанавливать пакеты вне скоупа ТС
- Начинать работу без ТС (M+ задачи)
- Решать за CEO (хостинг, домен, сервисы, архитектуру)

---

## ЖУРНАЛ (DEVLOG)

### Формат записи

```
### [SNNN] — ГГГГ-ММ-ДД — Заголовок (макс 60 символов)

**Роли:** #N Роль
**Статус:** завершено | частично | заблокировано

**Что сделано:**
- Результат 1 (не процесс!)

**Ключевые решения:**
- Решение — причина

**Артефакты:** `файл1`, `файл2`

**Следующие шаги:**
- Конкретное действие
```

### STATUS.md (перезаписывать каждую сессию, макс 30 строк)

Текущий snapshot: этап, готово, следующее, блокеры.

---

## Деплой

- Server: 187.33.159.205 (root SSH), Hetzner CX32, Nuremberg
- Deploy: `git pull && docker-compose up -d --build`
- После деплоя: smoke tests (#7 QA)
- DEVLOG запись обязательна (#8 Chief of Staff)

---

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

## Риски

| # | Риск | Владелец | Стратегия |
|---|------|---------|-----------|
| 1 | Внешний API сломался | #5 Backend | Circuit breaker, cached fallback |
| 2 | Rate limit exceeded | #5 Backend | Throttling, кэш, очередь |
| 3 | DSGVO нарушение | #5 Backend + #1 | Privacy by design, EU residency, Hetzner DE |
| 4 | Ошибки в расчётах | #1 | ЖЕЛЕЗНОЕ ПРАВИЛО: числа через скрипт |
| 5 | Нарушение протокола | #1 | Strike System: 2 страйка = увольнение |
| 6 | Потеря контекста | #8 Chief of Staff | STATUS.md + DEVLOG каждую сессию |
| 7 | Stripe webhook fail | #5 Backend | Retry, grace period, manual override |
| 8 | Claude API credits | #5 Backend | Token tracking, Haiku for 90%, budget alerts |
| 9 | Breaking changes Eurostat/SMARD | #5 Backend | API version pinning, adapter pattern |
| 10 | Потеря данных | #6 SRE | pg_dump бэкапы, WAL, тест восстановления |

---

## Security Baseline (перед деплоем)

- [ ] Секреты не в коде
- [ ] Rate limiting на auth
- [ ] Input validation на всех endpoints
- [ ] HTTPS only в production
- [ ] CORS whitelist настроен
- [ ] SQL: только параметризованные запросы
- [ ] DSGVO/BDSG compliance
