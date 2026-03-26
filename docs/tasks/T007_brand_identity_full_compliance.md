# T007 — Brand Identity Full Compliance: Цвета, скругления, шрифты

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #2 Lena Hoffmann — UX/UI Engineer
**Скилл:** ui-ux-pro-max
**Размер:** XL (глобальная работа, 50+ файлов)
**Референс:** `design/brand/Brand_Identity_CANCNYb6.png`

---

## Анализ Brand Identity (факты из файла)

### COLOR PALETTE (ровно 5 цветов + белый)

| # | Hex | Название | Где использовать |
|---|-----|---------|-----------------|
| 1 | `#C1292E` | Красный (Primary) | CTA, лого, акценты, активные элементы |
| 2 | `#1A1A1A` | Чёрный | Текст, фоны тёмных секций, заголовки |
| 3 | `#BC8279` | Терракота/Salmon | Вторичный акцент, графики, бордеры |
| 4 | `#FFFFFF` | Белый | Фоны, текст на тёмном |
| 5 | `#F5C518` | Жёлтый/Gold | Акцент, графики, выделение, hover |

**ЗАПРЕЩЁННЫЕ цвета (сейчас используются в коде):**
- `emerald` / `green` — 4 файла (success states, pulse-dot)
- `blue` — 2 файла (PlanBadge, billing)
- `amber` / `orange` — 5 файлов (категории, alerts)
- `red` (Tailwind default) — отличается от brand #C1292E
- `slate` / `stone` / `rose` — dashboard category colors
- Все Tailwind gray-* допустимы как оттенки #1A1A1A

### ЗАМЕНА ЗАПРЕЩЁННЫХ ЦВЕТОВ

| Было | Станет | Логика |
|------|--------|--------|
| `emerald-500` / `green-*` (success, up trend) | `#F5C518` (жёлтый) | Позитивный тренд = жёлтый |
| `red-600` (danger, down trend) | `#C1292E` (brand red) | Негативный тренд = красный |
| `blue-100/700` (Pro badge) | `#F5C518` bg + `#1A1A1A` text | Бейдж Pro = жёлтый |
| `amber-100/700` (Team badge) | `#BC8279` bg + `#FFFFFF` text | Бейдж Team = терракота |
| `emerald-500` (pulse-dot, live indicator) | `#F5C518` (жёлтый) | Живой = жёлтый точка |
| `slate-600` (Stahl category) | `#C1292E` (красный) | Stahl = primary |
| `blue-600` (Metal category) | `#1A1A1A` (чёрный) | Metal = чёрный |
| `stone-600` (Beton category) | `#BC8279` (терракота) | Beton = терракота |
| `amber-600` (Holz category) | `#F5C518` (жёлтый) | Holz = жёлтый |
| `rose-600` (Insulation category) | `#C1292E` opacity 0.6 | Dämmstoffe = красный lighter |
| `orange-600` (Energy category) | `#F5C518` opacity 0.7 | Energie = жёлтый darker |
| `green-100/700` (buy recommendation) | `#F5C518` bg + `#1A1A1A` text | Jetzt kaufen = жёлтый |
| `yellow-100/700` (wait recommendation) | `#BC8279` bg + `#FFFFFF` text | Abwarten = терракота |

### ШРИФТЫ

Из визуала Brand Identity:

| Элемент | Шрифт в визуале | Текущий шрифт | Действие |
|---------|----------------|---------------|---------|
| Headlines ("MATERIALPREISE. DIGITAL.") | **Похож на Bebas Neue / Impact** — ultra-condensed, all-caps, bold | Space Grotesk 700 | Заменить на Bebas Neue для больших заголовков |
| Sub-headlines ("BAUHAUS DATEN FÜR DIE BAUINDUSTRIE") | **Space Grotesk** или подобный geometric sans | Space Grotesk 700 | Оставить |
| Body text | **Inter** или подобный clean sans | Inter | Оставить |

