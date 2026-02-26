# USER PERSONAS -- BauPreis AI SaaS

## Тестовая группа пользователей немецкого строительного рынка

**Версия:** 1.0
**Управляет:** #11 UX Research Lead (Dr. Katrin Engel)
**Количество персон:** 10
**Обновление:** при каждом значимом UX-решении
**Создан:** 2026-02-26

---

## Принцип формирования

Персоны покрывают весь спектр пользователей BauPreis на немецком строительном рынке:
- Разные роли в строительной цепочке (закупки, управление, расчеты, поставки, проектирование, бухгалтерия, консалтинг)
- Разные размеры компаний (крупные GU, средние, малые, фрилансеры)
- Разный возраст (25-62 лет) и tech-уровень (3-9/10)
- Разные устройства (Desktop, Tablet, Smartphone)
- Разные планы BauPreis (Basis/Pro/Team)
- Все персоны -- из Германии, основной язык -- немецкий

---

## Как использовать

1. **При проектировании экранов:** "Как Persona #3 (Kalkulator, 48 лет, tech 6/10) пройдет этот flow?"
2. **При выборе фичей:** "Какие персоны получат больше всего value от этой фичи?"
3. **При тестировании:** "Прогнать сценарий от лица каждой из 10 персон"
4. **При приоритизации:** "Для скольких персон из 10 это критично?"
5. **Критерий прохождения:** UX-решение считается валидным, если >= 7/10 персон проходят task successfully

---

