import type { ModuleConfig } from '@repo/shared/config';

export const blogModuleConfig: ModuleConfig = {
  id: 'blog',
  route: '/blog',
  title: 'Блог',
  description: 'Статьи и публикации',
  featureFlag: 'blog',
  apiBasePath: '/blog',
  renderMode: 'ssr',
} as const;
