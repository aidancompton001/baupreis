# T009 v2 — ПОЛНОЕ СООТВЕТСТВИЕ МАКАПУ: Dashboard + Visual Language + Иконки + Шрифты + Графики

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #2 Lena Hoffmann — UX/UI Engineer + #3 Maximilian Braun — Frontend
**Скилл:** ui-ux-pro-max
**Размер:** XL (30+ файлов, 8 фаз)
**Референс:** `design/brand/Brand_Identity_CANCNYb6.png` — секции MOCKUP + VISUAL LANGUAGE + TYPOGRAPHY + COLOR PALETTE

---

## ЧАСТЬ 1: АУДИТ МАКАПА (ФАКТЫ ИЗ ИЗОБРАЖЕНИЯ)

### 1.1 MOCKUP Dashboard — что ТОЧНО изображено

**HEADER (верхняя полоса):**
- Фон: ЧЁРНЫЙ (#1A1A1A)
- Лого: красная иконка (маленькая) + белый текст "Dashboard" (активный таб) + "Preise" + "Datinger" + "Contact"
- Справа: иконка сетки (grid) + иконка уведомлений
- Толщина: ~56-64px, МОЩНЫЙ, ТЯЖЁЛЫЙ

**KPI ROW (4 карточки):**
- 4 карточки в ряд, ЧЁРНЫЕ рамки, белый фон
- Каждая: UPPERCASE label (bold, condensed) + крупная цифра + процент рядом
- Примеры: "PREICUBERAT €190,5 -7%" / "PREICMOXZ +2000 -6%" / "DURCHSCHNITTSPREIS +7.91 -1%" / "PREIS WLZ €1000 +5%"
- Шрифт labels: Space Grotesk Bold, uppercase, letter-spacing
- Шрифт цифр: очень bold, крупный

**ГЛАВНЫЙ ГРАФИК (большой):**
- Заголовок: "PREISENTWICKLUNG ZEMENT" — bold uppercase Space Grotesk
- Легенда: красный квадрат + "Preigröles-Aeeusoament"
- Тип: BAR CHART (вертикальные бары), НЕ area/line chart
- Цвет баров: КРАСНЫЙ (#C1292E)
- Ось Y: 600-1250 (числа)
- Ось X: Jan — Dec (месяцы)
- Рамка: ЧЁРНАЯ толстая
- Фон: белый

**НИЖНИЙ РЯД (4 блока):**
- Блок 1: "PREISENTWICKLUNG ZEMENT" — LINE CHART (ЧЁРНАЯ линия), белый фон, чёрная рамка
- Блок 2: "PREISENTWICKLUNG ZEMENT +12.5%" — ЖЁЛТЫЙ (#F5C518) фон, красный текст "+12.5%", ОГРОМНЫЙ шрифт
- Блок 3: "DURCHSCHNITTSPREIS HOLZ -30.5%" — ЖЁЛТЫЙ фон, ОГРОМНАЯ цифра "-30.5%"
- Блок 4: "DURCHSCHNITTSPREIS HOLZ €450.00" — ЖЁЛТЫЙ фон, ОГРОМНАЯ цифра "€450.00"

### 1.2 VISUAL LANGUAGE — что ТОЧНО изображено

**Геометрические элементы (модульная сетка 4x4):**
- Большой красный круг (левый верх)
- Красная шестерня с белым центром (верх)
- Треугольники: красные, чёрные, жёлтые — в разных комбинациях
- Квадраты: красные, чёрные, жёлтые — сплошные
- Полукруги: красные на чёрном/жёлтом фоне
- Строительный кран: красный, геометрический (SVG-стиль)
- График роста: красные бары + чёрная стрелка вверх
- Здание: красно-чёрное, геометрическое (прямоугольники)
- Большой красный круг (низ)

**Иконки для sidebar (из Visual Language):**
| Функция | Макап иконка | Описание |
|---------|-------------|----------|
| Overview/Dashboard | Бары + стрелка вверх | Красные бары, чёрная стрелка тренда |
| Прогнозы | Шестерня | Красная шестерня с белым центром |
| Чат | — | Геометрический speech bubble |
| Preisgleitklausel | Линейка/ruler | Геометрический |
| Legierungsrechner | Треугольники | Геометрическая композиция |
| Alerts | Колокол | Геометрический |
| Berichte | Документ | Геометрический прямоугольник |
| Einstellungen | Шестерня | Меньшая версия |
| Account | Здание/человек | Геометрический |

### 1.3 TYPOGRAPHY — ПОЛНЫЙ АНАЛИЗ ШРИФТОВ ИЗ МАКАПА

#### Определение шрифта из макапа

Заголовок "MATERIALPREISE. DIGITAL." в макапе имеет характеристики:
- Ultra-condensed (буквы ОЧЕНЬ узкие и высокие)
- Bold/Black weight
- All caps
- Sans-serif
- Плотный межбуквенный интервал

Сравнение с Google Fonts:

| Шрифт | Condensed? | Weight? | Сходство с макапом |
|-------|-----------|---------|-------------------|
| Bebas Neue | Condensed | 400 only | 70% — слишком ТОНКИЙ |
| **Oswald** | **Condensed** | **200-700** | **85% — Bold/700 ОЧЕНЬ похож** |
| Anton | Condensed | 400 only | 80% — только 1 вес |
| Barlow Condensed | Condensed | 100-900 | 90% — Black/900 похож |

**ВЫВОД: Oswald 700 — лучший match. Поддерживает Latin + Cyrillic. Free на Google Fonts.**

#### Полная карта шрифтов (3 шрифта)

| # | Шрифт | Google Font | Weight | Где используется | Tailwind class |
|---|-------|------------|--------|-----------------|---------------|
| 1 | **Oswald** | `Oswald` | 700 (Bold) | Headings H1, крупные цифры KPI, dashboard title, material title | `font-oswald` |
| 2 | **Space Grotesk** | `Space_Grotesk` | 500-700 | Sub-headlines, labels, sidebar, кнопки, chart titles, eyebrows | `font-grotesk` |
| 3 | **Inter** | `Inter` | 400-600 | Body text, descriptions, nav links, мелкий текст | (default) |

#### Где КОНКРЕТНО какой шрифт

| Элемент | Шрифт | Class | Файл |
|---------|-------|-------|------|
| Landing Hero H1 "MATERIALPREISE. DIGITAL." | Oswald 700 | `font-oswald text-[6rem] uppercase` | `page.tsx` |
| Dashboard title "DASHBOARD" / "MATERIALÜBERSICHT" | Oswald 700 | `font-oswald text-2xl uppercase` | `dashboard/page.tsx` |
| KPI крупные цифры "€7.915", "+12.5%" | Oswald 700 | `font-oswald text-3xl` | `dashboard/page.tsx` |
| Material title "STAHLTRÄGER HEB/IPE" | Oswald 700 | `font-oswald text-2xl uppercase` | `material/[code]/page.tsx` |
| Material крупные цены "€1.136,46" | Oswald 700 | `font-oswald text-2xl` | `material/[code]/page.tsx` |
| Chart titles "PREISENTWICKLUNG ZEMENT" | Space Grotesk 700 | `font-grotesk uppercase tracking-wide font-bold` | Recharts labels |
| Sidebar labels "ÜBERSICHT", "KI-PROGNOSEN" | Space Grotesk 600 | `font-grotesk uppercase text-xs tracking-wide font-semibold` | `DashboardNav.tsx` |
| Card labels "7 TAGE", "30 TAGE" | Space Grotesk 600 | `font-grotesk uppercase text-xs` | card components |
| KPI small labels "PREISBERICHT" | Space Grotesk 700 | `font-grotesk uppercase text-xs tracking-wide font-bold` | dashboard cards |
| Body text, descriptions | Inter 400 | (default, no class) | everywhere |
| Button labels "PLATTFORM ENTDECKEN" | Space Grotesk 700 | `font-grotesk uppercase font-bold` | CTA buttons |
| Nav links "Preise", "Über uns" | Inter 500 | `font-medium` | headers |

#### Что СЕЙЧАС в коде (ПРОБЛЕМЫ)

| Шрифт | Подключён? | Проблема |
|-------|-----------|---------|
| Inter | ✅ layout.tsx | OK, но используется для headings где нужен condensed |
| Space Grotesk | ✅ layout.tsx, `--font-grotesk` | OK для labels, но не используется на многих dashboard pages |
| **Bebas Neue** | ✅ layout.tsx, `--font-oswald` | **НЕПРАВИЛЬНЫЙ ШРИФТ! Слишком тонкий. Нужен Oswald.** |
| **Oswald** | ❌ НЕ подключён | **НУЖЕН для headings и крупных цифр** |

#### Что БЫЛО → Что СТАНЕТ (шрифты)

**layout.tsx:**
```
БЫЛО:
  import { Inter, Space_Grotesk, Bebas_Neue } from "next/font/google";
  const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-oswald" });
  <body className={`${inter.className} ${spaceGrotesk.variable} ${bebasNeue.variable}`}>

СТАНЕТ:
  import { Inter, Space_Grotesk, Oswald } from "next/font/google";
  const oswald = Oswald({ weight: ["700"], subsets: ["latin", "cyrillic"], variable: "--font-oswald", display: "swap" });
  <body className={`${inter.className} ${spaceGrotesk.variable} ${oswald.variable}`}>
```

**tailwind.config.ts:**
```
БЫЛО:
  fontFamily: {
    bebas: ['var(--font-oswald)', '"Bebas Neue"', 'sans-serif'],
    grotesk: ['var(--font-grotesk)', '"Space Grotesk"', 'sans-serif'],
  }

СТАНЕТ:
  fontFamily: {
    oswald: ['var(--font-oswald)', '"Oswald"', 'sans-serif'],
    grotesk: ['var(--font-grotesk)', '"Space Grotesk"', 'sans-serif'],
  }
```

**page.tsx (landing Hero H1):**
```
БЫЛО: className="font-oswald text-5xl ..."
СТАНЕТ: className="font-oswald text-5xl ..."
```

#### Файлы затронутые заменой шрифта

| # | Файл | Что |
|---|------|-----|
| 1 | `layout.tsx` | Bebas_Neue → Oswald, variable --font-oswald → --font-oswald |
| 2 | `tailwind.config.ts` | fontFamily bebas → oswald |
| 3 | `page.tsx` (landing) | font-oswald → font-oswald |
| 4 | `dashboard/page.tsx` | title, KPI numbers → font-oswald; labels → font-grotesk uppercase |
| 5 | `material/[code]/page.tsx` | title, prices → font-oswald; chart title → font-grotesk uppercase |
| 6-22 | 17 остальных dashboard pages | headings → font-oswald; labels → font-grotesk uppercase |

#### Риски шрифтов

| Риск | Митигация |
|------|----------|
| Oswald condensed + uppercase + длинное немецкое слово = overflow | Тест на "PREISGLEITKLAUSEL" (18 букв), "LEGIERUNGSRECHNER" (17 букв). Если overflow → tracking-tight или text-sm |
| Oswald не рендерит немецкие числа с запятой "7.915,23" | Oswald поддерживает все цифры + пунктуацию. Тест перед деплоем. |
| Oswald cyrillic для русской версии | Oswald имеет cyrillic subset → указываем в subsets |

### 1.4 COLOR PALETTE — из макапа (СТРОГО 5 ЦВЕТОВ)

| Hex | Название | Где |
|-----|---------|-----|
| `#C1292E` | Красный | Бары графиков, лого, акценты, активные элементы, рамки |
| `#1A1A1A` | Чёрный | Header фон, текст, рамки карточек, линии графиков |
| `#BC8279` | Терракота | Вторичный акцент |
| `#FFFFFF` | Белый | Фоны карточек, текст на тёмном |
| `#F5C518` | Жёлтый | KPI блоки фон, highlight цифры |

**ЗАПРЕЩЕНО:** синий (#2563eb), зелёный (#16a34a), розовый, серый полупрозрачный для текста, голубые градиенты

---

## ЧАСТЬ 2: АУДИТ ТЕКУЩЕГО КОДА (ЧТО СЕЙЧАС)

### 2.1 Dashboard Header (layout.tsx:21)

```
СЕЙЧАС: <header className="bg-white border-b-[3px] border-brand-600 h-16">
ПРОБЛЕМА: Белый фон, тонкий. Слабый. Не как в макапе.
```

### 2.2 Recharts — СИНИЕ хардкод цвета (material/[code]/page.tsx)

| Строка | Код | Проблема |
|--------|-----|---------|
| 171 | `stopColor="#2563eb" stopOpacity={0.15}` | СИНИЙ gradient |
| 172 | `stopColor="#2563eb" stopOpacity={0}` | СИНИЙ gradient |
| 175 | `stroke="#f0f0f0"` | Серая сетка (ОК, но можно #e5e7eb) |
| 178 | `fill: "#9ca3af"` | Серый tick text (слишком светлый) |
| 191 | `borderRadius: "8px"` | СКРУГЛЁННЫЙ tooltip! |
| 206 | `stroke="#16a34a"` | ЗЕЛЁНЫЙ min reference |
| 214 | `stroke="#dc2626"` | Красный max ref (близко, но не #C1292E) |
| 222 | `stroke="#2563eb"` | СИНЯЯ линия графика |
| 226 | `fill: "#2563eb"` | СИНЯЯ точка |

### 2.3 Recharts — legierungsrechner/page.tsx

| Строка | Код | Проблема |
|--------|-----|---------|
| 807 | `stroke="#f0f0f0"` | OK |
| 808 | `fill: "#9ca3af"` | Серый tick |
| 822 | `stroke="#16a34a"` | ЗЕЛЁНЫЙ |
| 828 | `stroke="#dc2626"` | Красный (не #C1292E) |
| 835 | `stroke="#2563eb"` | СИНИЙ |
| 839 | `fill: "#2563eb"` | СИНИЙ |

### 2.4 OG/Twitter images

| Файл | Проблема |
|------|---------|
| `opengraph-image.tsx` | Содержит #2563eb (синий) |
| `twitter-image.tsx` | Содержит #2563eb (синий) |

### 2.5 Sidebar иконки (DashboardNav.tsx)

```tsx
СЕЙЧАС: import { BarChart3, Bot, MessageSquare, Ruler, FlaskConical, Bell, FileText, Settings, User } from "lucide-react";
ПРОБЛЕМА: Lucide = тонкие линейные иконки, generic, НЕ Bauhaus. Нет геометрии, нет цвета.
```

### 2.6 Dashboard labels/шрифты

```
СЕЙЧАС: <h1 className="text-2xl font-bold gradient-text"> — Inter
ПРОБЛЕМА: Inter = тонкий. Нет uppercase. Нет font-grotesk. Не как в макапе.

СЕЙЧАС: <h2 className="font-semibold text-sm uppercase tracking-wide"> — Inter semibold
ПРОБЛЕМА: Уже uppercase, но шрифт Inter — не Space Grotesk Bold.

СЕЙЧАС: <p className="text-sm text-gray-500"> — серый полупрозрачный
ПРОБЛЕМА: Слишком слабый. В макапе текст ЧЁТКИЙ, #1A1A1A.
```

### 2.7 Карточки (.dash-card в globals.css)

```
СЕЙЧАС: @apply bg-white border-2 border-[#1A1A1A]
— Уже чёрные рамки ✓ (исправлено в T007... проверю)
```

Wait — проверяю реальный globals.css:

```css
ФАКТ: @apply bg-white border-2 border-gray-200
```

**РАМКИ ВСЁ ЕЩЁ СЕРЫЕ!** T007 должен был поменять, но globals.css показывает border-gray-200. Проверяю...

**ФАКТ из прочитанного globals.css (шаг Phase 2 globals выше):**
```css
.dash-card {
  @apply bg-white border-2 border-gray-200
         transition-all duration-200 ease-out;
}
```

**border-gray-200 = СЕРАЯ РАМКА. НЕ ЧЁРНАЯ. Это баг T007.**

### 2.8 LogoutButton на чёрном header

Текущий LogoutButton — тёмный текст/иконка. На чёрном header будет невидим.

### 2.9 LanguageSwitcher на чёрном header

Текущий — серые бордеры. На чёрном невидим.

---

## ЧАСТЬ 3: VISUAL LANGUAGE ICON SYSTEM

### 3.1 Файл иконок

Создать файл: `app/src/components/icons/BauhausIcons.tsx`

Каждая иконка = React компонент, SVG inline, размер через prop, СТРОГО палитра #C1292E/#1A1A1A/#F5C518/#BC8279/#FFFFFF.

### 3.2 Реестр иконок

| ID | Название | Описание | Где используется | SVG Elements |
|----|---------|----------|-----------------|-------------|
| `BI-01` | IconDashboard | Красные бары + чёрная стрелка вверх | Sidebar: Overview | 3 rect (бары #C1292E) + polyline (стрелка #1A1A1A) |
| `BI-02` | IconForecasts | Красная шестерня | Sidebar: KI-Prognosen | circle + path (gear teeth #C1292E, center #FFF) |
| `BI-03` | IconChat | Геометрический speech bubble | Sidebar: KI-Chat | rect + triangle (#1A1A1A) |
| `BI-04` | IconEscalation | Линейка/ruler геометрическая | Sidebar: Preisgleitklausel | rect + ticks (#C1292E) |
| `BI-05` | IconAlloy | Треугольники | Sidebar: Legierungsrechner | 2 triangles (#C1292E + #F5C518) |
| `BI-06` | IconAlerts | Геометрический колокол | Sidebar: Alarme | trapezoid + rect (#C1292E) |
| `BI-07` | IconReports | Геометрический документ | Sidebar: Berichte | rect + lines (#1A1A1A) |
| `BI-08` | IconSettings | Малая шестерня | Sidebar: Einstellungen | circle + teeth (#1A1A1A) |
| `BI-09` | IconAccount | Геометрический человек | Sidebar: Konto | circle (head) + trapezoid (body) (#1A1A1A) |
| `BI-10` | IconCrane | Строительный кран | Visual decorations | rect + lines (#C1292E) |
| `BI-11` | IconBuilding | Геометрическое здание | Visual decorations | rects (#C1292E + #1A1A1A) |
| `BI-12` | IconGear | Большая шестерня | Visual decorations | circle + teeth (#C1292E) |

### 3.3 Экспорт/использование

```tsx
// app/src/components/icons/BauhausIcons.tsx
export { IconDashboard, IconForecasts, IconChat, ... } from './BauhausIcons';

// DashboardNav.tsx
import { IconDashboard, IconForecasts, ... } from '@/components/icons/BauhausIcons';
```

---

## ЧАСТЬ 4: ПОЛНЫЙ СПИСОК ФАЙЛОВ И ИЗМЕНЕНИЙ

### Phase 1: Visual Language Icon System (НОВЫЙ ФАЙЛ)

| # | Файл | Действие | Строки |
|---|------|---------|--------|
| 1 | `app/src/components/icons/BauhausIcons.tsx` | СОЗДАТЬ | ~200 строк, 12 SVG компонентов |

**Каждая иконка — конкретные SVG elements:**

```tsx
// BI-01: IconDashboard — 3 красных бара + чёрная стрелка
export const IconDashboard = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="14" width="4" height="8" fill="#C1292E" />
    <rect x="10" y="8" width="4" height="14" fill="#C1292E" />
    <rect x="17" y="4" width="4" height="18" fill="#C1292E" />
    <polyline points="2,10 8,6 14,8 22,2" stroke="#1A1A1A" strokeWidth="2" fill="none" />
    <polyline points="18,2 22,2 22,6" stroke="#1A1A1A" strokeWidth="2" fill="none" />
  </svg>
);
```

### Phase 2: Dashboard Header → ЧЁРНЫЙ

| # | Файл | Строка | БЫЛО | СТАНЕТ |
|---|------|--------|------|--------|
| 2 | `(dashboard)/layout.tsx` | 21 | `bg-white border-b-[3px] border-brand-600` | `bg-[#1A1A1A] border-b-[3px] border-brand-600` |
| 3 | `(dashboard)/layout.tsx` | 25 | `<img ... className="h-7 w-auto" />` | `<img ... className="h-7 w-auto brightness-0 invert" />` |
| 4 | `components/auth/LogoutButton.tsx` | кнопка | тёмный текст/иконка | `text-white` |
| 5 | `i18n/LanguageSwitcher.tsx` | select | серый border | `text-white border-white/30 bg-transparent` |

### Phase 3: globals.css — .dash-card ЧЁРНЫЕ рамки

| # | Файл | Строка | БЫЛО | СТАНЕТ |
|---|------|--------|------|--------|
| 6 | `globals.css` | 75 | `border-2 border-gray-200` | `border-2 border-[#1A1A1A]` |
| 7 | `globals.css` | 79 | `box-shadow: 4px 4px 0 #E5E7EB` | `box-shadow: 4px 4px 0 #C1292E` |
| 8 | `globals.css` | 78 | `border-gray-400` (hover) | `border-[#C1292E]` (hover) |

### Phase 4: Recharts — ВСЕ хардкод цвета → Bauhaus

**material/[code]/page.tsx:**

| # | Строка | БЫЛО | СТАНЕТ |
|---|--------|------|--------|
| 9 | 171 | `stopColor="#2563eb" stopOpacity={0.15}` | `stopColor="#C1292E" stopOpacity={0.15}` |
| 10 | 172 | `stopColor="#2563eb" stopOpacity={0}` | `stopColor="#C1292E" stopOpacity={0}` |
| 11 | 178 | `fill: "#9ca3af"` | `fill: "#1A1A1A"` |
| 12 | 183 | `fill: "#9ca3af"` | `fill: "#1A1A1A"` |
| 13 | 191 | `borderRadius: "8px"` | `borderRadius: "0"` |
| 14 | 192 | `border: "1px solid #e5e7eb"` | `border: "2px solid #1A1A1A"` |
| 15 | 206 | `stroke="#16a34a"` | `stroke="#F5C518"` |
| 16 | 214 | `stroke="#dc2626"` | `stroke="#C1292E"` |
| 17 | 222 | `stroke="#2563eb"` | `stroke="#C1292E"` |
| 18 | 226 | `fill: "#2563eb"` | `fill: "#C1292E"` |

**legierungsrechner/page.tsx:**

| # | Строка | БЫЛО | СТАНЕТ |
|---|--------|------|--------|
| 19 | 808 | `fill: "#9ca3af"` | `fill: "#1A1A1A"` |
| 20 | 811 | `fill: "#9ca3af"` | `fill: "#1A1A1A"` |
| 21 | 822 | `stroke="#16a34a"` | `stroke="#F5C518"` |
| 22 | 828 | `stroke="#dc2626"` | `stroke="#C1292E"` |
| 23 | 835 | `stroke="#2563eb"` | `stroke="#1A1A1A"` |
| 24 | 839 | `fill: "#2563eb"` | `fill: "#1A1A1A"` |

**opengraph-image.tsx + twitter-image.tsx:**

| # | Файл | БЫЛО | СТАНЕТ |
|---|------|------|--------|
| 25 | opengraph-image.tsx | `#2563eb` | `#C1292E` |
| 26 | twitter-image.tsx | `#2563eb` | `#C1292E` |

### Phase 5: Шрифты — font-grotesk + font-oswald на ВСЕ dashboard

**dashboard/page.tsx:**

| # | Строка | БЫЛО | СТАНЕТ |
|---|--------|------|--------|
| 27 | 112 | `text-2xl font-bold text-gray-900` (loading title) | `text-2xl font-bold font-grotesk uppercase text-[#1A1A1A]` |
| 28 | 126 | `text-2xl font-bold gradient-text` (title) | `text-2xl font-bold font-grotesk uppercase text-[#1A1A1A]` |
| 29 | 127 | `text-gray-500 text-sm` (subtitle) | `text-[#1A1A1A] text-sm font-grotesk` |
| 30 | 134 | `border border-gray-200` (CSV export) | `border-2 border-[#1A1A1A]` |
| 31 | 144 | `text-gray-400 text-sm` (index label) | `text-gray-300 text-xs font-grotesk uppercase tracking-wide` |
| 32 | 145 | `text-3xl font-bold` (index value) | `text-3xl font-bold font-oswald` |
| 33 | 188 | `font-semibold text-sm` (category header) | `font-bold font-grotesk text-sm` |
| 34 | 202 | `font-medium text-sm text-gray-900` (card title) | `font-semibold text-sm font-grotesk text-[#1A1A1A]` |
| 35 | 212 | `text-lg font-bold text-gray-900` (card price) | `text-lg font-bold font-grotesk text-[#1A1A1A]` |
| 36 | 225 | `text-gray-500` (7d label) | `text-[#1A1A1A]/60 font-grotesk text-xs uppercase` |

**material/[code]/page.tsx:**

| # | Строка | БЫЛО | СТАНЕТ |
|---|--------|------|--------|
| 37 | 86 | `text-2xl font-bold gradient-text` (title) | `text-2xl font-bold font-grotesk uppercase text-[#1A1A1A]` |
| 38 | 87 | `text-gray-500 text-sm` (unit) | `text-[#1A1A1A]/60 text-sm font-grotesk uppercase` |
| 39 | 96-100 | period buttons | добавить `font-grotesk uppercase tracking-wide` |
| 40 | 120 | `text-sm text-gray-500` (label) | `text-xs text-[#1A1A1A]/60 font-grotesk uppercase tracking-wide` |
| 41 | 121 | `text-2xl font-bold` (price) | `text-2xl font-bold font-oswald` |
| 42 | 151 | `font-semibold mb-4` (chart title) | `font-bold font-grotesk uppercase tracking-wide mb-4` |

### Phase 6: DashboardNav.tsx — Bauhaus иконки + labels

| # | Строка | БЫЛО | СТАНЕТ |
|---|--------|------|--------|
| 43 | 8-18 | `import { BarChart3, Bot, ... } from "lucide-react"` | `import { IconDashboard, IconForecasts, ... } from "@/components/icons/BauhausIcons"` |
| 44 | 27-35 | `icon: <BarChart3 size={18} />` etc. | `icon: <IconDashboard size={20} />` etc. |
| 45 | 73 | `<span>{t(item.labelKey)}</span>` | `<span className="font-grotesk text-xs uppercase tracking-wide font-semibold">{t(item.labelKey)}</span>` |
| 46 | 82 | `bg-white border-t` (mobile nav) | `bg-[#1A1A1A] border-t-2 border-brand-600` (чёрный mobile nav) |
| 47 | 90-97 | mobile nav links | `text-white` active = `text-brand-600`, inactive = `text-white/60` |

### Phase 7: Остальные dashboard pages — font-grotesk

Все pages где есть headings/labels БЕЗ font-grotesk:

| # | Файл | Что |
|---|------|-----|
| 48 | `prognose/page.tsx` | Все headings → font-grotesk uppercase |
| 49 | `chat/page.tsx` | Heading + labels → font-grotesk |
| 50 | `alerts/page.tsx` | Heading + card labels → font-grotesk |
| 51 | `berichte/page.tsx` | Heading → font-grotesk |
| 52 | `preisgleitklausel/page.tsx` | Heading + labels → font-grotesk |
| 53 | `legierungsrechner/page.tsx` | Heading + labels → font-grotesk |
| 54 | `einstellungen/page.tsx` | Heading → font-grotesk |
| 55 | `einstellungen/abo/page.tsx` | Labels → font-grotesk |
| 56 | `einstellungen/api/page.tsx` | Labels → font-grotesk |
| 57 | `einstellungen/materialien/page.tsx` | Labels → font-grotesk |
| 58 | `einstellungen/team/page.tsx` | Labels → font-grotesk |
| 59 | `einstellungen/telegram/page.tsx` | Labels → font-grotesk |
| 60 | `einstellungen/whatsapp/page.tsx` | Labels → font-grotesk |
| 61 | `account/billing/page.tsx` | Labels → font-grotesk |
| 62 | `account/profile/page.tsx` | Labels → font-grotesk |
| 63 | `account/data/page.tsx` | Labels → font-grotesk |
| 64 | `account/security/page.tsx` | Labels → font-grotesk |

### Phase 8: Verification

| # | Проверка | Команда |
|---|---------|---------|
| 65 | Grep #2563eb → 0 | `grep -r "#2563eb" app/src/` |
| 66 | Grep #16a34a → 0 | `grep -r "#16a34a" app/src/` |
| 67 | Grep #3b82f6 → 0 | `grep -r "#3b82f6" app/src/` |
| 68 | Grep lucide-react в DashboardNav → 0 | `grep "lucide-react" DashboardNav.tsx` |
| 69 | Grep border-gray-200 в globals.css → 0 | `grep "border-gray-200" globals.css` |
| 70 | Grep borderRadius в Recharts → все "0" | `grep "borderRadius" material/` |
| 71 | Build check | `npm run build` → 0 errors |
| 72 | Visual check 375px | Mobile: чёрный header, чёрный bottom nav |
| 73 | Visual check 768px | Sidebar с Bauhaus иконками |
| 74 | Visual check 1440px | = макапу |

---

## ЧАСТЬ 5: ROADMAP (9 ФАЗ, 80 ШАГОВ)

### Phase 0: ШРИФТЫ — Oswald вместо Bebas Neue (FOUNDATION)

1. `app/src/app/layout.tsx` — убрать `import Bebas_Neue`, добавить `import Oswald`
2. `app/src/app/layout.tsx` — убрать `const bebasNeue = Bebas_Neue(...)`, добавить `const oswald = Oswald({ weight: ["700"], subsets: ["latin", "cyrillic"], variable: "--font-oswald", display: "swap" })`
3. `app/src/app/layout.tsx` — body className: `bebasNeue.variable` → `oswald.variable`
4. `app/tailwind.config.ts` — fontFamily: `bebas: [...]` → `oswald: ['var(--font-oswald)', '"Oswald"', 'sans-serif']`
5. `app/src/app/page.tsx` — Hero H1: `font-bebas` → `font-oswald` (если есть)
6. Grep `font-bebas` → 0 (убедиться что нигде не осталось)
7. Grep `bebas` → 0 по всему app/src/
8. `npm run build` → 0 errors (проверить что Oswald подключается)

### Phase 1: Visual Language Icon System

9. Создать `app/src/components/icons/BauhausIcons.tsx` — 12 SVG компонентов (BI-01 до BI-12)
10. Каждый = inline SVG, fill-based (НЕ stroke), viewBox="0 0 24 24"
11. Palette СТРОГО #C1292E/#1A1A1A/#F5C518/#BC8279/#FFFFFF
12. Export все из одного файла: `export const IconDashboard = ...` etc.

### Phase 2: Dashboard Header → ЧЁРНЫЙ

13. `(dashboard)/layout.tsx` строка 21 → `bg-[#1A1A1A]`
14. `(dashboard)/layout.tsx` строка 25 → img `brightness-0 invert`
15. `LogoutButton.tsx` → text-white для кнопки
16. `LanguageSwitcher.tsx` → text-white, border-white/30, bg-transparent на чёрном

### Phase 3: globals.css — ЧЁРНЫЕ рамки + hover красная тень

17. `.dash-card` → `border-[#1A1A1A]`
18. `.dash-card:hover` → `border-[#C1292E]`, `box-shadow: 4px 4px 0 #C1292E`

### Phase 4: Recharts цвета (14 хардкодов → Bauhaus)

19. `material/[code]/page.tsx` — 8 замен (#2563eb→#C1292E, #16a34a→#F5C518, tooltip→sharp, рамка→чёрная)
20. `legierungsrechner/page.tsx` — 6 замен (#2563eb→#1A1A1A, #16a34a→#F5C518)
21. `opengraph-image.tsx` — 1 замена #2563eb→#C1292E
22. `twitter-image.tsx` — 1 замена #2563eb→#C1292E

### Phase 5: Шрифты на dashboard pages — font-oswald для titles/numbers, font-grotesk для labels

23. `dashboard/page.tsx` — title → font-oswald uppercase, KPI numbers → font-oswald, labels → font-grotesk uppercase (10 замен)
24. `material/[code]/page.tsx` — title → font-oswald uppercase, prices → font-oswald, chart title → font-grotesk uppercase (6 замен)

### Phase 6: DashboardNav → Bauhaus иконки + labels

25. Убрать `import { BarChart3, Bot, ... } from "lucide-react"`
26. Добавить `import { IconDashboard, IconForecasts, ... } from "@/components/icons/BauhausIcons"`
27. Заменить все 9 icon props на Bauhaus иконки
28. Labels → `font-grotesk text-xs uppercase tracking-wide font-semibold`
29. Mobile bottom nav → `bg-[#1A1A1A] border-t-2 border-brand-600 pb-6`
30. Mobile nav text → `text-white/60`, active → `text-brand-500`

### Phase 7: Остальные 17 dashboard pages — font-oswald для headings + font-grotesk для labels

31. `prognose/page.tsx` — h1 → font-oswald uppercase, labels → font-grotesk uppercase
32. `chat/page.tsx` — heading → font-oswald, labels → font-grotesk
33. `alerts/page.tsx` — heading → font-oswald, card labels → font-grotesk
34. `berichte/page.tsx` — heading → font-oswald
35. `preisgleitklausel/page.tsx` — heading → font-oswald, labels → font-grotesk
36. `legierungsrechner/page.tsx` — heading → font-oswald, labels → font-grotesk
37. `einstellungen/page.tsx` — heading → font-oswald
38. `einstellungen/abo/page.tsx` — heading + labels → font-grotesk
39. `einstellungen/api/page.tsx` — heading + labels → font-grotesk
40. `einstellungen/materialien/page.tsx` — heading + labels → font-grotesk
41. `einstellungen/team/page.tsx` — heading + labels → font-grotesk
42. `einstellungen/telegram/page.tsx` — heading + labels → font-grotesk
43. `einstellungen/whatsapp/page.tsx` — heading + labels → font-grotesk
44. `account/billing/page.tsx` — heading + labels → font-grotesk
45. `account/profile/page.tsx` — heading + labels → font-grotesk
46. `account/data/page.tsx` — heading + labels → font-grotesk
47. `account/security/page.tsx` — heading + labels → font-grotesk

### Phase 8: Verification (грепы + build + visual)

48. Grep `#2563eb` app/src/ → 0 (синий убит)
49. Grep `#16a34a` app/src/ → 0 (зелёный убит)
50. Grep `#3b82f6` app/src/ → 0
51. Grep `lucide-react` DashboardNav.tsx → 0 (Lucide убит)
52. Grep `border-gray-200` globals.css → 0 (серые рамки убиты)
53. Grep `borderRadius` material/[code]/page.tsx → все "0" (tooltip sharp)
54. Grep `font-bebas` app/src/ → 0 (Bebas убит)
55. Grep `bebas` app/src/ → 0
56. `npm run build` → 0 errors
57. Тест font-oswald: число "7.915,23" рендерится корректно
58. Visual check 375px — чёрный header, чёрный bottom nav, карточки stack 1 col
59. Visual check 768px — sidebar с Bauhaus иконками, Oswald headings
60. Visual check 1440px — = макапу Brand Identity

---

## ЧАСТЬ 6: ЧЕКЛИСТ ПРИЁМКИ

### Визуальное соответствие макапу
- [ ] Dashboard header — ЧЁРНЫЙ (#1A1A1A), белый лого, белый текст
- [ ] KPI карточки — ЧЁРНЫЕ рамки (border-[#1A1A1A])
- [ ] Главный график — КРАСНАЯ (#C1292E) линия/area, НЕ синяя
- [ ] Reference lines — ЖЁЛТАЯ (#F5C518) для min, КРАСНАЯ для max
- [ ] Tooltip графика — острые углы (borderRadius: 0), чёрная рамка
- [ ] Шрифт labels — Space Grotesk Bold, UPPERCASE, tracking-wide
- [ ] Шрифт цифр — Space Grotesk Bold или Bebas Neue
- [ ] Жёлтые KPI блоки для ключевых цифр

### Иконки
- [ ] `BauhausIcons.tsx` создан — 12 компонентов
- [ ] Каждая иконка — СТРОГО палитра #C1292E/#1A1A1A/#F5C518
- [ ] Sidebar: Lucide заменён на BauhausIcons
- [ ] Mobile bottom nav: Bauhaus иконки + чёрный фон

### Цвета
- [ ] Grep `#2563eb` → 0 results (синий убит)
- [ ] Grep `#16a34a` → 0 results (зелёный убит)
- [ ] Grep `#3b82f6` → 0 results
- [ ] Grep `border-gray-200` в globals.css → 0
- [ ] ВСЕ цвета только из палитры: #C1292E, #1A1A1A, #BC8279, #FFFFFF, #F5C518 + gray-* оттенки

### Шрифты
- [ ] Oswald 700 подключён (layout.tsx), Bebas Neue УБРАН
- [ ] tailwind.config: fontFamily oswald (НЕ bebas)
- [ ] Grep `font-bebas` → 0, Grep `bebas` → 0
- [ ] Dashboard titles — font-oswald uppercase (condensed bold)
- [ ] Dashboard крупные цифры — font-oswald
- [ ] Dashboard labels — font-grotesk uppercase tracking-wide
- [ ] Sidebar labels — font-grotesk uppercase
- [ ] Landing Hero H1 — font-oswald
- [ ] Нет серого полупрозрачного текста (text-gray-500 на labels → text-[#1A1A1A]/60)

### Техническое
- [ ] `npm run build` → 0 errors
- [ ] Desktop 1440px = макапу
- [ ] Tablet 768px — sidebar с Bauhaus иконками
- [ ] Mobile 375px — чёрный header + чёрный bottom nav
- [ ] LogoutButton видим на чёрном header
- [ ] LanguageSwitcher видим на чёрном header

---

## ЧАСТЬ 7: РИСКИ И МИТИГАЦИЯ

| # | Риск | Вероятность | Митигация |
|---|------|------------|-----------|
| 1 | Bauhaus иконки не узнаваемы | Средняя | Tooltip + label рядом. Тестировать на CEO. |
| 2 | Чёрный header + чёрный mobile nav = слишком тёмно | Низкая | Макап показывает именно так. CEO решение. |
| 3 | font-grotesk uppercase everywhere = трудно читать немецкий | Средняя | Только labels/headings uppercase, body остаётся Inter normal |
| 4 | Recharts tooltip без скругления — ugly | Низкая | Bauhaus = sharp. Всё sharp. |
| 5 | LogoutButton/LanguageSwitcher невидимы на чёрном | Высокая | Явно добавить text-white |
| 6 | Жёлтые KPI блоки — текст нечитаем | Средняя | Текст #1A1A1A на #F5C518 = контраст 8.5:1 (WCAG AAA) ✓ |
| 7 | 12 SVG иконок — можно ошибиться в paths | Средняя | Каждая иконка проверяется визуально |

### Breakpoints

| Breakpoint | Проверка |
|-----------|---------|
| 375px | Чёрный header (лого белый, visible). Чёрный bottom nav (иконки белые). Карточки stack 1 col. |
| 768px | Sidebar появляется с Bauhaus иконками. Grid 2 col. Header чёрный. |
| 1440px | Full layout = макапу. 4 KPI в ряд. Большой график. Нижний ряд 4 блока. |

### Якоря, навигация, JS, анимации
- **Якоря:** Не затронуты
- **Навигация:** Sidebar иконки меняются визуально. href/routing НЕ меняется. Логика isActive() — та же.
- **JS:** Recharts props меняются (цвета). Data flow — тот же. Никакой бизнес-логики не трогаем.
- **Анимации:** dash-appear — без изменений. fadeIn — без изменений.
- **Тесты:** Grep verification. Build. Visual compare.