## Персона #1: Klaus Bergmann -- Einkaufer (Закупщик)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 57 лет |
| **Профессия** | Leiter Einkauf (руководитель отдела закупок) |
| **Компания** | STRABAG-подразделение, 800+ сотрудников, Munchen |
| **Город** | Munchen, Bayern |
| **Устройство** | Desktop (Dell 27", два монитора), iPad Pro для совещаний |
| **Tech-уровень** | 4/10 |
| **Языки** | Deutsch (Muttersprache), Englisch (B1) |

**Контекст использования:** Отвечает за закупку стройматериалов на 12+ млн EUR/год. Мониторит цены ежедневно утром (7:30-8:00). Ему нужны точные цены прямо сейчас, тренды за 90 дней и алерты при резком изменении. Использует BauPreis параллельно с SAP и Excel.

**Главная боль:** Каждый день тратит 45+ минут на сбор цен с 5 разных сайтов. Если цена на медь упала на 8%, а он узнал через 3 дня -- это прямые потери на 200K EUR контракте.

**Что важно:** Надежность данных (не прогнозы, а факты), скорость загрузки (< 3 сек), простой интерфейс без "модных штучек", Telegram-алерты (проверяет телефон чаще email), PDF-экспорт для руководства.

**Цитата:** _"Ich brauche keine bunten Grafiken -- ich brauche verlassliche Zahlen. Wenn der Kupferpreis um 5% fallt, muss ich das SOFORT wissen, nicht erst nachste Woche."_

**План BauPreis:** Team (299 EUR) -- нужен API для интеграции с SAP, PDF-отчеты для руководства, 3 коллеги в отделе

---

## Персона #2: Stefan Hofer -- Bauleiter (Прораб)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 43 года |
| **Профессия** | Bauleiter (прораб) |
| **Компания** | Mittleres Bauunternehmen, ~120 сотрудников, Hamburg |
| **Город** | Hamburg |
| **Устройство** | Samsung Galaxy S24 (основное), иногда Laptop вечером |
| **Tech-уровень** | 5/10 |
| **Языки** | Deutsch (Muttersprache) |

**Контекст использования:** Целый день на стройплощадке. Проверяет цены на телефоне между задачами -- в обеденный перерыв, в машине перед встречей. Ему нужно быстро глянуть: не изменились ли цены на материалы текущего проекта. Если резкий рост -- сразу звонит закупщику.

**Главная боль:** На стройке нет времени сидеть за компьютером. Нужна мобильная версия, которая загружается за 2 секунды и показывает главное сразу -- без скролла и кликов. Текущие инструменты -- десктопные, на телефоне неюзабельны.

**Что важно:** Мобильная версия (PWA), крупные цифры на экране, push-уведомления, минимум кликов до нужной информации, работа при слабом 4G на стройке.

**Цитата:** _"Auf der Baustelle habe ich keine Zeit fur komplizierte Software. Ich will mein Handy aufmachen, die Preise sehen -- fertig. Wenn Stahl plotzlich 10% teurer wird, muss mein Handy sofort piepen."_

**План BauPreis:** Pro (149 EUR) -- Telegram-алерты критичны, AI-прогнозы полезны для планирования закупок

---

## Персона #3: Markus Zimmermann -- Kalkulator (Калькулятор/Сметчик)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 48 лет |
| **Профессия** | Kalkulator / Baukalkulation |
| **Компания** | Bauunternehmen, ~200 сотрудников, Stuttgart |
| **Город** | Stuttgart, Baden-Wurttemberg |
| **Устройство** | Desktop (два монитора, Excel всегда открыт), Lenovo ThinkPad |
| **Tech-уровень** | 6/10 |
| **Языки** | Deutsch (Muttersprache), Englisch (A2) |

**Контекст использования:** Составляет сметы (Kalkulationen) для тендеров. Ему нужны актуальные цены материалов для расчета себестоимости. Проверяет BauPreis 3-5 раз в день при составлении каждой новой сметы. Особенно важны исторические данные (90 дней) для обоснования цен в тендерной документации.

**Главная боль:** Цены в сметах устаревают за неделю. Если заложил цену на арматурную сталь 2 месяца назад, а к моменту закупки она выросла на 15% -- проект уходит в минус. Нужен инструмент для Preisgleitklausel (оговорка о скользящей цене).

**Что важно:** Исторические графики цен, экспорт данных в Excel/CSV, Preisgleitklausel-калькулятор, точность цен до цента, BauPreis Index для общей картины.

**Цитата:** _"Meine Kalkulation steht und fallt mit den Materialpreisen. Wenn ich den Stahlpreis falsch ansetze, verlieren wir bei einem 5-Millionen-Projekt schnell 200.000 Euro. Ich brauche Zahlen, denen ich vertrauen kann."_

**План BauPreis:** Pro (149 EUR) -- AI-прогнозы для расчета рисков в тендерах, все материалы, Preisgleitklausel

---

## Персона #4: Jorg Seidel -- Geschaftsfuhrer (Директор)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 54 года |
| **Профессия** | Geschaftsfuhrer (генеральный директор) |
| **Компания** | Seidel Bau GmbH, ~35 сотрудников, Nurnberg |
| **Город** | Nurnberg, Bayern |
| **Устройство** | MacBook Pro 14", iPhone 15 Pro |
| **Tech-уровень** | 5/10 |
| **Языки** | Deutsch (Muttersprache), Englisch (B2) |

**Контекст использования:** Принимает финальные решения о закупках и тендерах. Не сидит в BauPreis каждый день -- заходит 2-3 раза в неделю на 10 минут. Ему нужен dashboard-обзор: как изменились цены за неделю, какие материалы выросли/упали, общий индекс. Детали делегирует закупщику.

**Главная боль:** Слишком много информации, мало времени. Не хочет разбираться в графиках -- хочет видеть: "На этой неделе стоит закупить медь, потому что цена упала на 7%". Ищет AI-рекомендации на человеческом языке.

**Что важно:** Executive summary на главной странице, AI-рекомендации простым языком, еженедельный отчет на email, цена подписки оправдана (ROI за первый месяц), мобильная версия для проверки в дороге.

**Цитата:** _"Ich bin kein Techniker -- ich bin Unternehmer. Sagen Sie mir nicht, dass Kupfer bei 8.450 EUR/t steht. Sagen Sie mir: 'Jetzt kaufen, nachste Woche wird es teurer.' Das ist der Mehrwert, fur den ich zahle."_

**План BauPreis:** Basis (49 EUR) -- для начала достаточно, если убедится в ценности -- перейдет на Pro

---

## Персона #5: Anna-Lena Fischer -- Projektleiterin (Руководитель проекта)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 38 лет |
| **Профессия** | Projektleiterin (руководитель проекта) |
| **Компания** | Generalunternehmer, ~500 сотрудников, Frankfurt am Main |
| **Город** | Frankfurt am Main, Hessen |
| **Устройство** | Surface Pro 9 (основное), iPhone 14 |
| **Tech-уровень** | 7/10 |
| **Языки** | Deutsch (Muttersprache), Englisch (C1) |

**Контекст использования:** Координирует 3-4 строительных проекта одновременно, общий бюджет 20+ млн EUR. Использует BauPreis для контроля стоимости материалов по проектам. Настраивает алерты на ключевые материалы каждого проекта. Еженедельно формирует отчет для Bauherr (заказчика) с обоснованием ценовых изменений.

**Главная боль:** Управляет несколькими проектами с разными материалами. Нужно быстро переключаться между "наборами" материалов. Текущие инструменты не позволяют группировать материалы по проектам.

**Что важно:** Возможность группировать материалы (по проектам), множественные алерты (разные пороги для разных проектов), PDF-отчеты для заказчиков, AI-прогнозы для планирования закупок на 30-90 дней вперед.

**Цитата:** _"Ich manage vier Projekte gleichzeitig. Fur jedes Projekt brauche ich andere Materialien im Blick. Wenn ich in einem Tool alles auf einen Blick sehe und meinem Bauherrn einen professionellen Bericht schicken kann -- das spart mir Stunden pro Woche."_

**План BauPreis:** Team (299 EUR) -- PDF-отчеты для Bauherr, API для интеграции с Projektmanagement-Tool, 3 коллеги нужен доступ

---

## Персона #6: Tim Winkler -- Junior Einkaufer (Младший закупщик)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 25 лет |
| **Профессия** | Junior Einkaufer (младший закупщик) |
| **Компания** | Mittleres Bauunternehmen, ~80 сотрудников, Berlin |
| **Город** | Berlin |
| **Устройство** | MacBook Air M2, iPhone 15, Apple Watch |
| **Tech-уровень** | 9/10 |
| **Языки** | Deutsch (Muttersprache), Englisch (C1), Turkisch (B1) |

**Контекст использования:** Только начал карьеру в закупках после учебы (BWL-Studium). Технически продвинутый, привык к современным SaaS-инструментам. Использует BauPreis как основной инструмент для изучения рынка стройматериалов. Проверяет цены каждое утро, настроил все возможные алерты, активно использует AI-чат для вопросов по рынку.

**Главная боль:** Мало опыта в закупках -- не знает "нормальные" цены и паттерны. Ему нужен AI-помощник, который объяснит: "Это нормальное колебание или аномалия?", "Стоит ли покупать сейчас или подождать?". Старшие коллеги не всегда доступны для консультаций.

**Что важно:** AI-чат (главная фича!), понятные объяснения трендов, обучающие элементы в интерфейсе, современный дизайн (как привычные SaaS), быстрая навигация, dark mode, keyboard shortcuts.

**Цитата:** _"Ich bin neu im Einkauf und lerne jeden Tag dazu. Der AI-Chat ist fur mich wie ein erfahrener Kollege, den ich jederzeit fragen kann. 'Ist der Aluminiumpreis gerade hoch oder niedrig im historischen Vergleich?' -- solche Fragen kann ich sonst niemandem stellen, ohne dumm dazustehen."_

**План BauPreis:** Pro (149 EUR) -- AI-чат и прогнозы = ключевая ценность для обучения

---

## Персона #7: Rainer Bock -- Metallhandler (Торговец металлом)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 51 год |
| **Профессия** | Geschaftsfuhrer / Metallhandler (торговец металлом) |
| **Компания** | Bock Metall GmbH, ~15 сотрудников, Essen |
| **Город** | Essen, Nordrhein-Westfalen |
| **Устройство** | Desktop (Windows 11), Samsung Galaxy A54 |
| **Tech-уровень** | 5/10 |
| **Языки** | Deutsch (Muttersprache), Englisch (B1) |

**Контекст использования:** Покупает и продает цветные металлы (Cu, Al, Zn, Ni). Для него BauPreis -- источник данных для определения закупочных и продажных цен. Использует Legierungsrechner (калькулятор сплавов) ежедневно для расчета цен на латунь, бронзу, нержавеющую сталь. Мониторит LME-цены и сравнивает с BauPreis.

**Главная боль:** Цены на металлы меняются несколько раз в день. Нужны данные в реальном времени (или хотя бы 4 обновления/день). Текущие источники (metals.dev, LME) разбросаны по разным сайтам. Нужен один dashboard с ценами всех ключевых металлов + калькулятор сплавов.

**Что важно:** Точность цен на металлы (до евро/тонна), Legierungsrechner (калькулятор сплавов), частота обновлений (4x/день минимум), исторические данные для переговоров с клиентами, AI-прогноз на 7 дней для закупочных решений.

**Цитата:** _"Der Legierungsrechner ist Gold wert. Fruher habe ich Messingpreise von Hand berechnet -- Kupfer mal 0,63 plus Zink mal 0,37 plus Marge. Jetzt klicke ich einmal und habe den aktuellen Preis fur alle 15 Legierungen. Das spart mir jeden Tag 30 Minuten."_

**План BauPreis:** Pro (149 EUR) -- Legierungsrechner + все металлы + AI-прогнозы для закупочных решений

---

## Персона #8: Prof. Dr. Michael Hartmann -- Architekt (Архитектор)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 46 лет |
| **Профессия** | Freier Architekt, Mitglied der Architektenkammer Baden-Wurttemberg |
| **Компания** | Hartmann + Partner Architekten, ~8 сотрудников, Freiburg |
| **Город** | Freiburg im Breisgau, Baden-Wurttemberg |
| **Устройство** | iMac 27" (основное), MacBook Pro 16", iPad Pro |
| **Tech-уровень** | 7/10 |
| **Языки** | Deutsch (Muttersprache), Englisch (C1), Franzosisch (B2) |

**Контекст использования:** Проектирует жилые и коммерческие здания. Использует BauPreis для расчета Preisgleitklausel (оговорка о скользящей цене в контрактах по HOAI/VOB). Включает ценовые данные BauPreis в проектную документацию. Обращается к инструменту при подготовке Kostenberechnung (расчет стоимости по DIN 276).

**Главная боль:** Preisgleitklausel требует обоснованных ценовых данных за 6-12 месяцев. Ему нужен надежный источник исторических цен, который можно указать в документации. Официальные источники (Destatis) обновляются с задержкой в 2-3 месяца. BauPreis может быть "оперативным дополнением".

**Что важно:** Preisgleitklausel-модуль (ключевая фича), надежность и цитируемость данных (источник указан), исторические данные за 12+ месяцев, PDF-экспорт для проектной документации, соответствие DIN 276 и HOAI.

**Цитата:** _"Als Architekt muss ich meinen Bauherren die Preisgleitklausel erklaren konnen. Wenn ich sagen kann: 'Laut BauPreis Index ist Bewehrungsstahl in den letzten 6 Monaten um 12% gestiegen -- hier ist der Nachweis als PDF' -- dann akzeptiert das jeder Bauherr."_

**План BauPreis:** Pro (149 EUR) -- Preisgleitklausel + исторические данные + AI-прогнозы для Kostenberechnung

---

## Персона #9: Sabine Kruger -- Buchhalterin (Бухгалтер)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 52 года |
| **Профессия** | Leiterin Buchhaltung (главный бухгалтер) |
| **Компания** | Bauunternehmen, ~60 сотрудников, Hannover |
| **Город** | Hannover, Niedersachsen |
| **Устройство** | Desktop (Windows 11, DATEV immer offen), HP Drucker |
| **Tech-уровень** | 3/10 |
| **Языки** | Deutsch (Muttersprache) |

**Контекст использования:** Отвечает за финансовую отчетность строительной фирмы. Использует BauPreis раз в неделю для формирования отчетов о динамике цен на материалы. Прикладывает PDF-отчеты к квартальным финансовым документам. Не разбирается в стройматериалах -- ей нужны готовые отчеты с цифрами.

**Главная боль:** Не технический человек. Сложные dashboards с графиками ее пугают. Нужна одна кнопка: "Сформировать отчет за период" -> получить PDF -> приложить к документации. Каждый лишний клик -- стресс и потеря времени.

**Что важно:** Простота (минимум кликов до результата), PDF-экспорт (главная фича), немецкий интерфейс (ТОЛЬКО Deutsch), крупный шрифт, понятные подписи к графикам, возможность выбрать период и получить отчет одной кнопкой.

**Цитата:** _"Ich verstehe nichts von Kupferpreisen und Legierungen. Ich brauche einmal pro Woche einen Bericht als PDF -- mit Datum, Preisen und Veranderungen. Mehr nicht. Wenn ich dafur mehr als drei Klicks brauche, ist das Tool nichts fur mich."_

**План BauPreis:** Team (299 EUR) -- покупает GF (директор), Sabine использует только PDF-отчеты. Или Basis (49 EUR), если покупает сама -- но тогда нет PDF

---

## Персона #10: Oliver Brandt -- Freelance Bauberater (Консультант)

| Параметр | Значение |
|----------|---------|
| **Возраст** | 41 год |
| **Профессия** | Freiberuflicher Bauberater / Bausachverstandiger |
| **Компания** | Selbstandig (фрилансер), работает на 4-6 клиентов одновременно |
| **Город** | Dusseldorf, Nordrhein-Westfalen |
| **Устройство** | MacBook Pro 14" (основное), iPhone 15, iPad Mini |
| **Tech-уровень** | 8/10 |
| **Языки** | Deutsch (Muttersprache), Englisch (C1) |

**Контекст использования:** Независимый консультант, работает на нескольких строительных проектах одновременно. Консультирует Bauherren (заказчиков) по ценам на материалы, проверяет сметы подрядчиков, готовит экспертизы. Использует BauPreis как "источник правды" для обоснования своих рекомендаций. Заходит ежедневно, часто с разных устройств.

**Главная боль:** Работает с несколькими клиентами, каждый со своим набором материалов. Нужно быстро переключаться между контекстами. Нужны профессиональные отчеты с логотипом и данными BauPreis, которые он может отправить клиентам. Конкуренты-консультанты не используют такие инструменты -- это его преимущество.

**Что важно:** Профессиональный вид отчетов (PDF с брендингом), данные из нескольких источников на одном экране, AI-анализ для подготовки экспертных заключений, мобильный доступ (iPad на встречах с клиентами), API для интеграции с собственными таблицами.

**Цитата:** _"BauPreis ist mein Wettbewerbsvorteil. Wenn ich meinem Kunden in der Besprechung auf dem iPad aktuelle Stahlpreise mit 90-Tage-Trend zeige und sage: 'Mein KI-Tool prognostiziert einen Anstieg von 5% im nachsten Monat -- kaufen Sie jetzt' -- dann bin ich der Experte, dem man vertraut."_

**План BauPreis:** Pro (149 EUR) -- AI-прогнозы и Telegram-алерты. Если появится возможность PDF-экспорта для Pro -- идеально. Потенциально перейдет на Team (299 EUR) при росте клиентской базы

---

## Сводная таблица

| # | Имя | Роль | Возраст | Tech | Устройство | План | Ключевая фича |
|---|-----|------|---------|------|-----------|------|---------------|
| 1 | Klaus Bergmann | Einkaufer | 57 | 4/10 | Desktop + iPad | Team | Алерты + API + PDF |
| 2 | Stefan Hofer | Bauleiter | 43 | 5/10 | Smartphone | Pro | Mobile PWA + Push |
| 3 | Markus Zimmermann | Kalkulator | 48 | 6/10 | Desktop (2 мон.) | Pro | Исторические цены + Preisgleitklausel |
| 4 | Jorg Seidel | Geschaftsfuhrer | 54 | 5/10 | MacBook + iPhone | Basis | AI-рекомендации простым языком |
| 5 | Anna-Lena Fischer | Projektleiterin | 38 | 7/10 | Surface Pro + iPhone | Team | PDF-отчеты + группировка по проектам |
| 6 | Tim Winkler | Junior Einkaufer | 25 | 9/10 | MacBook + iPhone | Pro | AI-чат для обучения |
| 7 | Rainer Bock | Metallhandler | 51 | 5/10 | Desktop + Samsung | Pro | Legierungsrechner |
| 8 | Prof. Dr. M. Hartmann | Architekt | 46 | 7/10 | iMac + MacBook + iPad | Pro | Preisgleitklausel + PDF |
| 9 | Sabine Kruger | Buchhalterin | 52 | 3/10 | Desktop (Windows) | Team* | PDF-отчеты (1 кнопка) |
| 10 | Oliver Brandt | Freelance Bauberater | 41 | 8/10 | MacBook + iPhone + iPad | Pro | AI-анализ + профессиональные отчеты |

*Team -- если покупает директор. Basis -- если покупает сама.

---

## Покрытие по планам

| План | Персоны | Доля |
|------|---------|------|
| **Basis (49 EUR)** | #4 Geschaftsfuhrer | 10% |
| **Pro (149 EUR)** | #2 Bauleiter, #3 Kalkulator, #6 Junior Einkaufer, #7 Metallhandler, #8 Architekt, #10 Bauberater | 60% |
| **Team (299 EUR)** | #1 Einkaufer, #5 Projektleiterin, #9 Buchhalterin | 30% |

**Вывод:** Pro -- самый востребованный план. Основная ценность: AI-прогнозы, все материалы, Telegram-алерты.

---

## Покрытие по ключевым фичам

| Фича BauPreis | Критично для персон | Приоритет |
|---------------|-------------------|-----------|
| Dashboard с ценами | Все 10 | P0 |
| Telegram-алерты | #1, #2, #5, #6, #10 (5/10) | P0 |
| AI-прогнозы | #3, #4, #5, #6, #8, #10 (6/10) | P0 |
| Мобильная версия (PWA) | #2, #4, #5, #6, #10 (5/10) | P0 |
| PDF-экспорт | #1, #5, #8, #9 (4/10) | P1 |
| Legierungsrechner | #7 (1/10, но критично) | P1 |
| AI-чат | #4, #6, #10 (3/10) | P1 |
| Preisgleitklausel | #3, #8 (2/10, но высокая ценность) | P1 |
| API-доступ | #1, #5, #10 (3/10) | P2 |
| Группировка по проектам | #5, #10 (2/10) | P2 |

---

*Персоны созданы: 2026-02-26*
*UX Research Lead: Dr. Katrin Engel (#11)*
*Следующее обновление: при значимом изменении продукта или аудитории*
