# STATUS.md — BauPreis AI SaaS

**Обновлён:** 2026-03-27
**Сессия:** S045 (T021: Notification Bell im Header)
**Методология:** V8.0 (TEAM V8.0, Landa Review обязателен)

## Текущий этап

Production (Phases 1-6 complete). Notification Bell реализован, ожидает деплой.

## Команда (V8.0)

8 специалистов: #1 Thomas Richter PA, #2 Katarina Weiß UX, #3 Erik Zimmermann FE, #5 Stefan Hartmann BE, #6 Dirk Schneider SRE, #7 Petra Vogel QA, #8 Michael Berger CoS, #14 Hans Landa II

## Последние выполненные задачи

- [x] S045: T021 Notification Bell — колокольчик в header, badge, dropdown, API, migration
- [x] S044: T020 Fix 0.00% Price Change — серверный расчёт change_pct
- [x] S043: T019 API-Datenquellen — 16 материалов, 4 платформы
- [x] S042: T012 Infographic Placement

## Следующие задачи (приоритет)

1. [ ] **ДЕПЛОЙ T021**: git push + docker build + migration 006 на сервере
2. [ ] Tankerkoenig API-Key регистрировать (Diesel inaktiv)
3. [ ] data-sources.ts:116 — комментарий EUR/m² → EUR/m³
4. [ ] Stripe: test → production
5. [ ] Anthropic API: пополнить баланс

## Блокеры

- T021 деплой: миграция 006 на сервере (manual psql)
- Diesel: нет TANKERKOENIG_API_KEY (15/16 материалов)
- Anthropic API: низкий баланс
- Stripe: test mode
