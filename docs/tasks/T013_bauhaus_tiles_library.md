# T013 — Bauhaus Visual Language: Полноцветные тайлы

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap готов, ждёт ОК
**Ответственный:** #2 Lena Hoffmann — UX/UI Engineer
**Размер:** M
**Скилл:** `ui-ux-pro-max`

---

## Цель

Создать библиотеку полноцветных (100% opacity) Bauhaus-тайлов — модульных SVG-блоков как на Visual Language бренда. Каждый тайл = квадрат с геометрической композицией. Хранить в отдельной папке, откуда дизайнер/разработчик берёт нужный тайл.

---

## Разница с T011

| | T011 (сделано) | T013 (новое) |
|---|---|---|
| **Opacity** | 3-12% (фоновые) | 100% (полноцветные) |
| **Назначение** | Background decorations | Hero-блоки, секционные акценты, бренд-элементы |
| **Размер** | Мелкие, рассеянные | Крупные, модульные, в сетке |
| **Композиция** | Отдельные фигуры | Тайл = квадрат с составной композицией внутри |
| **Файлы** | `decorations/BauhausShapes.tsx` | `tiles/BauhausTiles.tsx` (НОВАЯ папка) |

---

## Что создать: 12 тайлов (из Visual Language)

Каждый тайл = SVG viewBox="0 0 200 200", квадрат. Цвета: `#C1292E` (red), `#1A1A1A` (black), `#F5C518` (yellow), `#FFFFFF` (white).

| # | Название | Описание | Фон | Фигура |
|---|---------|---------|-----|--------|
| T01 | `TileCircleOnBlack` | Красный круг на чёрном фоне | black | red circle, centered |
| T02 | `TileDiagonalYellowBlack` | Диагональ: жёлтый верхний-левый треуг. + чёрный нижний-правый | — | diagonal split |
| T03 | `TileRedYellowSplit` | Верх красный, низ жёлтый, диагональная граница | — | diagonal split |
| T04 | `TileTriangleWhiteOnBlack` | Белый треугольник на чёрном фоне | black | white triangle |
| T05 | `TileYellowBlackTriangles` | Жёлтый и чёрный треугольники встречаются | — | two triangles |
| T06 | `TileHalfCircleRedYellow` | Красный полукруг справа на жёлтом фоне | yellow | red half-circle |
| T07 | `TileRedSquareBlackCorner` | Красный квадрат с чёрным треугольником в углу | red | black triangle corner |
| T08 | `TileYellowRedDiagonal` | Жёлтая и красная диагонали | — | diagonal composition |
| T09 | `TileBlackYellowQuarter` | Чёрный фон, жёлтый квадрант | black | yellow quarter |
| T10 | `TileRedOnWhite` | Красный квадрат по центру на белом | white | centered red rect |
| T11 | `TileCircleOnYellow` | Красный круг на жёлтом | yellow | red circle |
| T12 | `TileBlackTriangleYellow` | Чёрный треугольник на жёлтом фоне | yellow | black triangle |

### Составная композиция: `BauhausGrid`

Компонент `BauhausGrid` — 3×3 сетка из тайлов (как на картинке CEO). Props: `tiles` (массив 9 ID тайлов), `size` (общий размер).

---

## Структура файлов

```
app/src/components/tiles/
├── BauhausTiles.tsx      ← 12 тайлов (T01-T12)
├── BauhausGrid.tsx       ← Сетка 3×3 из тайлов
└── index.ts              ← Re-export
```

**Почему отдельная папка `tiles/`, а не в `decorations/`:**
- `decorations/` = полупрозрачные фоновые элементы (T011)
- `tiles/` = полноцветные бренд-блоки (T013)
- Разное назначение, разные consumers

---

## Файлы затронуты

### Новые файлы (создать)

| Файл | Назначение |
|------|-----------|
| `app/src/components/tiles/BauhausTiles.tsx` | 12 SVG-тайлов |
| `app/src/components/tiles/BauhausGrid.tsx` | 3×3 grid layout |
| `app/src/components/tiles/index.ts` | Re-export |

### НЕ затронуты

- `decorations/` — не трогаем (T011, работает)
- Landing page — пока не внедряем (отдельная задача)
- Dashboard — не затронут
- API, backend, database — не затронуты
- CSS, навигация, анимации — не затронуты

---

## Что может сломаться

| Риск | Вероятность | Mitigation |
|------|------------|-----------|
| Нет рисков — создаём новые файлы, ничего не меняем | — | — |

Это чистое создание новых компонентов. Ни один существующий файл не изменяется.

---

## Breakpoints

Grid 3×3 адаптивный:
- **Mobile 375px:** Grid → 1 колонка (тайлы стопкой) или скрыт
- **Tablet 768px:** Grid → 2 колонки
- **Desktop 1440px:** Grid → 3×3 полный

---

## Roadmap

1. Создать `app/src/components/tiles/BauhausTiles.tsx` — 12 SVG-тайлов (T01–T12)
2. Создать `app/src/components/tiles/BauhausGrid.tsx` — responsive grid 3×3
3. Создать `app/src/components/tiles/index.ts` — re-export
4. `npm run build` → 0 errors
5. Показать CEO превью всех 12 тайлов

---

## Чеклист приёмки

- [ ] 12 тайлов рендерятся корректно (SVG 200×200, 4 цвета бренда)
- [ ] BauhausGrid показывает 3×3 сетку
- [ ] Responsive: 1 col (375) / 2 col (768) / 3 col (1440)
- [ ] `npm run build` → 0 errors
- [ ] Тайлы доступны для импорта: `import { TileCircleOnBlack } from "@/components/tiles"`
- [ ] CEO визуально подтвердил соответствие Visual Language
