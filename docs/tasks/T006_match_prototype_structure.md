# T006 — Landing Page: Перенести СТРУКТУРУ из прототипа, не только цвета

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #2 Lena Hoffmann — UX/UI + #3 Maximilian Braun — Frontend
**Скилл:** ui-ux-pro-max
**Размер:** L
**Референс:** `design/prototypes/variant-2-bauhaus-bold.html`

---

## Проблема CEO

T004 сделал только color swap (indigo → red). Но НЕ перенёс структуру, layout, визуальные решения из прототипа. Результат = старый лендинг в красных цветах. CEO хочет чтобы сайт выглядел КАК ПРОТОТИП.

---

## Конкретные расхождения (факты)

### 1. Hero: Центр → 2 колонки

**БЫЛО (реализация):**
```
[         centered text          ]
[     BauPreis AI (big)          ]
[     tagline centered           ]
[     CTA buttons centered       ]
[     stats centered             ]
```

**ДОЛЖНО БЫТЬ (прототип):**
```
[  Text LEFT          |   Bauhaus composition RIGHT  ]
[  Badge              |   Big red circle (opacity)   ]
[  MATERIALPREISE.    |   Black dashboard card       ]
[  DIGITAL.           |     €7.915                   ]
[  Tagline            |     +2.3% BauPreis Index     ]
[  Subtitle           |     bar chart                ]
[  CTA buttons        |   Yellow square (rotated)    ]
[  Stats grid 4x1     |   Salmon rectangle           ]
```

**Файл:** `app/src/app/page.tsx` — Hero section
**Что менять:** `flex items-center justify-center text-center` → `grid lg:grid-cols-2 gap-16 items-center text-left`

### 2. Заголовок Hero

**БЫЛО:** `BauPreis AI` (как старый лендинг)
**ДОЛЖНО БЫТЬ:** `MATERIALPREISE. DIGITAL.` (bold Bauhaus typography, с жёлтыми точками)

### 3. Bauhaus-композиция (СПРАВА в hero)

**БЫЛО:** 4 невидимых div с opacity 0.04-0.15
**ДОЛЖНО БЫТЬ:** Видимая композиция:
- Большой красный полупрозрачный круг (фон)
- Чёрный прямоугольник = dashboard preview (€7.915, +2.3%, bar chart)
- Жёлтый квадрат (повёрнут 15°)
- Salmon прямоугольник
- Красный маленький круг

### 4. Логотип

**БЫЛО:** SVG chart icon в красном квадрате `<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>`
**ДОЛЖНО БЫТЬ:** Геометрический Bauhaus-логотип из Luma brand identity (красные квадраты с вырезами — как на скриншоте CEO)

**Файлы:** `page.tsx` (nav logo), `MarketingHeader.tsx`, `DashboardNav.tsx`, `(dashboard)/layout.tsx`

### 5. Длина лендинга: Убрать лишние секции

**БЫЛО (12+ секций):**
1. Hero
2. Problem (3 карточки)
3. Dashboard feature section + screenshot
4. Price Tracking feature section + screenshot
5. AI Analysis feature section + screenshot
6. AI Forecasts feature section + screenshot
7. AI Chat feature section + screenshot
8. Price Escalation + 2 screenshots
9. Alloy Calculator feature section + screenshot
10. Reports feature section + screenshot
11. Features Grid (6 карточек)
12. Tech Stack (4 карточки)
13. Pricing (3 плана)
14. FAQ (6 вопросов)
15. Footer

**ДОЛЖНО БЫТЬ (как прототип, 6 секций):**
1. Hero (2 колонки + Bauhaus-композиция)
2. Problem (3 карточки на чёрном фоне)
3. Dashboard mockup (browser frame + KPI + charts)
4. Pricing (3 плана)
5. FAQ (можно оставить, компактно)
6. Footer (с Bauhaus color bar)

**Секции 3-10 (7 feature sections + screenshots) — УБРАТЬ.** Это делало лендинг "длинющим".
**Секция 11 (Features Grid) — УБРАТЬ** (дублирует информацию).
**Секция 12 (Tech Stack) — УБРАТЬ** (не нужна на лендинге).

### 6. Dashboard mockup секция

**БЫЛО:** Нет (вместо этого 7 FeatureSection с реальными скриншотами)
**ДОЛЖНО БЫТЬ:** Один browser-frame mockup с dashboard:
- Titlebar (красный/жёлтый/зелёный dots + URL)
- 4 KPI cards (BauPreis Index, Stahl, Kupfer, Holz)
- Line chart (Stahlpreis 90d) + Bar chart (Top 5)

