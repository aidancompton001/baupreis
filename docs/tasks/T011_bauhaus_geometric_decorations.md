# T011 — Bauhaus Geometric Decorations System

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap готов, ждёт ОК
**Ответственный:** #2 Lena Hoffmann — UX/UI Engineer
**Размер:** L
**Скилл:** `ui-ux-pro-max`

---

## Цель

Создать систему переиспользуемых Bauhaus-геометрических декоративных элементов (треугольники, круги, прямоугольники, ромбы) из Visual Language бренда и внедрить их на сайт как фоновые/оверлейные украшения.

---

## Что есть сейчас (БЫЛО)

### Существующие декорации (примитивные, inline)

| Где | Элемент | Реализация |
|-----|---------|-----------|
| Landing Hero (page.tsx:65-66) | Красный круг 400px, жёлтый круг 200px | `<div>` с `border-radius`, opacity 6-12% |
| Landing Hero (page.tsx:117-139) | Красный круг, жёлтый квадрат 14px повёрнутый, salmon прямоугольник | Inline `<div>`, нет компонента |
| Landing Problem (page.tsx:147) | Красный обводной круг 300px | `<div>` с border, opacity 8% |
| Landing Pricing (page.tsx:255-256) | Жёлтый круг 200px, красный квадрат 150px | `<div>`, opacity 5-8% |
| Über Uns / Kontakt / Legal | Grid SVG overlay | `bg-[url('/grid.svg')]` — **файл grid.svg НЕ существует** |
| Footer (page.tsx:360-364) | Цветовая полоса red/yellow/salmon | `<div>` flex полоса |

### Существующие иконки (BauhausIcons.tsx)

12 SVG-иконок (BI-01 — BI-12). Из них декоративные: BI-10 Crane, BI-11 Building, BI-12 Gear. Все — функциональные иконки, **НЕ** геометрические паттерны.

### Чего НЕТ

- Компонентной системы для геометрических фигур
- Треугольников (только один в IconAlloy — функциональная иконка)
- Составных Bauhaus-композиций из Visual Language (как на картинке)
- Полупрозрачных overlay-паттернов
- Единого правила размещения декораций

---

## Что СТАНЕТ

### Новый компонент: `BauhausShapes.tsx`

Набор примитивных SVG-фигур как React-компоненты:

| Фигура | Props | Пример |
|--------|-------|--------|
| `<BauCircle />` | color, size, opacity, position | Красный круг, opacity 8% |
| `<BauTriangle />` | color, size, opacity, rotation, position | Жёлтый треугольник повёрнутый |
| `<BauRect />` | color, w, h, opacity, rotation, position | Чёрный прямоугольник |
| `<BauDiamond />` | color, size, opacity, position | Квадрат 45° = ромб |
| `<BauHalfCircle />` | color, size, opacity, rotation | Полукруг (как на Visual Language) |

Все фигуры:
- SVG-based (не div + border-radius) — чёткие на любом DPI
- `pointer-events-none`, `absolute` позиционирование
- 5 цветов бренда: `#C1292E`, `#1A1A1A`, `#F5C518`, `#BC8279`, `#FFFFFF`
- Принимают opacity (по умолчанию 0.06–0.12)
- Работают как `position: absolute` внутри `position: relative` контейнера

### Новый компонент: `BauhausComposition.tsx`

Готовые составные композиции из примитивов (вдохновлённые Visual Language):

| Композиция | Описание | Где использовать |
|------------|----------|------------------|
| `<CompositionCornerTL />` | Красный круг + чёрный треугольник + жёлтый квадрат | Левый верхний угол секций |
| `<CompositionCornerBR />` | Жёлтый треугольник + красный полукруг | Правый нижний угол секций |
| `<CompositionStripe />` | Горизонтальная полоса из треугольников (чередование red/yellow/black) | Разделители секций |
| `<CompositionGrid />` | SVG-паттерн: сетка из мелких квадратов/треугольников | Фон для hero-секций |

