# T012 — Dashboard crash: toFixed is not a function

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap готов, ждёт ОК
**Ответственный:** #5 Andreas Keller — Backend Engineer
**Размер:** S
**Скилл:** `systematic-debugging`

---

## Баг

**Ошибка:** `(e.change_pct_30d || 0).toFixed is not a function`
**Где:** `/dashboard` → Overview → жёлтые KPI-блоки (steel + wood)
**Когда:** Всегда при загрузке dashboard

---

## Корневая причина (доказано)

### Цепочка

1. PostgreSQL колонка `analysis.change_pct_30d` = `DECIMAL(6,2)` → тип `numeric`
2. Библиотека `node-postgres (pg)` возвращает `numeric` как **string** (не number) — задокументированное поведение для сохранения точности
3. API `/api/analysis` (route.ts:51) делает `...row` — передаёт string как есть
4. Dashboard (page.tsx:185) делает `(steelItem.change_pct_30d || 0).toFixed(1)`
5. `"2.43" || 0` → `"2.43"` (truthy string, не конвертится в 0)
6. `"2.43".toFixed(1)` → **TypeError** (String.prototype не имеет `.toFixed`)

### Доказательство

```sql
-- На сервере 187.33.159.205:
SELECT code, change_pct_30d, pg_typeof(change_pct_30d)
FROM analysis a JOIN materials m ON a.material_id = m.id LIMIT 5;

-- Результат:
-- concrete_c25 | 0.00 | numeric
-- copper_lme   | 2.43 | numeric
-- aluminum_lme | 3.97 | numeric
```

Тип `numeric` → pg driver → **string** на клиенте.

### Почему строки 156 и 166 НЕ падают

Строки 156/166 используют `parseFloat(String(indexData.change_pct_30d)).toFixed(2)` — корректная конвертация. Строки 185/187 — нет.

### Все уязвимые места в dashboard/page.tsx

| Строка | Код | Проблема |
|--------|-----|---------|
| **185** | `(steelItem.change_pct_30d \|\| 0).toFixed(1)` | string.toFixed → CRASH |
| **187** | `(woodItem.change_pct_30d \|\| 0).toFixed(1)` | string.toFixed → CRASH |
| **185** | `(steelItem.change_pct_30d \|\| 0) > 0` | string comparison → может дать wrong result |
| **187** | `(woodItem.change_pct_30d \|\| 0) > 0` | string comparison → может дать wrong result |
| **266** | `item.change_pct_30d > 0` | string comparison → может дать wrong result |
| **268** | `item.change_pct_30d < 0` | string comparison → может дать wrong result |

---

## Файлы затронуты

| Файл | Что менять |
|------|-----------|
| `app/src/app/(dashboard)/dashboard/page.tsx` | `Number()` обёртка на строках 185, 187, 266, 268 |

**НЕ затронуты:** навигация, CSS, анимации, breakpoints, другие страницы.

---

## Решение (100%)

Обернуть `change_pct_30d` в `Number()` перед любыми арифметическими операциями:

**БЫЛО (строка 185):**
```ts
(steelItem.change_pct_30d || 0).toFixed(1)
```

**СТАНЕТ:**
```ts
Number(steelItem.change_pct_30d || 0).toFixed(1)
```

То же для строк 187, 266, 268.

Также аналогично для `change_pct_7d` (тот же тип `DECIMAL(6,2)` → string) — превентивный фикс.

---

## Roadmap

1. В `dashboard/page.tsx` строки 185, 187: обернуть `change_pct_30d` в `Number()`
2. В `dashboard/page.tsx` строки 266, 268: обернуть `change_pct_30d` в `Number()`
3. Проверить `change_pct_7d` в том же файле — аналогичный фикс
4. `npm run build` → 0 errors
5. Деплой + проверка dashboard на production

---

## Чеклист приёмки

- [ ] Dashboard `/dashboard` открывается без ошибок
- [ ] Жёлтые KPI-блоки показывают корректные % значения
- [ ] Цвета (красный/жёлтый) для +/- работают правильно
- [ ] `npm run build` → 0 errors
- [ ] Production: страница работает
