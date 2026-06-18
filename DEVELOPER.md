# Developer Guide — Automotive Portal SvelteKit Monorepo

This document is the primary reference for developers working on the Automotive Portal. It covers environment setup, architecture decisions, adding new modules, code standards, testing, performance monitoring, and deployment.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Monorepo Architecture](#2-monorepo-architecture)
3. [Adding a New Module](#3-adding-a-new-module)
4. [Code Style — ESLint](#4-code-style--eslint)
5. [Testing — Vitest + Testing Library](#5-testing--vitest--testing-library)
6. [Web Vitals Monitoring](#6-web-vitals-monitoring)
7. [Code Review Checklist](#7-code-review-checklist)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Deployment](#9-deployment)

---

## 1. Getting Started

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | >= 22.0.0 | Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schnittstabile/fnm) |
| Yarn | 1.22.22 (Classic) | Managed via Corepack — do NOT install separately |
| Git | any recent | — |

> **Why Yarn Classic?** The project uses Yarn 1 workspaces, which is stable, predictable, and requires zero configuration beyond `workspaces` in the root `package.json`. See [Section 2](#2-monorepo-architecture) for the rationale.

### Step-by-step Setup

```bash
# 1. Clone the repository
git clone <repo-url> automotive-portal
cd automotive-portal

# 2. Enable Corepack (ships with Node 22 — no separate install needed)
corepack enable

# 3. Corepack will pick up the "packageManager" field in package.json
#    and activate yarn@1.22.22 automatically. Verify:
yarn --version
# => 1.22.22

# 4. Install all workspace dependencies in one shot
yarn install

# 5. Start the main web app in development mode
yarn dev
# => http://localhost:5173
```

### Starting Individual Apps

```bash
yarn dev          # apps/web      → http://localhost:5173  (main portal)
yarn dev:admin    # apps/admin    → http://localhost:5174  (admin panel)
yarn dev:exchange # apps/exchange → http://localhost:5175  (standalone exchange)
yarn dev:blog     # apps/blog     → http://localhost:5176  (standalone blog)
yarn dev:content  # apps/content  → http://localhost:5177  (standalone content)
yarn dev:weather  # apps/weather  → http://localhost:5178  (standalone weather)
yarn dev:cars     # apps/cars     → http://localhost:5179  (standalone cars)

# Start all apps simultaneously (requires concurrently — already in devDependencies)
yarn dev:all
```

### Port Reference

| App | Port | URL |
|-----|------|-----|
| `apps/web` | 5173 | http://localhost:5173 |
| `apps/admin` | 5174 | http://localhost:5174 |
| `apps/exchange` | 5175 | http://localhost:5175 |
| `apps/blog` | 5176 | http://localhost:5176 |
| `apps/content` | 5177 | http://localhost:5177 |
| `apps/weather` | 5178 | http://localhost:5178 |
| `apps/cars` | 5179 | http://localhost:5179 |

### Environment Setup

Each app has its own `.env` file. Copy the example and fill in values:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
```

**`apps/web/.env` — full reference:**

```env
# ── Feature Flags ──────────────────────────────────────────────────────────────
# Set to "false" to disable a module entirely:
#   - API routes return 403
#   - UI shows "Section unavailable" message
#   - Module is hidden from the landing page
PUBLIC_FEATURE_EXCHANGE=true
PUBLIC_FEATURE_BLOG=true
PUBLIC_FEATURE_CONTENT=true
PUBLIC_FEATURE_WEATHER=true
PUBLIC_FEATURE_CARS=true

# ── Render Modes ────────────────────────────────────────────────────────────────
# "ssr" (default): server fetches data, delivers pre-rendered HTML — fast FCP, SEO-friendly
# "spa"          : server returns empty shell, client fetches via /api proxy — good for auth'd pages
PUBLIC_RENDER_MODE_EXCHANGE=ssr
PUBLIC_RENDER_MODE_BLOG=ssr
PUBLIC_RENDER_MODE_CONTENT=ssr
PUBLIC_RENDER_MODE_WEATHER=ssr
PUBLIC_RENDER_MODE_CARS=ssr
```

**`apps/admin/.env`:**

```env
# Secret required for admin write operations (toggling flags, changing render modes)
ADMIN_SECRET=change-me-in-production

# Path to the shared flags-override file; both web and admin must point to the same path
FLAGS_STORE_PATH=/var/data/flags-override.json
```

> **Runtime flag overrides:** The admin panel writes to `flags-override.json` (via `@repo/flags-store`). The web app reads this file on every request, so flag changes from the admin panel take effect immediately — no restart needed. Both processes must share the same `FLAGS_STORE_PATH`.

---

## 2. Monorepo Architecture

### Workspace Layout

```
automotive-portal/
│
├── package.json                  ← root; defines workspaces + shared scripts
├── yarn.lock
│
├── apps/                         ← deployable SvelteKit applications
│   ├── web/                      ← @repo/web        — main portal (port 5173)
│   │   ├── src/
│   │   │   ├── app.html
│   │   │   ├── app.css
│   │   │   ├── app.d.ts          ← App.Locals type declaration
│   │   │   ├── hooks.server.ts   ← feature flag + render mode resolution
│   │   │   ├── routes/           ← SvelteKit file-based routing (thin shells)
│   │   │   │   ├── +layout.svelte
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── +page.server.ts
│   │   │   │   ├── exchange/
│   │   │   │   ├── blog/
│   │   │   │   │   └── [id]/
│   │   │   │   ├── content/
│   │   │   │   ├── weather/
│   │   │   │   │   └── city/[city]/
│   │   │   │   └── cars/
│   │   │   └── modules/          ← business logic lives here
│   │   │       ├── exchange/
│   │   │       ├── blog/
│   │   │       ├── content/
│   │   │       ├── weather/
│   │   │       └── cars/
│   │   ├── svelte.config.js      ← adapter-node + $modules alias
│   │   ├── vite.config.ts        ← tailwindcss, ssr.noExternal for @repo/shared
│   │   └── tsconfig.json
│   │
│   ├── admin/                    ← @repo/admin      — admin panel (port 5174)
│   │   └── src/
│   │       ├── hooks.server.ts   ← ADMIN_SECRET auth guard
│   │       └── routes/
│   │           ├── login/
│   │           ├── logout/
│   │           ├── dashboard/    ← module flag controls
│   │           └── api/          ← flag write endpoints
│   │
│   ├── exchange/                 ← @repo/exchange   — standalone (port 5175)
│   ├── blog/                     ← @repo/blog       — standalone (port 5176)
│   ├── content/                  ← @repo/content    — standalone (port 5177)
│   ├── weather/                  ← @repo/weather    — standalone (port 5178)
│   └── cars/                     ← @repo/cars       — standalone (port 5179)
│
└── packages/                     ← shared libraries (not deployed on their own)
    ├── shared/                   ← @repo/shared     — UI, API client, types, utils
    │   └── src/
    │       ├── api/              ← httpGet, httpPost, ApiError
    │       ├── feature-flags/    ← FeatureFlagConfig, RenderModeFlagConfig, env parsers
    │       ├── config/           ← ModuleConfig interface, APP_CONFIG
    │       ├── utils/            ← date, currency, helpers
    │       └── ui/               ← Button, Card, Input, Loader, EmptyState, ErrorState, PageHeader
    │
    ├── flags-store/              ← @repo/flags-store — file-based runtime flag store
    │   └── src/
    │       └── index.ts          ← readOverrides, writeOverrides, setModuleOverride
    │
    ├── tsconfig/                 ← @repo/tsconfig   — shared TypeScript configs
    │   ├── base.json             ← strict, noImplicitAny, ES2022
    │   └── svelte.json           ← extends base + bundler moduleResolution
    │
    └── eslint-config/            ← @repo/eslint-config — shared ESLint flat config
        └── index.js              ← TypeScript + Svelte rules
```

### Why Yarn 1 Classic Workspaces

Yarn Classic was chosen deliberately:

- **Zero ceremony.** One `workspaces` key in `package.json`, one `yarn install`, done.
- **Hoisting is predictable.** Dependencies shared across packages are hoisted to `node_modules/` at root, avoiding duplication without complex configuration.
- **`yarn workspace <name> <script>` works everywhere.** No need for a task runner or a separate workspace tool.
- **Corepack makes the version reproducible.** The `"packageManager": "yarn@1.22.22"` field in `package.json` ensures every developer and CI runner uses exactly the same version.

> **Do not upgrade to Yarn Berry (2/3/4) without team discussion.** PnP (Plug'n'Play) mode breaks several Svelte and Vite assumptions around file resolution, requiring significant adapter work.

### `apps/*` vs `packages/*`

| Directory | Rule |
|-----------|------|
| `apps/*` | Contains a SvelteKit application. Has its own `vite.config.ts`, `svelte.config.js`, can be deployed independently. |
| `packages/*` | Contains shared code with no runtime entry point of its own. Exported via `exports` map in `package.json`. Never deployed directly. |

### `@repo/shared` — What's Inside

The shared package is the **only allowed import target** for cross-module code. Its sub-path exports:

| Export path | Contents |
|-------------|---------|
| `@repo/shared` | Re-exports everything |
| `@repo/shared/api` | `httpGet`, `httpPost`, `ApiError`, `formatApiError` |
| `@repo/shared/feature-flags` | `FeatureFlagConfig`, `RenderModeFlagConfig`, `ModuleId`, `getFeatureFlagsFromEnv`, `getRenderModesFromEnv` |
| `@repo/shared/config` | `ModuleConfig` interface, `AppConfig`, `APP_CONFIG` |
| `@repo/shared/utils` | date helpers, currency formatters, general helpers |
| `@repo/shared/ui` | Svelte 5 components: `Button`, `Card`, `Input`, `Loader`, `EmptyState`, `ErrorState`, `PageHeader` |

**Important Vite/SSR note:** `@repo/shared` contains `.svelte` files. In `apps/web/vite.config.ts`, this package is listed in both `optimizeDeps.exclude` and `ssr.noExternal`. This forces Vite to compile it through the Svelte plugin on every request rather than trying to bundle or externalize it — which would cause `TypeError: css is not a function` at render time. Any new standalone app that depends on `@repo/shared` must replicate these two options.

### `@repo/flags-store` — Runtime Flag Overrides

The flags-store package provides file-based runtime override of feature flags without requiring an application restart.

**How it works:**

1. `apps/admin` writes to `flags-override.json` when a developer toggles a flag in the dashboard.
2. `apps/web/src/hooks.server.ts` calls `readOverrides()` on **every incoming request** and merges the result with the ENV-based defaults.
3. Because the file is read from disk each time, changes are visible to the web app immediately — even though both apps are separate Node processes.

**Priority chain (highest to lowest):**

```
runtime override (flags-override.json)
  > ENV variable (PUBLIC_FEATURE_*, PUBLIC_RENDER_MODE_*)
    > hard-coded default (all enabled, all ssr)
```

**API:**

```typescript
import {
  readOverrides,
  writeOverrides,
  setModuleOverride,
  resetModuleOverride,
  resetAllOverrides,
} from '@repo/flags-store';

// Read the current override map (safe to call at any time)
const overrides = readOverrides();

// Disable a single module at runtime
setModuleOverride('weather', { enabled: false });

// Switch a module to SPA mode
setModuleOverride('exchange', { renderMode: 'spa' });

// Remove override for one module (falls back to ENV)
resetModuleOverride('blog');

// Wipe all overrides
resetAllOverrides();
```

The `FLAGS_STORE_PATH` environment variable controls where the JSON file is written (default: `<cwd>/flags-override.json`). In production, both the web and admin processes must point to the same path.

### The "Route = Shell, Module = Product" Principle

This is the central architecture rule.

**A route is a thin shell.** Files in `src/routes/<module>/` do only three things:
1. Check `locals.featureEnabled` — return 403 if false.
2. Check `locals.renderMode` — either call the module's server loader or return a SPA skeleton.
3. Pass data to the Svelte component via the `load` return value.

**A module is a self-contained product.** Files in `src/modules/<module>/` contain all business logic:

```
src/modules/exchange/
  api/
    frankfurter.ts       ← raw external API calls — server-side only
  model/
    types.ts             ← TypeScript interfaces and type aliases
  server/
    load.ts              ← SSR data loader (called by +page.server.ts)
    handler.ts           ← API proxy handler (called by +server.ts)
  config/
    module.config.ts     ← ModuleConfig descriptor
  index.ts               ← public barrel export
```

**What this buys you:**

- A module can be moved to a standalone `apps/<module>/` app with zero changes to business logic.
- Routes stay small and easy to reason about.
- Module boundaries are enforced by the isolation rule below.

### Module Isolation Rule

```
FORBIDDEN:  import { something } from '$modules/blog'
            inside any file that belongs to a different module

ALLOWED:    import { ... } from '@repo/shared'
            import { ... } from '@repo/shared/api'
            import { ... } from '$modules/exchange/...'   ← within the same module only
```

Cross-module imports create hidden coupling that makes it impossible to extract a module into a standalone app. If two modules need to share something, it belongs in `@repo/shared`.

---

## 3. Adding a New Module

This section walks through adding a hypothetical `/insurance` module end-to-end.

### Step 1 — Create the Module Directory

```bash
mkdir -p apps/web/src/modules/insurance/{api,config,model,server}
```

Create each file:

**`apps/web/src/modules/insurance/api/insurance-api.ts`**

```typescript
import { httpGet } from '@repo/shared/api';
import type { InsuranceQuote } from '../model/types.js';

const BASE_URL = 'https://api.example-insurance.com/v1';

export async function fetchQuotes(vin: string): Promise<InsuranceQuote[]> {
  return httpGet<InsuranceQuote[]>(`${BASE_URL}/quotes?vin=${vin}`);
}
```

**`apps/web/src/modules/insurance/model/types.ts`**

```typescript
export interface InsuranceQuote {
  provider: string;
  annualPremium: number;
  currency: string;
  coverageType: 'liability' | 'comprehensive' | 'collision';
}
```

**`apps/web/src/modules/insurance/server/load.ts`**

```typescript
import { fetchQuotes } from '../api/insurance-api.js';
import type { InsuranceQuote } from '../model/types.js';

export interface InsuranceLoadResult {
  quotes: InsuranceQuote[];
  vin: string;
}

export async function loadInsuranceData(vin: string): Promise<InsuranceLoadResult> {
  const quotes = await fetchQuotes(vin);
  return { quotes, vin };
}
```

**`apps/web/src/modules/insurance/server/handler.ts`**

```typescript
import { fetchQuotes } from '../api/insurance-api.js';
import { ApiError } from '@repo/shared/api';
import type { RequestEvent } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';

export async function handleInsuranceRequest(event: RequestEvent) {
  const vin = event.url.searchParams.get('vin');
  if (!vin) {
    error(400, { message: 'vin query parameter is required' });
  }
  try {
    const quotes = await fetchQuotes(vin);
    return json(quotes);
  } catch (e) {
    if (e instanceof ApiError) {
      error(e.status, { message: e.message });
    }
    throw e;
  }
}
```

### Step 2 — Create `module.config.ts`

**`apps/web/src/modules/insurance/config/module.config.ts`**

```typescript
import type { ModuleConfig } from '@repo/shared/config';

export const insuranceModuleConfig: ModuleConfig = {
  id: 'insurance',
  route: '/insurance',
  title: 'Insurance',
  description: 'Get insurance quotes for your vehicle',
  featureFlag: 'insurance',
  apiBasePath: '/insurance',
  renderMode: 'ssr',
} as const;
```

The `ModuleConfig` interface (from `@repo/shared/config`) is:

```typescript
interface ModuleConfig {
  id: string;           // unique slug, matches the ModuleId union type
  route: string;        // SvelteKit route path
  title: string;        // display name
  description: string;  // short description shown on landing page
  featureFlag: string;  // matches the ENV var suffix (PUBLIC_FEATURE_<FEATUREFLAG>)
  apiBasePath: string;  // base path for the internal API proxy (+server.ts)
  renderMode: RenderMode; // default render mode ('ssr' | 'spa')
}
```

### Step 3 — Create the Public Barrel Export

**`apps/web/src/modules/insurance/index.ts`**

```typescript
export * from './config/module.config.js';
export * from './model/types.js';
export * from './server/load.js';
export * from './server/handler.js';
```

### Step 4 — Create the Route Files

**`apps/web/src/routes/insurance/+page.server.ts`**

```typescript
import type { PageServerLoad } from './$types';
import { loadInsuranceData } from '$modules/insurance/server/load.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Insurance module is disabled' });
  }

  const vin = url.searchParams.get('vin') ?? '';

  if (locals.renderMode === 'spa') {
    return { renderMode: 'spa' as const, quotes: null, vin };
  }

  if (!vin) {
    return { renderMode: 'ssr' as const, quotes: [], vin: '' };
  }

  const data = await loadInsuranceData(vin);
  return { renderMode: 'ssr' as const, ...data };
};
```

**`apps/web/src/routes/insurance/+server.ts`**

```typescript
import type { RequestHandler } from './$types';
import { handleInsuranceRequest } from '$modules/insurance/server/handler.js';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
  if (!event.locals.featureEnabled) {
    error(403, { message: 'Insurance module is disabled' });
  }
  return handleInsuranceRequest(event);
};
```

**`apps/web/src/routes/insurance/+page.svelte`**

```svelte
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let vin = $state(data.vin ?? '');
  let quotes = $state(data.quotes ?? []);
</script>

<!-- ... component markup ... -->
```

### Step 5 — Register the Feature Flag in `@repo/flags-store`

Open `packages/flags-store/src/index.ts` and add `'insurance'` to the `ModuleId` union:

```typescript
// Before
export type ModuleId = 'exchange' | 'blog' | 'content' | 'weather' | 'cars';

// After
export type ModuleId = 'exchange' | 'blog' | 'content' | 'weather' | 'cars' | 'insurance';
```

Also update `packages/shared/src/feature-flags/index.ts` to add the new module to the `ModuleId` type, `FeatureFlagConfig`, `RenderModeFlagConfig`, `getFeatureFlagsFromEnv`, and `getRenderModesFromEnv` — following the exact same pattern as the existing five modules.

### Step 6 — Add Environment Variables

**`apps/web/.env` and `apps/web/.env.example`:**

```env
PUBLIC_FEATURE_INSURANCE=true
PUBLIC_RENDER_MODE_INSURANCE=ssr
```

### Step 7 — Register on the Landing Page

Open `apps/web/src/routes/+page.server.ts` and add the new module to the `modules` array:

```typescript
{
  id: 'insurance',
  title: 'Insurance',
  description: 'Get insurance quotes for your vehicle',
  route: '/insurance',
  icon: '🛡️',
  enabled: flags.insurance,
},
```

### Step 8 — Register the Route in `hooks.server.ts`

Open `apps/web/src/hooks.server.ts` and add the route mapping:

```typescript
const MODULE_ROUTES: Record<string, ModuleId> = {
  '/exchange': 'exchange',
  '/blog': 'blog',
  '/content': 'content',
  '/weather': 'weather',
  '/cars': 'cars',
  '/insurance': 'insurance',   // ← add this
};
```

### Step 9 — (Optional) Create a Standalone App

If the module warrants its own deployment:

```bash
cp -r apps/web/src/modules/insurance apps/insurance/src/modules/
# Add a minimal SvelteKit scaffold with its own package.json (@repo/insurance)
# Set dev port to 5180 in vite.config.ts
# Add "dev:insurance" script to root package.json
```

The module code requires no changes — it depends only on `@repo/shared` which is already available in the monorepo.

---

## 4. Code Style — ESLint

### Current Config

The shared ESLint config lives at `packages/eslint-config/index.js`. It uses ESLint 9 flat config format:

```javascript
// packages/eslint-config/index.js
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        extraFileExtensions: ['.svelte'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      svelte: sveltePlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ['.svelte-kit/', 'build/', 'node_modules/', 'dist/'],
  },
];
```

### Extending with Airbnb Rules (Recommended)

To adopt the full Airbnb TypeScript style guide, install the additional dependency:

```bash
yarn workspace @repo/eslint-config add eslint-config-airbnb-typescript
yarn workspace @repo/eslint-config add -D eslint-plugin-import eslint-plugin-jsx-a11y
```

Then extend `packages/eslint-config/index.js`:

```javascript
// packages/eslint-config/index.js — Airbnb extended variant
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import airbnbBase from 'eslint-config-airbnb-base';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // ── TypeScript files ────────────────────────────────────────────────────────
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,                     // enable type-aware linting
        extraFileExtensions: ['.svelte'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      // Airbnb base (adapted for flat config)
      ...airbnbBase.rules,

      // TypeScript recommended on top
      ...tsPlugin.configs['recommended-type-checked'].rules,

      // Disallow `any` entirely — use `unknown` and narrow instead
      '@typescript-eslint/no-explicit-any': 'error',

      // Allow omitting return types on short arrow functions
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Prefer TypeScript imports — let the compiler handle extensions
      'import/extensions': ['error', 'ignorePackages', { ts: 'never', svelte: 'always' }],

      // Airbnb disables this; re-enable for monorepo workspace packages
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: ['**/*.test.ts', '**/*.spec.ts', '**/vitest.config.ts'],
      }],

      // Allow underscore-prefixed unused vars (common in SvelteKit load functions)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Enforce consistent type imports
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },

  // ── Svelte files ────────────────────────────────────────────────────────────
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      svelte: sveltePlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
      // Svelte 5 uses $props(), $state(), etc. — disable rules that flag them as unused
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '\\$props|\\$state|\\$derived|\\$effect',
        argsIgnorePattern: '^_',
      }],
    },
  },

  // ── Global ignores ─────────────────────────────────────────────────────────
  {
    ignores: ['.svelte-kit/', 'build/', 'node_modules/', 'dist/'],
  },
];
```

### Key Rules Enforced

| Rule | Setting | Why |
|------|---------|-----|
| `@typescript-eslint/no-explicit-any` | `error` | Forces proper typing; `unknown` + type guards instead |
| `@typescript-eslint/consistent-type-imports` | `error` | Keeps type imports distinct from value imports |
| `@typescript-eslint/no-unused-vars` | `error` | Catches dead code early |
| `import/no-extraneous-dependencies` | `error` | Prevents accidental production deps in dev |
| `svelte/no-unused-svelte-ignore` | `error` | Keeps suppression comments clean |
| `svelte/valid-compile` | `error` | Catches Svelte compile errors at lint time |

### Running the Linter

```bash
# Lint all workspaces
yarn lint

