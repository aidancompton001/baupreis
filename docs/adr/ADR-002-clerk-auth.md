# ADR-002: Clerk для аутентификации

**Дата:** 2025-12 (ретроспективно)
**Статус:** accepted
**Автор:** #4 Backend Engineer (ретроспективно)

## Контекст

Нужна аутентификация с Google OAuth, email sign-in, multi-tenant (organizations). Варианты: self-hosted (NextAuth/Lucia), managed (Clerk/Auth0/Supabase Auth).

## Варианты

1. **NextAuth.js** — self-hosted, бесплатно, но нет встроенных organizations
2. **Clerk** — managed, organizations из коробки, webhooks для sync, Google OAuth за минуты
3. **Auth0** — enterprise, дороже, сложнее настройка

## Решение

Выбран Clerk. Причины:
- Organizations (multi-tenant) из коробки
- Webhook sync: user created → auto-create org + user в PostgreSQL
- Google OAuth + email за 10 минут настройки
- Free tier достаточен для MVP

## Последствия

- (+) Быстрый старт, production-ready auth за часы
- (+) `requireOrg()` middleware для защиты API routes
- (-) Vendor lock-in (миграция потребует переписать auth flow)
- (-) Clerk outage = auth недоступен (риск #8 в реестре)
