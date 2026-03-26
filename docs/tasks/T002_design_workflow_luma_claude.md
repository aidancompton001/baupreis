# T002 — Дизайн-воркфлоу: Luma Brand Identity → Claude Code → Production UI

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #2 Lena Hoffmann — UX/UI Engineer
**Координация:** #1 Markus Lehmann — PA
**Скилл:** ui-ux-pro-max
**Размер:** L

---

## Контекст задачи

**Вопрос CEO:** Как сделать крутой дизайн БЕЗ Figma? Есть brand identity в Luma Labs.

**Luma Labs** — AI-платформа для генерации изображений/видео. CEO создал доску с brand identity:
`https://app.lumalabs.ai/board/74dcba45-06e6-4d17-b9c9-8f4725db333b`

**Доска требует авторизации** — Claude Code не может прочитать её напрямую.

---

## Анализ: Текущее состояние дизайна

### Что ЕСТЬ сейчас

| Элемент | Текущее значение |
|---------|-----------------|
| Шрифт | Inter (Google Fonts) |
| Brand color | brand-600 `#2563eb` (синий) + indigo-600 `#4F46E5` |
| Фон | Белый → light slate gradient |
| Стиль | Glassmorphism (backdrop-blur, white/80) |
| Компоненты | shadcn/ui + Tailwind CSS |
| Анимации | fadeInUp, fadeInLeft, fadeInRight, scroll-triggered |
| Landing | 12K+ строк, Hero + Features + Pricing + FAQ |
| Dashboard | Sidebar (w-64) + glassmorphic cards + Recharts |
| Страниц | 52 pages, 46 API routes |

### Что НУЖНО от CEO

**Из Luma-доски необходимо извлечь:**
1. Цветовая палитра (primary, secondary, accent)
2. Стиль логотипа (если есть)
3. Мудборд / визуальное направление
4. Типографические предпочтения (если есть)

---

## 3 варианта воркфлоу (БЕЗ Figma)

### Вариант A: Screenshot → Claude Code (РЕКОМЕНДУЕМЫЙ)

```
CEO экспортирует из Luma (PNG/JPG)
    → Кидает скриншоты в папку design/
    → Claude Code анализирует изображения
    → Извлекает: цвета, стиль, композицию
    → Генерирует design tokens (tailwind.config.ts)
    → Применяет к компонентам
```

| + Плюсы | - Минусы |
|---------|---------|
| Zero cost | Менее структурированно чем Figma |
| Zero setup | Ручной экспорт из Luma |
| Claude Code умеет анализировать изображения | Нет обратной синхронизации |
| Работает прямо сейчас | — |

### Вариант B: Luma → Design Tokens JSON → Claude Code

```
CEO экспортирует из Luma
    → Вручную описывает: "Primary: синий, Accent: оранжевый..."
    → Claude Code создаёт design-system/MASTER.md
    → Генерирует tailwind.config.ts + globals.css
    → Применяет к всем 52 страницам
```

| + Плюсы | - Минусы |
|---------|---------|
| Структурированные токены | Требует ручного описания от CEO |
| Переиспользуемые | Нет визуального референса |
| Git-tracked | — |

### Вариант C: Luma + Figma MCP (гибрид)

```
CEO экспортирует из Luma → импортирует в Figma (Free)
    → Подключает Figma MCP к Claude Code
    → Claude Code читает из Figma → генерирует код
```

| + Плюсы | - Минусы |
|---------|---------|
| Двусторонняя синхронизация | Требует Figma-аккаунт |
| Структурированные данные | Лишний шаг (Luma → Figma) |
| Профессиональный pipeline | Сложнее настроить |

---

## Рекомендация

**Вариант A (Screenshot → Claude Code)** — самый быстрый и бесплатный.

**Почему:**
1. Claude Code (Opus 4.6) — мультимодальная модель, отлично анализирует изображения
2. Наш стек (shadcn/ui + Tailwind) позволяет менять дизайн через tokens без переписывания кода
3. Zero cost, zero setup — можно начать через 5 минут
4. Если результат хороший → масштабируем. Если нет → переходим на Вариант C.

---

## Файлы которые будут затронуты (при реализации)

| Файл | Что изменится |
|------|--------------|
| `app/tailwind.config.ts` | Brand colors, шрифты, spacing |
| `app/src/app/globals.css` | CSS variables, анимации, glassmorphism параметры |
| `app/src/app/layout.tsx` | Font import (Inter → новый шрифт если нужен) |
| `app/src/app/page.tsx` | Landing page — цвета, градиенты, стиль |
| `app/src/app/(dashboard)/layout.tsx` | Dashboard layout — sidebar, header |
| `app/src/components/layout/DashboardNav.tsx` | Навигация — цвета active/inactive |
| `app/src/components/marketing/MarketingHeader.tsx` | Header — цвета, стиль |
| `app/src/components/marketing/MarketingFooter.tsx` | Footer — цвета |
| `app/src/components/dashboard/*.tsx` | Все dashboard компоненты — card стили |
| Все 52 страницы | Если меняются base tokens — автоматически через Tailwind |