# Lint a specific workspace
yarn workspace @repo/web lint

# Auto-fix fixable issues
yarn lint --fix

# Lint only staged files (runs automatically via pre-commit hook — see below)
yarn lint-staged
```

### Pre-commit Hook with Husky + lint-staged

Install the tools:

```bash
yarn add -DW husky lint-staged
npx husky init
```

Configure in root `package.json`:

```json
{
  "lint-staged": {
    "**/*.{ts,svelte}": ["eslint --fix", "git add"],
    "**/*.{json,md}": ["prettier --write", "git add"]
  }
}
```

Edit `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

This ensures no commit can go in with linting errors.

### VSCode Settings

Create `.vscode/settings.json` at the repo root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["javascript", "typescript", "svelte"],
  "svelte.enable-ts-plugin": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

Recommended extensions (`.vscode/extensions.json`):

```json
{
  "recommendations": [
    "svelte.svelte-vscode",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

---

## 5. Testing — Vitest + Testing Library

### Setup

Install testing dependencies for the app or package you want to test:

```bash
# For apps/web
yarn workspace @repo/web add -D vitest @testing-library/svelte @testing-library/jest-dom jsdom

# For packages/shared
yarn workspace @repo/shared add -D vitest @testing-library/svelte @testing-library/jest-dom jsdom
```

### Configuration

**`vitest.config.ts`** (create at the root of each app or package that has tests):

```typescript
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';    // only needed in apps/*

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
      exclude: [
        '**/*.d.ts',
        '**/.svelte-kit/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.ts',
        '**/index.ts',
        '**/config/module.config.ts',
        '+layout.svelte',
        'app.html',
        'app.d.ts',
      ],
    },
  },
});
```

**`vitest.setup.ts`:**

```typescript
import '@testing-library/jest-dom';
```

### Test File Structure

Co-locate test files with the code they test:

```
src/
  modules/
    weather/
      server/
        load.ts
        load.test.ts          ← unit test for the load function
      api/
        open-meteo.ts
        open-meteo.test.ts    ← unit test for the API client
      model/
        types.ts              ← no test needed (types only)
      config/
        module.config.ts      ← no test needed (constant)
  routes/
    weather/
      +page.svelte
      +page.test.ts           ← component test
      +page.server.ts
      +page.server.test.ts    ← server load function test
      city/
        [city]/
          +page.server.ts
          +page.server.test.ts

