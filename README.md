# Automotive Portal — SvelteKit Monorepo

**Svelte 5 + SvelteKit** monorepo. One domain, one port — all portal modules and standalone apps served from `apps/web` at `:5173`.

## Quick Start

```bash
corepack enable   # activates Yarn 4 via corepack
yarn install
yarn dev          # http://localhost:5173
```

## Commands

| Command | What it does |
|---------|-------------|
| `yarn dev` | Start main portal (`apps/web`) → `:5173` |
| `yarn build` | Production build: `apps/web` + all standalone apps |
| `yarn build:web` | Build `apps/web` only |
| `yarn build:standalone` | Build admin, bank, devtools, reports |
| `yarn lint` | ESLint across all workspaces |
| `yarn check` | `svelte-check` + `tsc` across all workspaces |
| `yarn test` | Vitest unit tests |
| `yarn test:e2e` | Playwright end-to-end tests |
| `yarn test:all` | Unit + e2e |
| `yarn dev:standalone:admin` | Run `apps/admin` standalone → `:5174` |
| `yarn dev:standalone:bank` | Run `apps/bank` standalone |
| `yarn dev:standalone:devtools` | Run `apps/devtools` standalone |
| `yarn dev:standalone:reports` | Run `apps/reports` standalone |
| `yarn dev:standalone:remotion` | Run `apps/remotion-app` standalone |

## Structure

```
repo/
├── apps/
│   ├── web/                          # @repo/web — single entry point (:5173)
│   │   └── src/
│   │       ├── hooks.server.ts       # feature flags, render mode, auth
│   │       ├── routes/
│   │       │   ├── (portal)/         # layout group: shared nav + langStore
│   │       │   │   ├── exchange/     # +page.svelte, +page.server.ts, +server.ts
│   │       │   │   ├── blog/         # /blog/[id]/
│   │       │   │   ├── content/
│   │       │   │   ├── weather/      # /weather/city/[city]/
│   │       │   │   ├── cars/
│   │       │   │   └── maps/         # /maps/[lat]/[lon]/
│   │       │   ├── admin/            # flag management dashboard
│   │       │   ├── bank/
│   │       │   ├── devtools/
│   │       │   ├── remotion/
│   │       │   └── reports/
│   │       └── modules/              # business logic — isolated per module
│   │           ├── exchange/         # api/ · model/ · server/ · config/ · index.ts
│   │           ├── blog/
│   │           ├── content/
│   │           ├── weather/
│   │           ├── cars/
│   │           └── maps/
│   ├── admin/      # @repo/admin    — extractable standalone admin app
│   ├── bank/       # @repo/bank     — extractable standalone bank app
│   ├── devtools/   # @repo/devtools — extractable standalone devtools app
│   ├── reports/    # @repo/reports  — extractable standalone reports app
│   └── remotion/   # @repo/remotion-app — Remotion Studio
│
└── packages/
    ├── shared/              # @repo/shared — api, utils, ui, feature-flags, i18n, config
    ├── flags-store/         # @repo/flags-store — file-based runtime flag overrides
    ├── remotion-compositions/
    ├── tsconfig/
    └── eslint-config/
```

## Routes

| Route | External API | Description |
|-------|-------------|-------------|
| `/` | — | Landing page, module cards |
| `/exchange` | frankfurter.dev/v1/latest | Currency rates & converter |
| `/blog` | jsonplaceholder.typicode.com | Posts list + detail |
| `/content` | dummyjson.com/quotes | Quotes with search |
| `/weather` | open-meteo.com + Nominatim | Weather + 7-day forecast |
| `/cars` | vpic.nhtsa.dot.gov/api | VIN decoder |
| `/maps` | OpenStreetMap + Nominatim | Map + geocoding |
| `/admin` | internal flags API | Feature flag management |
| `/bank` | — | Banking landing page |
| `/devtools` | — | Mobile device simulator |
| `/remotion` | @remotion/player | Video generator |
| `/reports` | public APIs | Analytics dashboard |
| `/api-docs` | — | OpenAPI / Swagger UI |

## Architecture

**Route = thin shell. Module = self-contained product.**

Routes in `src/routes/(portal)/<module>/` only: check `locals.featureEnabled`, check `locals.renderMode`, pass data to Svelte components.

Business logic lives in `src/modules/<module>/` and depends only on `@repo/shared`. Cross-module imports are forbidden — anything shared between modules belongs in `@repo/shared`.

## Feature Flags

All modules are controlled via ENV variables and the runtime admin dashboard at `/admin`.

```env
# Portal modules (support SSR/SPA render mode toggle)
PUBLIC_FEATURE_EXCHANGE=true
PUBLIC_FEATURE_BLOG=true
PUBLIC_FEATURE_CONTENT=true
PUBLIC_FEATURE_WEATHER=true
PUBLIC_FEATURE_CARS=true
PUBLIC_FEATURE_MAPS=true

# Standalone apps embedded in apps/web (always SSR)
PUBLIC_FEATURE_ADMIN=true
PUBLIC_FEATURE_BANK=true
PUBLIC_FEATURE_DEVTOOLS=true
PUBLIC_FEATURE_REMOTION=true
PUBLIC_FEATURE_REPORTS=true
```

When `false`: UI shows "Section unavailable", API returns `403`. The `/admin` route is always accessible so disabled flags can be re-enabled. Runtime overrides written via the admin dashboard take effect immediately without a restart (read on every request by `hooks.server.ts`).

## Production Deployment Notes

- **`ADMIN_SECRET`** must be set in both `apps/web/.env` and `apps/admin/.env` with the same value.
- **`FLAGS_STORE_PATH`** must point to the same file path in both apps if you use runtime flag overrides.
- All external API calls have an 8-second timeout via `AbortSignal.timeout`.
- Web Vitals are sent to `POST /api/vitals` — extend that handler to forward to your observability backend.
- OpenAPI spec is available at `/api-docs` (Swagger UI).

## Tech Stack

- Svelte 5, SvelteKit, TypeScript
- Yarn 4 (Berry, nodeLinker: node-modules)
- Vite 6, `@sveltejs/adapter-node`
- Tailwind CSS v4
- React 18 + Remotion 4 (for `/remotion`)
- Vitest + `@testing-library/svelte`, Playwright
- ESLint flat config, Prettier, Husky + lint-staged
