# T003 — 2 прототипа дизайна из Luma Brand Identity (только просмотр)

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #2 Lena Hoffmann — UX/UI Engineer
**Скилл:** ui-ux-pro-max
**Размер:** M

---

## Задача CEO

Сделать 2 standalone HTML-прототипа на основе 2 Luma brand identity вариантов.
**НЕ трогать текущий сайт.** Только файлы для просмотра в браузере.

CEO нравятся: графики, desktop-вид, общая эстетика из мокапов.

---

## Анализ Brand Identity из Luma

### Вариант 1: "Dark Professional" (92j9HUuD)

| Элемент | Значение |
|---------|---------|
| Primary | `#0A1528` (тёмный navy) |
| Secondary | `#A4C7E8` (light blue) |
| Accent | Orange (из мокапа ~`#E8732A`) |
| Background | `#FFFFFF` light / `#0A1528` dark sections |
| CTA | `#BEDF2` (?) — скорее зелёный акцент |
| Logo | "BauPreis AI" + chart icon, тёмный |
| Стиль | Bloomberg Terminal, blueprint-сетка, металлик-текстуры |
| Типографика | Sans-serif clean, "Materialpreise im Überblick" |
| Мокапы | Dark dashboard, line charts, price forecasts на мониторе |
| Visual language | Blueprint grid, metallic surfaces, technical precision |

### Вариант 2: "Bauhaus Bold" (CANCNYb6)

| Элемент | Значение |
|---------|---------|
| Primary | `#C1292E` (красный) |
| Secondary | `#1A1A1A` (чёрный) |
| Tertiary | `#BC8279` (salmon/rose) |
| Accent | `#F5C518` (жёлтый/gold) |
| Background | `#FFFFFF` |
| Logo | "BauPreis AI" + geometric arrow, КРАСНЫЙ |
| Стиль | Bauhaus-геометрия, bold shapes, German design heritage |
| Типографика | Ultra-bold "MATERIALPREISE. DIGITAL." — Bauhaus-inspired |
| Мокапы | Dashboard с bar charts, KPI cards (+12.5%, -30.5%, €450.00) |
| Visual language | Geometric shapes (круги, треугольники, здания, краны) |

---

## Что СЕЙЧАС на landing page (для сравнения)

| Элемент | Текущее значение |
|---------|-----------------|
| Primary | `#2563eb` (brand-600 синий) / `#4F46E5` (indigo-600) |
| Background | White → `#EEF2FF` gradient |
| Font | Inter |
| Hero | Gradient text, badge с pulse-dot, stats counter |
| Sections | Hero → Problem (dark bg) → 5 Feature sections → Pricing → FAQ |
| Стиль | Glassmorphism, indigo accents, modern SaaS generic |

---

## Что создаём (ПРОТОТИПЫ)

### Формат: 2 standalone HTML файла

```
design/prototypes/
├── variant-1-dark-professional.html    ← открыть в браузере
└── variant-2-bauhaus-bold.html         ← открыть в браузере
```

**Каждый файл — полноценная страница** (self-contained HTML + CSS + inline SVG):
- Nav (fixed top)
- Hero section (заголовок, подзаголовок, CTA, статистика)
- Problem section (3 карточки)
- Dashboard mockup section (с графиками на CSS/SVG)
- Pricing section (3 плана: Basis 49€, Pro 149€, Team 299€)
- Footer

**Графики** — CSS/SVG inline (bar charts, line charts, KPI cards). Не Recharts, не JS-библиотеки. Чистый HTML+CSS для мгновенного просмотра.

---

## Файлы затронуты

| Файл | Действие | Влияние на прод |
|------|---------|----------------|
| `design/prototypes/variant-1-dark-professional.html` | СОЗДАТЬ (новый) | НОЛЬ — standalone |
| `design/prototypes/variant-2-bauhaus-bold.html` | СОЗДАТЬ (новый) | НОЛЬ — standalone |

**Существующий код НЕ затрагивается. Ноль риска.**

### Что НЕ может сломаться
- Текущий сайт — не трогаем
- Build — не затронут (html вне app/)
- Тесты — не затронуты
- Навигация, якоря, JS, анимации — не затронуты

### Breakpoints в прототипах
- 375px (mobile) — responsive, stack layout
- 768px (tablet) — 2-column grids
- 1440px (desktop) — full layout, акцент CEO на desktop

---

## Roadmap

1. Создать папку `design/prototypes/`
2. Создать `variant-1-dark-professional.html`:
   - Palette: `#0A1528`, `#A4C7E8`, orange accent
   - Font: Inter (CDN) или Plus Jakarta Sans
   - Nav: dark navy bg, logo white
   - Hero: dark gradient bg, blueprint grid SVG pattern, white text
   - Dashboard mockup: dark cards, line/area charts (SVG), KPI numbers
   - Problem section: glass cards on dark bg
   - Pricing: 3 плана, dark theme cards
   - Footer: minimal dark
3. Создать `variant-2-bauhaus-bold.html`:
   - Palette: `#C1292E`, `#1A1A1A`, `#F5C518`, `#BC8279`
   - Font: Inter Bold / или Bebas Neue для headlines
   - Nav: white bg, red logo
   - Hero: geometric Bauhaus patterns (CSS shapes), bold typography
   - Dashboard mockup: white cards, red bar charts (SVG), KPI cards (+12.5%, €450)
   - Problem section: geometric illustrations (buildings, cranes as SVG)
   - Pricing: 3 плана, Bauhaus-style cards with geometric accents
   - Footer: black bg, geometric divider
4. Проверить оба файла в браузере на 1440px
5. Проверить responsive 375px / 768px

---

## Чеклист приёмки

- [ ] `variant-1-dark-professional.html` открывается в браузере
- [ ] `variant-2-bauhaus-bold.html` открывается в браузере
- [ ] Оба файла self-contained (no external dependencies кроме Google Fonts CDN)
- [ ] Desktop 1440px — layout красивый, графики видны
- [ ] Mobile 375px — не сломано, readable
- [ ] Графики (SVG/CSS) присутствуют в обоих вариантах
- [ ] Цвета соответствуют Luma brand identity
- [ ] Pricing section с 3 планами
- [ ] Текущий сайт НЕ изменён (zero files touched in app/)
- [ ] CEO может сравнить оба варианта и выбрать направление