packages/
  shared/
    src/
      api/
        http-client.ts
        http-client.test.ts
      ui/
        Button.svelte
        Button.test.ts
      feature-flags/
        index.ts
        index.test.ts
```

### Writing Tests

#### 1. Unit Test — API Function (mock `fetch`)

```typescript
// apps/web/src/modules/weather/api/open-meteo.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWeather, geocodeCity } from './open-meteo.js';

describe('fetchWeather', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns structured weather data for valid coordinates', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 22,
          apparent_temperature: 20,
          relative_humidity_2m: 60,
          wind_speed_10m: 15,
          weather_code: 0,
          is_day: 1,
        },
        hourly: { temperature_2m: [], weather_code: [], precipitation_probability: [] },
        daily: {
          temperature_2m_max: [],
          temperature_2m_min: [],
          weather_code: [],
          precipitation_probability_max: [],
        },
      }),
    });

    const result = await fetchWeather(48.85, 2.35);

    expect(result.current.temperature_2m).toBe(22);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('latitude=48.85'),
      expect.any(Object)
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('longitude=2.35'),
      expect.any(Object)
    );
  });

  it('throws ApiError on HTTP error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetchWeather(0, 0)).rejects.toThrow('HTTP 500');
  });
});

describe('geocodeCity', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns geocoded location for a valid city name', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([
        {
          lat: '48.8566',
          lon: '2.3522',
          display_name: 'Paris, France',
          address: { city: 'Paris', country: 'France', country_code: 'fr' },
        },
      ]),
    });

    const result = await geocodeCity('Paris');

    expect(result.name).toBe('Paris');
    expect(result.latitude).toBeCloseTo(48.8566);
    expect(result.country_code).toBe('FR');
  });

  it('throws when city is not found', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await expect(geocodeCity('ZZZUnknownCity')).rejects.toThrow('City not found');
  });
});
```

#### 2. Component Test — Svelte 5 Component

```typescript
// packages/shared/src/ui/Button.test.ts
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button.svelte';

