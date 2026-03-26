# T014 — Dashboard Overview: Большой график + табы материалов

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap готов, ждёт ОК
**Ответственный:** #2 Lena Hoffmann (UX/UI) + #3 Maximilian Braun (Frontend)
**Размер:** L
**Скилл:** `ui-ux-pro-max`

---

## Цель

1. Заменить чёрную плашку BauPreis Index на **большой bar chart** (столбиками, Bauhaus стиль)
2. Материалы по категориям — вынести в **отдельную вкладку** "Materialien"
3. Overview = график + жёлтые KPI-блоки (top materials)

---

## Что БЫЛО (текущее)

```
/dashboard (Overview)
├── Заголовок + CSV Export
├── Чёрная плашка BauPreis Index (944,43 / -5.11% / +5.22%)
├── Жёлтые KPI-блоки (4 шт: steel %, steel €, wood %, wood €)
└── Все материалы по категориям (steel, metal, concrete, wood, insulation, energy)
    └── Карточки с ценами, трендами, рекомендациями
```

## Что СТАНЕТ

```
/dashboard (Overview) — ВКЛАДКА 1
├── Заголовок + CSV Export
├── ██ БОЛЬШОЙ ГРАФИК BauPreis Index (bar chart, 30 дней) ██
│   ├── Столбики: красные (рост) / жёлтые (падение)
│   ├── Ось X: даты (dd.MM)
│   ├── Ось Y: значение индекса
│   ├── Текущее значение + % изменения в хедере графика
│   └── Переключатель: 7 Tage / 30 Tage
├── Жёлтые KPI-блоки (top materials) — остаются как есть
└── (материалов НЕТ — они теперь на вкладке Materialien)

/dashboard/materialien — ВКЛАДКА 2 (НОВАЯ)
├── Все материалы по категориям (steel, metal, concrete, wood, insulation, energy)
└── Карточки с ценами, трендами, рекомендациями (перенесены из Overview)
```

---

## Данные для графика

API уже готов: `GET /api/index?days=30` возвращает:
```json
[
  { "date": "2026-03-26", "index_value": 944.43, "change_pct_1d": 5.22, "change_pct_30d": -5.11 },
  { "date": "2026-03-25", "index_value": 897.56, "change_pct_1d": -3.66, "change_pct_30d": -9.82 },
  ...
]
```
**30 точек данных** — по одной на день. Достаточно для bar chart.

**Библиотека:** Recharts `^2.12` (уже в package.json).

---

## Визуальные критерии графика

