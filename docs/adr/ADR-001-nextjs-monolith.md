# ADR-001: Next.js 14 монолит вместо отдельного backend

**Дата:** 2025-12 (ретроспективно)
**Статус:** accepted
**Автор:** #1 Product Architect (ретроспективно)

## Контекст

Нужна архитектура для B2B SaaS мониторинга цен. Варианты: отдельный backend (NestJS/Express) + frontend, или Next.js App Router как full-stack монолит.

## Варианты

1. **NestJS backend + Next.js frontend** — классическое разделение, больше boilerplate, два деплоя
2. **Next.js 14 App Router монолит** — API routes + SSR + ISR в одном приложении, один Docker контейнер

## Решение

Выбран вариант 2: Next.js 14 монолит. Причины:
- Один деплой (docker-compose: app + postgres)
- API routes покрывают все нужды (46 routes)
- SSR/ISR для SEO и производительности
- Меньше инфраструктурной сложности для стартапа

## Последствия

- (+) Простой деплой, быстрая итерация
- (+) Shared types между API и UI
- (-) Масштабирование ограничено вертикально
- (-) Cron jobs через system crontab, не через backend framework