**Вывод по шрифтам:**
- Headlines (H1, hero) = **Bebas Neue** (ultra-condensed, uppercase, как в визуале)
- Sub-heads, labels, UI = **Space Grotesk** (geometric, Bauhaus-compatible)
- Body = **Inter** (читаемый, оставить)

### СКРУГЛЕНИЯ (КРИТИЧНО!)

Из визуала: **ВСЕ элементы ОСТРЫЕ. Никаких скруглений.**
- Карточки = острые углы (`rounded-none` или `rounded-sm` максимум)
- Кнопки = острые (`rounded-none` или `rounded-sm`)
- Бейджи = острые
- Инпуты = острые
- Модалки = острые
- Mockup dashboard = острые углы

**Текущее состояние: 295 скруглений в 49 файлах!** Всё нужно убрать.

| Класс | Количество | Заменить на |
|-------|-----------|-------------|
| `rounded-xl` | ~100 | `rounded-none` |
| `rounded-lg` | ~80 | `rounded-none` |
| `rounded-2xl` | ~30 | `rounded-none` |
| `rounded-full` | ~40 | `rounded-none` (кроме аватаров и dots) |
| `rounded-md` | ~20 | `rounded-none` |
| `rounded-3xl` | ~5 | `rounded-none` |
| `rounded` | ~20 | `rounded-none` |

**Исключения** (оставить скругления):
- Аватары пользователей (`rounded-full` на кружочках)
- Pulse-dot индикатор (2x2 кружок)
- Выпадающие селекты LanguageSwitcher (системный)

---

## Файлы затронуты

### Phase 1: Foundation (tailwind.config + globals.css + layout.tsx)

| Файл | Что меняется |
|------|-------------|
| `tailwind.config.ts` | Убрать ненужные brand shades, оставить только 5 цветов. Добавить fontFamily bebas. |
| `globals.css` | `.dash-card` → `rounded-none`. `.sidebar-item` → `rounded-none`. `.eyebrow` проверить. |
| `layout.tsx` | Добавить Bebas Neue font import |

### Phase 2: Landing page (page.tsx)

| Файл | Что меняется |
|------|-------------|
| `page.tsx` | Все `rounded-*` → `rounded-none`. Все emerald/green → yellow. H1 → Bebas Neue. |

### Phase 3: Marketing pages (6 файлов)

| Файл | Что меняется |
|------|-------------|
| `MarketingHeader.tsx` | `rounded-lg` на CTA → sharp |
| `MarketingFooter.tsx` | Проверить |
| `PreiseClient.tsx` | Pricing cards rounded → sharp |
| `UeberUnsClient.tsx` | Cards rounded → sharp |
| `KontaktClient.tsx` | Form inputs rounded → sharp |
| `BlogClient.tsx` | Cards rounded → sharp |
| `LegalPageShell.tsx` | Container rounded → sharp |

### Phase 4: Dashboard layout + nav (3 файла)

| Файл | Что меняется |
|------|-------------|
| `(dashboard)/layout.tsx` | Проверить скругления |
| `DashboardNav.tsx` | `.sidebar-item` уже в globals. Mobile bottom nav. |
| `MobileNav.tsx` | Menu rounded → sharp |

### Phase 5: Dashboard pages (15+ файлов)

| Файл | Что меняется |
|------|-------------|
| `dashboard/page.tsx` | CATEGORY_COLORS → 5 Bauhaus цветов. Все rounded → sharp. Green/red trend → yellow/brand. |
| `material/[code]/page.tsx` | Chart colors, rounded, trend colors |
| `prognose/page.tsx` | Colors, rounded |
| `chat/page.tsx` | Chat bubbles rounded → sharp |
| `alerts/page.tsx` | Cards, badges rounded → sharp |
| `berichte/page.tsx` | Cards rounded → sharp |
| `preisgleitklausel/page.tsx` | Calculator, inputs rounded → sharp |
| `legierungsrechner/page.tsx` | Calculator, inputs, 41 rounded! → sharp |
| `einstellungen/*.tsx` (6 файлов) | All settings pages |
| `account/*.tsx` (4 файла) | All account pages |