### Новый компонент: `BauhausOverlay.tsx`

Полупрозрачный SVG-паттерн overlay для секций:
- SVG `<pattern>` с мелкими геометрическими фигурами
- opacity 3-8% (не мешает читаемости)
- Тайлится бесшовно
- Несколько вариантов плотности: `sparse`, `medium`, `dense`

### Обновление grid.svg

Создать `/app/public/grid.svg` — бесшовный Bauhaus-grid паттерн (сейчас файл отсутствует, ссылки на него в 3 страницах битые).

---

## Где разместить декорации (план внедрения)

| Страница | Секция | Декорация | Opacity |
|----------|--------|-----------|---------|
| **Landing** Hero | Фон | Заменить div-круги на `<BauCircle>` + добавить `<BauTriangle>` | 6-10% |
| **Landing** Problem | Фон | `<CompositionCornerBR>` справа внизу | 8% |
| **Landing** Dashboard | Между секциями | `<CompositionStripe>` как разделитель | 100% (полноцветный) |
| **Landing** Pricing | Фон | `<BauCircle>` + `<BauTriangle>` по углам | 5-8% |
| **Landing** FAQ | Фон | `<BauhausOverlay variant="sparse">` | 3% |
| **Preise** (Pricing page) | Hero + фон | `<CompositionCornerTL>` + `<BauhausOverlay>` | 5-8% |
| **Über Uns** | Hero фон | `<BauhausOverlay>` вместо битого grid.svg | 8% |
| **Kontakt** | Hero фон | `<BauhausOverlay>` вместо битого grid.svg | 8% |
| **Legal pages** | Hero фон | `<BauhausOverlay variant="sparse">` вместо битого grid.svg | 5% |
| **Dashboard** sidebar | Нижний угол | Маленький `<BauTriangle>` + `<BauCircle>` | 4% |
| **Footer** | Фон | `<CompositionGrid>` | 3% |

---

## Файлы затронуты

### Новые файлы (создать)

| Файл | Назначение |
|------|-----------|
| `app/src/components/decorations/BauhausShapes.tsx` | Примитивы: Circle, Triangle, Rect, Diamond, HalfCircle |
| `app/src/components/decorations/BauhausComposition.tsx` | Готовые композиции из примитивов |
| `app/src/components/decorations/BauhausOverlay.tsx` | SVG pattern overlay |
| `app/src/components/decorations/index.ts` | Re-export |
| `app/public/grid.svg` | Bauhaus grid pattern (исправляет битые ссылки) |

### Изменяемые файлы

| Файл | Что меняется |
|------|-------------|
| `app/src/app/page.tsx` | Заменить inline div-декорации на компоненты |
| `app/src/app/(marketing)/preise/page.tsx` | Добавить декорации (сейчас нет) |
| `app/src/app/(marketing)/ueber-uns/page.tsx` | Заменить битый grid.svg на BauhausOverlay |
| `app/src/app/(marketing)/kontakt/page.tsx` | Заменить битый grid.svg на BauhausOverlay |
| `app/src/components/marketing/LegalPageShell.tsx` | Заменить битый grid.svg на BauhausOverlay |

### НЕ затронуты

- `BauhausIcons.tsx` — иконки остаются как есть
- `tailwind.config.ts` — цвета уже настроены
- `globals.css` — анимации уже есть
- Dashboard pages — только sidebar (minor)
- API routes, backend, database — не затронуты

---

## Что может сломаться / поплыть

| Риск | Вероятность | Mitigation |
|------|------------|-----------|
| SVG-декорации перекрывают кликабельные элементы | Средняя | `pointer-events-none` на всех декоративных элементах |
| Горизонтальный скролл от элементов за viewport | Высокая | `overflow-hidden` на родительском контейнере секции |
| Декорации мешают тексту на мобильных (375px) | Средняя | Скрывать крупные декорации на `<md` через `hidden md:block` |
| Производительность: много SVG на странице | Низкая | SVG inline лёгкие, opacity через CSS (GPU), без JS |
| CLS (Cumulative Layout Shift) | Низкая | Все декорации `position: absolute`, не влияют на поток |
| Битый grid.svg → белое пятно | Уже сломано | Создание grid.svg = fix 3 страниц |

