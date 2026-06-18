import type { ModuleConfig } from '@repo/shared/config';

export const contentModuleConfig: ModuleConfig = {
  id: 'content',
  route: '/content',
  title: 'Контент',
  description: 'Цитаты и вдохновляющий контент',
  featureFlag: 'content',
  apiBasePath: '/content',
  renderMode: 'ssr',
} as const;