### Phase 6: Components (10 файлов)

| Файл | Что меняется |
|------|-------------|
| `TrialBanner.tsx` | rounded → sharp, colors |
| `TrialFeatureBanner.tsx` | rounded → sharp, blue → bauhaus |
| `UpgradeCard.tsx` | rounded → sharp |
| `PlanBadge.tsx` | blue/amber → yellow/salmon |
| `WelcomeTour.tsx` | rounded → sharp |
| `Skeleton.tsx` | rounded → sharp (9 occurrences) |
| `HelpIcon.tsx` | rounded → sharp |
| `CookieConsent.tsx` | rounded → sharp |
| `LogoutButton.tsx` | rounded → sharp |
| `LanguageSwitcher.tsx` | rounded → sharp |

### Phase 7: Auth + Error pages (8 файлов)

| Файл | Что меняется |
|------|-------------|
| `sign-in/page.tsx` | rounded → sharp |
| `sign-up/page.tsx` | rounded → sharp |
| `onboarding/page.tsx` | rounded → sharp (11 occurrences!) |
| `error.tsx` (root) | rounded → sharp |
| `loading.tsx` (root) | rounded → sharp |
| `not-found.tsx` | rounded → sharp |
| `(auth)/error.tsx` | rounded → sharp |
| `(marketing)/error.tsx` | rounded → sharp |

---

## БЫЛО → СТАНЕТ (конкретно)

### Цвета в dashboard/page.tsx

```tsx
// БЫЛО
const CATEGORY_COLORS = {
  steel: "text-slate-600",
  metal: "text-blue-600",
  concrete: "text-stone-600",
  wood: "text-amber-600",
  insulation: "text-rose-600",
  energy: "text-orange-600",
};

// СТАНЕТ
const CATEGORY_COLORS = {
  steel: "text-bauhaus-red",
  metal: "text-bauhaus-black",
  concrete: "text-bauhaus-salmon",
  wood: "text-bauhaus-yellow",
  insulation: "text-bauhaus-red/60",
  energy: "text-bauhaus-yellow",
};
```

### Trend colors

```tsx
// БЫЛО
item.change > 0 ? "text-red-600" : "text-green-600"

// СТАНЕТ
item.change > 0 ? "text-bauhaus-red" : "text-bauhaus-yellow"
```

### Recommendation badges

```tsx
// БЫЛО
buy_now: "bg-green-100 text-green-700"
wait: "bg-yellow-100 text-yellow-700"
observe: "bg-gray-100 text-gray-700"

// СТАНЕТ
buy_now: "bg-[#F5C518] text-[#1A1A1A]"
wait: "bg-[#BC8279] text-white"
observe: "bg-gray-200 text-[#1A1A1A]"
```

### Скругления (глобально)

```
rounded-xl → rounded-none
rounded-lg → rounded-none
rounded-2xl → rounded-none
rounded-3xl → rounded-none
rounded-md → rounded-none
rounded (без суффикса) → rounded-none

ИСКЛЮЧЕНИЯ (не трогать):
rounded-full на аватарах/dots (2-3 места)
```

### Шрифты

```tsx
// layout.tsx — ДОБАВИТЬ
import { Inter, Space_Grotesk, Bebas_Neue } from "next/font/google";
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });

// tailwind.config.ts — ДОБАВИТЬ
fontFamily: {
  bebas: ['var(--font-bebas)', '"Bebas Neue"', 'sans-serif'],
  grotesk: ['var(--font-grotesk)', '"Space Grotesk"', 'sans-serif'],
}

// Hero H1
className="font-bebas text-6xl lg:text-8xl uppercase"
// вместо font-grotesk
```

