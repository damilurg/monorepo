# Developer Guide — Automotive Portal SvelteKit Monorepo

Full reference for developers. Covers environment setup, architecture, adding modules, testing, feature flags, extracting standalone apps, and deployment.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Architecture](#2-architecture)
3. [Feature Flags System](#3-feature-flags-system)
4. [Adding a New Module](#4-adding-a-new-module)
5. [Testing](#5-testing)
6. [Extracting a Standalone App](#6-extracting-a-standalone-app)
7. [Production Deployment](#7-production-deployment)
8. [Environment Variables Reference](#8-environment-variables-reference)

---

## 1. Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20.0.0 |
| Yarn | 4.x (managed via Corepack — do not install separately) |

### Setup

```bash
git clone <repo-url> portal
cd portal

corepack enable          # picks up "packageManager": "yarn@4.x" from package.json
yarn install
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
# fill in ADMIN_SECRET in both .env files

yarn dev                 # http://localhost:5173
```

### Key Commands

```bash
yarn dev                       # apps/web -> :5173 (main portal)
yarn dev:standalone:admin      # apps/admin standalone -> :5174
yarn dev:standalone:bank       # apps/bank standalone
yarn dev:standalone:devtools   # apps/devtools standalone
yarn dev:standalone:reports    # apps/reports standalone
yarn dev:standalone:remotion   # apps/remotion-app standalone

yarn build                     # build apps/web + all standalone apps
yarn build:web                 # build apps/web only
yarn build:standalone          # build admin + bank + devtools + reports

yarn lint                      # ESLint all workspaces
yarn check                     # svelte-check + tsc all workspaces
yarn test                      # Vitest unit tests (all workspaces)
yarn test:e2e                  # Playwright end-to-end (e2e/ directory)
yarn test:all                  # unit + e2e
```

### VSCode Setup

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[svelte]": { "editor.defaultFormatter": "svelte.svelte-vscode" },
  "eslint.validate": ["javascript", "typescript", "svelte"],
  "svelte.enable-ts-plugin": true,
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

Recommended extensions: `svelte.svelte-vscode`, `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode`, `bradlc.vscode-tailwindcss`.

---

## 2. Architecture

### Workspace Layout

```
repo/
├── package.json                  # root -- workspaces + shared scripts
├── yarn.lock
├── apps/
│   ├── web/                      # @repo/web -- main portal (:5173)
│   │   └── src/
│   │       ├── hooks.server.ts   # feature flag resolution, render mode, auth
│   │       ├── app.d.ts          # App.Locals type declaration
│   │       ├── routes/
│   │       │   ├── (portal)/     # layout group -- shared nav + langStore
│   │       │   │   ├── exchange/ # +page.svelte, +page.server.ts, +server.ts
│   │       │   │   ├── blog/     # /blog/[id]/
│   │       │   │   ├── content/
│   │       │   │   ├── weather/  # /weather/city/[city]/
│   │       │   │   ├── cars/
│   │       │   │   └── maps/     # /maps/[lat]/[lon]/
│   │       │   ├── admin/        # /admin -- flag dashboard
│   │       │   ├── bank/
│   │       │   ├── devtools/
│   │       │   ├── remotion/
│   │       │   ├── reports/
│   │       │   └── api/          # /api/vitals, /api-docs, etc.
│   │       ├── modules/          # business logic -- one dir per portal module
│   │       │   ├── exchange/
│   │       │   ├── blog/
│   │       │   ├── content/
│   │       │   ├── weather/
│   │       │   ├── cars/
│   │       │   └── maps/
│   │       └── lib/
│   │           ├── lang-store.svelte.ts   # portal-wide RU/EN language store
│   │           ├── admin-i18n.svelte.ts   # admin i18n singleton
│   │           └── player-mount.tsx       # React/Remotion mount helper
│   ├── admin/      # @repo/admin     -- extractable standalone admin app
│   ├── bank/       # @repo/bank      -- extractable standalone bank app
│   ├── devtools/   # @repo/devtools  -- extractable standalone devtools app
│   ├── reports/    # @repo/reports   -- extractable standalone reports app
│   └── remotion/   # @repo/remotion-app -- Remotion Studio
│
├── packages/
│   ├── shared/              # @repo/shared
│   │   └── src/
│   │       ├── api/         # httpGet, httpPost, ApiError
│   │       ├── feature-flags/ # FeatureFlagConfig, ModuleId, env parsers
│   │       ├── config/      # ModuleConfig interface, APP_CONFIG
│   │       ├── i18n/        # createI18nStore, LangToggle
│   │       ├── utils/       # date, currency, general helpers
│   │       └── ui/          # Button, Card, Input, Loader, EmptyState, ErrorState, PageHeader
│   ├── flags-store/         # @repo/flags-store -- file-based runtime overrides
│   ├── remotion-compositions/ # @repo/remotion-compositions
│   ├── tsconfig/            # @repo/tsconfig -- shared TS configs
│   └── eslint-config/       # @repo/eslint-config -- shared ESLint flat config
│
├── e2e/                     # Playwright tests
├── vitest.config.ts
├── vitest.setup.ts
└── vitest.mocks/            # stubs for $app/environment, navigation, stores
```

### Route = Shell, Module = Product

This is the central architectural rule.

**A route is a thin shell.** Files in `src/routes/(portal)/<module>/` do three things only:
1. Check `locals.featureEnabled` -- return 403 if false.
2. Check `locals.renderMode` -- call the module loader (SSR) or return an empty skeleton (SPA).
3. Pass the result to the Svelte component.

**A module is a self-contained product.** All business logic lives in `src/modules/<module>/`:

```
src/modules/exchange/
  api/
    frankfurter.ts       # raw external API calls -- server-side only
  model/
    types.ts             # TypeScript interfaces, DTO transforms
  server/
    load.ts              # SSR data loader (called by +page.server.ts)
    handler.ts           # API proxy handler (called by +server.ts)
  config/
    module.config.ts     # ModuleConfig descriptor
  index.ts               # public barrel export
```

This structure lets you move a module to a standalone app without touching any business logic.

### Module Isolation Rule

```ts
// FORBIDDEN -- cross-module import
import { something } from '$modules/blog'   // inside exchange module

// ALLOWED
import { ... } from '@repo/shared'
import { ... } from '@repo/shared/api'
import { ... } from '@repo/shared/ui'
import { ... } from '$modules/exchange/...'  // within the same module only
```

If two modules need to share something, it belongs in `@repo/shared`.

### @repo/shared Sub-path Exports

| Export path | Contents |
|-------------|---------|
| `@repo/shared` | Re-exports everything |
| `@repo/shared/api` | `httpGet`, `httpPost`, `ApiError` |
| `@repo/shared/feature-flags` | `FeatureFlagConfig`, `RenderModeFlagConfig`, `ModuleId`, `getFeatureFlagsFromEnv`, `getRenderModesFromEnv` |
| `@repo/shared/config` | `ModuleConfig` interface, `APP_CONFIG` |
| `@repo/shared/utils` | date helpers, currency formatters |
| `@repo/shared/ui` | Svelte 5 components: `Button`, `Card`, `Input`, `Loader`, `EmptyState`, `ErrorState`, `PageHeader` |

**Vite/SSR note:** `@repo/shared` contains `.svelte` files. In `apps/web/vite.config.ts` it is listed in both `optimizeDeps.exclude` and `ssr.noExternal`. This forces Vite to process it through the Svelte plugin rather than bundling or externalizing it. Any new standalone app depending on `@repo/shared` must replicate these two options.

### hooks.server.ts

`apps/web/src/hooks.server.ts` runs on every request and sets:

| `event.locals` field | Set from |
|---------------------|---------|
| `featureEnabled` | runtime override -> ENV var -> default `true` |
| `renderMode` | runtime override -> ENV var -> default `'ssr'` (standalone apps always `'ssr'`) |
| `app` | `ModuleId` of the matched route, or `'home'` |
| `isAuthenticated` | cookie checked by `$lib/server/auth.ts` |
| `lang` | `lang` cookie (`'ru'` or `'en'`) |

Portal modules (`/exchange`, `/blog`, etc.) support both `featureEnabled` and `renderMode`. Standalone app routes (`/admin`, `/bank`, etc.) support `featureEnabled` only -- `renderMode` is hardcoded to `'ssr'`.

In dev mode the handle also injects the React Fast Refresh preamble into every HTML response, which is required because SvelteKit bypasses Vite's `transformIndexHtml` hook.

---

## 3. Feature Flags System

### Priority Chain

```
runtime override (flags-override.json)
  > ENV variable (PUBLIC_FEATURE_*, PUBLIC_RENDER_MODE_*)
    > hard-coded default (all enabled, all ssr)
```

### ENV-based Flags

Set in `apps/web/.env`. Changes require a server restart.

```env
PUBLIC_FEATURE_EXCHANGE=true      # false -> API returns 403, UI shows "unavailable"
PUBLIC_RENDER_MODE_EXCHANGE=ssr   # ssr | spa
```

### Runtime Overrides via Admin Dashboard

The `/admin` route (and the extractable `apps/admin` standalone) provides a dashboard to toggle flags without restarting the server. Changes are written to `flags-override.json` by `@repo/flags-store` and read by `hooks.server.ts` on every request.

`@repo/flags-store` API:

```typescript
import { readOverrides, setModuleOverride, resetModuleOverride, resetAllOverrides } from '@repo/flags-store';

const overrides = readOverrides();                            // read current overrides
setModuleOverride('weather', { enabled: false });            // disable a module at runtime
setModuleOverride('exchange', { renderMode: 'spa' });        // switch render mode
resetModuleOverride('blog');                                  // remove override, fall back to ENV
resetAllOverrides();                                          // wipe all overrides
```

**Critical:** `FLAGS_STORE_PATH` must point to the same file in both `apps/web` and `apps/admin` (or the running standalone admin process). If they point to different paths, admin writes will have no effect on the web app.

### Adding a Module to the Flag System

When adding a new module, update `ModuleId` in **both** of these files:

- `packages/shared/src/feature-flags/index.ts`
- `packages/flags-store/src/index.ts`

Follow the existing pattern for `FeatureFlagConfig`, `RenderModeFlagConfig`, `getFeatureFlagsFromEnv`, and `getRenderModesFromEnv`.

---

## 4. Adding a New Module

This walks through adding a hypothetical `/insurance` module end-to-end.

### Step 1 -- Create the module directory

```bash
mkdir -p apps/web/src/modules/insurance/{api,model,server,config}
```

Create the files following the structure of an existing module (e.g., `exchange`):

- `api/insurance-api.ts` -- raw external API calls using `httpGet` from `@repo/shared/api`. Server-side only -- never imported from `.svelte` files.
- `model/types.ts` -- TypeScript interfaces for all data shapes.
- `server/load.ts` -- SSR data loader function called by `+page.server.ts`.
- `server/handler.ts` -- API proxy handler called by `+server.ts`.
- `config/module.config.ts` -- `ModuleConfig` descriptor (id, route, title, description).
- `index.ts` -- barrel export of everything above.

All external HTTP calls must use `httpGet`/`httpPost` from `@repo/shared/api`, which wraps `fetch` with `AbortSignal.timeout(8000)`.

### Step 2 -- Create route files

```
apps/web/src/routes/(portal)/insurance/
  +page.server.ts
  +page.svelte
  +server.ts        # API proxy -- GET /insurance?...
```

`+page.server.ts` pattern:

```typescript
import type { PageServerLoad } from './$types';
import { loadInsuranceData } from '$modules/insurance/server/load.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.featureEnabled) error(403, { message: 'Insurance module is disabled' });

  if (locals.renderMode === 'spa') {
    return { renderMode: 'spa' as const, data: null };
  }

  const result = await loadInsuranceData(url.searchParams.get('vin') ?? '');
  return { renderMode: 'ssr' as const, ...result };
};
```

### Step 3 -- Register the feature flag

1. Add `'insurance'` to `ModuleId` in `packages/shared/src/feature-flags/index.ts` and `packages/flags-store/src/index.ts`.
2. Add `insurance: true` / `insurance: 'ssr'` to the corresponding `FeatureFlagConfig` and `RenderModeFlagConfig` objects and their env parsers.

### Step 4 -- Register in hooks.server.ts

```typescript
const MODULE_ROUTES: Record<string, ModuleId> = {
  // ... existing entries ...
  '/insurance': 'insurance',   // add this
};
```

### Step 5 -- Add ENV variables

In `apps/web/.env` and `apps/web/.env.example`:

```env
PUBLIC_FEATURE_INSURANCE=true
PUBLIC_RENDER_MODE_INSURANCE=ssr
```

### Step 6 -- Register on the landing page

Add the module to the modules array in `apps/web/src/routes/(portal)/+page.server.ts` (or wherever the landing card list is built).

### Step 7 -- Write tests

Create unit tests in `src/modules/insurance/server/load.test.ts` and component tests in `src/routes/(portal)/insurance/+page.server.test.ts`. Cover: feature disabled (403), SSR path, SPA path, external API error.

---

## 5. Testing

### Unit Tests (Vitest)

Config lives at the repo root `vitest.config.ts`. Tests are co-located with the code they test.

```
src/modules/weather/
  server/
    load.ts
    load.test.ts          # unit test for the SSR loader
  api/
    open-meteo.ts
    open-meteo.test.ts    # unit test for the API client
```

Run:

```bash
yarn test                  # run once across all workspaces
yarn test --watch          # TDD watch mode
yarn test --coverage       # coverage report
```

Coverage thresholds are set to 100% for covered files. Excluded from coverage: `*.d.ts`, `.svelte-kit/`, `index.ts` barrel exports, `module.config.ts` constants, layout files.

**Patterns:**

- Mock external `fetch` calls with `vi.fn()` -- never make real network calls in tests.
- Use `vi.mock(...)` at the module level for server loaders.
- Test all branches: feature enabled/disabled, SSR/SPA render mode, success/error from external API.

```typescript
// Example: testing the feature-disabled branch
it('throws 403 when feature is disabled', async () => {
  await expect(
    load({ locals: { featureEnabled: false, renderMode: 'ssr' } } as any)
  ).rejects.toMatchObject({ status: 403 });
});
```

### End-to-End Tests (Playwright)

Tests live in `e2e/`. Each file covers a route or user flow.

```
e2e/
  home.test.ts
  exchange.test.ts
  blog.test.ts
  cars.test.ts
  content.test.ts
  weather.test.ts
```

Config: `playwright.config.ts` at the repo root.

```bash
yarn test:e2e              # run all e2e tests
yarn test:all              # unit + e2e
```

### Code Review Checklist

Before opening a PR:

- [ ] `yarn lint` passes with zero warnings
- [ ] `yarn check` passes (TypeScript strict mode across all workspaces)
- [ ] New module has unit tests covering: feature disabled (403), SSR path, SPA path, API error
- [ ] No `any` types -- use `unknown` and narrow with type guards
- [ ] No cross-module imports -- only `@repo/shared` and its sub-paths
- [ ] New module registered in `hooks.server.ts` `MODULE_ROUTES`
- [ ] `ModuleId` updated in both `@repo/shared/feature-flags` and `@repo/flags-store`
- [ ] ENV vars added to `.env.example`
- [ ] Both SSR and SPA render modes tested

---

## 6. Extracting a Standalone App

Each portal module is designed to be extractable into its own deployable SvelteKit app with no changes to business logic. `apps/admin`, `apps/bank`, `apps/devtools`, and `apps/reports` already demonstrate this pattern.

### Steps to extract a module (e.g., `weather`)

**1. Create the new app scaffold:**

```bash
mkdir -p apps/weather/src/{routes,modules/weather}
# add package.json with name "@repo/weather"
# add svelte.config.js, vite.config.ts, tsconfig.json
```

**2. Copy the module:**

```bash
cp -r apps/web/src/modules/weather apps/weather/src/modules/
```

The module code has no dependencies except `@repo/shared` -- it moves unchanged.

**3. Configure vite.config.ts** to add `@repo/shared` to `optimizeDeps.exclude` and `ssr.noExternal` (same as `apps/web`). Without this, Svelte components in `@repo/shared` will fail to render server-side.

**4. Create `+page.server.ts`** that imports directly from `./modules/weather/server/load.ts` instead of `$modules/weather/...`.

**5. Add the workspace script** to root `package.json`:

```json
"dev:standalone:weather": "yarn workspace @repo/weather dev"
```

**6. Provide `.env`** with `ADMIN_SECRET` and `FLAGS_STORE_PATH` if the standalone needs flag awareness, though in practice simple standalone apps can omit the flag system entirely.

---

## 7. Production Deployment

### Build

```bash
yarn build        # builds apps/web + admin + bank + devtools + reports
```

### Required Environment Variables

See [Section 8](#8-environment-variables-reference) for the full list.

Critical minimums:

```env
# apps/web
NODE_ENV=production
ADMIN_SECRET=<strong-secret>              # must match apps/admin
FLAGS_STORE_PATH=/var/data/flags.json     # must match apps/admin

# apps/admin
NODE_ENV=production
ADMIN_SECRET=<same-strong-secret>
FLAGS_STORE_PATH=/var/data/flags.json     # must match apps/web
```

### PM2 (single VPS)

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'web',
      script: 'build/index.js',
      cwd: './apps/web',
      env: {
        NODE_ENV: 'production',
        PORT: 5173,
        ADMIN_SECRET: process.env.ADMIN_SECRET,
        FLAGS_STORE_PATH: '/var/data/flags.json',
        PUBLIC_FEATURE_EXCHANGE: 'true',
        PUBLIC_RENDER_MODE_EXCHANGE: 'ssr',
        // ... remaining PUBLIC_FEATURE_* and PUBLIC_RENDER_MODE_* vars
      },
    },
    {
      name: 'admin',
      script: 'build/index.js',
      cwd: './apps/admin',
      env: {
        NODE_ENV: 'production',
        PORT: 5174,
        ADMIN_SECRET: process.env.ADMIN_SECRET,
        FLAGS_STORE_PATH: '/var/data/flags.json',
      },
    },
  ],
};
```

```bash
pm2 start ecosystem.config.cjs
pm2 save && pm2 startup
```

### Nginx (minimal)

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

All routes -- including `/admin`, `/bank`, `/devtools`, etc. -- are served through `apps/web` on port 5173. The standalone `apps/admin` on port 5174 is used only when deploying it independently (e.g., on a separate subdomain). The app enforces `ADMIN_SECRET` cookie auth on `/admin` regardless of whether you additionally restrict it at the reverse proxy level.

### Observability

- **Web Vitals:** Sent via `navigator.sendBeacon` to `POST /api/vitals`. Extend the handler in `apps/web/src/routes/api/vitals/+server.ts` to forward payloads to your backend (Datadog, Grafana Cloud, etc.).
- **API timeouts:** All external calls use `AbortSignal.timeout(8000)`. Errors surface as `ApiError` with the upstream HTTP status.
- **OpenAPI:** Swagger UI available at `/api-docs`.

### Deployment Checklist

- [ ] `ADMIN_SECRET` set in both `apps/web` and `apps/admin` (same value)
- [ ] `FLAGS_STORE_PATH` set to the same absolute path in both apps
- [ ] `FLAGS_STORE_PATH` directory is writable by the Node process
- [ ] `NODE_ENV=production` in both apps
- [ ] All `PUBLIC_FEATURE_*` and `PUBLIC_RENDER_MODE_*` vars set explicitly (do not rely on defaults in production)
- [ ] `/api/vitals` handler wired to your observability backend
- [ ] HTTPS configured; HTTP redirects to HTTPS
- [ ] Consider restricting `/admin` by IP in the reverse proxy in addition to app-level auth

---

## 8. Environment Variables Reference

### apps/web/.env

```env
# ── Auth ───────────────────────────────────────────────────────────────────────
# Required. Must match ADMIN_SECRET in apps/admin/.env.
ADMIN_SECRET=your-strong-secret-here

# ── Portal module feature flags ────────────────────────────────────────────────
# false -> API returns 403, UI shows "Section unavailable"
# Runtime overrides via /admin take priority over these values.
PUBLIC_FEATURE_EXCHANGE=true
PUBLIC_FEATURE_BLOG=true
PUBLIC_FEATURE_CONTENT=true
PUBLIC_FEATURE_WEATHER=true
PUBLIC_FEATURE_CARS=true
PUBLIC_FEATURE_MAPS=true

# Standalone app routes embedded in apps/web
PUBLIC_FEATURE_ADMIN=true
PUBLIC_FEATURE_BANK=true
PUBLIC_FEATURE_DEVTOOLS=true
PUBLIC_FEATURE_REPORTS=true
PUBLIC_FEATURE_REMOTION=true

# ── Render mode (portal modules only -- standalone apps are always ssr) ────────
# ssr: server fetches data, returns pre-rendered HTML (default, SEO-friendly)
# spa: server returns empty shell, client fetches via internal API proxy
PUBLIC_RENDER_MODE_EXCHANGE=ssr
PUBLIC_RENDER_MODE_BLOG=ssr
PUBLIC_RENDER_MODE_CONTENT=ssr
PUBLIC_RENDER_MODE_WEATHER=ssr
PUBLIC_RENDER_MODE_CARS=ssr
PUBLIC_RENDER_MODE_MAPS=ssr

# ── Runtime flags store ────────────────────────────────────────────────────────
# Path to the runtime override JSON file written by the admin dashboard.
# Must match FLAGS_STORE_PATH in apps/admin/.env.
# Default: <cwd>/flags-override.json
# Production: use an absolute path on a shared volume.
# FLAGS_STORE_PATH=/var/data/flags-override.json

# ── Analytics (all optional -- leave blank to disable) ────────────────────────
PUBLIC_GA4_ID=
PUBLIC_HEAP_APP_ID=
PUBLIC_AMPLITUDE_API_KEY=
```

### apps/admin/.env

```env
# ── Auth ───────────────────────────────────────────────────────────────────────
# Must match ADMIN_SECRET in apps/web/.env.
ADMIN_SECRET=your-strong-secret-here

# ── Runtime flags store ────────────────────────────────────────────────────────
# Must point to the same file as FLAGS_STORE_PATH in apps/web/.env.
# If these differ, writes from the admin dashboard will not affect apps/web.
# FLAGS_STORE_PATH=/var/data/flags-override.json

# ── ENV defaults mirror ────────────────────────────────────────────────────────
# Copy of the PUBLIC_FEATURE_* and PUBLIC_RENDER_MODE_* values from apps/web.
# The admin dashboard uses these to display the "ENV default" column.
# Keep in sync with apps/web/.env.
PUBLIC_FEATURE_EXCHANGE=true
PUBLIC_FEATURE_BLOG=true
PUBLIC_FEATURE_CONTENT=true
PUBLIC_FEATURE_WEATHER=true
PUBLIC_FEATURE_CARS=true
PUBLIC_FEATURE_MAPS=true
PUBLIC_FEATURE_ADMIN=true
PUBLIC_FEATURE_BANK=true
PUBLIC_FEATURE_DEVTOOLS=true
PUBLIC_FEATURE_REPORTS=true
PUBLIC_FEATURE_REMOTION=true

PUBLIC_RENDER_MODE_EXCHANGE=ssr
PUBLIC_RENDER_MODE_BLOG=ssr
PUBLIC_RENDER_MODE_CONTENT=ssr
PUBLIC_RENDER_MODE_WEATHER=ssr
PUBLIC_RENDER_MODE_CARS=ssr
PUBLIC_RENDER_MODE_MAPS=ssr
```

### Variable Precedence (hooks.server.ts)

```
flags-override.json (runtime, written by /admin dashboard)
  > PUBLIC_FEATURE_<MODULE> / PUBLIC_RENDER_MODE_<MODULE> (ENV)
    > hard-coded default: enabled=true, renderMode='ssr'
```
