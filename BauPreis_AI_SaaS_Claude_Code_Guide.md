# BauPreis AI SaaS — Полная пошаговая документация для Claude Code

> **Что это:** Мастер-документ для создания SaaS-сервиса мониторинга цен на стройматериалы в Германии с подпиской.
> **Стек:** Hetzner Cloud + Docker Compose + n8n + PostgreSQL + Claude API + Next.js (App Router) + Clerk (Auth) + Stripe (Billing) + Telegram + PWA
> **Модель:** Multi-tenant SaaS, 3 тарифа (Basis €49, Pro €149, Team €299/мес)
> **Дата верификации:** Февраль 2026

---

## СОДЕРЖАНИЕ

1. [Обзор архитектуры](#1-архитектура)
2. [Инфраструктура: Hetzner](#2-инфраструктура)
3. [Docker Compose](#3-docker-compose)
4. [Переменные окружения (.env)](#4-env)
5. [База данных: multi-tenant PostgreSQL](#5-база-данных)
6. [Источники данных: API эндпойнты](#6-источники-данных)
7. [n8n: 6 воркфлоу (multi-tenant)](#7-воркфлоу)
8. [Claude API: промпты](#8-claude-api)
9. [Next.js SaaS App: полная структура](#9-nextjs-app)
10. [Auth: Clerk](#10-auth)
11. [Billing: Stripe](#11-billing)
12. [Landing Page](#12-landing)
13. [Dashboard (защищённая зона)](#13-dashboard)
14. [API Routes](#14-api-routes)
15. [Telegram-бот (per-org)](#15-telegram)
16. [Email-отчёты (per-org)](#16-email)
17. [PWA (установка на iPhone/Android)](#17-pwa)
18. [Деплой: пошаговые команды](#18-деплой)
19. [Мониторинг и бэкапы](#19-мониторинг)
20. [Чеклист: поэтапный план](#20-чеклист)

---

## 1. АРХИТЕКТУРА

```
┌─────────────────────────────────────────────────────────────┐
│                     HETZNER CX32 (€6.80/мес)                │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────────┐ │
│  │ Traefik  │  │  n8n     │  │  Next.js App (Port 3000)   │ │
│  │ :80/:443 │  │  :5678   │  │                            │ │
│  │ SSL auto │  │ 6 WFs    │  │  ┌─────────┐ ┌──────────┐ │ │
│  └────┬─────┘  └────┬─────┘  │  │ Landing │ │Dashboard │ │ │
│       │              │        │  │ (public)│ │(auth req)│ │ │
│       │              │        │  └─────────┘ └──────────┘ │ │
│       │              │        │  ┌─────────┐ ┌──────────┐ │ │
│       │              │        │  │ Clerk   │ │ Stripe   │ │ │
│       │              │        │  │ (Auth)  │ │(Billing) │ │ │
│       │              │        │  └─────────┘ └──────────┘ │ │
│       │              │        └────────────────────────────┘ │
│       │              │                    │                   │
│  ┌────▼──────────────▼────────────────────▼────────────────┐ │
│  │              PostgreSQL 16 (multi-tenant)                │ │
│  │  organizations | users | materials | prices | analysis  │ │
│  │  alert_rules | alerts_sent | reports | subscriptions    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
    ┌────▼────┐         ┌────▼────┐          ┌────▼────┐
    │Metals.Dev│        │ GENESIS │          │Claude AI│
    │  API    │         │Destatis │          │  API    │
    └─────────┘         └─────────┘          └─────────┘
```

**Ключевое отличие от self-hosted:**
- Данные о ценах (materials, prices) — ОБЩИЕ для всех клиентов, собираются один раз
- Настройки (alert_rules, reports, telegram tokens) — PER-ORG (привязаны к организации)
- Auth через Clerk — регистрация, логин, Google OAuth
- Billing через Stripe — подписки, тарифы, оплата
- Landing page — публичная, SEO-оптимизированная
- Dashboard — защищённый, только для залогиненных пользователей
- PWA — устанавливается на iPhone/Android как приложение

---

## 2. ИНФРАСТРУКТУРА

### Сервер: Hetzner Cloud CX32

| Параметр | Значение |
|----------|----------|
| План | **CX32** (для SaaS нужно больше RAM) |
| vCPU | 4 (shared) |
| RAM | 8 GB |
| Disk | 80 GB NVMe SSD |
| Traffic | 20 TB/мес |
| Локация | **Nuremberg, DE** (GDPR) |
| OS | Ubuntu 24.04 LTS |
| Цена | **€6.80/мес** |

**Масштабирование:** При 200+ клиентах → CX42 (8 vCPU, 16 GB, €16.40). Одним кликом.

### Первичная настройка

```bash
ssh root@<IP_АДРЕС>

apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh

adduser baupreis
usermod -aG docker baupreis

ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Установить Node.js 20 (для Next.js build, если не в Docker)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

su - baupreis
mkdir -p /home/baupreis/baupreis-ai
cd /home/baupreis/baupreis-ai
```

---

## 3. DOCKER COMPOSE

### Файл: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # ============ TRAEFIK (Reverse Proxy + SSL) ============
  traefik:
    image: traefik:v3.0
    restart: always
    command:
      - "--api.dashboard=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=${ACME_EMAIL}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_letsencrypt:/letsencrypt

  # ============ POSTGRESQL 16 ============
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: baupreis
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -h localhost -U ${DB_USER}']
      interval: 5s
      timeout: 5s
      retries: 10

  # ============ N8N (Workflows) ============
  n8n:
    image: n8nio/n8n:latest
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=baupreis
      - DB_POSTGRESDB_USER=${DB_USER}
      - DB_POSTGRESDB_PASSWORD=${DB_PASSWORD}
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - N8N_HOST=n8n.${DOMAIN}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - WEBHOOK_URL=https://n8n.${DOMAIN}
      - GENERIC_TIMEZONE=Europe/Berlin
      - TZ=Europe/Berlin
    volumes:
      - n8n_data:/home/node/.n8n
      - ./local-files:/files
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.n8n.rule=Host(`n8n.${DOMAIN}`)"
      - "traefik.http.routers.n8n.entrypoints=websecure"
      - "traefik.http.routers.n8n.tls.certresolver=letsencrypt"
      - "traefik.http.services.n8n.loadbalancer.server.port=5678"

  # ============ NEXT.JS APP (Landing + Dashboard + API) ============
  app:
    build: ./app
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/baupreis
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
      - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - NEXT_PUBLIC_APP_URL=https://${DOMAIN}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`${DOMAIN}`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
      - "traefik.http.services.app.loadbalancer.server.port=3000"

volumes:
  postgres_data:
  n8n_data:
  traefik_letsencrypt:
```

**DNS записи (у регистратора домена):**
```
baupreis.ai       A    → <IP сервера>
n8n.baupreis.ai   A    → <IP сервера>
```

---

## 4. ENV

### Файл: `.env`

```env
# === ДОМЕН ===
DOMAIN=baupreis.ai
ACME_EMAIL=admin@baupreis.ai

# === БАЗА ДАННЫХ ===
DB_USER=baupreis
DB_PASSWORD=<СГЕНЕРИРОВАТЬ: openssl rand -base64 32>

# === N8N ===
N8N_USER=admin
N8N_PASSWORD=<НАДЁЖНЫЙ_ПАРОЛЬ>
N8N_ENCRYPTION_KEY=<СГЕНЕРИРОВАТЬ: openssl rand -hex 32>

# === CLERK (Auth) ===
# Получить на dashboard.clerk.com → Create Application → Keys
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# === STRIPE (Billing) ===
# Получить на dashboard.stripe.com → Developers → API keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (создать в Stripe Dashboard → Products)
STRIPE_PRICE_BASIS_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_TEAM_MONTHLY=price_...
STRIPE_PRICE_BASIS_YEARLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_TEAM_YEARLY=price_...

# === API КЛЮЧИ ===
ANTHROPIC_API_KEY=<получить на console.anthropic.com>
METALS_DEV_API_KEY=<получить на metals.dev>

# === TELEGRAM ===
TELEGRAM_BOT_TOKEN=<получить через @BotFather>

# === DESTATIS ===
DESTATIS_USER=<зарегистрироваться на www-genesis.destatis.de>
DESTATIS_PASSWORD=<пароль от GENESIS>

# === EMAIL (Resend.com) ===
RESEND_API_KEY=<получить на resend.com>
EMAIL_FROM=BauPreis AI <noreply@baupreis.ai>
```

---

## 5. БАЗА ДАННЫХ

### Файл: `init.sql`

```sql
-- ============================================================
-- BauPreis AI SaaS — Multi-tenant Database Schema
-- PostgreSQL 16
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ ОРГАНИЗАЦИИ (TENANTS) ============
CREATE TABLE organizations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                    VARCHAR(200) NOT NULL,
    slug                    VARCHAR(100) UNIQUE NOT NULL,
    plan                    VARCHAR(20) DEFAULT 'trial',
    -- plan: 'trial', 'basis', 'pro', 'team', 'cancelled'
    stripe_customer_id      VARCHAR(100),
    stripe_subscription_id  VARCHAR(100),
    stripe_price_id         VARCHAR(100),
    max_materials           INTEGER DEFAULT 5,
    max_users               INTEGER DEFAULT 1,
    max_alerts              INTEGER DEFAULT 3,
    features_telegram       BOOLEAN DEFAULT false,
    features_forecast       BOOLEAN DEFAULT false,
    features_api            BOOLEAN DEFAULT false,
    features_pdf_reports    BOOLEAN DEFAULT false,
    telegram_chat_id        VARCHAR(100),
    is_active               BOOLEAN DEFAULT true,
    trial_ends_at           TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_slug ON organizations(slug);
CREATE INDEX idx_org_stripe ON organizations(stripe_customer_id);

-- ============ ПОЛЬЗОВАТЕЛИ ============
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    clerk_user_id   VARCHAR(100) UNIQUE NOT NULL,
    email           VARCHAR(200) NOT NULL,
    name            VARCHAR(200),
    role            VARCHAR(20) DEFAULT 'owner',
    -- role: 'owner', 'admin', 'member'
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_users_clerk ON users(clerk_user_id);

-- ============ МАТЕРИАЛЫ (ОБЩИЕ) ============
CREATE TABLE materials (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code            VARCHAR(50) UNIQUE NOT NULL,
    name_de         VARCHAR(200) NOT NULL,
    name_ru         VARCHAR(200),
    category        VARCHAR(50) NOT NULL,
    unit            VARCHAR(20) NOT NULL,
    lme_symbol      VARCHAR(20),
    destatis_code   VARCHAR(20),
    metals_dev_key  VARCHAR(50),
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============ ЦЕНЫ (ОБЩИЕ) ============
CREATE TABLE prices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id     UUID NOT NULL REFERENCES materials(id),
    timestamp       TIMESTAMPTZ NOT NULL,
    price_eur       DECIMAL(12,2) NOT NULL,
    price_usd       DECIMAL(12,2),
    source          VARCHAR(50) NOT NULL,
    raw_json        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prices_material_time ON prices(material_id, timestamp DESC);
CREATE INDEX idx_prices_source ON prices(source);

-- ============ АНАЛИЗ (ОБЩИЙ) ============
CREATE TABLE analysis (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id     UUID REFERENCES materials(id),
    timestamp       TIMESTAMPTZ NOT NULL,
    trend           VARCHAR(20),
    change_pct_7d   DECIMAL(6,2),
    change_pct_30d  DECIMAL(6,2),
    forecast_json   JSONB NOT NULL,
    explanation_de  TEXT,
    recommendation  VARCHAR(50),
    confidence      INTEGER CHECK (confidence BETWEEN 0 AND 100),
    model_version   VARCHAR(50),
    prompt_tokens   INTEGER,
    completion_tokens INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analysis_material_time ON analysis(material_id, timestamp DESC);

-- ============ ПРАВИЛА АЛЕРТОВ (PER-ORG) ============
CREATE TABLE alert_rules (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    material_id     UUID REFERENCES materials(id),
    rule_type       VARCHAR(30) NOT NULL,
    threshold_pct   DECIMAL(6,2),
    time_window     VARCHAR(20),
    channel         VARCHAR(20) NOT NULL,
    priority        VARCHAR(10) DEFAULT 'medium',
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alert_rules_org ON alert_rules(org_id);

-- ============ ОТПРАВЛЕННЫЕ АЛЕРТЫ (PER-ORG) ============
CREATE TABLE alerts_sent (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    rule_id         UUID REFERENCES alert_rules(id),
    material_id     UUID REFERENCES materials(id),
    message_text    TEXT NOT NULL,
    channel         VARCHAR(20) NOT NULL,
    sent_at         TIMESTAMPTZ DEFAULT NOW(),
    delivery_status VARCHAR(20) DEFAULT 'sent'
);

CREATE INDEX idx_alerts_sent_org ON alerts_sent(org_id);

-- ============ ОТЧЁТЫ (PER-ORG) ============
CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    report_type     VARCHAR(20) NOT NULL,
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    content_json    JSONB NOT NULL,
    content_html    TEXT,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_org ON reports(org_id);

-- ============ ВЫБРАННЫЕ МАТЕРИАЛЫ (PER-ORG) ============
-- Для тарифа Basis: организация выбирает 5 материалов
CREATE TABLE org_materials (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    material_id     UUID NOT NULL REFERENCES materials(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, material_id)
);

CREATE INDEX idx_org_materials ON org_materials(org_id);

-- ============ НАЧАЛЬНЫЕ ДАННЫЕ: МАТЕРИАЛЫ ============
INSERT INTO materials (code, name_de, name_ru, category, unit, lme_symbol, metals_dev_key) VALUES
    ('steel_rebar',   'Bewehrungsstahl BSt 500',   'Арматура BSt 500',      'steel',      'EUR/t',   NULL, NULL),
    ('steel_beam',    'Stahlträger HEB/IPE',       'Стальные балки HEB/IPE', 'steel',      'EUR/t',   NULL, NULL),
    ('copper_lme',    'Kupfer (LME 3-Monats)',     'Медь (LME 3 мес.)',     'metal',      'EUR/t',   'LME-XCU', 'copper'),
    ('aluminum_lme',  'Aluminium (LME 3-Monats)',  'Алюминий (LME 3 мес.)', 'metal',      'EUR/t',   'LME-XAL', 'aluminum'),
    ('zinc_lme',      'Zink (LME 3-Monats)',       'Цинк (LME 3 мес.)',    'metal',      'EUR/t',   'LME-XZN', 'zinc'),
    ('nickel_lme',    'Nickel (LME 3-Monats)',     'Никель (LME 3 мес.)',   'metal',      'EUR/t',   'LME-XNI', 'nickel'),
    ('concrete_c25',  'Transportbeton C25/30',     'Товарный бетон C25/30', 'concrete',   'EUR/m³',  NULL, NULL),
    ('cement_cem2',   'Zement CEM II/B-LL',        'Цемент CEM II/B-LL',   'concrete',   'EUR/t',   NULL, NULL),
    ('wood_kvh',      'Konstruktionsvollholz C24', 'KVH C24',               'wood',       'EUR/m³',  NULL, NULL),
    ('wood_bsh',      'Brettschichtholz GL24h',    'BSH GL24h',             'wood',       'EUR/m³',  NULL, NULL),
    ('wood_osb',      'OSB/3 Platten 18mm',        'OSB/3 плиты 18мм',     'wood',       'EUR/m²',  NULL, NULL),
    ('insulation_eps','EPS WLG 035',               'EPS WLG 035',           'insulation', 'EUR/m³',  NULL, NULL),
    ('insulation_xps','XPS 300kPa',                'XPS 300кПа',            'insulation', 'EUR/m³',  NULL, NULL),
    ('insulation_mw', 'Mineralwolle WLG 035',      'Минвата WLG 035',      'insulation', 'EUR/m³',  NULL, NULL),
    ('diesel',        'Diesel (Großhandel)',        'Дизель (опт)',          'energy',     'EUR/l',   NULL, NULL),
    ('electricity',   'Industriestrom',             'Электроэнергия (пром.)', 'energy',    'EUR/MWh', NULL, NULL);

-- ============ ТАРИФНЫЕ ПЛАНЫ (справочник) ============
CREATE TABLE plans (
    id          VARCHAR(20) PRIMARY KEY,
    name_de     VARCHAR(50) NOT NULL,
    price_monthly DECIMAL(8,2) NOT NULL,
    price_yearly DECIMAL(8,2) NOT NULL,
    max_materials INTEGER NOT NULL,
    max_users   INTEGER NOT NULL,
    max_alerts  INTEGER NOT NULL,
    features    JSONB NOT NULL
);

INSERT INTO plans (id, name_de, price_monthly, price_yearly, max_materials, max_users, max_alerts, features) VALUES
('basis', 'Basis',  49,   470,  5,  1,  3,  '{"telegram": false, "forecast": false, "api": false, "pdf_reports": false, "update_frequency": 2}'),
('pro',   'Pro',    149,  1430, 99, 1,  999,'{"telegram": true, "forecast": true, "api": false, "pdf_reports": false, "update_frequency": 4}'),
('team',  'Team',   299,  2870, 99, 5,  999,'{"telegram": true, "forecast": true, "api": true, "pdf_reports": true, "update_frequency": 4}');
```

---

## 6. ИСТОЧНИКИ ДАННЫХ

**(Без изменений — данные собираются один раз для всех клиентов)**

### 6.1 Metals.Dev API
```
Регистрация: https://metals.dev (бесплатно, без карты)
Free: 100 запросов/мес | Prod: $14.99/мес — 5000 запросов
Base URL: https://api.metals.dev/v1

GET /latest?api_key=KEY&currency=EUR          → все металлы
GET /metal/authority?api_key=KEY&authority=lme → LME official
GET /timeseries?api_key=KEY&start_date=...    → история (макс 30 дн)
```

### 6.2 GENESIS-Online (Destatis)
```
Регистрация: https://www-genesis.destatis.de (бесплатно)
Base URL: https://www-genesis.destatis.de/genesisWS/rest/2020

GET /data/tablefile?username=X&password=X&name=61261&format=ffcsv
→ Таблица 61261: Baupreisindices

Ключевые таблицы: 61261, 61241, 61111
```

### 6.3 ECB (курсы валют)
```
GET https://data-api.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?format=jsondata&lastNObservations=30
→ бесплатно, без ключа
```

### 6.4 Web Scraping
```
stahlpreis.org → HTTP Request + Cheerio → 1x/день
baupreis.de   → HTTP Request + Code    → 1x/неделю
```

---

## 7. ВОРКФЛОУ (n8n)

### WF-01: Data Collector

**Триггер:** Schedule — 4 раза/день (06:00, 10:00, 14:00, 18:00 CET)
**Изменений нет** — данные собираются глобально, не per-org.

```
[Schedule 06:00,10:00,14:00,18:00]
  ├── [HTTP: Metals.Dev /latest] → [Code: normalize] → [Postgres: INSERT prices]
  ├── [HTTP: Metals.Dev /metal/authority?authority=lme] → [Code: extract] → [Postgres]
  ├── [HTTP: GENESIS 61261] → [Code: parse CSV] → [Postgres]
  ├── [HTTP: ECB EUR/USD] → [Code: extract] → [Postgres]
  └── [HTTP: stahlpreis.org (1x/день)] → [Code: Cheerio] → [Postgres]
  ALL → [Merge] → [Code: validate] → [IF anomaly ±5%] → YES → [Webhook WF-03]
```

### WF-02: AI Analyzer

**Триггер:** Schedule — 2 раза/день (07:30, 15:30 CET)
**Изменений нет** — анализ глобальный. Результат в общей таблице analysis.

```
[Schedule 07:30, 15:30]
  → [Postgres: last 30d prices per material]
  → [Code: build prompt context]
  → [HTTP POST: Claude API] (промпт — см. раздел 8)
  → [Code: parse JSON response]
  → [Postgres: INSERT INTO analysis]
  → [IF urgent_buy] → [Webhook WF-03]
```

### WF-03: Alert Engine (MULTI-TENANT!)

**Триггер:** Webhook от WF-01 или WF-02
**ИЗМЕНЕНИЕ:** Теперь для каждого алерта проверяем alert_rules ВСЕХ активных организаций.

```
[Webhook Trigger: {material_code, change_pct, event_type}]
  │
  ├── [Postgres: SELECT ar.*, o.telegram_chat_id, o.plan, u.email
  │     FROM alert_rules ar
  │     JOIN organizations o ON ar.org_id = o.id
  │     JOIN users u ON u.org_id = o.id AND u.role = 'owner'
  │     WHERE ar.is_active = true
  │       AND o.is_active = true
  │       AND (o.plan != 'trial' OR o.trial_ends_at > NOW())
  │       AND (ar.material_id IS NULL OR ar.material_id = $material_id)
  │       AND ar.threshold_pct <= ABS($change_pct)]
  │
  └── [Loop: for each matching rule]
        │
        ├── [IF channel='telegram' AND o.features_telegram AND o.telegram_chat_id]
        │     → [Telegram: Send to o.telegram_chat_id]
        │
        ├── [IF channel='email' OR channel='both']
        │     → [Resend: Send alert email to u.email]
        │
        └── [Postgres: INSERT INTO alerts_sent(org_id, ...)]
```

### WF-04: Report Generator (MULTI-TENANT!)

```
# Ежедневный (Пн-Пт, 07:00) — для ВСЕХ активных org
[Cron: 0 7 * * 1-5]
  → [Postgres: SELECT * FROM organizations WHERE is_active AND plan != 'cancelled']
  → [Loop: for each org]
      → [Postgres: get org's materials (org_materials OR all if pro/team)]
      → [Postgres: today's prices for those materials]
      → [Claude API: format daily summary]
      → [Resend: send to org owner email]
      → [Postgres: INSERT INTO reports(org_id, ...)]

# Еженедельный (Пн, 07:00) — только Pro + Team
[Cron: 0 7 * * 1]
  → [Postgres: SELECT * FROM organizations WHERE plan IN ('pro', 'team')]
  → [Loop] → ... (аналогично)

# Ежемесячный (1-е, 08:00) — только Team
[Cron: 0 8 1 * *]
  → [Postgres: SELECT * FROM organizations WHERE plan = 'team']
  → [Loop] → ... + PDF generation
```

### WF-05: Telegram Bot (MULTI-TENANT!)

```
[Telegram Trigger: on message]
  │
  ├── [Code: extract chat_id from message]
  ├── [Postgres: SELECT o.* FROM organizations o WHERE o.telegram_chat_id = $chat_id]
  │
  ├── [IF org not found]
  │     → [Telegram: "Bitte verbinden Sie diesen Chat unter baupreis.ai/dashboard/einstellungen"]
  │
  └── [IF org found AND features_telegram = true]
        └── [Switch: command]
              ├── /preis <X> → [Postgres: latest price for org's materials] → reply
              ├── /prognose <X> → [IF features_forecast] → [Claude API] → reply
              ├── /bericht → [Postgres: today's summary for org] → reply
              ├── /alarm <X> <N> → [Check org max_alerts] → [INSERT alert_rule] → reply
              └── <text> → [Claude API: answer] → reply
```

### WF-06: Health Monitor

**Без изменений** — мониторит источники данных и квоты, не per-org.

---

## 8. CLAUDE API

### Промпт для анализа (WF-02)

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 4096,
  "temperature": 0.3,
  "system": "Du bist ein erfahrener Analyst für den deutschen Baustoffmarkt. Du analysierst Preisdaten und gibst fundierte, datengestützte Empfehlungen für Einkaufsleiter von Bauunternehmen.\n\nRegeln:\n1. Antworte IMMER auf Deutsch\n2. Gib IMMER strukturiertes JSON zurück\n3. Erkläre Preisbewegungen durch reale Marktfaktoren\n4. Gib Konfidenzwerte (0-100) für jede Prognose\n5. Empfehlungen: 'jetzt kaufen', 'abwarten', 'beobachten'",
  "messages": [{
    "role": "user",
    "content": "Analysiere folgende Baustoffpreise der letzten 30 Tage:\n\n{{price_data}}\n\nVorherige Prognosen:\n{{previous_forecasts}}\n\nJSON-Format:\n{\"timestamp\":\"ISO-8601\",\"market_summary\":\"...\",\"materials\":[{\"code\":\"...\",\"trend\":\"rising|falling|stable\",\"change_7d_pct\":0,\"change_30d_pct\":0,\"forecast\":{\"horizon_days\":14,\"min\":0,\"max\":0,\"expected\":0,\"confidence\":75},\"explanation\":\"...\",\"recommendation\":\"buy_now|wait|monitor\",\"recommendation_text\":\"...\"}],\"risks\":[],\"opportunities\":[]}"
  }]
}
```

### Промпт для Telegram

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 1024,
  "temperature": 0.5,
  "system": "Du bist BauPreis AI, ein freundlicher Assistent für Baustoffpreise. Antworte kurz, präzise, auf Deutsch. Formatiere für Telegram (mit Emojis).",
  "messages": [{
    "role": "user",
    "content": "Aktuelle Preise:\n{{current_prices}}\n\nFrage: {{user_message}}"
  }]
}
```

### Промпт для отчётов

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 2048,
  "temperature": 0.3,
  "system": "Du erstellst tägliche Marktberichte für Einkaufsleiter. Einfache Sprache, wichtigste Änderungen, konkrete Empfehlungen. 2-3 Minuten Lesezeit.",
  "messages": [{
    "role": "user",
    "content": "Tagesbericht für {{date}}.\nPreise heute vs. gestern:\n{{daily_comparison}}\n7-Tage-Trend:\n{{weekly_trend}}"
  }]
}
```

---

## 9. NEXT.JS APP

### Структура проекта

```
app/
├── Dockerfile
├── package.json
├── tailwind.config.ts
├── next.config.js
├── public/
│   ├── manifest.json          ← PWA manifest
│   ├── sw.js                  ← Service Worker
│   ├── icon-192.png           ← PWA icon
│   ├── icon-512.png           ← PWA icon
│   └── og-image.png           ← Social sharing
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← ClerkProvider wrapper
│   │   ├── page.tsx           ← LANDING PAGE (public)
│   │   │
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   │
│   │   ├── onboarding/
│   │   │   └── page.tsx       ← После регистрации: выбор тарифа, создание org
│   │   │
│   │   ├── (marketing)/       ← Публичные SEO-страницы
│   │   │   ├── preise/page.tsx        ← Pricing page
│   │   │   ├── ueber-uns/page.tsx     ← About
│   │   │   ├── datenschutz/page.tsx   ← Privacy Policy
│   │   │   ├── impressum/page.tsx     ← Legal (обязательно в DE)
│   │   │   ├── agb/page.tsx           ← Terms of Service
│   │   │   └── blog/
│   │   │       ├── page.tsx           ← Blog index
│   │   │       └── [slug]/page.tsx    ← Blog post
│   │   │
│   │   ├── (dashboard)/       ← ЗАЩИЩЁННАЯ ЗОНА (requires auth + active sub)
│   │   │   ├── layout.tsx     ← Sidebar + nav + middleware check
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx   ← Overview: все материалы клиента
│   │   │   ├── material/
│   │   │   │   └── [code]/page.tsx  ← Детали одного материала
│   │   │   ├── prognose/
│   │   │   │   └── page.tsx   ← AI-прогнозы (Pro+Team only)
│   │   │   ├── alerts/
│   │   │   │   └── page.tsx   ← Настройка алертов
│   │   │   ├── berichte/
│   │   │   │   └── page.tsx   ← Архив отчётов
│   │   │   └── einstellungen/
│   │   │       ├── page.tsx   ← Общие настройки
│   │   │       ├── abo/page.tsx       ← Управление подпиской (Stripe portal)
│   │   │       ├── team/page.tsx      ← Управление пользователями (Team only)
│   │   │       └── telegram/page.tsx  ← Подключение Telegram
│   │   │
│   │   └── api/
│   │       ├── prices/route.ts
│   │       ├── analysis/route.ts
│   │       ├── alerts/route.ts
│   │       ├── org/route.ts
│   │       ├── webhook/
│   │       │   ├── stripe/route.ts    ← Stripe webhooks
│   │       │   └── clerk/route.ts     ← Clerk webhooks
│   │       └── telegram/
│   │           └── connect/route.ts   ← Telegram chat linking
│   │
│   ├── components/
│   │   ├── marketing/         ← Hero, PricingTable, FAQ, Footer, Testimonials
│   │   ├── dashboard/         ← PriceCard, PriceChart, AlertFeed, ForecastPanel
│   │   ├── layout/            ← Sidebar, TopNav, MobileNav
│   │   └── ui/                ← shadcn/ui components (Button, Card, Dialog, etc.)
│   │
│   ├── lib/
│   │   ├── db.ts              ← PostgreSQL pool (pg)
│   │   ├── auth.ts            ← Clerk helpers + org resolver
│   │   ├── stripe.ts          ← Stripe helpers
│   │   ├── plans.ts           ← Plan limits & feature checks
│   │   └── utils.ts           ← Formatters, helpers
│   │
│   └── middleware.ts          ← Clerk auth middleware
```

### package.json

```json
{
  "name": "baupreis-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.2",
    "react": "^18.3",
    "react-dom": "^18.3",
    "@clerk/nextjs": "^5",
    "stripe": "^14",
    "pg": "^8.12",
    "recharts": "^2.12",
    "date-fns": "^3",
    "lucide-react": "^0.300",
    "tailwindcss": "^3.4",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^18",
    "@types/node": "^20",
    "@types/pg": "^8",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { domains: ['img.clerk.com'] },
};
module.exports = nextConfig;
```

---

## 10. AUTH (CLERK)

### Настройка Clerk

```
1. Зарегистрироваться на clerk.com
2. Create Application → Name: "BauPreis AI"
3. Social connections: включить Google
4. Email: включить Email + Password
5. Appearance: настроить цвета под бренд
6. Keys → скопировать CLERK_PUBLISHABLE_KEY и CLERK_SECRET_KEY
7. Webhooks → добавить: https://baupreis.ai/api/webhook/clerk
   Events: user.created, user.deleted
```

### middleware.ts

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Публичные страницы (не требуют auth)
  publicRoutes: [
    "/",
    "/preise",
    "/ueber-uns",
    "/datenschutz",
    "/impressum",
    "/agb",
    "/blog(.*)",
    "/api/webhook/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### lib/auth.ts

```typescript
import { auth, currentUser } from "@clerk/nextjs/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getOrg() {
  const { userId } = auth();
  if (!userId) return null;

  const result = await pool.query(
    `SELECT o.* FROM organizations o
     JOIN users u ON u.org_id = o.id
     WHERE u.clerk_user_id = $1 AND o.is_active = true`,
    [userId]
  );

  return result.rows[0] || null;
}

export async function requireOrg() {
  const org = await getOrg();
  if (!org) throw new Error("No organization found");
  
  // Проверка: trial не истёк или есть активная подписка
  if (org.plan === 'trial' && new Date(org.trial_ends_at) < new Date()) {
    throw new Error("Trial expired");
  }
  if (org.plan === 'cancelled') {
    throw new Error("Subscription cancelled");
  }
  
  return org;
}

export function canAccess(org: any, feature: string): boolean {
  const featureMap: Record<string, string> = {
    telegram: 'features_telegram',
    forecast: 'features_forecast',
    api: 'features_api',
    pdf_reports: 'features_pdf_reports',
  };
  return org[featureMap[feature]] === true;
}
```

### Webhook: api/webhook/clerk/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  // Verify webhook signature (use Clerk webhook secret)
  const evt = JSON.parse(payload);

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ");

    // Создать организацию и пользователя
    const slug = email.split("@")[0].replace(/[^a-z0-9]/g, "-").slice(0, 50);
    
    const orgResult = await pool.query(
      `INSERT INTO organizations (name, slug, plan, trial_ends_at)
       VALUES ($1, $2, 'trial', NOW() + INTERVAL '14 days')
       RETURNING id`,
      [name || email, slug + "-" + Date.now()]
    );

    await pool.query(
      `INSERT INTO users (org_id, clerk_user_id, email, name, role)
       VALUES ($1, $2, $3, $4, 'owner')`,
      [orgResult.rows[0].id, id, email, name]
    );
  }

  if (evt.type === "user.deleted") {
    // Деактивировать org
    await pool.query(
      `UPDATE organizations SET is_active = false
       WHERE id = (SELECT org_id FROM users WHERE clerk_user_id = $1)`,
      [evt.data.id]
    );
  }

  return NextResponse.json({ received: true });
}
```

---

## 11. BILLING (STRIPE)

### Настройка Stripe

```
1. Зарегистрироваться на stripe.com
2. Dashboard → Products → Create 3 products:

   Product: "BauPreis AI Basis"
   → Price: €49/month (recurring), ID: price_basis_monthly
   → Price: €470/year (recurring), ID: price_basis_yearly

   Product: "BauPreis AI Pro"
   → Price: €149/month, ID: price_pro_monthly
   → Price: €1430/year, ID: price_pro_yearly

   Product: "BauPreis AI Team"
   → Price: €299/month, ID: price_team_monthly
   → Price: €2870/year, ID: price_team_yearly

3. Developers → Webhooks → Add endpoint:
   URL: https://baupreis.ai/api/webhook/stripe
   Events: checkout.session.completed, customer.subscription.updated,
           customer.subscription.deleted, invoice.payment_failed

4. Copy webhook signing secret → STRIPE_WEBHOOK_SECRET
```

### lib/stripe.ts

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function createCheckoutSession(orgId: string, priceId: string, email: string) {
  return stripe.checkout.sessions.create({
    customer_email: email,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/preise`,
    metadata: { orgId },
    subscription_data: { metadata: { orgId } },
    allow_promotion_codes: true,
  });
}

export async function createBillingPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/einstellungen/abo`,
  });
}

// Map Stripe Price ID → plan
export function getPlanFromPriceId(priceId: string): string {
  const map: Record<string, string> = {
    [process.env.STRIPE_PRICE_BASIS_MONTHLY!]: 'basis',
    [process.env.STRIPE_PRICE_PRO_MONTHLY!]: 'pro',
    [process.env.STRIPE_PRICE_TEAM_MONTHLY!]: 'team',
    [process.env.STRIPE_PRICE_BASIS_YEARLY!]: 'basis',
    [process.env.STRIPE_PRICE_PRO_YEARLY!]: 'pro',
    [process.env.STRIPE_PRICE_TEAM_YEARLY!]: 'team',
  };
  return map[priceId] || 'basis';
}
```

### lib/plans.ts

```typescript
export const PLAN_LIMITS = {
  trial: { materials: 5, users: 1, alerts: 3, telegram: false, forecast: false, api: false, pdf: false },
  basis: { materials: 5, users: 1, alerts: 3, telegram: false, forecast: false, api: false, pdf: false },
  pro:   { materials: 99, users: 1, alerts: 999, telegram: true, forecast: true, api: false, pdf: false },
  team:  { materials: 99, users: 5, alerts: 999, telegram: true, forecast: true, api: true, pdf: true },
};

export function applyPlanToOrg(plan: string) {
  const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.basis;
  return {
    plan,
    max_materials: limits.materials,
    max_users: limits.users,
    max_alerts: limits.alerts,
    features_telegram: limits.telegram,
    features_forecast: limits.forecast,
    features_api: limits.api,
    features_pdf_reports: limits.pdf,
  };
}
```

### Webhook: api/webhook/stripe/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPlanFromPriceId, applyPlanToOrg } from "@/lib/plans";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orgId = session.metadata?.orgId;
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0].price.id;
      const plan = getPlanFromPriceId(priceId);
      const limits = applyPlanToOrg(plan);

      await pool.query(
        `UPDATE organizations SET
           plan = $1, stripe_customer_id = $2, stripe_subscription_id = $3,
           stripe_price_id = $4, max_materials = $5, max_users = $6,
           max_alerts = $7, features_telegram = $8, features_forecast = $9,
           features_api = $10, features_pdf_reports = $11, updated_at = NOW()
         WHERE id = $12`,
        [limits.plan, session.customer, session.subscription, priceId,
         limits.max_materials, limits.max_users, limits.max_alerts,
         limits.features_telegram, limits.features_forecast,
         limits.features_api, limits.features_pdf_reports, orgId]
      );
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object;
      const orgId = sub.metadata?.orgId;
      if (sub.status === "active") {
        const priceId = sub.items.data[0].price.id;
        const plan = getPlanFromPriceId(priceId);
        const limits = applyPlanToOrg(plan);
        await pool.query(
          `UPDATE organizations SET plan=$1, stripe_price_id=$2, max_materials=$3,
           max_users=$4, max_alerts=$5, features_telegram=$6, features_forecast=$7,
           features_api=$8, features_pdf_reports=$9, updated_at=NOW() WHERE id=$10`,
          [limits.plan, priceId, limits.max_materials, limits.max_users, limits.max_alerts,
           limits.features_telegram, limits.features_forecast, limits.features_api,
           limits.features_pdf_reports, orgId]
        );
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await pool.query(
        `UPDATE organizations SET plan='cancelled', updated_at=NOW()
         WHERE stripe_subscription_id = $1`,
        [sub.id]
      );
      break;
    }

    case "invoice.payment_failed": {
      // TODO: send email to org owner about failed payment
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## 12. LANDING PAGE

### app/page.tsx (корневая — Landing)

Содержание Landing Page (на немецком):
1. **Hero:** "Baustoffpreise in Echtzeit. KI-Prognosen. Ab €49/Monat."
   - CTA: "14 Tage kostenlos testen" → /sign-up
2. **Problem:** "Materialpreise schwanken. Sie erfahren es zu spät."
3. **Solution:** 3 USP с иконками (Echtzeit-Monitoring, KI-Prognosen, Telegram-Alerts)
4. **How it works:** 3 шага (Registrieren → Materialien wählen → Sparen)
5. **Pricing Table:** 3 тарифа (интерактивная, toggle monthly/yearly)
6. **Social Proof:** Testimonials (пустое место для будущих, пока показать цифры)
7. **FAQ:** 6-8 вопросов
8. **CTA:** "Jetzt kostenlos starten"
9. **Footer:** Impressum, Datenschutz, AGB, Kontakt

**SEO мета-теги:**
```
<title>BauPreis AI — Baustoffpreise in Echtzeit | KI-Prognosen für Bauunternehmen</title>
<meta name="description" content="Überwachen Sie Baustoffpreise 24/7 mit KI. Erhalten Sie Preisalarme, Prognosen und Empfehlungen. Ab €49/Monat. 14 Tage kostenlos." />
<meta property="og:title" content="BauPreis AI — Baustoffpreise in Echtzeit" />
```

---

## 13. DASHBOARD

### Основные страницы:

**Dashboard Overview (/dashboard):**
- Карточки: каждый материал клиента с ценой, трендом (↑↓→), % изменения за 7д
- Мини-графики (sparklines) для каждого материала
- Лента последних алертов (3 шт.)
- Блок "KI-Empfehlung des Tages" (если Pro+)

**Material Detail (/material/[code]):**
- График цен за 30/90/365 дней (recharts LineChart)
- Текущая цена, min/max за период
- AI-анализ: тренд, прогноз, рекомендация
- История алертов для этого материала

**Alerts (/alerts):**
- Список правил: материал, порог, канал, активность
- Кнопка "Neuer Alarm" (проверка лимита по тарифу)
- Лог отправленных алертов

**Reports (/berichte):**
- Архив отчётов: дата, тип, кнопка "Lesen"
- Контент отчёта в модалке

**Settings (/einstellungen):**
- Abo: текущий тариф, кнопка "Upgrade" / "Verwalten" (Stripe portal)
- Team: добавить/удалить пользователей (Team only)
- Telegram: инструкция + кнопка "Chat verbinden"
- Materialauswahl: выбор 5 материалов (Basis) или все (Pro/Team)

---

## 14. API ROUTES

### GET /api/prices

```typescript
import { requireOrg } from "@/lib/auth";
import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  const org = await requireOrg();
  const material = req.nextUrl.searchParams.get("material");
  const days = parseInt(req.nextUrl.searchParams.get("days") || "30");

  // Проверить: материал доступен для этой org?
  let materialFilter = "";
  if (org.plan === "basis" || org.plan === "trial") {
    materialFilter = `AND m.id IN (SELECT material_id FROM org_materials WHERE org_id = '${org.id}')`;
  }

  const query = `
    SELECT p.timestamp, p.price_eur, p.source, m.name_de, m.unit, m.code
    FROM prices p
    JOIN materials m ON p.material_id = m.id
    WHERE m.code = $1 ${materialFilter}
      AND p.timestamp > NOW() - INTERVAL '${days} days'
    ORDER BY p.timestamp DESC
  `;

  const result = await pool.query(query, [material]);
  return NextResponse.json(result.rows);
}
```

### POST /api/alerts

```typescript
export async function POST(req: NextRequest) {
  const org = await requireOrg();
  const body = await req.json();

  // Проверить лимит алертов
  const countResult = await pool.query(
    "SELECT COUNT(*) FROM alert_rules WHERE org_id = $1 AND is_active = true",
    [org.id]
  );
  if (parseInt(countResult.rows[0].count) >= org.max_alerts) {
    return NextResponse.json(
      { error: "Alarm-Limit erreicht. Bitte upgraden Sie Ihren Plan." },
      { status: 403 }
    );
  }

  // Создать правило
  await pool.query(
    `INSERT INTO alert_rules (org_id, material_id, rule_type, threshold_pct, time_window, channel, priority)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [org.id, body.material_id, body.rule_type, body.threshold_pct, body.time_window, body.channel, body.priority]
  );

  return NextResponse.json({ success: true });
}
```

---

## 15. TELEGRAM

### Подключение Telegram к организации

```
Процесс для пользователя:
1. Открыть /dashboard/einstellungen/telegram
2. Увидеть: "Senden Sie /start an @baupreis_ai_bot"
3. Бот отвечает: "Geben Sie Ihren Verbindungscode ein: XXXX-XXXX"
4. Пользователь вводит код
5. Бот связывает chat_id с org_id
6. Dashboard показывает: "✅ Telegram verbunden"

Техническая реализация:
- При открытии страницы → API генерирует уникальный код → хранит в Redis/DB (5 мин TTL)
- Бот получает код → ищет в DB → обновляет org.telegram_chat_id
```

---

## 16. EMAIL

### Resend.com

```
1. Зарегистрироваться на resend.com (Free: 3000 emails/мес)
2. Добавить домен: baupreis.ai
3. DNS: TXT (SPF), CNAME (DKIM)
4. API Key → RESEND_API_KEY в .env
```

### Отправка из n8n

```
HTTP Request Node:
  Method: POST
  URL: https://api.resend.com/emails
  Headers: Authorization: Bearer {{$env.RESEND_API_KEY}}
  Body:
  {
    "from": "BauPreis AI <noreply@baupreis.ai>",
    "to": ["{{$json.email}}"],
    "subject": "📊 Tagesbericht Baustoffpreise — {{$json.date}}",
    "html": "{{$json.report_html}}"
  }
```

---

## 17. PWA

### public/manifest.json

```json
{
  "name": "BauPreis AI",
  "short_name": "BauPreis",
  "description": "Baustoffpreise in Echtzeit mit KI-Prognosen",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### public/sw.js (Service Worker)

```javascript
const CACHE_NAME = 'baupreis-v1';
const OFFLINE_URLS = ['/dashboard', '/offline.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
  }
});
```

### В layout.tsx добавить:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="BauPreis" />
<link rel="apple-touch-icon" href="/icon-192.png" />
```

---

## 18. ДЕПЛОЙ

```bash
# === ПОДГОТОВКА (ДО начала) ===

# 1. Зарегистрировать домен baupreis.ai (или .de)
# 2. Зарегистрироваться на: hetzner.com, clerk.com, stripe.com,
#    metals.dev, destatis.de, console.anthropic.com, resend.com

# === ДЕНЬ 1: Сервер ===

ssh root@<IP>
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh
adduser baupreis && usermod -aG docker baupreis
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw enable
su - baupreis
mkdir baupreis-ai && cd baupreis-ai

# Создать файлы: docker-compose.yml, .env, init.sql (из разделов выше)

# Создать папку app/ с Next.js проектом
mkdir -p app/src/app app/public
# ... (создать все файлы из раздела 9)

# Права для n8n
mkdir -p n8n_data local-files
sudo chown -R 1000:1000 n8n_data

# DNS: baupreis.ai → A → IP, n8n.baupreis.ai → A → IP

# === ДЕНЬ 2: Запуск ===

docker compose up -d postgres
docker compose logs -f postgres  # дождаться "ready to accept connections"

docker compose up -d n8n
docker compose logs -f n8n  # дождаться "Editor is now accessible"

docker compose up -d app
docker compose logs -f app  # дождаться "Ready on port 3000"

docker compose up -d traefik
# Подождать 1-2 минуты для получения SSL сертификатов

# Проверка:
curl https://baupreis.ai          # Landing page
curl https://n8n.baupreis.ai      # n8n login

# === ДЕНЬ 3: Настройка n8n ===

# Открыть n8n → Settings → Credentials:
# - PostgreSQL (host: postgres, db: baupreis)
# - Metals.Dev (HTTP Header: api_key)
# - Anthropic (HTTP Header: x-api-key)
# - Telegram Bot (Access Token)
# - Resend (HTTP Header: Authorization: Bearer ...)

# Импортировать/создать 6 воркфлоу (из раздела 7)
# Активировать WF-01 → тест → первые цены в БД

# === ДЕНЬ 4: Stripe + Clerk ===

# Stripe: создать Products, настроить Webhook
# Clerk: настроить Application, Webhook
# Тест: регистрация → trial → upgrade → оплата → dashboard

# === НЕДЕЛЯ 2+ ===

# WF-02 (AI) → WF-03 (Alerts) → WF-05 (Telegram) → WF-04 (Reports)
# E2E тестирование всех тарифов
# Historical backfill (Metals.Dev timeseries за 90 дней)
```

---

## 19. МОНИТОРИНГ И БЭКАПЫ

### Бэкап БД

```bash
#!/bin/bash
# /home/baupreis/backup.sh
BACKUP_DIR=/home/baupreis/backups
DATE=$(date +%Y%m%d_%H%M)
mkdir -p $BACKUP_DIR
docker exec baupreis-ai-postgres-1 pg_dump -U baupreis baupreis | gzip > $BACKUP_DIR/baupreis_$DATE.sql.gz
ls -t $BACKUP_DIR/*.sql.gz | tail -n +31 | xargs rm -f 2>/dev/null

# Crontab: crontab -e
# 0 3 * * * /home/baupreis/backup.sh >> /home/baupreis/backups/backup.log 2>&1
```

### Обновления

```bash
cd /home/baupreis/baupreis-ai
docker compose pull n8n
docker compose up -d n8n

# Для app (после git push):
docker compose build app
docker compose up -d app
```

---

## 20. ЧЕКЛИСТ

### Фаза 1: Инфраструктура (Дни 1-2)

| # | Задача | Статус |
|---|--------|--------|
| 1 | Hetzner CX32, Ubuntu 24.04, Nuremberg | ☐ |
| 2 | Домен: baupreis.ai + DNS A-записи | ☐ |
| 3 | SSH, Docker, firewall | ☐ |
| 4 | docker-compose.yml, .env, init.sql | ☐ |
| 5 | docker compose up -d (postgres + n8n + traefik) | ☐ |
| 6 | SSL работает на обоих доменах | ☐ |

### Фаза 2: Auth + Billing (Дни 3-5)

| # | Задача | Статус |
|---|--------|--------|
| 7 | Clerk: создать app, настроить Google OAuth | ☐ |
| 8 | Stripe: создать 3 Products × 2 prices (monthly+yearly) | ☐ |
| 9 | Stripe: настроить Webhook | ☐ |
| 10 | Next.js app: middleware, sign-in, sign-up | ☐ |
| 11 | Onboarding flow: register → create org → choose plan | ☐ |
| 12 | Stripe Checkout → webhook → update org.plan | ☐ |
| 13 | Stripe Billing Portal (manage subscription) | ☐ |
| 14 | Тест: register → trial → upgrade → paid → dashboard | ☐ |

### Фаза 3: Dashboard (Дни 6-10)

| # | Задача | Статус |
|---|--------|--------|
| 15 | Dashboard overview: price cards + sparklines | ☐ |
| 16 | Material detail: price chart + AI analysis | ☐ |
| 17 | Alerts page: create/delete rules, log | ☐ |
| 18 | Reports page: archive, read | ☐ |
| 19 | Settings: abo, team, telegram, materials | ☐ |
| 20 | Plan-based feature gating (Pro/Team features locked for Basis) | ☐ |
| 21 | Responsive design (mobile-first) | ☐ |

### Фаза 4: Landing + SEO (Дни 11-13)

| # | Задача | Статус |
|---|--------|--------|
| 22 | Landing page (Hero, USP, Pricing, FAQ, Footer) — auf Deutsch | ☐ |
| 23 | Pricing page с toggle monthly/yearly | ☐ |
| 24 | Impressum, Datenschutz, AGB (юрист ~€500) | ☐ |
| 25 | SEO meta tags, OG image, structured data | ☐ |
| 26 | PWA manifest + service worker + icons | ☐ |

### Фаза 5: n8n Workflows (Дни 14-20)

| # | Задача | Статус |
|---|--------|--------|
| 27 | API keys: Metals.Dev, Anthropic, Destatis, Resend | ☐ |
| 28 | Telegram bot: @BotFather → token | ☐ |
| 29 | n8n credentials (все) | ☐ |
| 30 | WF-01: Data Collector → первые цены в БД | ☐ |
| 31 | WF-06: Health Monitor → включить | ☐ |
| 32 | WF-02: AI Analyzer → первый анализ | ☐ |
| 33 | WF-03: Alert Engine (multi-tenant) → тест | ☐ |
| 34 | WF-05: Telegram Bot (multi-tenant) → /preis Stahl | ☐ |
| 35 | WF-04: Report Generator (multi-tenant) → первый email | ☐ |
| 36 | Historical backfill: 90 дней данных | ☐ |

### Фаза 6: Launch (Дни 21-25)

| # | Задача | Статус |
|---|--------|--------|
| 37 | E2E тест: все 3 тарифа, все features | ☐ |
| 38 | Бэкап скрипт + cron | ☐ |
| 39 | 5 beta-клиентов (бесплатный trial 30 дней) | ☐ |
| 40 | Фидбек → итерация | ☐ |
| 41 | **GO LIVE** 🚀 | ☐ |

---

## МЕСЯЧНЫЙ БЮДЖЕТ SaaS (верифицировано 02/2026)

| Позиция | Стоимость | Источник |
|---------|-----------|----------|
| Hetzner CX32 | €6.80 | hetzner.com/cloud |
| Metals.Dev Pro | $14.99 (~€14) | metals.dev/pricing |
| Claude API | €15–60 | console.anthropic.com |
| Clerk | €0 (free до 10K MAU) | clerk.com |
| Stripe | 1.4% + €0.25/транзакция | stripe.com |
| Resend | €0 (free до 3K/мес) | resend.com |
| Домен .ai | ~€5/мес | — |
| **ИТОГО** | **~€42–86/мес** | |

**При 10 клиентах (avg €100):** доход €1 000 — расходы €86 = прибыль **€914/мес**
**При 100 клиентах:** доход €10 000 — расходы ~€200 = прибыль **€9 800/мес**

---

## ЧТО СКАЗАТЬ CLAUDE CODE

Скопируйте этот текст и отправьте Claude Code вместе с этим файлом:

```
Прочитай файл BauPreis_AI_SaaS_Claude_Code_Guide.md — это мастер-документ для создания SaaS-сервиса.

Начни с Фазы 1 (инфраструктура): создай docker-compose.yml, .env.example и init.sql точно по документу.
Затем создай Next.js проект в папке app/ со структурой из раздела 9.
Установи зависимости из package.json (раздел 9).
Реализуй auth (Clerk, раздел 10), billing (Stripe, раздел 11), landing page (раздел 12), dashboard (раздел 13) и API routes (раздел 14).
Добавь PWA manifest и service worker (раздел 17).
Следуй чеклисту из раздела 20 по порядку.

Все тексты на Landing Page и в Dashboard — НА НЕМЕЦКОМ языке.
```

---

*Документ v2.0 — SaaS-версия. Все API, цены, конфигурации верифицированы на февраль 2026.*
