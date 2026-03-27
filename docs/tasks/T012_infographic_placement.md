# T012 — Размещение инфографик на сайте

**Дата:** 2026-03-27
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #2 Katarina Weiß — UX/UI Engineer
**Размер:** M

---

## Сортировка 10 файлов

### ✅ ИСПОЛЬЗОВАТЬ (3 файла):

| # | Файл | Категория | Новое имя | Куда |
|---|------|----------|----------|------|
| 1 | `_dl6Nvjjs.png` | Product pipeline | `product-pipeline.png` | Landing: после Hero |
| 2 | `_lHMkXqEL.png` | Market analysis | `market-analysis.png` | Landing: секция Problem |
| 3 | `_HZK_5csH.jpg` | Dashboard features | `dashboard-features.jpg` | Landing: после Problem |

### ❌ НЕ ИСПОЛЬЗОВАТЬ (7 файлов — опечатки или дубли):

| # | Файл | Причина отказа |
|---|------|---------------|
| 4 | `_IWLX2UIf.png` | "Kontret" вместо "Beton" |
| 5 | `_72avzZGS.png` | Слово "EINKAUFSENTSCHEIDUNGEN" разбито некорректно |
| 6 | `_Mu3U434K.png` | Дубль product — хуже чем #1 |
| 7 | `_R5lGGXQR.png` | Тёмный фон — не вписывается |
| 8 | `_6W0xcbXp.png` | "BAUIRVOLUMEN" (опечатка), "KONTROLE" (опечатка) |
| 9 | `_wFZtQfv8.jpg` | "#C1292E" виден как текст на картинке |
| 10 | `_gHJDFTUg.jpg` | "DASUPreis" (грубая опечатка), "FEATURESS" |

---

## Размещение на Landing Page

```
[HERO]
    ↓
[PRODUCT INFOGRAPHIC] — "Как работает BauPreis AI"
  product-pipeline.png — полная ширина, border-2 border-[#1A1A1A], shadow
    ↓
[PROBLEM + MARKET INFOGRAPHIC] — "Рынок стройматериалов Германии"
  market-analysis.png — внутри Problem section или отдельная секция
    ↓
[DASHBOARD INFOGRAPHIC] — "Возможности платформы"
  dashboard-features.jpg — перед Pricing
    ↓
[PRICING]
    ↓
[FAQ + FOOTER]
```

---

## Roadmap (6 шагов)

1. Переименовать 3 файла в `app/public/img/infografic/`:
   - `_dl6Nvjjs.png` → `product-pipeline.png`
   - `_lHMkXqEL.png` → `market-analysis.png`
   - `_HZK_5csH.jpg` → `dashboard-features.jpg`

2. В `page.tsx` — добавить секцию "Как работает" ПОСЛЕ Hero:
   - Eyebrow + H2 + img с `animate-on-scroll`
   - `<img src="/img/infografic/product-pipeline.png" loading="lazy" className="w-full max-w-[1000px] mx-auto border-2 border-[#1A1A1A] shadow-[6px_6px_0_#C1292E]" />`

3. В `page.tsx` — добавить market инфографику ВНУТРИ или ПОСЛЕ Problem section:
   - `<img src="/img/infografic/market-analysis.png" loading="lazy" ... />`

4. В `page.tsx` — добавить dashboard инфографику ПЕРЕД Pricing:
   - Eyebrow "PLATFORM FEATURES" + img

5. `npm run build` → 0 errors

6. Visual check: 375px, 768px, 1440px

---

## Чеклист

- [ ] 3 файла переименованы
- [ ] Product инфографика на landing после Hero
- [ ] Market инфографика в Problem section
- [ ] Dashboard инфографика перед Pricing
- [ ] `loading="lazy"` на всех img
- [ ] alt-текст на немецком
- [ ] border-2 border-[#1A1A1A] + Bauhaus shadow
- [ ] Mobile 375px — читаемо
- [ ] `npm run build` → 0 errors
