/**
 * @repo/flags-store
 *
 * Shared file-based runtime feature flag store.
 * Both apps/web and apps/admin read/write the same JSON file.
 *
 * File location: FLAGS_STORE_PATH env var (default: <cwd>/flags-override.json)
 *
 * Priority in apps/web: runtime overrides (this store) > ENV defaults.
 * Changes take effect immediately on next request — no restart required.
 *
 * NOTE: Server-side only. Never import in browser code.
 */

import fs from 'node:fs';
import path from 'node:path';

export type ModuleId =
  | 'exchange'
  | 'blog'
  | 'content'
  | 'weather'
  | 'cars'
  | 'maps'
  | 'admin'
  | 'bank'
  | 'devtools'
  | 'reports'
  | 'remotion';

export type RenderMode = 'ssr' | 'spa';

export interface FlagOverride {
  enabled?: boolean;
  renderMode?: RenderMode;
}

export type FlagsOverrideMap = Partial<Record<ModuleId, FlagOverride>>;

function getStorePath(): string {
  return process.env['FLAGS_STORE_PATH'] ?? path.resolve(process.cwd(), 'flags-override.json');
}

// Read from disk every time — works across separate processes (web + admin)
export function readOverrides(): FlagsOverrideMap {
  try {
    const p = getStorePath();
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf-8');
      return JSON.parse(raw) as FlagsOverrideMap;
    }
  } catch { /* ignore */ }
  return {};
}

export function writeOverrides(overrides: FlagsOverrideMap): void {
  const p = getStorePath();
  fs.writeFileSync(p, JSON.stringify(overrides, null, 2), 'utf-8');
}

export function setModuleOverride(moduleId: ModuleId, patch: FlagOverride): void {
  const overrides = readOverrides();
  overrides[moduleId] = { ...(overrides[moduleId] ?? {}), ...patch };
  writeOverrides(overrides);
}

export function resetModuleOverride(moduleId: ModuleId): void {
  const overrides = readOverrides();
  delete overrides[moduleId];
  if (Object.keys(overrides).length === 0) {
    try { fs.unlinkSync(getStorePath()); } catch { /* ignore */ }
  } else {
    writeOverrides(overrides);
  }
}

export function resetAllOverrides(): void {
  try { fs.unlinkSync(getStorePath()); } catch { /* ignore */ }
}

export function getStorePath_public(): string {
  return getStorePath();
}
