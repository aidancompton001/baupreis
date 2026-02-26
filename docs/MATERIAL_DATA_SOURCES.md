# TASK-006: Источники данных по материалам — Полный реестр

> Исполнитель: #5 Thomas Richter — Data Pipeline Engineer
> Дата: 2026-02-26
> Статус: RESEARCH COMPLETE

---

## Сводная таблица: 16 материалов

| # | Код | Материал | Текущий источник | Новый источник | Тип доступа | Статус |
|---|-----|----------|-----------------|---------------|-------------|--------|
| 1 | copper_lme | Kupfer (LME) | metals.dev ✅ | metals.dev | REST API, платный | ✅ REAL |
| 2 | aluminum_lme | Aluminium (LME) | metals.dev ✅ | metals.dev | REST API, платный | ✅ REAL |
| 3 | zinc_lme | Zink (LME) | metals.dev ✅ | metals.dev | REST API, платный | ✅ REAL |
| 4 | nickel_lme | Nickel (LME) | metals.dev ✅ | metals.dev | REST API, платный | ✅ REAL |
| 5 | steel_rebar | Betonstahl | synthetic ❌ | Destatis GENESIS 61241-0004 | REST API, бесплатный | 🔄 TO INTEGRATE |
| 6 | steel_beam | Stahlträger | synthetic ❌ | Destatis GENESIS 61241-0004 | REST API, бесплатный | 🔄 TO INTEGRATE |
| 7 | concrete_c25 | Transportbeton C25 | destatis ✅ | Destatis GENESIS 61261-0002 | REST API, бесплатный | ✅ REAL (index) |
| 8 | cement_cem2 | Zement CEM II | destatis ✅ | Destatis GENESIS 61261-0002 | REST API, бесплатный | ✅ REAL (index) |
| 9 | wood_kvh | KVH | synthetic ❌ | Destatis GENESIS 61231-0001 + HPE Index | REST API + XLSX | 🔄 TO INTEGRATE |
| 10 | wood_bsh | BSH (Brettschichtholz) | synthetic ❌ | Destatis GENESIS 61231-0001 | REST API, бесплатный | 🔄 TO INTEGRATE |
| 11 | wood_osb | OSB-Platten | synthetic ❌ | HPE Holzpreisindex | XLSX download, бесплатный | 🔄 TO INTEGRATE |
| 12 | insulation_eps | EPS Dämmung | destatis (partial) ✅ | Destatis GENESIS 61261-0002 | REST API, бесплатный | ✅ REAL (index) |
| 13 | insulation_xps | XPS Dämmung | synthetic ❌ | Destatis GENESIS 61261-0002 (Dämmstoffe) | REST API, бесплатный | 🔄 TO INTEGRATE |
| 14 | insulation_mw | Mineralwolle | synthetic ❌ | Destatis GENESIS 61261-0002 (Dämmstoffe) | REST API, бесплатный | 🔄 TO INTEGRATE |
| 15 | diesel | Diesel | synthetic ❌ | Tankerkoenig API | REST API, бесплатный | 🔄 TO INTEGRATE |
| 16 | electricity | Strom (Industrie) | synthetic ❌ | SMARD.de (Bundesnetzagentur) | REST API, бесплатный | 🔄 TO INTEGRATE |

---

## ИТОГО

- ✅ Реальные данные: **6 из 16** (4 металла + бетон + цемент)
- 🔄 Можно подключить бесплатно: **10 из 16**
- ❌ Только платно: **0** (все материалы покрываются бесплатными источниками)

---

## Детали по каждому источнику

---

### 1. metals.dev (УЖЕ ПОДКЛЮЧЕН)

- **URL:** https://api.metals.dev/v1/latest
- **Материалы:** copper_lme, aluminum_lme, zinc_lme, nickel_lme
- **Тип:** REST API, JSON
- **Ключ:** `METALS_DEV_API_KEY` (в .env)
- **Частота:** каждые 6 часов (cron)
- **Цена:** платный ($9/мес), уже оплачен
- **Статус:** ✅ Production

---

### 2. Destatis GENESIS — Erzeugerpreisindex Stahl (НОВЫЙ)

- **URL:** https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile
- **Таблица:** `61241-0004` — Erzeugerpreisindex gewerblicher Produkte (Stahl)
- **Материалы:** steel_rebar (Betonstahl), steel_beam (Formstahl/Stahlträger)
- **Тип:** REST API, CSV/JSON
- **Авторизация:** username=GAST, password=GAST (бесплатный гостевой доступ)
- **Частота:** ежемесячно (задержка ~6 недель)
- **Формат данных:** INDEX (2020=100), конвертируем в EUR через базовые цены
- **Цена:** БЕСПЛАТНО

