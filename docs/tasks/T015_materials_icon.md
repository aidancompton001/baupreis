# T015 — Уникальная иконка для Materials в sub-nav

**Дата:** 2026-03-27
**Статус:** P0 — Roadmap
**Ответственный:** #2 Katarina Weiß
**Размер:** S

## Проблема
Materials tab использует ту же иконку (IconDashboard) что и Overview — путаница.

## Roadmap
1. BauhausIcons.tsx — добавить IconMaterials (геометрические блоки: кубик + балка + труба, палитра #C1292E/#1A1A1A)
2. DashboardSubNav.tsx строка 19 — заменить IconDashboard → IconMaterials
3. Build check

## Чеклист
- [ ] IconMaterials создана в BauhausIcons.tsx
- [ ] Materials tab в sub-nav показывает УНИКАЛЬНУЮ иконку
- [ ] Build OK
