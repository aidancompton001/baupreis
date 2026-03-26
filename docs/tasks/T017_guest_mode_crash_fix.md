# T017 — Guest Mode Crash + Trial Days + Logo Fix

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap готов, ждёт ОК
**Ответственный:** #3 Maximilian Braun — Frontend
**Размер:** S
**Скилл:** `systematic-debugging`

---

## Баги (3 штуки)

### БАГ 1: "Application error: client-side exception" при навигации

**Корень:** `UnifiedHeader.tsx:28-30` — **React Rules of Hooks violation.**

```tsx
// СТРОКА 28: conditional return BEFORE hooks
if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;
// СТРОКА 30: hook AFTER conditional return
const isLoggedIn = useIsLoggedIn();
```

Когда guest на `/dashboard` нажимает "Sign In" → client-side navigation к `/sign-in` → `pathname` меняется → early return → `useIsLoggedIn()` hook не вызывается → React detects hooks order change → **CRASH**.

**Фикс:** Переместить ВСЕ hooks ПЕРЕД conditional return.

### БАГ 2: Trial = "7 Tage" вместо "14 Tage"

**Корень:** `guest.register` в i18n de/en/ru = "7 Tage/days/дней".

**Фикс:** Заменить на 14 во всех 3 файлах.

### БАГ 3: Мобильный logo не ведёт на главную

**Корень:** Logo link `<Link href="/">` в `UnifiedHeader.tsx:50` — это **работает**, но если crash (БАГ 1) происходит при любой навигации, то и logo click тоже crashит. **Фикс БАГ 1 исправит и это.**

---

## Файлы затронуты

| Файл | Что менять |
|------|-----------|
| `app/src/components/layout/UnifiedHeader.tsx` | Hooks перед conditional return |
| `app/src/i18n/de.ts` | `guest.register`: 7 → 14 |
| `app/src/i18n/en.ts` | `guest.register`: 7 → 14 |
| `app/src/i18n/ru.ts` | `guest.register`: 7 → 14 |

---

## Roadmap

1. В `UnifiedHeader.tsx`: переместить `useIsLoggedIn()` ПЕРЕД conditional return
2. В de/en/ru.ts: `guest.register` → "14 Tage" / "14 days" / "14 дней"
3. `npm run build` → 0 errors
4. Деплой + проверка: incognito → /dashboard → Sign In → нет crash

---

## Чеклист приёмки

- [ ] Guest на /dashboard → нажимает Sign In → переходит на /sign-in БЕЗ crash
- [ ] Guest overlay показывает "14 Tage" (не 7)
- [ ] Logo на мобильном ведёт на главную
- [ ] `npm run build` → 0 errors