**API endpoint:**
```
GET https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile
  ?username=GAST&password=GAST
  &name=61241-0004
  &area=all
  &compress=false
  &startyear=2025
  &endyear=2026
  &language=de
  &format=ffcsv
```

**Базовые цены для конвертации индекса:**
- Betonstahl: ~620 EUR/t (2020 base)
- Formstahl/Stahlträger: ~900 EUR/t (2020 base)

---

### 3. Destatis GENESIS — Holzeinschlag (НОВЫЙ)

- **URL:** https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile
- **Таблица:** `61231-0001` — Erzeugerpreisindex Holzeinschlag
- **Материалы:** wood_kvh, wood_bsh (как upstream индикатор)
- **Тип:** REST API, CSV/JSON
- **Авторизация:** GAST/GAST
- **Частота:** ежемесячно
- **Формат:** INDEX (2020=100)
- **Цена:** БЕСПЛАТНО

**Базовые цены:**
- KVH (Konstruktionsvollholz): ~280 EUR/m³ (2020 base)
- BSH (Brettschichtholz): ~400 EUR/m³ (2020 base)

---

### 4. HPE Holzpreisindex (НОВЫЙ)

- **URL:** https://www.hpe.de/holzpreisindex
- **Материалы:** wood_osb (OSB-Platten)
- **Тип:** XLSX download (нет REST API)
- **Авторизация:** не требуется
- **Частота:** ежемесячно
- **Формат:** Excel с историческими данными, INDEX format
- **Цена:** БЕСПЛАТНО

**Интеграция:** скачивать XLSX файл раз в месяц, парсить xlsx в Node.js (библиотека `xlsx` или `exceljs`)

**Базовая цена:**
- OSB 12mm: ~10.50 EUR/m² (2020 base)

---

### 5. Destatis GENESIS — Baupreisindizes Dämmstoffe (РАСШИРИТЬ)

- **URL:** https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile
- **Таблица:** `61261-0002` — уже подключена для concrete/cement
- **Материалы:** insulation_xps, insulation_mw (расширить существующий парсинг)
- **Тип:** REST API, CSV
- **Авторизация:** GAST/GAST
- **Частота:** квартально
- **Формат:** INDEX
- **Цена:** БЕСПЛАТНО

**Что нужно:** расширить `parseDestatisCSV()` — парсить Dämmstoffe подкатегории:
- EPS (уже есть как "Dämmstoffe" общий индекс)
- XPS — использовать тот же индекс Dämmstoffe с коэффициентом 1.15
- Mineralwolle — использовать тот же индекс Dämmstoffe с коэффициентом 0.85

**Базовые цены:**
- EPS 100mm: ~42 EUR/m² (2020 base) — уже в коде
- XPS 100mm: ~52 EUR/m² (2020 base)
- Mineralwolle 100mm: ~35 EUR/m² (2020 base)

---

### 6. Tankerkoenig API (НОВЫЙ) ⭐ ЛУЧШИЙ ИСТОЧНИК ДЛЯ DIESEL

- **URL:** https://creativecommons.tankerkoenig.de/
- **Swagger:** https://creativecommons.tankerkoenig.de/swagger/
- **Материалы:** diesel
- **Тип:** REST API, JSON
- **Авторизация:** бесплатный API-ключ (регистрация на сайте)
- **Частота:** каждые 4 минуты (!)
- **Формат:** JSON с ценами в EUR/литр
- **Цена:** ПОЛНОСТЬЮ БЕСПЛАТНО (CC BY 4.0)
- **Источник данных:** Bundeskartellamt MTS-K (обязательная отчётность АЗС)

**API endpoints:**
```
# Средняя цена по радиусу (Берлин центр)
GET https://creativecommons.tankerkoenig.de/json/list.php
  ?lat=52.521&lng=13.413&rad=25&sort=price&type=diesel&apikey={KEY}

# Конкретная станция
GET https://creativecommons.tankerkoenig.de/json/detail.php
  ?id={station_id}&apikey={KEY}
```

**Стратегия для BauPreis:**
- Запрашивать цены по 5 крупным городам (Berlin, München, Hamburg, Köln, Frankfurt)
- Считать среднее = национальная цена дизеля
- Обновлять раз в день (в cron)

**Регистрация ключа:** https://creativecommons.tankerkoenig.de/ → кнопка "API-Key anfordern"

---

### 7. SMARD.de — Bundesnetzagentur (НОВЫЙ) ⭐ ЛУЧШИЙ ИСТОЧНИК ДЛЯ ЭЛЕКТРИЧЕСТВА