### 7. Footer

**БЫЛО:** Простой серый footer
**ДОЛЖНО БЫТЬ:** Чёрный footer + Bauhaus color bar (красный + жёлтый + salmon + чёрный)

---

## Файлы затронуты

| Файл | Что менять |
|------|-----------|
| `app/src/app/page.tsx` | ПОЛНАЯ переделка: hero 2-col, убрать 7 feature sections, добавить dashboard mockup, footer с color bar |
| `app/src/app/page.tsx` | Новый Bauhaus-логотип SVG |
| `app/src/components/marketing/MarketingHeader.tsx` | Новый логотип |
| `app/src/components/marketing/MarketingFooter.tsx` | Чёрный bg + color bar |
| `app/src/app/(dashboard)/layout.tsx` | Новый логотип |

### Что может сломаться

| Риск | Вероятность | Митигация |
|------|------------|-----------|
| SEO: удаление 7 feature sections убирает контент | Средняя | FAQ остаётся, structured data в layout.tsx не затронут |
| Internal links на секции (#dashboard, #pricing) | Низкая | id="pricing" оставить |
| Responsive 375px: 2-column hero → 1 column | Средняя | `lg:grid-cols-2` → мобильно stack |
| Bauhaus composition на мобильном | Средняя | Скрыть на mobile (как в прототипе) |

### Breakpoints

| Breakpoint | Что проверить |
|-----------|--------------|
| 375px | Hero = 1 колонка (composition скрыта), stats 2x2 grid |
| 768px | Hero = 1 колонка ещё, dashboard mockup responsive |
| 1440px | Hero = 2 колонки, composition видна, full dashboard mockup |

---

## Roadmap

### Phase 1: Hero переделка (самое важное)
1. Заменить centered layout на `grid lg:grid-cols-2` в Hero
2. Левая колонка: Badge → "MATERIALPREISE. DIGITAL." → tagline → subtitle → CTA buttons → stats
3. Правая колонка: Bauhaus-композиция (чёрный dashboard card + geometric shapes)
4. Mobile: composition скрыта, текст по центру

### Phase 2: Убрать лишние секции
5. Удалить все 7 FeatureSection вызовов (Dashboard, Price Tracking, AI Analysis, Forecasts, Chat, Escalation, Alloy, Reports)
6. Удалить FeatureSection component definition (или оставить, не мешает)
7. Удалить Features Grid секцию
8. Удалить Tech Stack секцию
9. Оставить: Hero → Problem → Dashboard Mockup → Pricing → FAQ → Footer

### Phase 3: Dashboard mockup секция
10. Создать Dashboard mockup секцию между Problem и Pricing:
    - Browser frame (dots + URL bar)
    - 4 KPI cards (CSS grid)
    - Line chart (SVG) + Bar chart (SVG)
    - Box-shadow: 8px 8px 0 #C1292E

### Phase 4: Логотип
11. Создать Bauhaus-логотип как SVG component (геометрические красные квадраты с вырезами — по референсу из Luma brand identity)
12. Заменить лого в page.tsx nav
13. Заменить лого в MarketingHeader.tsx
14. Заменить лого в (dashboard)/layout.tsx

### Phase 5: Footer
15. Обновить footer: bg-bauhaus-black + Bauhaus color bar div

### Phase 6: Verify
16. `npm run build` → 0 errors
17. Responsive check: 375 / 768 / 1440
18. Сравнить с прототипом визуально

---

## Чеклист приёмки

- [ ] Hero: 2 колонки (текст лево + Bauhaus-композиция право)
- [ ] Hero заголовок: "MATERIALPREISE. DIGITAL." (не "BauPreis AI")
- [ ] Bauhaus-композиция: чёрный dashboard card + геометрия ВИДНЫ
- [ ] Логотип: геометрический Bauhaus (красные квадраты) — как из Luma
- [ ] Лендинг: 6 секций (Hero, Problem, Dashboard, Pricing, FAQ, Footer)
- [ ] Удалены: 7 feature sections, Grid, Tech Stack
- [ ] Dashboard mockup: browser frame + KPI + SVG charts
- [ ] Footer: чёрный + Bauhaus color bar
- [ ] Mobile 375px: composition скрыта, 1 колонка
- [ ] Desktop 1440px: как прототип
- [ ] `npm run build` → 0 errors
- [ ] CEO видит что сайт = прототип
