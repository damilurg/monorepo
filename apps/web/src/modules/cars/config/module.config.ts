import type { ModuleConfig } from '@repo/shared/config';

export const carsModuleConfig: ModuleConfig = {
  id: 'cars',
  route: '/cars',
  title: 'Авто',
  description: 'Декодер VIN — информация об автомобиле',
  featureFlag: 'cars',
  apiBasePath: '/cars',
  renderMode: 'ssr',
} as const;
