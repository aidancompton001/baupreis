# T016 — Dashboard Guest Preview (просмотр без регистрации)

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap готов, ждёт ОК
**Ответственный:** #3 Maximilian Braun (Frontend) + #5 Andreas Keller (Backend)
**Размер:** M
**Скилл:** `brainstorming`

---

## Цель

Незарегистрированные пользователи могут заходить на dashboard-страницы и видеть layout, но контент заблокирован overlay с призывом зарегистрироваться. Вместо redirect на /sign-in — preview mode.

---

## Что БЫЛО

- Middleware `middleware.ts:65-72`: если нет `baupreis_session` cookie → redirect на `/sign-in`
- Незарегистрированный пользователь **не видит dashboard вообще**
- Marketing pages (/, /preise, /kontakt, /ueber-uns) — доступны

## Что СТАНЕТ

- Middleware: dashboard routes (`/dashboard/*`, `/alerts`, `/chat`, etc.) — **пропускает** без cookie
- Dashboard layout: определяет guest mode → показывает **GuestOverlay** поверх контента
- GuestOverlay: полупрозрачный overlay с blur, CTA "Jetzt registrieren"
- API routes: **НЕ МЕНЯЮТСЯ** — возвращают 403 без сессии (уже так)
- Dashboard pages: показывают skeleton/mock данные для гостей, real данные для auth users

---

## Архитектура

```
Guest заходит на /dashboard
  → middleware: пропускает (нет redirect)
  → layout.tsx: проверяет cookie → guest mode
  → page.tsx: fetch /api/analysis → 403 (нет сессии)
  → показывает mock/skeleton + GuestOverlay
```

### GuestOverlay компонент

```
┌──────────────────────────────────────────┐
│  (blur backdrop, opacity 80%)            │
│                                          │
│     🔒 DASHBOARD PREVIEW                 │
│                                          │
│     Registrieren Sie sich, um            │
│     Echtzeit-Preisdaten zu sehen         │
│                                          │
│     [KOSTENLOS TESTEN — 7 TAGE]          │
│     [ANMELDEN]                           │
│                                          │
└──────────────────────────────────────────┘
```

- `position: fixed`, `inset: 0`, `z-index: 50`
- `backdrop-filter: blur(8px)`, `bg-white/80`
- Bauhaus стиль: border-2 card, Oswald heading, shadow buttons
- Появляется **только** если нет `baupreis_session` cookie

---

## Файлы затронуты

### Новые файлы

| Файл | Назначение |
|------|-----------|
| `app/src/components/dashboard/GuestOverlay.tsx` | Overlay с CTA для гостей |

### Изменяемые файлы

| Файл | Что меняется |
|------|-------------|
| `app/src/middleware.ts` | Добавить dashboard routes в public (пропускать без redirect) |
| `app/src/app/(dashboard)/layout.tsx` | Определить guest mode → показать GuestOverlay |
| `app/src/app/(dashboard)/dashboard/page.tsx` | Обработать 403 от API (показать mock данные) |

### НЕ затронуты

- API routes (уже возвращают 403 без сессии)
- Marketing pages
- Auth flow (/sign-in, /sign-up)
- Database, cron jobs
- i18n (добавить 3 ключа)

---

## Что может сломаться

| Риск | Вероятность | Mitigation |
|------|------------|-----------|
| API вызовы от guest → 403 → error в console | Высокая | Catch 403 gracefully, показать mock |
| WelcomeTour для guest пользователя | Средняя | Скрыть WelcomeTour если guest |
| TrialBanner для guest | Средняя | Скрыть TrialBanner если guest |
| SEO: dashboard индексируется | Низкая | `robots: noindex` уже стоит в layout |
| Security: guest видит реальные данные | Невозможно | API блокирует, mock данные = static |

---

## Breakpoints

GuestOverlay: responsive, центрируется на всех breakpoints. Card внутри: max-w-md.

---

## Навигация, JS, анимации

- **Навигация:** SubNav видна для guest (все вкладки кликабельны, overlay на каждой)
- **JS:** Cookie check на клиенте (`document.cookie`)
- **Анимации:** GuestOverlay fade-in

---

## Roadmap

1. Создать `GuestOverlay.tsx` — overlay с CTA (Bauhaus стиль)
2. В `middleware.ts`: добавить dashboard routes в public list
3. В `layout.tsx`: cookie check → условно показать GuestOverlay + скрыть TrialBanner/WelcomeTour
4. В `dashboard/page.tsx`: graceful 403 handling → mock/skeleton
5. Добавить i18n ключи (de/en/ru) для guest overlay текстов
6. `npm run build` → 0 errors
7. Проверить guest flow: открыть incognito → /dashboard → видно overlay

---

## Чеклист приёмки

- [ ] Незарегистрированный пользователь может зайти на /dashboard
- [ ] Видит layout + overlay с blur и CTA
- [ ] Кнопка "Registrieren" ведёт на /sign-up
- [ ] Кнопка "Anmelden" ведёт на /sign-in
- [ ] SubNav видна и кликабельна
- [ ] API не отдаёт реальные данные гостю (403)
- [ ] TrialBanner и WelcomeTour скрыты для guest
- [ ] Зарегистрированный пользователь видит dashboard как раньше (без overlay)
- [ ] `npm run build` → 0 errors
