# Automotive Portal — SvelteKit Monorepo

Монорепозиторий на базе **Svelte 5 + SvelteKit**, содержащий портальные модули и несколько standalone-приложений — все доступны через один домен на одном порту.

## Быстрый старт

```bash
corepack enable          # активирует Yarn 4 через corepack
yarn install
yarn dev                 # http://localhost:5173
```

## Команды

```bash
yarn dev                       # основной портал (apps/web) → :5173
yarn build                     # production-сборка apps/web
yarn check                     # svelte-check + tsc по всем пакетам
yarn lint                      # ESLint по всем пакетам
yarn test                      # Vitest unit-тесты
yarn test:e2e                  # Playwright e2e
yarn test:coverage             # покрытие (v8)

# Standalone-приложения (извлечённые, для отдельного деплоя)
yarn dev:standalone:admin
yarn dev:standalone:bank
yarn dev:standalone:devtools
yarn dev:standalone:remotion
yarn dev:standalone:reports
```

## Структура

```
repo/
├── apps/
│   ├── web/                         # Единая точка входа — :5173
│   │   ├── src/
│   │   │   ├── hooks.server.ts      # feature flags + render mode
│   │   │   ├── routes/
│   │   │   │   ├── (portal)/        # layout-группа: portal nav + langStore
│   │   │   │   │   ├── +layout.svelte
│   │   │   │   │   ├── +page.svelte # главная — карточки модулей
│   │   │   │   │   ├── exchange/    # +page.svelte · +page.server.ts · +server.ts
│   │   │   │   │   ├── blog/        # + /blog/[id]/
│   │   │   │   │   ├── content/
│   │   │   │   │   ├── weather/     # + /weather/city/[city]/
│   │   │   │   │   ├── cars/
│   │   │   │   │   └── maps/        # + /maps/[lat]/[lon]/
│   │   │   │   ├── admin/           # /admin — панель управления флагами
│   │   │   │   ├── bank/            # /bank — банковский лендинг
│   │   │   │   ├── devtools/        # /devtools — симулятор устройств
│   │   │   │   ├── remotion/        # /remotion — Remotion видео-генератор
│   │   │   │   └── reports/         # /reports — аналитический дашборд
│   │   │   ├── modules/             # бизнес-логика (изолированные модули)
│   │   │   │   ├── exchange/        # api/ · model/ · server/ · config/ · index.ts
│   │   │   │   ├── blog/
│   │   │   │   ├── content/
│   │   │   │   ├── weather/
│   │   │   │   ├── cars/
│   │   │   │   └── maps/
│   │   │   └── lib/
│   │   │       ├── lang-store.svelte.ts   # portal-wide RU/EN store
│   │   │       ├── admin-i18n.svelte.ts   # admin i18n singleton
│   │   │       └── player-mount.tsx       # React/Remotion mount helper
│   │   └── .env / .env.example
│   │
│   ├── admin/      # standalone: извлекаемая admin-панель
│   ├── bank/       # standalone: банковский лендинг
│   ├── devtools/   # standalone: симулятор устройств
│   ├── remotion/   # standalone: Remotion Studio
│   └── reports/    # standalone: дашборд
│
├── packages/
│   ├── shared/                       # @repo/shared
│   │   └── src/
│   │       ├── api/                  # HTTP-клиент, ApiError
│   │       ├── feature-flags/        # FeatureFlagConfig, RenderModeFlagConfig
│   │       ├── config/               # ModuleConfig, APP_CONFIG
│   │       ├── i18n/                 # createI18nStore, LangToggle
│   │       ├── utils/                # date, currency, helpers
│   │       └── ui/                   # Button, Card, Input, Loader, EmptyState, ErrorState, PageHeader
│   ├── remotion-compositions/        # @repo/remotion-compositions
│   ├── flags-store/                  # @repo/flags-store
│   ├── tsconfig/
│   └── eslint-config/
│
├── vitest.config.ts
├── vitest.setup.ts
├── vitest.mocks/                     # stubs: $app/environment · navigation · stores
├── playwright.config.ts
└── .gitignore
```

## Архитектура: Route = оболочка, Module = продукт

Каждый модуль — самодостаточный продукт с публичным API:

```
modules/exchange/
  api/              прямые вызовы внешнего API (только server-side)
  model/            типы, константы, DTO-трансформы
  server/
    load.ts         SSR loader
    handler.ts      API proxy handler
  config/
    module.config.ts
  index.ts          публичный API модуля
```

