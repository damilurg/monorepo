import type { ModuleConfig } from '@repo/shared/config';

export const mapsModuleConfig: ModuleConfig = {
  id: 'maps',
  route: '/maps',
  title: 'Карты',
  description: 'Интерактивные карты OSM, маркеры, поиск мест',
  featureFlag: 'maps',
  apiBasePath: '/maps',
  renderMode: 'ssr',
} as const;
