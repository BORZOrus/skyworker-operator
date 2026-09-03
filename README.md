# SkyWorker — Реестр операторов дронов

Маркетплейс операторов и сервисных компаний дронов по Казахстану. Отдельный модуль для платформы SkyWorker (официальный дистрибьютор DJI Agriculture в РК).

**Живой прототип:** https://borzorus.github.io/skyworker-operator/

## Что это
Двусторонняя площадка:
- **Операторы и компании** размещают карточки: допуски, техника, портфолио, направления, регионы работы.
- **Заказчики** ищут исполнителей (по направлению/региону), сравнивают, связываются — или размещают заявку.

Направления: агро, фото/видео, геодезия, картография, строительство, мониторинг/инспекция, поиск-спас, охрана, лес, доставка, другое.

## Стек
- **Frontend:** React 18 + TypeScript + Vite (стек SkyWorker ERP — для будущей стыковки)
- Роутинг: react-router (HashRouter, под GitHub Pages)
- Данные: пока моки (`src/data.ts`) + localStorage (`src/store.ts`); позже — REST API SkyWorker
- Бренд: чёрно-белый (#020A0A / #FFFFFF), логотип в `public/brand/`, шрифт Inter

## Структура
```
frontend/           React-приложение
  src/
    data.ts         моки профилей + справочник направлений
    regions.ts      20 регионов РК + города
    fieldSchemas.ts движок «модуль направления» (свои поля у каждого)
    store.ts        избранное + заявки (localStorage)
    components/     RegionPicker, profiles (карточка/модалка/связаться)
    pages/          Catalog, Landing, Register, Cabinet, Favorites, Requests, PostRequest
backend/            модели БД (SQLAlchemy) — задел, не запущен
knowledge/          KONSPEKT.md (вся аналитика проекта), UX-референсы, план
pisma/              письма Нурлану и разработчику SkyWorker
prototype/          ранний HTML-прототип + бренд-ассеты
```

## Запуск и сборка
```bash
cd frontend
npm install --include=dev      # NODE_ENV=production в окружении рубит devDeps — ставить с --include=dev
npx vite build                 # сборка в dist/
```
Деплой: `dist/` пушится в ветку `gh-pages` (GitHub Pages). База — `/skyworker-operator/`.

## Статус
Этап заглушек: весь UX собран и кликается на моках. Реальные вход/данные/бэкенд — следующий слой (FastAPI + PostgreSQL, стыковка со SkyWorker по UUID/external_id).

Полный контекст, решения и открытые вопросы — в `knowledge/KONSPEKT.md`.