### Что может сломаться

| Риск | Вероятность | Митигация |
|------|------------|-----------|
| Контраст текста < 4.5:1 | Средняя | WCAG проверка после каждого изменения |
| Glassmorphism не работает с новыми цветами | Низкая | Тест на всех breakpoints |
| Landing page layout сломается | Низкая | Изменения через tokens, не через хардкод |
| Dashboard карточки нечитаемы | Средняя | A/B тест старый vs новый стиль |
| Анимации конфликтуют с новым стилем | Низкая | Проверка prefers-reduced-motion |

### Breakpoints

| Breakpoint | Что проверить |
|-----------|--------------|
| 375px (mobile) | Sidebar скрыт, bottom nav, карточки stack vertically |
| 768px (tablet) | Sidebar появляется, grid 2 колонки |
| 1440px (desktop) | Full layout, все виджеты видны |

### Якоря, навигация, JS, анимации

- **Якоря:** Landing page scrolling sections — НЕ затронуты (id-based)
- **Навигация:** Sidebar + header — ЗАТРОНУТЫ (цвета active/inactive)
- **JS:** Intersection Observer анимации — НЕ затронуты (логика та же)
- **Анимации:** fadeIn* — могут потребовать корректировки под новый стиль

### Тесты

| Тест | Тип | Что проверить |
|------|-----|--------------|
| Контраст WCAG AA | Manual | Все тексты 4.5:1+ |
| Responsive layout | E2E | 375 / 768 / 1440 |
| Dark/light elements | Visual | Glassmorphism читаемость |
| Landing page render | E2E | Все секции загружаются |
| Dashboard navigation | E2E | Active states видны |

---

## Roadmap

### Phase 1: Получение brand identity от CEO (5 мин)

1. CEO экспортирует из Luma-доски все ассеты как PNG/JPG
2. CEO кидает файлы в папку `design/brand/` (создадим)
3. CEO текстом описывает: "хочу такие цвета, такой стиль, такое настроение"

### Phase 2: Анализ и Design System (30 мин)

4. Claude Code анализирует скриншоты из `design/brand/`
5. Извлекает: цветовую палитру, стиль, композицию, настроение
6. Генерирует `design-system/MASTER.md` (ui-ux-pro-max --persist)
7. CEO ревьюит MASTER.md → ОК / правки

### Phase 3: Design Tokens → Код (1-2 часа)

8. Обновить `tailwind.config.ts` — новые brand colors
9. Обновить `globals.css` — CSS variables, glassmorphism параметры
10. Обновить `layout.tsx` — шрифт (если меняется)
11. Build check: `npm run build` → 0 errors

### Phase 4: Landing Page Redesign (2-3 часа)

12. Применить новый стиль к `page.tsx` — Hero section
13. Применить ко всем секциям Landing page
14. Применить к MarketingHeader + MarketingFooter
15. Responsive check: 375 / 768 / 1440
16. WCAG контраст check

### Phase 5: Dashboard Redesign (2-3 часа)

17. Обновить Dashboard layout + sidebar
18. Обновить DashboardNav (active/inactive states)
19. Обновить все dashboard компоненты (cards, badges, banners)
20. Responsive check dashboard
21. Build + smoke test

### Phase 6: Верификация (1 час)

22. E2E тесты: landing + dashboard + navigation
23. WCAG AA audit (contrast, focus states)
24. Performance: Lighthouse score ≥ 90
25. Visual regression: скриншоты before/after
26. CEO финальный ревью

---

## Чеклист приёмки

- [ ] Brand identity из Luma получена и проанализирована
- [ ] Design System MASTER.md создан и одобрен CEO
- [ ] tailwind.config.ts обновлён (новые цвета)
- [ ] globals.css обновлён (CSS variables)
- [ ] Landing page — новый стиль применён
- [ ] Dashboard — новый стиль применён
- [ ] Responsive: 375 / 768 / 1440 — layout не ломается
- [ ] WCAG AA: контраст 4.5:1+ на всех текстах
- [ ] `npm run build` → 0 errors
- [ ] CEO одобрил финальный результат

---

## Landa Review Notes

**Учтено из предыдущего Landa Report:**
- Figma-аккаунт НЕ требуется для Варианта A
- Token cost минимален (скриншоты = 1 запрос на анализ)
- shadcn/ui совместимость обеспечена через Tailwind tokens (не хардкод)
