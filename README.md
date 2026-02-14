# BauPreis AI

**KI-gestützte Baustoff-Preisplattform für Deutschland**

AI-powered construction material price monitoring platform for the German market. Track 16+ materials, get AI forecasts, receive price alerts, and make data-driven purchasing decisions.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Claude AI](https://img.shields.io/badge/Claude_AI-Sonnet_4.5-orange)

---

## Features

| Feature | Basis (49/mo) | Pro (149/mo) | Team (299/mo) |
|---------|:---:|:---:|:---:|
| Price monitoring (16 materials) | 5 materials | All | All |
| Price alerts (Email) | 3 alerts | Unlimited | Unlimited |
| Telegram alerts | - | Yes | Yes |
| AI forecasts (7/30/90 days) | - | Yes | Yes |
| AI Chat ("Frag BauPreis AI") | - | Yes | Yes |
| Preisgleitklausel calculator | - | Yes | Yes |
| CSV export | Yes | Yes | Yes |
| PDF reports | - | - | Yes |
| API access | - | - | Yes |
| Team management (up to 5) | - | - | Yes |

### Core Capabilities

- **Real-time price monitoring** — Steel, copper, aluminum, zinc, nickel, concrete, cement, wood, insulation, diesel, electricity
- **AI-powered analysis** — Claude Sonnet 4.5 analyzes trends, generates forecasts, and provides buy/wait/watch recommendations
- **Multi-channel alerts** — Email, Telegram, WhatsApp notifications on price changes
- **Preisgleitklausel calculator** — VHB Formblatt 225 formula for German public contracts
- **BauPreis Index** — Weighted composite index of 16 construction materials (base = 1000)
- **Internationalization** — German, English, Russian (DE default)
- **PWA** — Progressive Web App, works offline

### Data Sources

| Source | Materials | Update Frequency |
|--------|-----------|-----------------|
| [Metals.dev](https://metals.dev) | Cu, Al, Zn, Ni (LME) | Real-time |
| [Destatis GENESIS](https://www-genesis.destatis.de) | Concrete, Cement, Insulation, Wood, Steel indices | Monthly/Quarterly |
| Synthetic fallback | All 16 materials | On demand |

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth:** Clerk (Google OAuth + Email)
- **Billing:** Stripe (subscriptions)
- **Database:** PostgreSQL 16 (multi-tenant)
- **AI:** Claude API (Anthropic) — analysis, forecasts, chat
- **Background Jobs:** Next.js API routes + system crontab
- **Reverse Proxy:** Traefik v3 (auto SSL via Let's Encrypt)
- **Email:** Resend.com
- **Notifications:** Telegram Bot API, WhatsApp Cloud API

---

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or Docker)
- API keys: Clerk, Anthropic (optional), Metals.dev (optional)

### Local Development

```bash
# Clone
git clone https://github.com/aidancompton001/baupreis.git
cd baupreis

# Install dependencies
cd app && npm install

# Set up environment
cp .env.example .env
# Edit .env with your keys

# Initialize database
psql -U postgres -f init.sql

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker Deployment

```bash
# Configure environment
cp .env.example .env
# Edit .env with your keys (see SETUP_PROCESS.md)

# Build and run
docker compose build --no-cache
docker compose up -d

# Initialize data
SECRET="your_cron_secret"
curl -X POST -H "Authorization: Bearer $SECRET" http://localhost:3000/api/cron/collect-prices
curl -X POST -H "Authorization: Bearer $SECRET" http://localhost:3000/api/cron/analyze
curl -X POST -H "Authorization: Bearer $SECRET" http://localhost:3000/api/index/calculate
```

### Vercel + Neon (Serverless)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd app
vercel

# Set environment variables in Vercel Dashboard
# Use Neon (neon.tech) for PostgreSQL
```

---

## Project Structure

```
baupreis/
├── docker-compose.yml          # Traefik + PostgreSQL + App
├── init.sql                    # Database schema + seed data
├── .env.example                # Environment variables template
├── SETUP_PROCESS.md            # Detailed setup guide
├── app/                        # Next.js application
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Landing page
│   │   │   ├── (dashboard)/                # Protected pages
│   │   │   │   ├── dashboard/              # Main dashboard
│   │   │   │   ├── alerts/                 # Price alerts
│   │   │   │   ├── prognose/               # AI forecasts
│   │   │   │   ├── chat/                   # AI chat
│   │   │   │   ├── preisgleitklausel/      # Price escalation calc
│   │   │   │   ├── berichte/               # Reports
│   │   │   │   ├── material/[code]/        # Material detail
│   │   │   │   └── einstellungen/          # Settings
│   │   │   ├── (marketing)/                # Public pages
│   │   │   └── api/                        # API routes
│   │   │       ├── cron/                   # Background jobs
│   │   │       ├── v1/                     # Public API (Team plan)
│   │   │       └── webhook/                # Clerk + Stripe webhooks
│   │   ├── components/
│   │   ├── i18n/               # Translations (de/en/ru)
│   │   └── lib/                # Utilities, DB, auth
│   └── public/                 # PWA assets
└── docs/                       # Research documents
```

---

## Environment Variables

See [.env.example](.env.example) for the full list. Key variables:

| Variable | Required | Description |
|----------|:---:|-------------|
| `DOMAIN` | Yes | Your domain (e.g., baupreis.ai) |
| `DB_USER` / `DB_PASSWORD` | Yes | PostgreSQL credentials |
| `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Yes | Clerk auth keys |
| `ANTHROPIC_API_KEY` | No* | Claude AI (falls back to synthetic) |
| `METALS_DEV_API_KEY` | No* | Real metal prices (falls back to synthetic) |
| `CRON_SECRET` | Yes | Auth for background jobs |
| `STRIPE_SECRET_KEY` | No* | Billing (skip for demo) |

*App works without these using synthetic data/fallbacks.

---

## Cron Jobs

| Job | Schedule | Endpoint |
|-----|----------|----------|
| Collect prices | Every 6h | `POST /api/cron/collect-prices` |
| AI analysis | Every 12h | `POST /api/cron/analyze` |
| Send alerts | Every 1h | `POST /api/cron/send-alerts` |
| Generate reports | Daily 6:00 | `POST /api/cron/generate-reports` |
| Health check | Every 5min | `POST /api/cron/health` |
| BauPreis Index | Daily 7:00 | `POST /api/index/calculate` |

All cron endpoints require `Authorization: Bearer $CRON_SECRET` header.

---

## API (Team Plan)

```bash
# Get API key from Settings > API
curl -H "Authorization: Bearer bp_live_..." https://baupreis.ai/api/v1/prices
curl -H "Authorization: Bearer bp_live_..." https://baupreis.ai/api/v1/analysis
curl -H "Authorization: Bearer bp_live_..." https://baupreis.ai/api/v1/materials
```

Rate limit: 100 requests/minute per organization.

---

## License

Proprietary. All rights reserved.

---

## Contact

BauPreis AI — [baupreis.ai](https://baupreis.ai)
