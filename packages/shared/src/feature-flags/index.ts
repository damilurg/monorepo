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

export interface FeatureFlagConfig {
  exchange: boolean;
  blog: boolean;
  content: boolean;
  weather: boolean;
  cars: boolean;
  maps: boolean;
  admin: boolean;
  bank: boolean;
  devtools: boolean;
  reports: boolean;
  remotion: boolean;
}

export interface RenderModeFlagConfig {
  exchange: RenderMode;
  blog: RenderMode;
  content: RenderMode;
  weather: RenderMode;
  cars: RenderMode;
  maps: RenderMode;
  admin: RenderMode;
  bank: RenderMode;
  devtools: RenderMode;
  reports: RenderMode;
  remotion: RenderMode;
}

export const FEATURE_FLAGS: FeatureFlagConfig = {
  exchange: true,
  blog: true,
  content: true,
  weather: true,
  cars: true,
  maps: true,
  admin: true,
  bank: true,
  devtools: true,
  reports: true,
  remotion: true,
} as const;

export const RENDER_MODE_FLAGS: RenderModeFlagConfig = {
  exchange: 'ssr',
  blog: 'ssr',
  content: 'ssr',
  weather: 'ssr',
  cars: 'ssr',
  maps: 'ssr',
  admin: 'ssr',
  bank: 'ssr',
  devtools: 'ssr',
  reports: 'ssr',
  remotion: 'ssr',
} as const;

export function isFeatureEnabled(
  flags: FeatureFlagConfig,
  moduleId: ModuleId
): boolean {
  return flags[moduleId] ?? false;
}

export function getFeatureFlagsFromEnv(env: Record<string, string | undefined>): FeatureFlagConfig {
  return {
    exchange: env['PUBLIC_FEATURE_EXCHANGE'] !== 'false',
    blog: env['PUBLIC_FEATURE_BLOG'] !== 'false',
    content: env['PUBLIC_FEATURE_CONTENT'] !== 'false',
    weather: env['PUBLIC_FEATURE_WEATHER'] !== 'false',
    cars: env['PUBLIC_FEATURE_CARS'] !== 'false',
    maps: env['PUBLIC_FEATURE_MAPS'] !== 'false',
    admin: env['PUBLIC_FEATURE_ADMIN'] !== 'false',
    bank: env['PUBLIC_FEATURE_BANK'] !== 'false',
    devtools: env['PUBLIC_FEATURE_DEVTOOLS'] !== 'false',
    reports: env['PUBLIC_FEATURE_REPORTS'] !== 'false',
    remotion: env['PUBLIC_FEATURE_REMOTION'] !== 'false',
  };
}

export function getRenderModesFromEnv(env: Record<string, string | undefined>): RenderModeFlagConfig {
  const mode = (key: string): RenderMode =>
    env[key] === 'spa' ? 'spa' : 'ssr';
  return {
    exchange: mode('PUBLIC_RENDER_MODE_EXCHANGE'),
    blog: mode('PUBLIC_RENDER_MODE_BLOG'),
    content: mode('PUBLIC_RENDER_MODE_CONTENT'),
    weather: mode('PUBLIC_RENDER_MODE_WEATHER'),
    cars: mode('PUBLIC_RENDER_MODE_CARS'),
    maps: mode('PUBLIC_RENDER_MODE_MAPS'),
    admin: mode('PUBLIC_RENDER_MODE_ADMIN'),
    bank: mode('PUBLIC_RENDER_MODE_BANK'),
    devtools: mode('PUBLIC_RENDER_MODE_DEVTOOLS'),
    reports: mode('PUBLIC_RENDER_MODE_REPORTS'),
    remotion: mode('PUBLIC_RENDER_MODE_REMOTION'),
  };
}