| Параметр | Значение |
|----------|---------|
| Тип | `<BarChart>` (Recharts) — столбики |
| Высота | 400px desktop, 280px mobile |
| Столбики | Красный `#C1292E` если рост (change_pct_1d > 0), Жёлтый `#F5C518` если падение |
| Контейнер | border-2 border-[#1A1A1A], shadow-[6px_6px_0_#C1292E], bg-white |
| Хедер графика | "BAUPREIS INDEX" + текущее значение (большое, Oswald) + % 30d |
| Ось X | Даты dd.MM (Space Grotesk, 10px, gray-500) |
| Ось Y | Значение индекса (Space Grotesk, 10px, gray-500) |
| Grid | Горизонтальные линии, stroke="#E5E7EB" |
| Tooltip | Значение + дата + change_pct_1d |
| Переключатель | "7 TAGE" / "30 TAGE" — кнопки в хедере графика |
| Шрифт | Oswald для значений, Space Grotesk для labels |
| Rounded | rounded-none (Bauhaus стиль) |

---

## Новая вкладка "Materialien"

**В DashboardSubNav.tsx** — добавить между "Overview" и "AI Forecasts":

```
OVERVIEW | MATERIALIEN | AI FORECASTS | AI CHAT | ...
```

| Параметр | Значение |
|----------|---------|
| href | `/dashboard/materialien` |
| labelKey | `"nav.materials"` |
| icon | Существующий CategoryIcon или новый |
| Позиция | Вторая вкладка (после Overview) |

---

## Файлы затронуты

### Новые файлы (создать)

| Файл | Назначение |
|------|-----------|
| `app/src/components/dashboard/IndexChart.tsx` | Recharts BarChart для BauPreis Index |
| `app/src/app/(dashboard)/dashboard/materialien/page.tsx` | Новая страница материалов |

### Изменяемые файлы

| Файл | Что меняется |
|------|-------------|
| `app/src/app/(dashboard)/dashboard/page.tsx` | Удалить чёрную плашку → вставить IndexChart. Удалить блок материалов по категориям |
| `app/src/components/layout/DashboardSubNav.tsx` | Добавить вкладку "Materialien" |
| `app/src/i18n/de.ts` | Добавить `"nav.materials": "Materialien"` |
| `app/src/i18n/en.ts` | Добавить `"nav.materials": "Materials"` |
| `app/src/i18n/ru.ts` | Добавить `"nav.materials": "Материалы"` |

### НЕ затронуты

- API routes (данные уже есть)
- Database schema
- Landing page
- Другие dashboard pages
- CSS/globals.css
- BauhausIcons (переиспользуем CategoryIcon)

---

## Что может сломаться

| Риск | Вероятность | Mitigation |
|------|------------|-----------|
| Recharts SSR: `window is not defined` | Высокая | `"use client"` + dynamic import с `ssr: false` |
| index API возвращает string (pg numeric) | Средняя | `Number()` конвертация (как T012) |
| WelcomeTour ссылается на `data-tour="baupreis-index"` | Средняя | Сохранить data-tour на новом графике |
| DashboardSubNav overflow на mobile с новой вкладкой | Низкая | Уже `overflow-x-auto scrollbar-hide` |
| `/dashboard/materialien` routing | Низкая | Next.js App Router — просто создать папку |

---

## Breakpoints

| Breakpoint | Поведение |
|-----------|-----------|
| **Mobile 375px** | График h=280px, 1 столбик = тонкий (4px), labels каждый 5й день |
| **Tablet 768px** | График h=350px, labels каждый 3й день |
| **Desktop 1440px** | График h=400px, все labels видны |
| **KPI блоки** | 2 col mobile, 4 col desktop — без изменений |
| **Materialien** | 1 col mobile, 2-3-4 col desktop — как было в Overview |

---

## Навигация, JS, анимации

- **Навигация:** DashboardSubNav — новая вкладка "Materialien" (между Overview и AI Forecasts)
- **JS:** Recharts bundle ~40KB (уже в package.json, tree-shaking)
- **Анимации:** Recharts встроенные + `dash-appear` на контейнере
- **Якоря:** `data-tour="baupreis-index"` сохраняется на графике

---

## Roadmap

### Phase 1 — IndexChart компонент
1. Создать `app/src/components/dashboard/IndexChart.tsx` — Recharts BarChart
2. Props: `data` (index history), `period` (7/30)
3. Переключатель 7d/30d внутри компонента

### Phase 2 — Обновить Overview
4. В `dashboard/page.tsx`: fetch `/api/index?days=30` (вместо `?days=1`)
5. Заменить чёрную плашку (строки 140-176) на `<IndexChart>`
6. Удалить блок материалов по категориям (строки 202-304)
7. Оставить: заголовок, KPI-блоки, пустое состояние

### Phase 3 — Новая вкладка Materialien
8. Создать `app/src/app/(dashboard)/dashboard/materialien/page.tsx`
9. Перенести в него логику материалов из Overview (группировка + карточки)
10. Добавить в DashboardSubNav новый пункт "Materialien"
11. Добавить i18n ключ `nav.materials` в de/en/ru

### Phase 4 — Verify
12. `npm run build` → 0 errors
13. Проверить desktop (1440) + mobile (375)

---

## Чеклист приёмки

- [ ] График BauPreis Index показывает 30 столбиков (по дням)
- [ ] Красные столбики = рост, жёлтые = падение
- [ ] Текущее значение индекса в хедере графика
- [ ] Переключатель 7 Tage / 30 Tage работает
- [ ] Tooltip показывает дату + значение + change %
- [ ] Жёлтые KPI-блоки под графиком — работают
- [ ] Вкладка "Materialien" в субнаве
- [ ] `/dashboard/materialien` показывает все материалы по категориям
- [ ] WelcomeTour не сломан (data-tour сохранён)
- [ ] Responsive: 375 / 768 / 1440
- [ ] `npm run build` → 0 errors
