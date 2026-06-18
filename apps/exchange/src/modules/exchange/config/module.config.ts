import type { ModuleConfig } from '@repo/shared/config';

export const exchangeModuleConfig: ModuleConfig = {
  id: 'exchange',
  route: '/exchange',
  title: 'Обменник',
  description: 'Курсы валют и конвертация',
  featureFlag: 'exchange',
  apiBasePath: '/exchange',
  renderMode: 'ssr',
} as const;
