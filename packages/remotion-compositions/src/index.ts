// Compositions only — Root.tsx is intentionally excluded to avoid a diamond
// re-export (Root imports all compositions → TDZ on dynamic import via barrel).
// Use Root.tsx directly for `remotion studio` / CLI entry.
export { HelloWorld } from './compositions/HelloWorld.js';
export { DataViz } from './compositions/DataViz.js';
export { PortalOverview } from './compositions/PortalOverview.js';
export { ModuleSlide, MODULE_DATA } from './compositions/ModuleSlide.js';
export { PortalSlideshow } from './compositions/PortalSlideshow.js';
