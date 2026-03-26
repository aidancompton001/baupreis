# T008 — Размещение официальных логотипов на сайте

**Дата:** 2026-03-26
**Статус:** P0 — Roadmap (жду ОК от CEO)
**Ответственный:** #2 Lena Hoffmann — UX/UI Engineer
**Размер:** M

---

## Новые логотипы

```
app/public/logo/
├── logo-full-horizontal.png   — иконка + "BauPreis AI" в строку
├── logo-full-vertical.png     — иконка + "BauPreis AI" в 2 строки
└── logo-icon.png              — только иконка (маленький)
```

## Текущее состояние (где сейчас лого)

| Место | Файл | Сейчас | Что нужно |
|-------|------|--------|-----------|
| **Landing nav** | `page.tsx:69` | `<img src="/logo-bauhaus.png">` + текст "BauPreis AI" | `logo-full-horizontal.png` (убрать текст) |
| **Landing footer** | `page.tsx:366` | `<BauhausLogo size={28}>` + текст | `logo-full-horizontal.png` |
| **Marketing header** | `MarketingHeader.tsx:16` | `<img src="/logo-bauhaus.png">` + текст | `logo-full-horizontal.png` |
| **Dashboard header** | `(dashboard)/layout.tsx:25` | `<img src="/logo-bauhaus.png">` + текст | `logo-full-horizontal.png` |
| **Auth sign-in** | `sign-in/page.tsx:48` | Текст "BauPreis AI" (без иконки) | `logo-full-vertical.png` |
| **Auth sign-up** | `sign-up/page.tsx:48` | Текст "BauPreis AI" (без иконки) | `logo-full-vertical.png` |
| **Mobile nav** | `MobileNav.tsx` | Нет лого (гамбургер) | Без изменений (хедер виден) |
| **PWA manifest** | `manifest.json` | `icon-192.png`, `icon-512.png` (НЕ существуют!) | Сгенерировать из `logo-icon.png` |
| **Apple touch icon** | `layout.tsx:98` | `/icon-192.png` (не существует) | Сгенерировать из `logo-icon.png` |
| **Schema.org logo** | `layout.tsx:175` | `https://baupreis.ais152.com/icon-512.png` | Обновить путь |
| **OG image** | `opengraph-image.tsx` | Текст "BauPreis AI" (сгенерированный) | Оставить (сложный компонент) |
| **Manifest theme_color** | `manifest.json:8` | `#3b82f6` (старый синий!) | `#C1292E` |
| **Manifest bg_color** | `manifest.json:7` | `#0f172a` | `#1A1A1A` |
| **Старый файл** | `app/public/logo-bauhaus.png` | Кроп из brand identity | Удалить (заменён на logo/) |

---

## Файлы затронуты

| Файл | Действие |
|------|---------|
| `app/src/app/page.tsx` | Заменить лого в nav + footer |
| `app/src/components/marketing/MarketingHeader.tsx` | Заменить лого |
| `app/src/app/(dashboard)/layout.tsx` | Заменить лого |
| `app/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Добавить logo-full-vertical |
| `app/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` | Добавить logo-full-vertical |
| `app/public/manifest.json` | Обновить icons, theme_color, bg_color |
| `app/src/app/layout.tsx` | Обновить apple-touch-icon путь, schema.org logo |
| `app/public/icon-192.png` | СОЗДАТЬ (resize logo-icon.png → 192x192) |
| `app/public/icon-512.png` | СОЗДАТЬ (resize logo-icon.png → 512x512) |
| `app/public/logo-bauhaus.png` | УДАЛИТЬ (старый) |

## Что может сломаться

| Риск | Вероятность | Митигация |
|------|------------|-----------|
| PWA не обновится (кэш SW) | Средняя | manifest.json версия + SW update |
| Горизонтальный лого слишком большой в mobile nav | Средняя | max-height: 32px |
| Удаление logo-bauhaus.png сломает кэш | Низкая | Новые пути /logo/* |

### Breakpoints

| Breakpoint | Что проверить |
|-----------|--------------|
| 375px | Лого в nav не обрезается, auth pages лого центрирован |
| 768px | Dashboard sidebar — лого horizontal |
| 1440px | Все лого на местах |

---

## Roadmap

1. Сгенерировать `icon-192.png` и `icon-512.png` из `logo-icon.png` (Python PIL resize)
2. Обновить `manifest.json` — icon paths, theme_color → `#C1292E`, bg_color → `#1A1A1A`
3. Обновить `layout.tsx` — apple-touch-icon path, schema.org logo URL
4. Обновить `page.tsx` — nav лого → `<img src="/logo/logo-full-horizontal.png" height={32}>`, убрать текст "BauPreis AI". Footer → то же
5. Обновить `MarketingHeader.tsx` — лого → horizontal, убрать текст
6. Обновить `(dashboard)/layout.tsx` — лого → horizontal, убрать текст
7. Обновить `sign-in/page.tsx` — добавить `<img src="/logo/logo-full-vertical.png">`
8. Обновить `sign-up/page.tsx` — добавить vertical лого
9. Удалить `app/public/logo-bauhaus.png`
10. `npm run build` → 0 errors
11. Проверить 375 / 768 / 1440

---

## Чеклист приёмки

- [ ] Landing nav — horizontal лого (без текста)
- [ ] Landing footer — horizontal лого
- [ ] Marketing header — horizontal лого
- [ ] Dashboard header — horizontal лого
- [ ] Auth sign-in — vertical лого
- [ ] Auth sign-up — vertical лого
- [ ] PWA icons — icon-192.png + icon-512.png сгенерированы из logo-icon.png
- [ ] manifest.json — theme_color `#C1292E`, bg_color `#1A1A1A`
- [ ] Schema.org logo URL обновлён
- [ ] Старый logo-bauhaus.png удалён
- [ ] Mobile 375px — лого не обрезается
- [ ] `npm run build` → 0 errors
