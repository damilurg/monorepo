import type { RenderMode } from '../feature-flags/index.js';

export interface ModuleConfig {
  id: string;
  route: string;
  title: string;
  description: string;
  featureFlag: string;
  apiBasePath: string;
  renderMode: RenderMode;
}
