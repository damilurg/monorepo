import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import type { ModuleId } from '@repo/shared/feature-flags';

type RuntimeFlagMap = Partial<Record<ModuleId, boolean>>;

// Stored next to the web app — survives hot-reload, reset on server restart if cleared
const flagsPath = resolve(process.cwd(), 'runtime-flags.json');

function load(): RuntimeFlagMap {
  try {
    if (!existsSync(flagsPath)) return {};
    return JSON.parse(readFileSync(flagsPath, 'utf-8')) as RuntimeFlagMap;
  } catch {
    return {};
  }
}

function persist(flags: RuntimeFlagMap): void {
  try {
    writeFileSync(flagsPath, JSON.stringify(flags, null, 2), 'utf-8');
  } catch {
    // Silently fail — runtime overrides are best-effort
  }
}

export function getRuntimeFlag(id: ModuleId): boolean | undefined {
  return load()[id];
}

export function setRuntimeFlag(id: ModuleId, value: boolean): void {
  const flags = load();
  flags[id] = value;
  persist(flags);
}

export function clearRuntimeFlag(id: ModuleId): void {
  const flags = load();
  delete flags[id];
  persist(flags);
}

export function getAllRuntimeFlags(): RuntimeFlagMap {
  return load();
}

export function clearAll(): void {
  persist({});
}
