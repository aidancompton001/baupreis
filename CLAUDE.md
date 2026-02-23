# BauPreis AI SaaS — Project Guidelines

## Project Overview
SaaS-сервис мониторинга цен на стройматериалы в Германии с AI-прогнозами.
Multi-tenant, 3 тарифа: Basis (49), Pro (149), Team (299 EUR/мес).


## Tech Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Auth:** Clerk (Google OAuth + Email)
- **Billing:** Paddle (Merchant of Record, subscriptions, 3 plans)
- **Database:** PostgreSQL 16 (multi-tenant)
- **AI:** Claude API (Sonnet 4.5) for analysis, forecasts, reports
- **Background Jobs:** Next.js API routes (`/api/cron/*`) + system crontab (6 jobs: data collector, AI analyzer, alerts, reports, health, index)
- **Reverse Proxy:** Caddy (auto SSL)
- **Hosting:** Hetzner Cloud CX32 (Nuremberg, GDPR)
- **Email:** Resend.com
- **PWA:** manifest.json + Service Worker

## Architecture Principles
- Data (materials, prices, analysis) is SHARED across all tenants
- Settings (alert_rules, reports, telegram) are PER-ORG (per organization)
- Auth via Clerk webhooks -> auto-create org + user on registration
- Billing via Paddle webhooks -> update org plan + feature flags
- Feature gating: check org.plan before allowing access to Pro/Team features

## Key Conventions
- **Language:** ALL user-facing text (landing, dashboard, emails) is in GERMAN (Deutsch)
- **Code:** TypeScript strict mode, English variable/function names
- **Styling:** Tailwind CSS + shadcn/ui components, mobile-first responsive
- **Database:** Use parameterized queries ($1, $2...) — NO string interpolation in SQL
- **API routes:** Always call `requireOrg()` to verify auth + active subscription
- **Plan checks:** Use `canAccess(org, feature)` before showing Pro/Team features

## Folder Structure
```
/                           # Project root
├── CLAUDE.md               # This file — project guidelines
├── docker-compose.yml      # All services: postgres, app (Caddy external)
├── .env.example            # Environment variables template
├── init.sql                # Database schema + seed data
├── app/                    # Next.js application
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.js
│   ├── public/             # Static assets, PWA icons, manifest
│   └── src/
│       ├── middleware.ts    # Clerk auth middleware
│       ├── app/            # App Router pages
│       │   ├── layout.tsx  # Root layout (ClerkProvider)
│       │   ├── page.tsx    # Landing page (public)
│       │   ├── (auth)/     # Sign-in, sign-up
│       │   ├── onboarding/ # Post-registration flow
│       │   ├── (marketing)/ # Public SEO pages
│       │   ├── (dashboard)/ # Protected dashboard area
│       │   └── api/        # API routes
│       ├── components/     # React components
│       │   ├── marketing/  # Landing page components
│       │   ├── dashboard/  # Dashboard components
│       │   ├── layout/     # Sidebar, nav
│       │   └── ui/         # shadcn/ui base components
│       └── lib/            # Utilities and helpers
│           ├── db.ts       # PostgreSQL connection pool
│           ├── auth.ts     # Clerk helpers + org resolver
│           ├── paddle.ts   # Paddle helpers
│           ├── plans.ts    # Plan limits & feature checks
│           └── utils.ts    # Formatters, helpers
```

## Multi-tenant Data Model
- `organizations` — tenants with plan, Paddle IDs, feature flags
- `users` — linked to org via org_id, linked to Clerk via clerk_user_id
- `materials` — SHARED catalog (16 materials)
- `prices` — SHARED price data from APIs
- `analysis` — SHARED AI analysis results
- `org_materials` — PER-ORG material selection (Basis: 5 max)
- `alert_rules` — PER-ORG alert configuration
- `alerts_sent` — PER-ORG alert history
- `reports` — PER-ORG report archive

## Plan Limits
| Feature         | Trial/Basis | Pro    | Team    |
|-----------------|-------------|--------|---------|
| Materials       | 5           | All    | All     |
| Users           | 1           | 1      | 5       |
| Alerts          | 3           | Unlimited | Unlimited |
| Telegram        | No          | Yes    | Yes     |
| AI Forecast     | No          | Yes    | Yes     |
| API Access      | No          | No     | Yes     |
| PDF Reports     | No          | No     | Yes     |

## Development Workflow
1. Always check CLAUDE.md before starting work
2. Follow the phase checklist in the master document (section 20)
3. All UI text in German, code comments/variables in English
4. Test plan-based feature gating for each new feature
5. Ensure mobile responsiveness for all pages

## Reference
Full documentation: `BauPreis_AI_SaaS_Claude_Code_Guide.md`
