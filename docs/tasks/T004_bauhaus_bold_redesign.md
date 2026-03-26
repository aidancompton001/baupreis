# T004 — Bauhaus Bold Redesign: Landing + Dashboard + All Pages

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #2 Lena Hoffmann — UX/UI + #3 Maximilian Braun — Frontend
**Скилл:** ui-ux-pro-max
**Размер:** XL (кросс-доменная, 50+ файлов)
**Референс:** `design/prototypes/variant-2-bauhaus-bold.html` + `variant-2-dashboard.html`

---

## Решение CEO

**Bauhaus Bold** — финальное направление дизайна.

---

## Новая Design System

### Цвета

| Токен | БЫЛО (текущее) | СТАНЕТ (Bauhaus Bold) |
|-------|----------------|----------------------|
| `brand-600` (primary) | `#2563eb` (синий) | `#C1292E` (красный) |
| `brand-700` (hover) | `#1d4ed8` | `#A81F24` |
| `brand-500` | `#3b82f6` | `#D93338` |
| `brand-400` | `#60a5fa` | `#E25A5E` |
| `brand-300` | `#93c5fd` | `#F09092` |
| `brand-200` | `#bfdbfe` | `#FECACA` |
| `brand-100` | `#dbeafe` | `#FEE2E2` |
| `brand-50` | `#eff6ff` | `#FEF2F2` |
| `brand-800` | `#1e40af` | `#8B1A1E` |
| `brand-900` | `#1e3a8a` | `#6B1215` |
| `brand-950` | `#172554` | `#450C0E` |
| `indigo-600` (accent) | `#4F46E5` | `#F5C518` (жёлтый) |
| `indigo-400` | `#818CF8` | `#F5C518` |
| `indigo-200` | `#C7D2FE` | `#FEF9C3` |
| `indigo-50` | `#EEF2FF` | `#FFFDE7` |

### Новые кастомные цвета (tailwind extend)

```
bauhaus-red: #C1292E
bauhaus-black: #1A1A1A
bauhaus-yellow: #F5C518
bauhaus-salmon: #BC8279
```

### Типографика

| Элемент | БЫЛО | СТАНЕТ |
|---------|------|--------|
| Headlines | Inter 800/900 | Space Grotesk 700 |
| Body | Inter 400/500 | Inter 400/500 (без изменений) |
| Labels/Eyebrows | Inter 700 uppercase | Space Grotesk 700 uppercase |

### Стиль

