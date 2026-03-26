# T009 — Dashboard: 1:1 как в макапе Brand Identity

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #2 Lena Hoffmann — UX/UI + #3 Maximilian Braun — Frontend
**Размер:** L
**Референс:** Mockup из `design/brand/Brand_Identity_CANCNYb6.png` — секция MOCKUP

---

## Проблемы CEO (конкретно)

### 1. СИНИЙ ЦВЕТ В ГРАФИКАХ (Recharts)
**Факт:** Recharts компоненты используют ХАРДКОД hex — НЕ Tailwind. T007 не затронул.

| Файл | Строка | Хардкод | Должно быть |
|------|--------|---------|-------------|
| `material/[code]/page.tsx:171` | `stopColor="#2563eb"` | СИНИЙ gradient | `#C1292E` (красный) |
| `material/[code]/page.tsx:172` | `stopColor="#2563eb"` | СИНИЙ gradient | `#C1292E` |
| `material/[code]/page.tsx:206` | `stroke="#16a34a"` | ЗЕЛЁНЫЙ min ref | `#F5C518` (жёлтый) |
| `material/[code]/page.tsx:214` | `stroke="#dc2626"` | Красный max ref | `#C1292E` |
| `material/[code]/page.tsx:222` | `stroke="#2563eb"` | СИНЯЯ линия | `#C1292E` (красный) |
| `material/[code]/page.tsx:226` | `fill: "#2563eb"` | СИНЯЯ точка | `#C1292E` |
| `legierungsrechner/page.tsx:822` | `stroke="#16a34a"` | ЗЕЛЁНЫЙ | `#F5C518` |
| `legierungsrechner/page.tsx:828` | `stroke="#dc2626"` | Красный | `#C1292E` |
| `legierungsrechner/page.tsx:835` | `stroke="#2563eb"` | СИНИЙ | `#1A1A1A` (чёрный) |
| `legierungsrechner/page.tsx:839` | `fill: "#2563eb"` | СИНИЙ | `#1A1A1A` |
| `opengraph-image.tsx` | 1 ref | Синий | `#C1292E` |
| `twitter-image.tsx` | 1 ref | Синий | `#C1292E` |

**14 хардкод цветов в 4 файлах.**

### 2. ШРИФТЫ НЕ ТЕ

Макап показывает **жирный, плотный, uppercase** шрифт. В макапе:
- "DASHBOARD" — bold, uppercase, condensed
- "PREISENTWICKLUNG ZEMENT" — bold uppercase
- "€190,5", "+2000", "+7.91" — очень жирный, крупный
- KPI labels — uppercase, bold, condensed

**Текущее:** Inter regular/bold — тонкий, лёгкий, корпоративный.
**Нужно:** font-grotesk (Space Grotesk) для ВСЕХ заголовков/labels в dashboard + font-bebas для крупных цифр.

**Файлы где нет font-grotesk на заголовках:**
- `(dashboard)/dashboard/page.tsx` — title, category headers, card labels
- `(dashboard)/material/[code]/page.tsx` — title, chart title, stats labels
- `(dashboard)/layout.tsx` — нет bold header styling
- Все dashboard pages — labels/titles не font-grotesk

### 3. ХЕДЕР СЛИШКОМ ТОНКИЙ