describe('Button', () => {
  it('renders children text', () => {
    render(Button, { props: { children: () => 'Click me' } });
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onclick handler when clicked', async () => {
    const handler = vi.fn();
    render(Button, { props: { onclick: handler, children: () => 'Click' } });

    await fireEvent.click(screen.getByRole('button'));

    expect(handler).toHaveBeenCalledOnce();
  });

  it('is disabled and shows spinner when loading', () => {
    render(Button, { props: { loading: true, children: () => 'Loading...' } });

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('applies variant class when passed', () => {
    render(Button, { props: { variant: 'danger', children: () => 'Delete' } });
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });
});
```

#### 3. Server-side Load Function Test

```typescript
// apps/web/src/routes/weather/city/[city]/+page.server.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from './+page.server.js';

vi.mock('$modules/weather/server/load.js', () => ({
  loadWeatherForCity: vi.fn().mockResolvedValue({
    city: 'Paris',
    country: 'France',
    current: { temperature_2m: 20, weather_code: 0 },
    hourly: [],
    daily: [],
  }),
}));

describe('+page.server load — /weather/city/[city]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns full SSR data when renderMode is "ssr" and feature is enabled', async () => {
    const result = await load({
      params: { city: 'paris' },
      locals: { featureEnabled: true, renderMode: 'ssr', app: 'weather' },
    } as Parameters<typeof load>[0]);

    expect(result.renderMode).toBe('ssr');
    expect(result.city).toBe('Paris');
    expect(result.current).toBeDefined();
  });

  it('returns SPA shell without calling the loader when renderMode is "spa"', async () => {
    const { loadWeatherForCity } = await import('$modules/weather/server/load.js');

    const result = await load({
      params: { city: 'paris' },
      locals: { featureEnabled: true, renderMode: 'spa', app: 'weather' },
    } as Parameters<typeof load>[0]);

    expect(result.renderMode).toBe('spa');
    expect(loadWeatherForCity).not.toHaveBeenCalled();
  });

  it('throws 403 when the feature is disabled', async () => {
    await expect(
      load({
        params: { city: 'paris' },
        locals: { featureEnabled: false, renderMode: 'ssr', app: 'weather' },
      } as Parameters<typeof load>[0])
    ).rejects.toMatchObject({ status: 403 });
  });
});
```

#### 4. Unit Test — `@repo/shared/feature-flags`

```typescript
// packages/shared/src/feature-flags/index.test.ts
import { describe, it, expect } from 'vitest';
import { getFeatureFlagsFromEnv, getRenderModesFromEnv, isFeatureEnabled } from './index.js';