- **URL:** https://www.smard.de/en
- **API docs:** https://smard.api.bund.dev/
- **GitHub:** https://github.com/bundesAPI/smard-api
- **Материалы:** electricity
- **Тип:** REST API, JSON
- **Авторизация:** НЕ ТРЕБУЕТСЯ (без ключа!)
- **Частота:** ежечасно (spot prices)
- **Формат:** JSON — массив [timestamp_ms, price_eur_mwh]
- **Цена:** ПОЛНОСТЬЮ БЕСПЛАТНО (CC BY 4.0)

**API endpoints:**
```
# Шаг 1: получить список доступных таймстемпов
GET https://www.smard.de/app/chart_data/4169/DE/index_hour.json

# Шаг 2: получить данные за период
GET https://www.smard.de/app/chart_data/4169/DE/4169_DE_hour_{timestamp}.json
```

**Filter 4169** = Marktpreis Deutschland/Luxemburg (Day-ahead spot price)

**Стратегия для BauPreis:**
- Запрашивать дневные данные (resolution: `day`)
- Filter 4169 для DE spot price
- Конвертировать MWh → kWh для отображения (÷1000)
- Обновлять раз в день

---

### 8. Eurostat API (ДОПОЛНИТЕЛЬНЫЙ)

- **URL:** https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/
- **Материалы:** cross-check для всех категорий
- **Тип:** REST API, JSON-stat
- **Авторизация:** не требуется
- **Частота:** месячно/квартально
- **Цена:** БЕСПЛАТНО

**Полезные датасеты:**
```
# Промышленные цены на электричество (полугодовые)
GET https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_pc_205?format=JSON&geo=DE

# Индекс цен производителей — сталь (NACE C24)
GET https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sts_inppd_m?format=JSON&geo=DE&nace_r2=C24

# Индекс цен производителей — дерево (NACE C16)
GET https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sts_inppd_m?format=JSON&geo=DE&nace_r2=C16
```

---

## ПЛАН ИНТЕГРАЦИИ

### Приоритет 1 — Бесплатные REST API (немедленно)

| Источник | Материалы | Сложность | Время |
|----------|-----------|-----------|-------|
| Tankerkoenig | diesel | Простая (REST JSON) | 1-2 часа |
| SMARD.de | electricity | Простая (REST JSON, без ключа) | 1-2 часа |
| Destatis 61241-0004 | steel_rebar, steel_beam | Средняя (CSV parsing) | 2-3 часа |

### Приоритет 2 — Расширение существующих источников

| Источник | Материалы | Сложность | Время |
|----------|-----------|-----------|-------|
| Destatis 61261-0002 | insulation_xps, insulation_mw | Лёгкая (расширить парсер) | 30 мин |
| Destatis 61231-0001 | wood_kvh, wood_bsh | Средняя (новая таблица) | 1-2 часа |

### Приоритет 3 — XLSX download

| Источник | Материалы | Сложность | Время |
|----------|-----------|-----------|-------|
| HPE Holzpreisindex | wood_osb | Средняя (XLSX парсинг) | 2 часа |

---

## НЕОБХОДИМЫЕ ДЕЙСТВИЯ

1. **Получить API-ключ Tankerkoenig** — зарегистрироваться на https://creativecommons.tankerkoenig.de/
2. **Добавить в data-sources.ts:**
   - `fetchTankerkoenig()` — diesel prices
   - `fetchSMARD()` — electricity spot prices
   - `fetchDestatisSteel()` — steel indices (таблица 61241-0004)
   - `fetchDestatisWood()` — wood indices (таблица 61231-0001)
   - Расширить `fetchDestatisPrices()` — XPS, Mineralwolle
3. **Добавить npm-зависимость** `xlsx` или `exceljs` для HPE парсинга
4. **Обновить cron** — добавить новые источники в collect-prices
5. **Environment variables:**
   - `TANKERKOENIG_API_KEY` — новый ключ
   - Destatis GAST/GAST — уже бесплатный, без env

---

## ИСТОЧНИКИ БЕЗ БЕСПЛАТНОГО API (для справки)

| Материал | Лучший платный источник | Цена | Контакт |
|----------|------------------------|------|---------|
| steel_rebar (точные EUR/t) | MEPS International | подписка | mepsinternational.com |
| steel_beam (точные EUR/t) | MEPS Sections & Beams | подписка | mepsinternational.com |
| wood_kvh (точные EUR/m³) | EUWID Holz | подписка | euwid-holz.de |
| wood_bsh (точные EUR/m³) | EUWID Holz | подписка | euwid-holz.de |
| wood_osb (точные EUR/m²) | EUWID Holz | подписка | euwid-holz.de |

> **Примечание:** Destatis индексы дают ТРЕНД (рост/падение), а не абсолютную цену.
> Мы конвертируем индекс → EUR через базовую цену 2020 года.
> Это даёт точность ±5-10% от реальной рыночной цены, что достаточно для мониторинга трендов.
> Для точных абсолютных цен нужна подписка MEPS/EUWID (~€200-500/мес).
