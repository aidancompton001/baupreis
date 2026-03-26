# T015 — Marketing Pages Bauhaus Redesign (Preise + Über Uns + Kontakt)

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap готов, ждёт ОК
**Ответственный:** #2 Lena Hoffmann — UX/UI Engineer
**Размер:** L
**Скилл:** `ui-ux-pro-max`

---

## Цель

Привести 3 marketing-страницы в единый Bauhaus Bold стиль: чёрные рамки, Oswald/Grotesk шрифты, red/yellow/black палитра, sharp corners, shadow-[6px_6px_0], tiles из T013.

---

## Что БЫЛО → что СТАНЕТ

### 1. PREISE (Pricing)

| Элемент | БЫЛО | СТАНЕТ |
|---------|------|--------|
| Hero | `pt-32` plain, generic `text-4xl font-bold text-gray-900` | Чёрный bg-[#1A1A1A] hero, белый Oswald заголовок, yellow accent |
| Toggle | `bg-gray-100 rounded-none` generic | `border-2 border-[#1A1A1A]` toggle как в IndexChart |
| Cards Basis/Team | `border hover:shadow-lg` тонкая рамка | `border-2 border-[#1A1A1A]` + hover `shadow-[4px_4px_0_#C1292E]` |
| Card Pro | `border-2 border-brand-600 shadow-lg` | `border-[3px] border-[#C1292E] shadow-[6px_6px_0_#C1292E]` + yellow badge |
| Check/X marks | Generic `&#10003;` / `&#10007;` | SVG check (red) / SVG x (gray) как на Landing |
| Price font | `text-4xl font-bold` generic | `font-oswald text-5xl` |
| CTA buttons | `rounded-none` generic | `shadow-[4px_4px_0_#1A1A1A]` Bauhaus buttons |
| Disclaimer | `bg-gray-50` | `border-2 border-[#1A1A1A] bg-white` |
| Tiles | CompositionCornerTL opacity 8% | `TileDiagYellowBlack` в углу hero (small) |

### 2. ÜBER UNS (About Us)

| Элемент | БЫЛО | СТАНЕТ |
|---------|------|--------|
| Hero | `bg-gradient-to-br from-brand-600` generic gradient | `bg-[#1A1A1A]` solid black, white Oswald title, red accent line |
| Hero font | `font-grotesk text-4xl` | `font-oswald text-5xl sm:text-6xl uppercase` |
| Cards | `border border-gray-100 hover:shadow-lg` soft | `border-2 border-[#1A1A1A]` + hover `shadow-[4px_4px_0_#C1292E]` |
| Icon boxes | `rounded-none bg-brand-50` | `bg-[#C1292E]` red bg, white SVG icon |
| Card text | Generic gray | `font-grotesk` explicitly |
| Tiles | Нет | `TileRedYellowSplit` + `TileCircleOnBlack` как декор рядом с hero |

### 3. KONTAKT (Contact)

| Элемент | БЫЛО | СТАНЕТ |
|---------|------|--------|
| Hero | `bg-gradient-to-br from-brand-600` generic | `bg-[#1A1A1A]` solid black, Oswald title |
| Info card | `border border-gray-100 shadow-sm` | `border-2 border-[#1A1A1A] shadow-[4px_4px_0_#F5C518]` yellow shadow |
| Form card | `border border-gray-100 shadow-lg` | `border-2 border-[#1A1A1A] shadow-[6px_6px_0_#C1292E]` |
| Inputs | `border-gray-200 focus:ring-2` | `border-2 border-[#1A1A1A] focus:border-[#C1292E]` |
| Submit btn | `bg-brand-600 rounded-none shadow-md` | `bg-[#C1292E] shadow-[4px_4px_0_#1A1A1A] font-oswald uppercase` |
| Email link | `text-brand-600` | `text-[#C1292E] font-bold` |
| Tiles | Нет | `TileCircleOnYellow` рядом с info card (декор) |

---

## Общие Bauhaus Bold правила (все 3 страницы)

| Правило | Значение |
|---------|---------|
| Borders | `border-2 border-[#1A1A1A]` (не border-gray) |
| Shadows | `shadow-[4px_4px_0_#C1292E]` или `shadow-[6px_6px_0_#C1292E]` |
| Headings | `font-oswald uppercase` |
| Body | `font-grotesk` |
| Buttons | `rounded-none shadow-[4px_4px_0_#1A1A1A] uppercase tracking-wide font-bold` |
| Colors | `#C1292E` (red), `#1A1A1A` (black), `#F5C518` (yellow), `#FFFFFF` (white) |
| rounded | ВСЕГДА `rounded-none` (Bauhaus = no rounding) |
| Hero bg | `bg-[#1A1A1A]` solid black (не gradient) |

---

## Файлы затронуты

| Файл | Что меняется |
|------|-------------|
| `app/src/app/(marketing)/preise/PreiseClient.tsx` | Полный Bauhaus redesign |
| `app/src/app/(marketing)/ueber-uns/UeberUnsClient.tsx` | Полный Bauhaus redesign |
| `app/src/app/(marketing)/kontakt/KontaktClient.tsx` | Полный Bauhaus redesign |

### НЕ затронуты
- Landing page (уже в стиле)
- Dashboard pages
- API routes, database
- DashboardSubNav, Header
- i18n (ключи те же)
- globals.css

---

## Что может сломаться

| Риск | Вероятность | Mitigation |
|------|------------|-----------|
| Pricing карточки: badge "Beliebt" позиционирование | Средняя | Тестировать absolute positioning |
| Contact form: focus states после смены border | Средняя | Проверить focus:border-[#C1292E] |
| Tiles import не используется → tree-shaking | Низкая | Import only used tiles |
| Hero text contrast на чёрном bg | Низкая | White text on #1A1A1A = max contrast |

---

## Breakpoints

| Breakpoint | Preise | Über Uns | Kontakt |
|-----------|--------|----------|---------|
| **375px** | 1 col cards, stacked | 1 col cards | 1 col (info + form stacked) |
| **768px** | 2 col (Basis+Pro), Team below | 2 col grid | sidebar info + form |
| **1440px** | 3 col grid | 2 col grid | sidebar info + form |

---

## Навигация, JS, анимации

- **Навигация:** Не затронута
- **JS:** IntersectionObserver остаётся на UeberUns + Kontakt
- **Анимации:** `animate-on-scroll` + `anim-delay-N` остаются
- **Якоря:** Нет anchor-ов на этих страницах

---

## Roadmap

### Phase 1 — Preise
1. Rewrite PreiseClient.tsx: black hero, Bauhaus cards, Oswald prices, shadow buttons, tile

### Phase 2 — Über Uns
2. Rewrite UeberUnsClient.tsx: black hero, Bauhaus cards with red icon boxes, tiles

### Phase 3 — Kontakt
3. Rewrite KontaktClient.tsx: black hero, Bauhaus form/info cards, styled inputs, tile

### Phase 4 — Verify
4. `npm run build` → 0 errors
5. Проверить 375/768/1440 все 3 страницы

---

## Чеклист приёмки

- [ ] Preise: чёрный hero, border-2 cards, shadow buttons, Oswald цены
- [ ] Über Uns: чёрный hero, красные icon-боксы, border-2 cards
- [ ] Kontakt: чёрный hero, styled form inputs, shadow cards
- [ ] Все 3: font-oswald headings, font-grotesk body, no rounded corners
- [ ] Все 3: shadow-[Npx_Npx_0_color] на ключевых элементах
- [ ] Tiles интегрированы где уместно
- [ ] Responsive: 375 / 768 / 1440
- [ ] `npm run build` → 0 errors