describe('getFeatureFlagsFromEnv', () => {
  it('defaults all flags to true when env vars are absent', () => {
    const flags = getFeatureFlagsFromEnv({});
    expect(flags.exchange).toBe(true);
    expect(flags.weather).toBe(true);
    expect(flags.cars).toBe(true);
  });

  it('disables a flag when ENV is explicitly "false"', () => {
    const flags = getFeatureFlagsFromEnv({ PUBLIC_FEATURE_EXCHANGE: 'false' });
    expect(flags.exchange).toBe(false);
    expect(flags.weather).toBe(true);
  });
});

describe('getRenderModesFromEnv', () => {
  it('defaults all modes to "ssr"', () => {
    const modes = getRenderModesFromEnv({});
    expect(modes.exchange).toBe('ssr');
  });

  it('returns "spa" when ENV is explicitly "spa"', () => {
    const modes = getRenderModesFromEnv({ PUBLIC_RENDER_MODE_BLOG: 'spa' });
    expect(modes.blog).toBe('spa');
    expect(modes.exchange).toBe('ssr');
  });
});

describe('isFeatureEnabled', () => {
  it('returns the flag value for the given module', () => {
    const flags = { exchange: true, blog: false, content: true, weather: true, cars: true };
    expect(isFeatureEnabled(flags, 'exchange')).toBe(true);
    expect(isFeatureEnabled(flags, 'blog')).toBe(false);
  });
});
```

### Coverage Configuration

Coverage thresholds are set to 100% for all covered files. This forces developers to address all branches — enabled/disabled flags, SSR/SPA paths, success and error cases — before a PR merges.

```typescript
// vitest.config.ts — coverage section
coverage: {
  provider: 'v8',
  reporter: ['text', 'lcov', 'html'],
  thresholds: {
    lines: 100,
    branches: 100,
    functions: 100,
    statements: 100,
  },
  exclude: [
    '**/*.d.ts',
    '**/.svelte-kit/**',
    '**/node_modules/**',
    '**/dist/**',
    '**/*.config.ts',
    '**/index.ts',           // barrel exports covered by their consumer tests
    '**/config/module.config.ts',  // pure constants — no logic
    '+layout.svelte',
    'app.html',
    'app.d.ts',
  ],
},
```

### TDD Workflow

This project practices test-driven development. The cycle for every new function or component:

```
1. Write a failing test that describes the desired behaviour
   (yarn test:watch keeps a fast feedback loop)

