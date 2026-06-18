import type { ModuleConfig } from '@repo/shared/config';

export const weatherModuleConfig: ModuleConfig = {
  id: 'weather',
  route: '/weather',
  title: 'Погода',
  description: 'Прогноз погоды для любого города',
  featureFlag: 'weather',
  apiBasePath: '/weather',
  renderMode: 'ssr',
} as const;
