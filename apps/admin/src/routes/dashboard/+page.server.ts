import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
  readOverrides,
  getStorePath_public,
  type ModuleId,
  type RenderMode,
} from '@repo/flags-store';
import { getFeatureFlagsFromEnv, getRenderModesFromEnv } from '@repo/shared/feature-flags';

const MODULE_IDS: ModuleId[] = [
  'exchange',
  'blog',
  'content',
  'weather',
  'cars',
  'maps',
  'admin',
  'bank',
  'devtools',
  'reports',
  'remotion',
];

const MODULE_META: Record<ModuleId, { title: string; icon: string; standalone?: boolean }> = {
  exchange: { title: 'Обменник',   icon: '💱' },
  blog:     { title: 'Блог',       icon: '📝' },
  content:  { title: 'Контент',    icon: '💡' },
  weather:  { title: 'Погода',     icon: '🌤' },
  cars:     { title: 'Авто',       icon: '🚗' },
  maps:     { title: 'Карты',      icon: '🗺️' },
  admin:    { title: 'Admin Panel', icon: '⚙️',  standalone: true },
  bank:     { title: 'Bank',        icon: '🏦',  standalone: true },
  devtools: { title: 'DevTools',    icon: '🔧',  standalone: true },
  reports:  { title: 'Reports',     icon: '📊',  standalone: true },
  remotion: { title: 'Remotion',    icon: '🎬',  standalone: true },
};

// Minimal ENV simulation — admin reads same keys as web
const envLike: Record<string, string | undefined> = {
  PUBLIC_FEATURE_EXCHANGE:  process.env['PUBLIC_FEATURE_EXCHANGE'],
  PUBLIC_FEATURE_BLOG:      process.env['PUBLIC_FEATURE_BLOG'],
  PUBLIC_FEATURE_CONTENT:   process.env['PUBLIC_FEATURE_CONTENT'],
  PUBLIC_FEATURE_WEATHER:   process.env['PUBLIC_FEATURE_WEATHER'],
  PUBLIC_FEATURE_CARS:      process.env['PUBLIC_FEATURE_CARS'],
  PUBLIC_FEATURE_MAPS:      process.env['PUBLIC_FEATURE_MAPS'],
  PUBLIC_FEATURE_ADMIN:     process.env['PUBLIC_FEATURE_ADMIN'],
  PUBLIC_FEATURE_BANK:      process.env['PUBLIC_FEATURE_BANK'],
  PUBLIC_FEATURE_DEVTOOLS:  process.env['PUBLIC_FEATURE_DEVTOOLS'],
  PUBLIC_FEATURE_REPORTS:   process.env['PUBLIC_FEATURE_REPORTS'],
  PUBLIC_FEATURE_REMOTION:  process.env['PUBLIC_FEATURE_REMOTION'],
  PUBLIC_RENDER_MODE_EXCHANGE: process.env['PUBLIC_RENDER_MODE_EXCHANGE'],
  PUBLIC_RENDER_MODE_BLOG:     process.env['PUBLIC_RENDER_MODE_BLOG'],
  PUBLIC_RENDER_MODE_CONTENT:  process.env['PUBLIC_RENDER_MODE_CONTENT'],
  PUBLIC_RENDER_MODE_WEATHER:  process.env['PUBLIC_RENDER_MODE_WEATHER'],
  PUBLIC_RENDER_MODE_CARS:     process.env['PUBLIC_RENDER_MODE_CARS'],
  PUBLIC_RENDER_MODE_MAPS:     process.env['PUBLIC_RENDER_MODE_MAPS'],
  PUBLIC_RENDER_MODE_ADMIN:    process.env['PUBLIC_RENDER_MODE_ADMIN'],
  PUBLIC_RENDER_MODE_BANK:     process.env['PUBLIC_RENDER_MODE_BANK'],
  PUBLIC_RENDER_MODE_DEVTOOLS: process.env['PUBLIC_RENDER_MODE_DEVTOOLS'],
  PUBLIC_RENDER_MODE_REPORTS:  process.env['PUBLIC_RENDER_MODE_REPORTS'],
  PUBLIC_RENDER_MODE_REMOTION: process.env['PUBLIC_RENDER_MODE_REMOTION'],
};

export interface ModuleStatus {
  id: ModuleId;
  title: string;
  icon: string;
  standalone: boolean;
  envEnabled: boolean;
  envRenderMode: RenderMode;
  runtimeEnabled: boolean;
  runtimeRenderMode: RenderMode;
  hasOverride: boolean;
  overrideEnabled: boolean | null;
  overrideRenderMode: RenderMode | null;
}

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.isAuthenticated) redirect(302, '/login');

  const envFlags = getFeatureFlagsFromEnv(envLike);
  const envModes = getRenderModesFromEnv(envLike);
  const overrides = readOverrides();

  const modules: ModuleStatus[] = MODULE_IDS.map((id) => {
    const override = overrides[id] ?? {};
    const envEnabled = envFlags[id];
    const envMode = envModes[id];
    return {
      id,
      title: MODULE_META[id].title,
      icon: MODULE_META[id].icon,
      standalone: MODULE_META[id].standalone ?? false,
      envEnabled,
      envRenderMode: envMode,
      runtimeEnabled: override.enabled ?? envEnabled,
      runtimeRenderMode: override.renderMode ?? envMode,
      hasOverride: 'enabled' in override || 'renderMode' in override,
      overrideEnabled: override.enabled ?? null,
      overrideRenderMode: override.renderMode ?? null,
    };
  });

  return { modules, storeFile: getStorePath_public() };
};