2. Write the minimum code needed to make the test pass

3. Refactor for clarity, without breaking the tests

4. Repeat for the next behaviour
```

Common patterns:
- Mock external API calls with `vi.fn()` — never make real network requests in tests.
- Use `vi.mock(...)` at the module level for server loaders.
- Test error paths explicitly — `ApiError`, 403 from feature flags, missing parameters.
- Test SSR and SPA render modes as separate cases in every `+page.server.ts` test.

### Test Commands

Add these scripts to each app's `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

And to the root `package.json`:

```json
{
  "scripts": {
    "test": "yarn workspaces run test",
    "test:coverage": "yarn workspaces run test:coverage"
  }
}
```

```bash
yarn test             # run all tests once across all workspaces
yarn test:watch       # TDD mode — re-runs on file change
yarn test:coverage    # generate coverage report (opens ./coverage/index.html)
```

---

## 6. Web Vitals Monitoring

### Core Metrics and Targets

| Metric | Target | What it measures |
|--------|--------|-----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | When the largest visible element loads |
| **INP** (Interaction to Next Paint) | < 200ms | Response time to user interactions |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability — elements moving unexpectedly |
| **TTFB** (Time to First Byte) | < 800ms | Server response time |
| **FCP** (First Contentful Paint) | < 1.8s | When the first content pixel appears |

> LCP and CLS are Core Web Vitals that directly affect Google search ranking. INP replaced FID in March 2024 as the interactivity metric.

### In-app Measurement

Add to `apps/web/src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {
    // web-vitals is tree-shakeable — import only in the browser
    const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals');

    const report = (metric: { name: string; value: number; rating: string }) => {
      if (import.meta.env.DEV) {
        console.log(`[vitals] ${metric.name}: ${metric.value.toFixed(1)} (${metric.rating})`);
      }

      if (import.meta.env.PROD) {
        navigator.sendBeacon('/api/vitals', JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          path: window.location.pathname,
          timestamp: Date.now(),
        }));
      }
    };

    onCLS(report);
    onINP(report);
    onLCP(report);
    onFCP(report);
    onTTFB(report);
  });
</script>
```

Install the package:

```bash
yarn workspace @repo/web add web-vitals
```

### Lighthouse CI

Create `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'

      - run: corepack enable && corepack prepare yarn@1.22.22 --activate

      - run: yarn install --frozen-lockfile

      - run: yarn build:web

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v12
        with:
          urls: |
            http://localhost:5173
            http://localhost:5173/exchange
            http://localhost:5173/weather
          uploadArtifacts: true
          temporaryPublicStorage: true
          configPath: .lighthouserc.json
```

Create `.lighthouserc.json`:

```json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

### Bundle Analysis

```bash
# Build and visualize the bundle
yarn workspace @repo/web build
npx vite-bundle-visualizer
```

Watch for:
- Any single chunk > 100 kB (uncompressed) — candidate for code splitting.
- Third-party libraries accidentally bundled multiple times.
- `@repo/shared` UI components pulled into SSR entry — expected and fine, since they are pre-rendered.

### SSR Performance Tips

**Keep `+page.server.ts` lean:**

```typescript
// Good: one focused fetch
export const load: PageServerLoad = async ({ locals }) => {
  return loadExchangeData('USD');
};

// Bad: waterfall fetches
export const load: PageServerLoad = async ({ locals }) => {
  const rates = await loadRates();
  const history = await loadHistory(rates.base);  // blocked by rates
  return { rates, history };
};