Маршрут — тонкая оболочка:

```
routes/(portal)/exchange/
  +page.server.ts   вызывает loadExchangeData() или возвращает SPA-оболочку
  +page.svelte      UI — получает только подготовленные данные
  +server.ts        API proxy (GET /exchange?base=USD)
```

**Правило изоляции** — запрещено:
```ts
import { something } from '$modules/blog'   // внутри другого модуля
```
Разрешено только:
```ts
import { ... } from '@repo/shared'
import { ... } from '@repo/shared/api'
import { ... } from '@repo/shared/ui'
```

## Feature Flags

Все модули и standalone-приложения управляются через переменные окружения и admin-панель `/admin`.

```env
# Портальные модули
PUBLIC_FEATURE_EXCHANGE=true
PUBLIC_FEATURE_BLOG=true
PUBLIC_FEATURE_CONTENT=true
PUBLIC_FEATURE_WEATHER=true
PUBLIC_FEATURE_CARS=true
PUBLIC_FEATURE_MAPS=true

# Standalone-приложения
PUBLIC_FEATURE_ADMIN=true
PUBLIC_FEATURE_BANK=true
PUBLIC_FEATURE_DEVTOOLS=true
PUBLIC_FEATURE_REMOTION=true
PUBLIC_FEATURE_REPORTS=true
```

При `false`: UI показывает экран «Раздел временно недоступен», API возвращает `403`.  
Admin-панель (`/admin`) **всегда доступна** — чтобы можно было повторно включить отключённые флаги.

## Render Mode (SSR / SPA)

```env
PUBLIC_RENDER_MODE_EXCHANGE=ssr   # ssr (default) | spa
PUBLIC_RENDER_MODE_BLOG=ssr
# ...
```

**SSR** — данные загружаются сервером, HTML пре-рендеренный, SEO-friendly.  
**SPA** — сервер отдаёт пустую оболочку, данные грузятся клиентом через внутренний proxy.

## Локализация (RU / EN)

Глобальный `langStore` (cookie + localStorage) управляет языком по всему порталу.  
Переключатель в навигационной шапке меняет язык синхронно на всех страницах.

## Добавление нового модуля

```bash
# 1. Модуль
mkdir -p apps/web/src/modules/insurance/{api,model,server,config}
# 2. Маршрут
mkdir apps/web/src/routes/\(portal\)/insurance
# 3. Флаги в .env
echo "PUBLIC_FEATURE_INSURANCE=true" >> apps/web/.env
echo "PUBLIC_RENDER_MODE_INSURANCE=ssr" >> apps/web/.env
# 4. Зарегистрировать в hooks.server.ts (MODULE_ROUTES)
```

Существующие модули не затрагиваются.

## Переносимость модулей

```bash
cp -r apps/web/src/modules/exchange ./standalone/src/modules/
cp -r packages/shared ./standalone/packages/shared
# Добавить свой SvelteKit проект — бизнес-логика не меняется
```

## Приложения

| Маршрут       | API                               | Описание                       |
|---------------|-----------------------------------|--------------------------------|
| `/`           | —                                 | Главная, карточки модулей      |
| `/exchange`   | frankfurter.dev/v1/latest         | Курсы валют, конвертер         |
| `/blog`       | jsonplaceholder.typicode.com      | Список постов + детальная      |
| `/content`    | dummyjson.com/quotes              | Цитаты с поиском               |
| `/weather`    | open-meteo.com + Nominatim        | Погода + 7-дневный прогноз     |
| `/cars`       | vpic.nhtsa.dot.gov/api            | VIN-декодер                    |
| `/maps`       | OpenStreetMap + Nominatim         | Карта + геокодирование         |
| `/admin`      | internal flags API                | Управление feature flags       |
| `/bank`       | —                                 | Банковский лендинг             |
| `/devtools`   | —                                 | Симулятор мобильных устройств  |
| `/remotion`   | @remotion/player                  | Видео-генератор                |
| `/reports`    | open-source публичные API         | Аналитический дашборд         |

## Технологии

- Svelte 5, SvelteKit, TypeScript
- Yarn 4 (nodeLinker: node-modules)
- Vite 6, @sveltejs/adapter-node
- Tailwind CSS v4
- React 18 + Remotion 4 (для /remotion)
- Vitest 4 + @testing-library/svelte + Playwright
- ESLint (flat config), Prettier, Husky + lint-staged