---

## Breakpoints

| Breakpoint | Поведение декораций |
|-----------|-------------------|
| **Mobile 375px** | Только мелкие элементы (Circle ≤100px). Крупные композиции `hidden` |
| **Tablet 768px** | Средние элементы, compositions в углах видны |
| **Desktop 1440px** | Полный набор декораций, все композиции видны |

---

## Навигация, JS, анимации

- **Навигация:** НЕ затронута. UnifiedHeader, DashboardNav — без изменений
- **JS:** Минимальный. IntersectionObserver уже работает — можно добавить `animate-on-scroll` к декорациям для появления при скролле
- **Анимации:** Существующие `fadeInUp/Left/Right` достаточны. Новых keyframes не нужно
- **Якоря:** Секция `#pricing` — проверить что декорации не смещают anchor position

---

## Тесты

| Тест | Тип | Файл |
|------|-----|------|
| BauhausShapes рендерятся с правильными SVG-атрибутами | Unit | `BauhausShapes.test.tsx` |
| pointer-events-none на всех декорациях | Unit | Включить в BauhausShapes.test |
| Нет горизонтального скролла на 375px / 768px / 1440px | E2E | `e2e/decorations.spec.ts` |
| grid.svg загружается (HTTP 200) | E2E | Включить в smoke test |
| Landing page визуально не сломана | Visual regression | Screenshot сравнение |

---

## Roadmap (пошагово)

### Phase 1 — Примитивы
1. Создать `app/src/components/decorations/BauhausShapes.tsx` — 5 SVG-компонентов (Circle, Triangle, Rect, Diamond, HalfCircle)
2. Создать `app/src/components/decorations/index.ts` — re-export

### Phase 2 — Композиции
3. Создать `app/src/components/decorations/BauhausComposition.tsx` — 4 готовые композиции
4. Создать `app/src/components/decorations/BauhausOverlay.tsx` — SVG pattern overlay

### Phase 3 — grid.svg fix
5. Создать `app/public/grid.svg` — Bauhaus grid pattern (чинит 3 битые страницы)

### Phase 4 — Внедрение на Landing
6. `page.tsx` — заменить inline div-декорации на BauhausShapes компоненты
7. `page.tsx` — добавить Triangle + CompositionStripe в новые места

### Phase 5 — Внедрение на Marketing pages
8. `preise/page.tsx` — добавить декорации (сейчас пустая)
9. `ueber-uns/page.tsx` — заменить битый grid.svg на BauhausOverlay
10. `kontakt/page.tsx` — заменить битый grid.svg на BauhausOverlay
11. `LegalPageShell.tsx` — заменить битый grid.svg на BauhausOverlay

### Phase 6 — Responsive & Test
12. Проверить все breakpoints (375 / 768 / 1440) — скрыть крупные на mobile
13. Проверить `overflow-hidden` на всех секциях
14. Build check: `npm run build` → 0 errors

### Phase 7 — Review
15. Screenshot всех страниц → показать CEO

---

## Чеклист приёмки

- [ ] 5 примитивных SVG-компонентов работают (Circle, Triangle, Rect, Diamond, HalfCircle)
- [ ] 4 композиции собираются из примитивов
- [ ] BauhausOverlay тайлится бесшовно
- [ ] grid.svg создан → 3 страницы (Über Uns, Kontakt, Legal) перестали ломаться
- [ ] Landing page: inline div-декорации заменены на компоненты
- [ ] Preise page: имеет геометрические декорации
- [ ] Все декорации `pointer-events-none`
- [ ] Нет горизонтального скролла на 375px
- [ ] `npm run build` → 0 errors
- [ ] CEO визуально подтвердил результат
