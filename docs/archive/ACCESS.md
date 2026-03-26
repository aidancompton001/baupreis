# BauPreis AI — Access & Deployment Guide

## Local Development (http://localhost:3000)

### Quick Start
```bash
cd app
npm run dev
# Open: http://localhost:3000
```

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (local or Docker)
- Copy `.env.local` from `.env.example` and fill values

### Dev Mode Features
- Clerk auth is BYPASSED (no network needed)
- Auto-creates dev org (plan: "pro", trial 14 days)
- All API endpoints work with mock/seed data
- Database: `postgresql://baupreis:baupreis123@localhost:5432/baupreis`

### Access URLs (Local)

| Page | URL | Auth |
|------|-----|------|
| **Landing** | http://localhost:3000 | Public |
| **Pricing** | http://localhost:3000/preise | Public |
| **About Us** | http://localhost:3000/ueber-uns | Public |
| **Blog** | http://localhost:3000/blog | Public |
| **AGB** | http://localhost:3000/agb | Public |
| **Datenschutz** | http://localhost:3000/datenschutz | Public |
| **Impressum** | http://localhost:3000/impressum | Public |
| **Sign In** | http://localhost:3000/sign-in | Clerk |
| **Sign Up** | http://localhost:3000/sign-up | Clerk |
| **Onboarding** | http://localhost:3000/onboarding | Requires auth |
| **Dashboard** | http://localhost:3000/dashboard | Requires auth (bypassed in dev) |
| **Alerts** | http://localhost:3000/alerts | Requires auth |
| **AI Forecasts** | http://localhost:3000/prognose | Requires auth |
| **AI Chat** | http://localhost:3000/chat | Requires auth (Pro+) |
| **Reports** | http://localhost:3000/berichte | Requires auth |
| **Escalation Calculator** | http://localhost:3000/preisgleitklausel | Requires auth (Pro+) |
| **Material Detail** | http://localhost:3000/material/steel_rebar | Requires auth |
| **Settings** | http://localhost:3000/einstellungen | Requires auth |
| **Settings: Materials** | http://localhost:3000/einstellungen/materialien | Requires auth |
| **Settings: Subscription** | http://localhost:3000/einstellungen/abo | Requires auth |
| **Settings: Team** | http://localhost:3000/einstellungen/team | Requires auth (Team) |
| **Settings: Telegram** | http://localhost:3000/einstellungen/telegram | Requires auth (Pro+) |
| **Settings: WhatsApp** | http://localhost:3000/einstellungen/whatsapp | Requires auth (Pro+) |
| **Settings: API Keys** | http://localhost:3000/einstellungen/api | Requires auth (Team) |

### Material Codes (for /material/[code])
| Code | Material |
|------|----------|
| steel_rebar | Bewehrungsstahl BSt 500 |
| steel_beam | Stahltrager HEB/IPE |
| copper_lme | Kupfer (LME 3-Monats) |
| aluminum_lme | Aluminium (LME 3-Monats) |
| zinc_lme | Zink (LME 3-Monats) |
| nickel_lme | Nickel (LME 3-Monats) |
| concrete_c25 | Transportbeton C25/30 |
| cement_cem2 | Zement CEM II/B-LL |
| wood_kvh | Konstruktionsvollholz C24 |
| wood_bsh | Brettschichtholz GL24h |
| wood_osb | OSB/3 Platten 18mm |
| insulation_eps | EPS WLG 035 |
| insulation_xps | XPS 300kPa |
| insulation_mw | Mineralwolle WLG 035 |
| diesel | Diesel (Grosshandel) |
| electricity | Industriestrom |

### API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/prices?days=30` | GET | Org | Price data (all materials) |
| `/api/prices?material=steel_rebar&days=30` | GET | Org | Price data (single material) |
| `/api/analysis` | GET | Org | AI analysis for all materials |
| `/api/analysis?material=steel_rebar` | GET | Org | AI analysis (single material) |
| `/api/materials` | GET | Org | Material catalog + selection |
| `/api/materials` | POST | Org | Save material selection |
| `/api/org` | GET | Org | Current organization data |
| `/api/org` | PATCH | Org | Update org (name) |
| `/api/alerts` | GET | Org | Alert rules + sent history |
| `/api/alerts` | POST | Org | Create alert rule |
| `/api/reports` | GET | Org | Report archive |
| `/api/index?days=1` | GET | Org | BauPreis Index history |
| `/api/chat` | POST | Org (Pro+) | AI Chat (streaming SSE) |
| `/api/prices/at-date?date=2026-01-01&materials=steel_rebar` | GET | Org | Prices at specific date |
| `/api/export/prices?days=30` | GET | Org | CSV export (all materials) |
| `/api/export/prices?material=steel_rebar&days=30` | GET | Org | CSV export (single material) |
| `/api/export/report?id=xxx` | GET | Org | CSV export (report) |
| `/api/export/report-pdf?id=xxx` | GET | Org (Team) | PDF export (report) |
| `/api/team` | GET | Org (Team) | Team members + invites |
| `/api/team` | POST | Org (Team) | Create invite |
| `/api/team/[memberId]` | PATCH | Org (Team) | Change role |
| `/api/team/[memberId]` | DELETE | Org (Team) | Remove member |
| `/api/team/accept-invite` | POST | Org | Accept team invite |
| `/api/api-keys` | GET/POST/DELETE | Org (Team) | API key management |
| `/api/v1/prices` | GET | API Key | External API: prices |
| `/api/v1/analysis` | GET | API Key | External API: analysis |
| `/api/v1/materials` | GET | API Key | External API: materials |
| `/api/index/calculate` | POST | Secret | Trigger index calculation |
| `/api/webhook/clerk` | POST | Svix | Clerk webhook |
| `/api/webhook/stripe` | POST | Stripe | Stripe webhook |
| `/api/telegram/connect` | POST | Org | Telegram bot connect |
| `/api/whatsapp/connect` | POST | Org | WhatsApp connect |

