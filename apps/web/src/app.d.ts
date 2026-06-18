import type { ModuleId, RenderMode } from '@repo/shared/feature-flags';

declare global {
  namespace App {
    interface Locals {
      app: ModuleId | 'home' | 'admin' | null;
      featureEnabled: boolean;
      renderMode: RenderMode;
      lang: 'ru' | 'en';
      isAuthenticated: boolean;
    }
    interface Error {
      message: string;
      code?: string;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      ADMIN_SECRET?: string;
    }
  }
}

export {};
