# T018 — Material Chart: Average Line + Cards UX + Back Navigation

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap готов, ждёт ОК
**Ответственный:** #2 Lena Hoffmann (UX) + #3 Maximilian Braun (Frontend)
**Размер:** M
**Скилл:** `ui-ux-pro-max`

---

## Цель

3 улучшения:
1. **График материала:** добавить жёлтую штрих-пунктирную линию = скользящее среднее (moving average)
2. **Карточки материалов:** визуальная подсказка "кликни, чтобы раскрыть" (click affordance)
3. **Страница материала:** кнопка "Zurück zu Materialien" вместо browser back

---

## 1. Жёлтая штрих-пунктирная линия (Moving Average)

### Что БЫЛО
- Красная линия = актуальная цена (`Area` с `#C1292E`)
- Штрих-пунктирные `ReferenceLine` на min/max (статичные горизонтальные)
- Нет линии среднего

### Что СТАНЕТ
- Красная area = актуальная цена (как было)
- **Жёлтая штрих-пунктирная Line** = 7-дневное скользящее среднее (Simple Moving Average)
- Расчёт SMA на клиенте: для каждой точки = среднее за последние 7 дней
- Цвет: `#F5C518`, strokeDasharray="6 4", strokeWidth=2
- Tooltip: показывает и price, и SMA value

### Как рассчитать SMA-7
```typescript
// Для каждого дня i: average of prices[i-6..i] (или меньше если i < 6)
chartData.map((point, i) => ({
  ...point,
  sma7: chartData.slice(Math.max(0, i - 6), i + 1)
    .reduce((s, p) => s + p.price, 0) / Math.min(i + 1, 7),
}))
```

Никаких API изменений не нужно — рассчитывается на клиенте из уже загруженных price points.

---

## 2. Click Affordance на карточках материалов

### Что БЫЛО
- Карточки = `<Link>` (кликабельны), но визуально нет подсказки
- `dash-card` класс + hover shadow — есть, но нет текста "Details anzeigen"

### Что СТАНЕТ
- Внизу каждой карточки: маленький текст `"Details →"` серым, при hover — красным
- `cursor-pointer` уже есть (Link), но добавить явный visual cue

### Конкретные значения
```
<p className="text-xs text-[#1A1A1A]/30 font-grotesk mt-3 group-hover:text-[#C1292E] transition-colors">
  Details anzeigen →
</p>
```
Карточка `<Link>` + `className="group"` для hover state.

---

## 3. Кнопка "Zurück" на странице материала

### Что БЫЛО
- Заголовок: `<h1>{materialName}</h1>` + unit
- Нет back button → пользователь жмёт browser back

### Что СТАНЕТ
- Над заголовком: `← Zurück zu Materialien` ведёт на `/dashboard/materialien`
- Bauhaus стиль: `font-grotesk text-xs uppercase tracking-wide text-[#1A1A1A]/50 hover:text-[#C1292E]`

---

## Файлы затронуты

| Файл | Что меняется |
|------|-------------|
| `app/src/app/(dashboard)/material/[code]/page.tsx` | SMA-7 линия в chart + back button |
| `app/src/app/(dashboard)/dashboard/materialien/page.tsx` | "Details →" на карточках |

### НЕ затронуты
- API routes (SMA рассчитывается на клиенте)
- Landing page, marketing pages
- IndexChart, GuestOverlay
- i18n (используем hardcoded DE, можно добавить ключи позже)

---

## Что может сломаться

| Риск | Вероятность | Mitigation |
|------|------------|-----------|
| SMA-7 при < 7 точках данных | Средняя | Fallback: average of available points |
| Recharts доп. Line перегружает chart | Низкая | Тонкая dashed линия, не доминирует |
| Tooltip с 2 значениями — верстка | Низкая | Custom tooltip, как в IndexChart |

---

## Breakpoints

- Chart: `ResponsiveContainer` уже адаптивный
- "Details →" текст: виден на всех breakpoints
- Back button: виден на всех breakpoints

---

## Roadmap

1. В `material/[code]/page.tsx`: рассчитать SMA-7 из price data
2. Добавить `<Line>` для SMA-7 (жёлтая, dashed) в AreaChart
3. Обновить Tooltip для отображения обоих значений
4. Добавить back button "← Zurück zu Materialien" над заголовком
5. В `materialien/page.tsx`: добавить "Details →" + `group` hover на карточки
6. `npm run build` → 0 errors

---

## Чеклист приёмки

- [ ] Chart: красная area + жёлтая dashed SMA-7 линия видны
- [ ] SMA-7 рассчитывается корректно (среднее за 7 дней)
- [ ] Tooltip показывает и цену, и SMA
- [ ] Карточки материалов: "Details →" видно, при hover красный
- [ ] Страница материала: "← Zurück zu Materialien" кнопка работает
- [ ] `npm run build` → 0 errors