**Макап:** Чёрный (#1A1A1A) хедер, белый лого, белый текст навигации. МОЩНЫЙ.
**Текущее:** Белый хедер с тонкой красной полоской внизу. Слабый.

### 4. КАРТОЧКИ СЛИШКОМ МЯГКИЕ

**Макап:** Жёсткие чёрные рамки (border: 2-3px solid #1A1A1A), жёлтый фон для KPI.
**Текущее:** Тонкие серые рамки (border-gray-200), белый фон. Полупрозрачные серые надписи.

### 5. ЖЁЛТЫЕ БЛОКИ ДЛЯ KPI

**Макап:** Большие жёлтые (#F5C518) блоки для: "-30.5%", "€450.00", "+12.5%"
**Текущее:** Белые карточки с цветным текстом. Нет жёлтых блоков.

### 6. БАРЫ В ГРАФИКАХ

**Макап:** Красные толстые бары (BarChart), не Area/Line chart.
**Текущее:** Area chart с синей заливкой.

### 7. SIDEBAR LABELS НЕ BOLD

**Макап:** Жирные uppercase labels в навигации
**Текущее:** Обычный Inter regular

---

## Файлы затронуты

| # | Файл | Что меняется |
|---|------|-------------|
| 1 | `(dashboard)/layout.tsx` | Хедер: bg-white → bg-[#1A1A1A], текст белый |
| 2 | `components/layout/DashboardNav.tsx` | Sidebar: font-grotesk, uppercase labels, bold |
| 3 | `(dashboard)/dashboard/page.tsx` | font-grotesk на titles/labels, жёлтые KPI блоки |
| 4 | `(dashboard)/material/[code]/page.tsx` | Recharts: #2563eb→#C1292E, #16a34a→#F5C518. font-grotesk. Tooltip borderRadius:0 |
| 5 | `(dashboard)/legierungsrechner/page.tsx` | Recharts: все хардкод цвета → Bauhaus |
| 6 | `(dashboard)/prognose/page.tsx` | font-grotesk labels |
| 7 | `(dashboard)/chat/page.tsx` | font-grotesk |
| 8 | `(dashboard)/alerts/page.tsx` | font-grotesk, borders |
| 9 | `(dashboard)/berichte/page.tsx` | font-grotesk |
| 10 | `app/src/app/globals.css` | .dash-card: border-2 border-[#1A1A1A] вместо border-gray-200 |
| 11 | `opengraph-image.tsx` | #2563eb → #C1292E |
| 12 | `twitter-image.tsx` | #2563eb → #C1292E |
| 13 | Все einstellungen + account pages | font-grotesk on headings |

---

## БЫЛО → СТАНЕТ

### Dashboard header (layout.tsx)
```
БЫЛО: bg-white border-b-[3px] border-brand-600 h-16
СТАНЕТ: bg-[#1A1A1A] border-b-[3px] border-brand-600 h-16
Logo: brightness-0 invert (белый на чёрном)
```

### .dash-card (globals.css)
```
БЫЛО: bg-white border-2 border-gray-200
СТАНЕТ: bg-white border-2 border-[#1A1A1A]
```

### Recharts (material/[code]/page.tsx)
```
БЫЛО: stroke="#2563eb", fill="#2563eb", gradient #2563eb
СТАНЕТ: stroke="#C1292E", fill="#C1292E", gradient #C1292E
Min ref: #16a34a → #F5C518
Tooltip: borderRadius: "8px" → borderRadius: "0"
```

### KPI cards на dashboard
```
БЫЛО: белый фон, цветной текст
СТАНЕТ: жёлтый (#F5C518) фон для negative/positive KPIs, чёрный текст
```

### Sidebar labels
```
БЫЛО: text-sm (Inter regular)
СТАНЕТ: font-grotesk text-sm font-semibold uppercase tracking-wide
```

---

## Roadmap

### Phase 1: Dashboard header → чёрный
1. `(dashboard)/layout.tsx` — header bg-[#1A1A1A], logo invert для белого на чёрном

### Phase 2: globals.css — жёсткие рамки
2. `.dash-card` — border-[#1A1A1A] вместо border-gray-200
3. `.dash-card:hover` — shadow цвет обновить

### Phase 3: Recharts цвета (14 хардкодов)
4. `material/[code]/page.tsx` — ВСЕ #2563eb → #C1292E, #16a34a → #F5C518, tooltip rounded → 0
5. `legierungsrechner/page.tsx` — ВСЕ #2563eb → #1A1A1A, #16a34a → #F5C518
6. `opengraph-image.tsx` + `twitter-image.tsx` — #2563eb → #C1292E

### Phase 4: Шрифты — font-grotesk + uppercase на ВСЕ dashboard labels
7. `DashboardNav.tsx` — sidebar labels: font-grotesk uppercase tracking-wide
8. `dashboard/page.tsx` — title, category headers, card labels: font-grotesk uppercase
9. `material/[code]/page.tsx` — title, chart title, stats labels: font-grotesk
10. Все остальные dashboard pages — headings: font-grotesk

### Phase 5: Жёлтые KPI блоки
11. `dashboard/page.tsx` — рекомендации buy_now на жёлтом фоне, change cards с цветным фоном

### Phase 6: Verify
12. Grep `#2563eb|#16a34a|#3b82f6` → 0
13. `npm run build` → 0 errors
14. Visual compare с макапом

---

## Чеклист приёмки

- [ ] Dashboard header — ЧЁРНЫЙ (#1A1A1A), белый лого
- [ ] Recharts: 0 синих цветов (#2563eb) — линии красные (#C1292E)
- [ ] Recharts: 0 зелёных цветов (#16a34a) — ref lines жёлтые (#F5C518)
- [ ] .dash-card — чёрные рамки border-[#1A1A1A]
- [ ] Sidebar labels — font-grotesk, uppercase, bold
- [ ] Dashboard titles — font-grotesk, uppercase
- [ ] KPI/stats — жёлтые блоки для ключевых цифр
- [ ] Tooltip в графиках — borderRadius: 0 (sharp)
- [ ] Grep `#2563eb` → 0 results
- [ ] Grep `#16a34a` → 0 results
- [ ] `npm run build` → 0 errors
- [ ] Визуально = макапу из Brand Identity