---

## Что может сломаться

| Риск | Вероятность | Митигация |
|------|------------|-----------|
| Острые углы на мобильном выглядят грубо | Средняя | Проверить 375px — если плохо, добавить `rounded-sm` |
| Жёлтый для "success" непривычен | Низкая | Bauhaus стиль — CEO решение |
| Bebas Neue не поддерживает кириллицу | Средняя | Fallback на Space Grotesk для ru locale |
| 295 замен rounded → можно пропустить | Высокая | Финальный grep на `rounded-(xl\|lg\|2xl\|md)` |
| Inputs без скругления выглядят "жёстко" | Низкая | Brand identity requirement |

### Breakpoints

| Breakpoint | Что проверить |
|-----------|--------------|
| 375px | Острые карточки, кнопки читаемы |
| 768px | Dashboard sidebar sharp edges |
| 1440px | Full layout, все элементы sharp |

---

## Roadmap (7 фаз, 21 шаг)

### Phase 1: Foundation
1. `tailwind.config.ts` — добавить fontFamily bebas, проверить все цвета только 5 Bauhaus
2. `globals.css` — `.dash-card` rounded-none, `.sidebar-item` rounded-none
3. `layout.tsx` — добавить Bebas Neue font import + CSS variable

### Phase 2: Landing page
4. `page.tsx` — все rounded → sharp, emerald → yellow, Hero H1 → font-bebas

### Phase 3: Marketing pages
5. 6 файлов — все rounded → sharp, запрещённые цвета → Bauhaus palette

### Phase 4: Dashboard layout
6. `(dashboard)/layout.tsx` — sharp edges
7. `DashboardNav.tsx` — sidebar items sharp
8. `MobileNav.tsx` — menu sharp

### Phase 5: Dashboard pages
9. `dashboard/page.tsx` — CATEGORY_COLORS → Bauhaus, trend colors → yellow/red, recommendations → yellow/salmon, rounded → sharp
10. `material/[code]/page.tsx` — chart colors Bauhaus, rounded sharp
11. Остальные 13 dashboard pages — rounded → sharp, colors → Bauhaus

### Phase 6: Components
12. `PlanBadge.tsx` — blue → yellow, amber → salmon
13. `TrialBanner.tsx` — sharp, colors
14. Остальные 8 компонентов — sharp, colors

### Phase 7: Auth + Error + Verification
15. 8 auth/error/loading pages — sharp
16. Grep verification: 0 результатов на `rounded-(xl|lg|2xl|md|3xl)` (кроме rounded-full на dots/avatars)
17. Grep verification: 0 результатов на `emerald|green-[1-9]|blue-[1-9]|amber|orange|rose|slate|stone|violet|purple|pink|teal|cyan`
18. `npm run build` → 0 errors
19. Visual check: 375 / 768 / 1440

---

## Чеклист приёмки

- [ ] Только 5 цветов + серые оттенки (#C1292E, #1A1A1A, #BC8279, #FFFFFF, #F5C518)
- [ ] НОЛЬ запрещённых цветов: grep emerald/green/blue/amber/orange/rose/slate/stone = 0
- [ ] НОЛЬ скруглений: grep rounded-(xl|lg|2xl|md|3xl) = 0 (кроме full на dots/avatars)
- [ ] Bebas Neue подключён для Hero H1
- [ ] Space Grotesk для sub-headlines, labels
- [ ] Inter для body text
- [ ] Dashboard categories = 5 Bauhaus цветов
- [ ] Trend up = жёлтый, trend down = красный
- [ ] PlanBadge: Pro = жёлтый, Team = терракота
- [ ] Все карточки, кнопки, инпуты = sharp edges
- [ ] `npm run build` → 0 errors
- [ ] Desktop 1440px — визуал соответствует Brand Identity
- [ ] Mobile 375px — не сломано
- [ ] CEO одобрил
