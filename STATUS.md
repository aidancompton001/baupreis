# STATUS.md — BauPreis AI SaaS

**Обновлён:** 2026-03-27
**Сессия:** S044 (T020: Fix 0.00% Price Change Bug)
**Методология:** V8.0 (TEAM V8.0, Landa Review обязателен)

## Текущий этап

Production (Phases 1-6 complete). API-Datenquellen vollstaendig dokumentiert.

## Команда (V8.0)

8 специалистов: #1 Thomas Richter PA, #2 Katarina Weiß UX, #3 Erik Zimmermann FE, #5 Stefan Hartmann BE, #6 Dirk Schneider SRE, #7 Petra Vogel QA, #8 Michael Berger CoS, #14 Hans Landa II

## Последние выполненные задачи

- [x] S043: T019 API-Datenquellen — 16 материалов, 4 платформы, credentials маппинг, Landa Review
- [x] S042: T012 Infographic Placement — 3 инфографики на Landing
- [x] S041: T018 Material Chart SMA-7 + UX
- [x] S035: T012 Dashboard toFixed crash fix

## Следующие задачи (приоритет)

1. [ ] Tankerkoenig: зарегистрировать API-Key, добавить в Server .env (Diesel inaktiv)
2. [ ] data-sources.ts:116 — исправить комментарий EUR/m² → EUR/m³
3. [ ] Destatis credentials убрать из Server .env (Hygiene)
4. [ ] Stripe: переход из test mode в production
5. [ ] Anthropic API: пополнить баланс

## Блокеры

- Diesel: нет TANKERKOENIG_API_KEY на сервере (15/16 материалов активны)
- Anthropic API: низкий баланс
- Stripe: всё ещё test mode