// Better: parallel when data is independent
export const load: PageServerLoad = async () => {
  const [rates, popularPairs] = await Promise.all([loadRates(), loadPopularPairs()]);
  return { rates, popularPairs };
};
```

**Use `depends()` for cache invalidation:**

```typescript
export const load: PageServerLoad = async ({ depends }) => {
  depends('app:exchange-rates');
  return loadExchangeData('USD');
};
```

**Prevent layout shift:**
- Always set `width` and `height` on `<img>` elements.
- Use `font-display: swap` in Tailwind CSS font configuration.
- Reserve space for async content using `<Loader />` from `@repo/shared/ui`.
- Avoid inserting content above the fold after initial paint.

---

## 7. Code Review Checklist

### Before Opening a PR (Author)

- [ ] `yarn lint` passes with zero warnings and zero errors
- [ ] `yarn check` passes (TypeScript strict mode across all workspaces)
- [ ] `yarn test:coverage` reports 100% on all files changed in this PR
- [ ] No `any` types introduced — use `unknown` and narrow with type guards
- [ ] No cross-module imports — only `@repo/shared` and its sub-paths are allowed between modules
- [ ] New module has `module.config.ts` (with all `ModuleConfig` fields filled) and `index.ts` (barrel export)
- [ ] Feature flag added: `PUBLIC_FEATURE_<MODULE>=true` in `.env.example`
- [ ] Render mode flag added: `PUBLIC_RENDER_MODE_<MODULE>=ssr` in `.env.example`
- [ ] New module registered in `hooks.server.ts` `MODULE_ROUTES` map
- [ ] New module added to `ModuleId` union in both `@repo/flags-store` and `@repo/shared/feature-flags`
- [ ] Mobile-first layout: test at 375px viewport before marking complete
- [ ] Error states handled: `ApiError`, feature disabled (403), missing parameters
- [ ] Both SSR and SPA render modes tested (if applicable)

### Reviewer Checklist

**Architecture:**
- Does the module's `index.ts` export only the public surface — no implementation details leaked?
- Is all server-side data access confined to `+page.server.ts` and `+server.ts`? No `fetch()` calls in `+page.svelte`.
- Are API types fully defined in `model/types.ts`? No `Record<string, unknown>` or inline object types on response shapes.
- Could this module be extracted to a standalone `apps/<module>/` app without modifying any business logic?

**TypeScript:**
- Are all function parameters and return types explicit (or safely inferable without `any`)?
- Are SvelteKit-generated types (`PageData`, `PageServerLoad`, `RequestHandler`) used instead of manual type assertions?

**Testing:**
- Does the test file cover all branches: enabled/disabled, SSR/SPA, success/error?
- Are mock implementations minimal — testing behaviour, not implementation details?

**Performance:**
- Does `+page.server.ts` avoid waterfall fetches? Use `Promise.all` for parallel requests.
- Are images sized? Any font loading that could cause CLS?

---

## 8. CI/CD Pipeline

### GitHub Actions — Main CI

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Lint · Type-check · Test · Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'yarn'

      - name: Enable Corepack and activate Yarn
        run: corepack enable && corepack prepare yarn@1.22.22 --activate

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Lint
        run: yarn lint

      - name: Type-check
        run: yarn check

      - name: Test with coverage
        run: yarn test:coverage

      - name: Upload coverage report
        uses: codecov/codecov-action@v4
        with:
          files: ./apps/web/coverage/lcov.info,./packages/shared/coverage/lcov.info
          fail_ci_if_error: true

      - name: Build
        run: yarn build
```

### Caching Strategy

```yaml
      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: |
            node_modules
            apps/*/node_modules
            packages/*/node_modules
          key: ${{ runner.os }}-yarn-${{ hashFiles('yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-
```

### Branch Protection Rules (recommended)

Configure on GitHub → Settings → Branches → `main`:

- Require status checks to pass: `ci / Lint · Type-check · Test · Build`
- Require branches to be up to date before merging
- Require at least 1 approving review
- Dismiss stale pull request approvals when new commits are pushed

---

## 9. Deployment

### Option A — Single VPS (All Apps)

Best for: full control, predictable cost, production workloads.
Cost: approximately $12/month for a 2 GB RAM VPS (DigitalOcean, Hetzner, etc.).

**Build all apps:**

```bash
yarn build   # builds apps/web + apps/admin
yarn workspace @repo/exchange build
yarn workspace @repo/blog build
yarn workspace @repo/content build
yarn workspace @repo/weather build
yarn workspace @repo/cars build
```

**PM2 ecosystem config (`ecosystem.config.cjs` at repo root):**

```javascript
module.exports = {
  apps: [
    {
      name: 'web',
      script: 'node',
      args: 'build/index.js',
      cwd: './apps/web',
      env: {
        NODE_ENV: 'production',
        PORT: 5173,
        FLAGS_STORE_PATH: '/var/data/flags-override.json',
        PUBLIC_FEATURE_EXCHANGE: 'true',
        PUBLIC_FEATURE_BLOG: 'true',
        PUBLIC_FEATURE_CONTENT: 'true',
        PUBLIC_FEATURE_WEATHER: 'true',
        PUBLIC_FEATURE_CARS: 'true',
        PUBLIC_RENDER_MODE_EXCHANGE: 'ssr',
        PUBLIC_RENDER_MODE_BLOG: 'ssr',
        PUBLIC_RENDER_MODE_CONTENT: 'ssr',
        PUBLIC_RENDER_MODE_WEATHER: 'ssr',
        PUBLIC_RENDER_MODE_CARS: 'ssr',
      },
    },
    {
      name: 'admin',
      script: 'node',
      args: 'build/index.js',
      cwd: './apps/admin',
      env: {
        NODE_ENV: 'production',
        PORT: 5174,
        ADMIN_SECRET: 'REPLACE_WITH_STRONG_SECRET',
        FLAGS_STORE_PATH: '/var/data/flags-override.json',
      },
    },
    {
      name: 'exchange',
      script: 'node',
      args: 'build/index.js',
      cwd: './apps/exchange',
      env: { NODE_ENV: 'production', PORT: 5175 },
    },
    {
      name: 'blog',
      script: 'node',
      args: 'build/index.js',
      cwd: './apps/blog',
      env: { NODE_ENV: 'production', PORT: 5176 },
    },
    {
      name: 'content',
      script: 'node',
      args: 'build/index.js',
      cwd: './apps/content',
      env: { NODE_ENV: 'production', PORT: 5177 },
    },
    {
      name: 'weather',
      script: 'node',
      args: 'build/index.js',
      cwd: './apps/weather',
      env: { NODE_ENV: 'production', PORT: 5178 },
    },
    {
      name: 'cars',
      script: 'node',
      args: 'build/index.js',
      cwd: './apps/cars',
      env: { NODE_ENV: 'production', PORT: 5179 },
    },
  ],
};
```

Start all processes:

```bash
pm2 start ecosystem.config.cjs
pm2 save       # persist across reboots
pm2 startup    # generate systemd unit
```

**Nginx reverse proxy config (`/etc/nginx/sites-available/automotive-portal`):**

