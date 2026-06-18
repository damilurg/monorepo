import type { RenderMode } from '@repo/shared/feature-flags';

declare global {
  namespace App {
    interface Locals {
      featureEnabled: boolean;
      renderMode: RenderMode;
    }
  }
}

export {};
