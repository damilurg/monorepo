# Migrating from Yarn 1 → Yarn 4

## What changed

| File | Change |
|---|---|
| `package.json` | `packageManager: yarn@4.9.2`, `engines.yarn: >=4.0.0` |
| `.yarnrc.yml` | `nodeLinker: node-modules` (keeps traditional `node_modules/`) |
| All `package.json` | `@repo/*` deps updated from `"*"` → `"workspace:*"` |
| `.gitignore` | Added Yarn 4 cache/state paths |

## Why `nodeLinker: node-modules`

Yarn 4's default PnP (Plug'n'Play) mode is incompatible with several tools in this stack:
- **Vite** — cannot resolve some ESM packages under PnP
- **Remotion** — uses native paths for ffmpeg / renderer
- **SvelteKit** — adapter-node expects `node_modules/` for SSR

`nodeLinker: node-modules` gives us Yarn 4's improved CLI and workspace tooling without PnP friction.

## Migration steps (run once)

```bash
# 1. Install Yarn 4 via Corepack (ships with Node 20+)
corepack enable
corepack prepare yarn@4.9.2 --activate

# 2. Delete old lockfile and node_modules
rm yarn.lock
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# 3. Install with Yarn 4
yarn install

# 4. Verify
yarn dev
```

## What stays the same

All scripts work identically:
```bash
yarn dev          # Start apps/web (single domain, all routes)
yarn build        # Build apps/web
yarn lint         # Lint all workspaces
yarn check        # TypeScript check all workspaces
yarn workspace @repo/web dev   # Same workspace commands
```

## New Yarn 4 commands worth knowing

```bash
# Parallel build respecting workspace dependency order
yarn workspaces foreach --all -pt run build

# Deduplicate lockfile
yarn dedupe

# Check workspace constraints
yarn constraints

# Add a dep to a specific workspace
yarn workspace @repo/web add some-package
```

## Rollback to Yarn 1

If you need to revert:
1. Set `packageManager: yarn@1.22.22` in root `package.json`
2. Delete `.yarnrc.yml`
3. Change `"workspace:*"` back to `"*"` in all package.json files (or just delete and re-run `yarn install` — Yarn 1 resolves `*` against workspace packages automatically)
4. Delete `yarn.lock` and re-run `yarn install`