| Элемент | БЫЛО | СТАНЕТ |
|---------|------|--------|
| Glassmorphism | bg-white/80 backdrop-blur | Solid borders, box-shadow: offset |
| Card shadows | indigo-tinted soft shadow | `4px 4px 0 color` (Bauhaus hard shadow) |
| Border radius | rounded-2xl (16px) | rounded-xl (12px) — чуть острее |
| Active sidebar | gradient from-brand-50 | solid bg + red left border |
| CTA buttons | bg-indigo-600 rounded-xl | bg-red + box-shadow: 4px 4px 0 black |
| Hero gradient | #fff → #EEF2FF | White + geometric shapes (CSS) |
| Dark section | bg-gray-900 + indigo accents | bg-black (#1A1A1A) + red/yellow accents |

---

## Файлы затронуты (по фазам)

### Phase 1: Foundation (tokens + globals) — 3 файла

| Файл | Что меняется |
|------|-------------|
| `app/tailwind.config.ts` | brand palette 50-950 → Bauhaus red. Добавить bauhaus-yellow, bauhaus-salmon. Добавить fontFamily Space Grotesk |
| `app/src/app/globals.css` | CSS variables, .dash-card (убрать backdrop-blur → hard shadow), .eyebrow, .gradient-text, .sidebar-* |
| `app/src/app/layout.tsx` | Добавить Space Grotesk import рядом с Inter |

### Phase 2: Landing Page — 2 файла

| Файл | Что меняется |
|------|-------------|
| `app/src/app/page.tsx` | Полная переделка: hero (geometric shapes вместо gradient), nav цвета, buttons, dark section, stats, feature sections, pricing, FAQ, все indigo → red/yellow |
| `app/src/components/MobileNav.tsx` | brand-600 → bauhaus-red |

### Phase 3: Marketing pages — 6 файлов

| Файл | Что меняется |
|------|-------------|
| `app/src/components/marketing/MarketingHeader.tsx` | Logo color, CTA, nav links |
| `app/src/components/marketing/MarketingFooter.tsx` | Colors, Bauhaus color bar |
| `app/src/components/marketing/LegalPageShell.tsx` | Accent colors |
| `app/src/app/(marketing)/preise/PreiseClient.tsx` | Pricing cards: border, CTA, featured badge |
| `app/src/app/(marketing)/ueber-uns/UeberUnsClient.tsx` | Accent colors |
| `app/src/app/(marketing)/kontakt/KontaktClient.tsx` | Form styles, CTA |

### Phase 4: Dashboard Layout + Nav — 4 файла

| Файл | Что меняется |
|------|-------------|
| `app/src/app/(dashboard)/layout.tsx` | Header: убрать glassmorphism → solid + red border. Background gradient → solid gray-50 |
| `app/src/components/layout/DashboardNav.tsx` | Sidebar: solid bg, red active border, Space Grotesk labels. Mobile bottom nav: red active |
| `app/src/app/(dashboard)/loading.tsx` | Spinner: brand-200/600 → red |
| `app/src/app/(dashboard)/error.tsx` | Button color |

### Phase 5: Dashboard Pages — 12+ файлов

| Файл | Что меняется |
|------|-------------|
| `app/src/app/(dashboard)/dashboard/page.tsx` | CATEGORY_COLORS → Bauhaus mapping, CATEGORY_BORDER → Bauhaus, index banner gradient → black + red shadow, card styles |
| `app/src/app/(dashboard)/material/[code]/page.tsx` | Chart colors, accent colors |
| `app/src/app/(dashboard)/prognose/page.tsx` | Chart colors, cards |
| `app/src/app/(dashboard)/chat/page.tsx` | Chat bubble colors |
| `app/src/app/(dashboard)/alerts/page.tsx` | Badge colors, cards |
| `app/src/app/(dashboard)/berichte/page.tsx` | Report cards |
| `app/src/app/(dashboard)/preisgleitklausel/page.tsx` | Calculator styles |
| `app/src/app/(dashboard)/legierungsrechner/page.tsx` | Alloy calc styles |
| `app/src/app/(dashboard)/einstellungen/page.tsx` | Settings cards |
| `app/src/app/(dashboard)/einstellungen/abo/page.tsx` | Subscription buttons |
| `app/src/app/(dashboard)/einstellungen/telegram/page.tsx` | Integration cards |
| + остальные settings/account pages | Accent colors |

### Phase 6: Dashboard Components — 7 файлов

| Файл | Что меняется |
|------|-------------|
| `app/src/components/dashboard/TrialBanner.tsx` | bg-brand-50 → red-light, border/text |
| `app/src/components/dashboard/TrialFeatureBanner.tsx` | gradient → solid Bauhaus |
| `app/src/components/dashboard/UpgradeCard.tsx` | gradient → solid, border, CTA |
| `app/src/components/dashboard/PlanBadge.tsx` | Pro: yellow bg. Team: red bg |
| `app/src/components/dashboard/WelcomeTour.tsx` | Popup styling |
| `app/src/components/dashboard/Skeleton.tsx` | Skeleton colors |
| `app/src/components/ui/HelpIcon.tsx` | hover brand-600 → red |

### Phase 7: Auth + Other — 6 файлов

| Файл | Что меняется |
|------|-------------|
| `app/src/app/(auth)/sign-in/.../page.tsx` | brand-600 → red |
| `app/src/app/(auth)/sign-up/.../page.tsx` | brand-600 → red |
| `app/src/app/error.tsx` | Button color |
| `app/src/app/loading.tsx` | Spinner color |
| `app/src/app/not-found.tsx` | Link color |
| `app/src/components/CookieConsent.tsx` | brand-600 → red |

---

## Что БЫЛО → Что СТАНЕТ (конкретные значения)

### globals.css

```css
/* БЫЛО */
.eyebrow { @apply text-indigo-600; }
.gradient-text { @apply bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent; }
.dash-card { @apply bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-[...indigo...]; }
.sidebar-item-active { @apply bg-gradient-to-r from-brand-50 to-transparent border-l-brand-600 text-brand-600; }

/* СТАНЕТ */
.eyebrow { @apply text-bauhaus-red; font-family: 'Space Grotesk', sans-serif; }
.gradient-text { color: #C1292E; } /* solid red, no gradient */
.dash-card { @apply bg-white rounded-xl border-2 border-gray-200 shadow-none transition-all; }
.dash-card:hover { box-shadow: 4px 4px 0 #E5E7EB; transform: translateY(-2px); }
.sidebar-item-active { @apply bg-red-50 border-l-[3px] border-l-[#C1292E] text-[#C1292E] font-semibold; }
```

### tailwind.config.ts

```ts
// БЫЛО
brand: { 600: "#2563eb", ... }

// СТАНЕТ
brand: {
  50: "#FEF2F2", 100: "#FEE2E2", 200: "#FECACA", 300: "#F09092",
  400: "#E25A5E", 500: "#D93338", 600: "#C1292E", 700: "#A81F24",
  800: "#8B1A1E", 900: "#6B1215", 950: "#450C0E",
},
bauhaus: { red: "#C1292E", black: "#1A1A1A", yellow: "#F5C518", salmon: "#BC8279" },
fontFamily: { grotesk: ['"Space Grotesk"', 'sans-serif'] },
```

### Hero (page.tsx)

```
БЫЛО: linear-gradient(180deg, #fff 0%, #EEF2FF 50%, #fff 100%) + radial indigo glows
СТАНЕТ: white bg + CSS geometric shapes (red circle, yellow square, black rectangle) + no gradient
```

### Dashboard Index Banner

```
БЫЛО: bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700
СТАНЕТ: bg-[#1A1A1A] + box-shadow: 6px 6px 0 #C1292E + geometric ::before accent
```

---

## Что может сломаться

| Риск | Вероятность | Митигация |
|------|------------|-----------|
| Контраст текста < 4.5:1 с новыми цветами | Средняя | WCAG check после каждой фазы |
| Glassmorphism removal → карточки выглядят "плоско" | Низкая | Bauhaus hard shadows компенсируют |
| Category colors в dashboard нечитаемы | Средняя | Тест каждой категории отдельно |
| Hero geometric shapes ломают mobile layout | Средняя | overflow:hidden + responsive sizes |
| Recharts графики не подхватят новые цвета | Высокая | Charts используют хардкод цвета → менять отдельно |
| 52 страницы — можно пропустить файл | Высокая | Grep `brand-600\|indigo-600\|#2563eb\|#4F46E5` после всех фаз |
| E2E тесты с цвет-зависимыми селекторами | Низкая | Тесты используют data-tour, не цвета |

### Breakpoints

| Breakpoint | Что проверить |
|-----------|--------------|
| 375px | Hero geometric shapes не вылезают, bottom nav с новыми цветами, cards stack |
| 768px | Sidebar появляется с новым стилем, grid 2 cols |
| 1440px | Full layout, все карточки видны, geometric shapes по местам |

### Якоря, навигация, JS, анимации

- **Якоря:** Landing sections по id — НЕ затронуты
- **Навигация:** Sidebar + header — ПОЛНОСТЬЮ меняется стиль
- **JS:** IntersectionObserver, useEffect — логика та же, визуал меняется
- **Анимации:** fadeIn* — ОСТАВИТЬ, добавить prefers-reduced-motion. Убрать backdrop-blur анимации

---

## Roadmap (7 фаз, 24 шага)

### Phase 1: Foundation (Design Tokens)
1. Обновить `tailwind.config.ts` — новый brand palette + bauhaus colors + fontFamily grotesk
2. Обновить `globals.css` — все кастомные классы (.eyebrow, .gradient-text, .dash-card, .sidebar-*)
3. Обновить `layout.tsx` — добавить Space Grotesk font import
4. `npm run build` → проверить 0 errors

### Phase 2: Landing Page
5. Переписать Hero section в `page.tsx` — geometric shapes, Bauhaus typography, new CTA buttons
6. Переписать Problem section — black bg + red/yellow/salmon accents
7. Переписать Feature sections — new card style, eyebrow colors
8. Переписать Pricing section — Bauhaus cards with hard shadows
9. Переписать nav bar + `MobileNav.tsx`
10. `npm run build` → проверить

### Phase 3: Marketing Pages
11. Обновить `MarketingHeader.tsx` — red border, logo, CTA
12. Обновить `MarketingFooter.tsx` — Bauhaus color bar
13. Обновить `PreiseClient.tsx` — pricing cards
14. Обновить остальные marketing pages (kontakt, ueber-uns, blog, legal)
15. `npm run build` → проверить

### Phase 4: Dashboard Layout
16. Обновить `(dashboard)/layout.tsx` — header solid + red border
17. Обновить `DashboardNav.tsx` — sidebar Bauhaus style + mobile bottom nav
18. `npm run build` → проверить

### Phase 5: Dashboard Pages
19. Обновить `dashboard/page.tsx` — category colors, index banner, card styles
20. Обновить все feature pages (material, prognose, chat, alerts, berichte, preisgleitklausel, legierungsrechner)
21. Обновить settings + account pages

### Phase 6: Components + Auth
22. Обновить все dashboard components (TrialBanner, UpgradeCard, PlanBadge, WelcomeTour, HelpIcon, CookieConsent)
23. Обновить auth pages + error/loading/not-found

### Phase 7: Verification
24. Grep по всему app/src/ на остатки старых цветов (`indigo-600`, `#4F46E5`, `#2563eb`, `brand-600` если пропущен)
25. WCAG AA контраст check на ключевых страницах
26. Responsive check: 375 / 768 / 1440 — landing + dashboard
27. `npm run build` → финальный
28. E2E тесты если есть

---

## Чеклист приёмки

- [ ] `tailwind.config.ts` — новая палитра brand + bauhaus + fontFamily
- [ ] `globals.css` — все custom classes обновлены
- [ ] Space Grotesk подключён в layout.tsx
- [ ] Landing page — Bauhaus Bold стиль (как в prototype)
- [ ] Dashboard — Bauhaus Bold стиль (как в dashboard prototype)
- [ ] Marketing pages — единый стиль
- [ ] Auth pages — единый стиль
- [ ] Sidebar — red active, solid bg (без glassmorphism)
- [ ] Cards — hard shadow вместо backdrop-blur
- [ ] CTA buttons — red + box-shadow: 4px 4px 0 black
- [ ] 16 материалов — category colors маппятся на Bauhaus palette
- [ ] Grep: 0 результатов на `indigo-600`, `#4F46E5`, `#2563eb` (в CSS/TSX)
- [ ] WCAG AA: контраст 4.5:1+ на всех текстах
- [ ] Responsive: 375 / 768 / 1440 — не ломается
- [ ] `npm run build` → 0 errors
- [ ] CEO одобрил финальный результат