### i18n (Language Switching)
- Languages: DE (default), EN, RU
- Switch via dropdown in dashboard header
- Cookie `locale=en` or `locale=ru`
- Test: `curl -b "locale=en" http://localhost:3000/`
- Accept-Language auto-detection on first visit

---

## Production Deployment (https://baupreis.ai)

### Infrastructure
- **Server:** Hetzner Cloud CX32 (Nuremberg, GDPR-compliant)
- **OS:** Ubuntu 22.04 LTS
- **Stack:** Docker Compose (Traefik + PostgreSQL + Next.js) + system crontab
- **SSL:** Auto via Let's Encrypt (Traefik)
- **Domain:** baupreis.ai

### Deploy Steps
```bash
# 1. Clone repo to server
git clone <repo-url> /opt/baupreis
cd /opt/baupreis

# 2. Create .env from template
cp .env.example .env
nano .env  # Fill ALL values (see below)

# 3. Initialize database
docker compose up -d postgres
docker compose exec postgres psql -U baupreis -d baupreis -f /docker-entrypoint-initdb.d/init.sql

# 4. Start all services
docker compose up -d

# 5. Verify
curl https://baupreis.ai       # Landing page
curl https://baupreis.ai/api/prices?days=1  # API check
```

### Production URLs
| Service | URL |
|---------|-----|
| **App** | https://baupreis.ai |

### Required Environment Variables
```
# DOMAIN
DOMAIN=baupreis.ai
ACME_EMAIL=admin@baupreis.ai

# DATABASE
DB_USER=baupreis
DB_PASSWORD=<openssl rand -base64 32>

# CRON (Background Jobs)
CRON_SECRET=<openssl rand -hex 32>

# CLERK (https://dashboard.clerk.com)
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# STRIPE (https://dashboard.stripe.com)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIS_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_TEAM_MONTHLY=price_...
STRIPE_PRICE_BASIS_YEARLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_TEAM_YEARLY=price_...

# ANTHROPIC (https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# METALS.DEV (https://metals.dev)
METALS_DEV_API_KEY=...

# TELEGRAM (@BotFather)
TELEGRAM_BOT_TOKEN=...

# DESTATIS (www-genesis.destatis.de)
DESTATIS_USER=...
DESTATIS_PASSWORD=...

# EMAIL (https://resend.com)
RESEND_API_KEY=re_...
EMAIL_FROM=BauPreis AI <noreply@baupreis.ai>

# BAUPREIS INDEX
INDEX_CALCULATION_SECRET=<openssl rand -hex 32>

# WHATSAPP (Meta Business Manager)
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
```

### Webhooks to Configure

| Service | Webhook URL | Events |
|---------|-------------|--------|
| **Clerk** | `https://baupreis.ai/api/webhook/clerk` | user.created, user.updated |
| **Stripe** | `https://baupreis.ai/api/webhook/stripe` | checkout.session.completed, customer.subscription.updated, customer.subscription.deleted |

### Cron Jobs (system crontab → API routes)
| API Route | Schedule | Description |
|-----------|----------|-------------|
| `POST /api/cron/collect-prices` | Every 6h | Fetches prices from LME, Destatis, Metals.Dev |
| `POST /api/cron/analyze` | Every 12h | Claude AI generates analysis + forecasts |
| `POST /api/cron/send-alerts` | Every 1h | Checks rules, sends email/Telegram/WhatsApp |
| `POST /api/cron/generate-reports` | Daily 06:00 | Generates daily/weekly/monthly reports |
| `POST /api/cron/health` | Every 5min | Monitors app, DB, external APIs |
| `POST /api/index/calculate` | Daily 07:00 | Calculates BauPreis Index |

All cron endpoints require `Authorization: Bearer $CRON_SECRET` header.
Triggered by system crontab on the Hetzner server (`/etc/cron.d/baupreis`).

---

## Plan Features Matrix

| Feature | Trial | Basis (49) | Pro (149) | Team (299) |
|---------|-------|------------|-----------|------------|
| Materials | 5 | 5 | All 16 | All 16 |
| Users | 1 | 1 | 1 | 5 |
| Alerts | 3 | 3 | Unlimited | Unlimited |
| Email Reports | Yes | Yes | Yes | Yes |
| Telegram | No | No | Yes | Yes |
| WhatsApp | No | No | Yes | Yes |
| AI Forecasts | No | No | Yes | Yes |
| AI Chat | No | No | Yes | Yes |
| Escalation Calc | No | No | Yes | Yes |
| CSV Export | Yes | Yes | Yes | Yes |
| PDF Reports | No | No | No | Yes |
| API Access | No | No | No | Yes |
| Team Management | No | No | No | Yes |

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Auth | Clerk (Google OAuth + Email) |
| Billing | Stripe (subscriptions) |
| Database | PostgreSQL 16 (multi-tenant) |
| AI | Claude API (Sonnet 4.5) |
| Background Jobs | Next.js API routes + system crontab (6 jobs) |
| Proxy | Traefik v3 (auto SSL) |
| Hosting | Hetzner Cloud CX32 (Nuremberg) |
| Email | Resend.com |
| i18n | Custom (DE/EN/RU, cookie-based) |
| Charts | Recharts |
| PDF | pdfkit |

## Build Info
- **Pages:** 47
- **Build:** `cd app && npm run build` (0 errors)
- **Dev server:** `cd app && npm run dev` (port 3000)