```nginx
upstream web      { server 127.0.0.1:5173; }
upstream admin    { server 127.0.0.1:5174; }
upstream exchange { server 127.0.0.1:5175; }
upstream blog_app { server 127.0.0.1:5176; }
upstream content  { server 127.0.0.1:5177; }
upstream weather  { server 127.0.0.1:5178; }
upstream cars     { server 127.0.0.1:5179; }

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    gzip on;
    gzip_types text/plain application/javascript text/css application/json;
    gzip_min_length 1000;

    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy strict-origin-when-cross-origin;

    # Main portal — all module routes go through apps/web
    location / {
        proxy_pass http://web;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin panel — restrict by IP or add basic auth in production
    location /admin {
        # allow 10.0.0.0/8;
        # deny all;
        proxy_pass http://admin;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Uncomment to serve standalone apps at sub-paths instead of via apps/web:
    # location /exchange { proxy_pass http://exchange; }
    # location /weather  { proxy_pass http://weather; }
    # location /blog     { proxy_pass http://blog_app; }
    # location /content  { proxy_pass http://content; }
    # location /cars     { proxy_pass http://cars; }
}
```

Enable and reload:

```bash
ln -s /etc/nginx/sites-available/automotive-portal /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Option B — Vercel (Serverless per App)

Best for: low traffic, zero ops, free tier.
Cost: $0 on Hobby plan for low-traffic deployments.

Each `apps/*` app is deployed as a separate Vercel project using `@sveltejs/adapter-vercel`:

```bash
yarn workspace @repo/web add -D @sveltejs/adapter-vercel
```

Update `apps/web/svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-vercel';
```

Connect each app to its own Vercel project and set environment variables in the Vercel dashboard.

> **Note:** `@repo/flags-store` uses the local filesystem, which does not persist across Vercel serverless function invocations. On Vercel, replace the file-based store with Vercel KV or Redis.

### Option C — Railway / Render

Best for: simple containerized deployment with persistent filesystem, ~$5–7/month per service.

Both Railway and Render support monorepo deployments. Set the root directory per service:

| Service | Root Directory | Build Command | Start Command |
|---------|---------------|---------------|---------------|
| web | `apps/web` | `yarn build` | `node build/index.js` |
| admin | `apps/admin` | `yarn build` | `node build/index.js` |

Mount a shared volume at `FLAGS_STORE_PATH` so the web and admin processes share the same `flags-override.json` file.

### Environment Variable Management

| Context | Method |
|---------|--------|
| Development | `.env` files (gitignored) |
| CI | GitHub Actions secrets |
| Production VPS | PM2 `env` block or `/etc/environment` |
| Vercel / Railway | Platform environment variable UI |

Never commit `.env` files containing real secrets. The `.env.example` files in each app directory serve as the canonical reference for all required variables.

---

## Quick Reference

```bash
# Development
yarn dev                    # start apps/web on :5173
yarn dev:all                # start all 7 apps concurrently

# Code quality
yarn lint                   # ESLint all workspaces
yarn check                  # TypeScript type-check all workspaces

# Testing
yarn test                   # run all tests once
yarn test:watch             # TDD watch mode
yarn test:coverage          # coverage report (HTML in ./coverage/)

# Build
yarn build                  # build apps/web + apps/admin

# Target a specific workspace
yarn workspace @repo/web <script>
yarn workspace @repo/shared <script>
yarn workspace @repo/flags-store check
```

---

## 10. Regex Guidelines

### When to use regex

✅ **Allowed:**
- Validating short strings: phone format, postal code, slug
- Template replacement: `str.replace(/pattern/, replacement)`
- Whitespace normalization: `text.replace(/\s+/gu, ' ')`
- PII masking in logs: phones, emails, card numbers
- Token extraction: first number, semver from `v1.2.3`
- Split by delimiter: `text.split(/[,;]\s*/u)`
- Log keyword search: `if (/\berror\b/iu.test(log))`

❌ **Banned (use a proper parser):**
| Task | Instead use |
|------|-------------|
| Parse HTML | `DOMParser`, `cheerio` |
| Parse XML | `DOMParser`, `xml2js` |
| Parse JSON | `JSON.parse()` |
| Parse URLs | `new URL(str)` |
| Parse dates | `Intl.DateTimeFormat`, `date-fns` |
| Parse SQL | AST parser |

**Rule of thumb:** If the data has nesting or balance (brackets, tags, quotes) — use a parser.

### i18n-safe regex in this project

This project uses the **`/u` flag** and **Unicode property escapes** for all user-facing regex.

```typescript
// ❌ BAD — \w misses Cyrillic, umlauts, CJK
/^\w+$/.test('Иванов')   // false
/^\w+$/.test('Müller')   // false

// ✅ GOOD — \p{L} matches all Unicode letters
/^\p{L}+$/u.test('Иванов')  // true
/^\p{L}+$/u.test('Müller')  // true
/^\p{L}+$/u.test('王伟')     // true
```

```typescript
// ❌ BAD — \d matches Arabic-Indic digits in some engines
/^\d+$/.test('١٢٣')  // might be true

// ✅ GOOD — explicit ASCII digits
/^[0-9]+$/u.test('١٢٣')  // false — as expected
```

### ESLint enforcement

The custom `@repo/eslint-plugin` enforces these rules:

| Rule | Severity | Description |
|------|----------|-------------|
| `repo/require-unicode-flag` | warn | Add `/u` when using `\w`, `\d`, `\s` |
| `repo/no-regex-for-structured-data` | error | No parsing HTML/JSON/URL/dates with regex |
| `repo/prefer-unicode-property-escapes` | warn | Suggest `\p{L}` over `\w` in `/u` patterns |
| `repo/no-backtracking-regex` | error | Block `(a+)+` ReDoS patterns |

### ReDoS prevention

Avoid **nested quantifiers** — they cause exponential backtracking:

```typescript
// ❌ CATASTROPHIC — (a+)+ on "aaaaaaaab" hangs the server
/^(a+)+$/.test('aaaaaaaab')

// ✅ SAFE — rewrite using atomic alternatives
/^a+$/.test('aaaaaaaab')
```

Always set a length limit on input before running regex on user data:
```typescript
if (input.length > 1000) throw new Error('Input too long');
const match = /pattern/u.exec(input);
```

### Svelte-specific notes

In `.svelte` files, regex in `<script>` blocks follow the same rules. The ESLint config validates `.svelte` files automatically. Template expressions are NOT regex contexts.
