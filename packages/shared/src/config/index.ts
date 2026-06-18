export type { ModuleConfig } from './module-config.js';

export interface AppConfig {
  name: string;
  version: string;
}

export const APP_CONFIG: AppConfig = {
  name: 'Automotive Portal',
  version: '1.0.0',
} as const;
