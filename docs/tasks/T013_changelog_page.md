# T013 — Changelog Page: Журнал изменений (Neuigkeiten)

**Дата:** 2026-03-27
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #3 Erik Zimmermann — Frontend Engineer
**Размер:** M

---

## Идея

Публичная страница `/changelog` (или `/neuigkeiten`) — хронологический журнал обновлений.
Пользователи видят что нового: фичи, улучшения, фиксы, дизайн-изменения.

**Зачем:**
- Прозрачность: пользователи видят что продукт развивается
- SEO: свежий контент, ключевые слова
- Доверие: B2B клиенты ценят changelog (стандарт SaaS)
- Маркетинг: каждое обновление = повод вернуться

---

## Структура страницы

```
[UnifiedHeader — автоматически из root layout]

[Hero: "NEUIGKEITEN" — тёмный фон, Bauhaus стиль]

[Timeline — записи от новых к старым]
  ┌──────────────────────────────────┐
  │ 27.03.2026           [NEU]      │
  │ BAUHAUS BOLD REDESIGN           │
  │ Vollständiger visueller Umbau   │
  │ der Plattform...                │
  └──────────────────────────────────┘
  ┌──────────────────────────────────┐
  │ 26.03.2026      [VERBESSERUNG]  │
  │ UNIFIED NAVIGATION              │
  │ Einheitliche Navigation...      │
  └──────────────────────────────────┘
  ...

[MarketingFooter — автоматически из (marketing) layout]
```

**Теги (badges):**

| Тег | Цвет | Значение |
|-----|------|---------|
| NEU | bg-brand-600 text-white | Новая фича |
| VERBESSERUNG | bg-[#F5C518] text-[#1A1A1A] | Улучшение |
| FIX | bg-[#BC8279] text-white | Исправление бага |
| DESIGN | bg-[#1A1A1A] text-white | Визуальное изменение |

---

## Файлы

### Новые:
1. `app/src/app/(marketing)/changelog/page.tsx` — metadata + ChangelogClient
2. `app/src/app/(marketing)/changelog/ChangelogClient.tsx` — UI
3. `app/src/changelog/entries.ts` — данные (массив записей)

### Изменяемые:
4. `app/src/i18n/de.ts` — ~15 ключей
5. `app/src/i18n/en.ts` — ~15 ключей
6. `app/src/components/marketing/MarketingFooter.tsx` — +1 link
7. `app/src/middleware.ts` — добавить `/changelog` в isPublic

---

## Roadmap (8 шагов)

1. Добавить `/changelog` в `isPublic` в middleware.ts
2. Создать `app/src/changelog/entries.ts` — 10-15 записей из DEVLOG
3. Создать `app/src/app/(marketing)/changelog/page.tsx` — metadata
4. Создать `app/src/app/(marketing)/changelog/ChangelogClient.tsx` — UI (hero + timeline cards)
5. Добавить i18n ключи в de.ts + en.ts
6. Добавить ссылку "Neuigkeiten" в MarketingFooter.tsx
7. `npm run build` → 0 errors
8. Проверить /changelog → 200, mobile readable

---

## Чеклист

- [ ] /changelog → страница с записями, не 404
- [ ] Hero: тёмный фон, "NEUIGKEITEN", Bauhaus стиль
- [ ] 10-15 записей из реальной истории проекта
- [ ] Теги: NEU / VERBESSERUNG / FIX / DESIGN с правильными цветами
- [ ] Footer: ссылка "Neuigkeiten" видна
- [ ] Middleware: /changelog в public routes
- [ ] i18n: de + en ключи
- [ ] Mobile 375px: readable
- [ ] `npm run build` → 0 errors
