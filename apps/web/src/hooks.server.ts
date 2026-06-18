import { type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import {
  getFeatureFlagsFromEnv,
  getRenderModesFromEnv,
  type ModuleId,
} from '@repo/shared/feature-flags';
import { readOverrides } from '@repo/flags-store';
import { env } from '$env/dynamic/public';
import { isAuthenticated } from '$lib/server/auth.js';

// React Fast Refresh preamble — injected into every HTML response in dev.
// @vitejs/plugin-react normally does this via transformIndexHtml, but SvelteKit's
// dev server generates HTML in configureServer (bypassing transformIndexHtml), so
// the preamble script never reaches the browser.  Without it, every .tsx file that
// goes through the React plugin throws "can't detect preamble", and compositions
// loaded via PortalSlideshow's static imports land in TDZ in Vite's module cache.
const REACT_PREAMBLE = `<script type="module">
  import RefreshRuntime from '/@react-refresh';
  RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => () => {};
  window.__vite_plugin_react_preamble_installed__ = true;
</script>`;

// Portal web-module routes — feature flag guard applied in root layout
const MODULE_ROUTES: Record<string, ModuleId> = {
  '/exchange': 'exchange',
  '/blog':     'blog',
  '/content':  'content',
  '/weather':  'weather',
  '/cars':     'cars',
  '/maps':     'maps',
};

// Standalone app routes embedded in web — served directly, no proxy
const STANDALONE_ROUTES: Record<string, ModuleId> = {
  '/admin':    'admin',
  '/bank':     'bank',
  '/devtools': 'devtools',
  '/remotion': 'remotion',
  '/reports':  'reports',
};

function getModuleFromPath(pathname: string): ModuleId | null {
  for (const [route, moduleId] of Object.entries(MODULE_ROUTES)) {
    if (pathname === route || pathname.startsWith(route + '/')) return moduleId;
  }
  return null;
}

function getStandaloneFromPath(pathname: string): ModuleId | null {
  for (const [route, moduleId] of Object.entries(STANDALONE_ROUTES)) {
    if (pathname === route || pathname.startsWith(route + '/')) return moduleId;
  }
  return null;
}

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  // Admin auth cookie — checked by admin routes and API handlers
  event.locals.isAuthenticated = isAuthenticated(event);

  const envFlags = getFeatureFlagsFromEnv(env);
  const envModes = getRenderModesFromEnv(env);
  const overrides = readOverrides();

  const moduleId = getModuleFromPath(pathname);
  const standaloneId = getStandaloneFromPath(pathname);

  if (moduleId) {
    const override = overrides[moduleId] ?? {};
    event.locals.app = moduleId;
    event.locals.featureEnabled = override.enabled ?? envFlags[moduleId];
    event.locals.renderMode = override.renderMode ?? envModes[moduleId];
  } else if (standaloneId) {
    const override = overrides[standaloneId] ?? {};
    event.locals.app = standaloneId;
    event.locals.featureEnabled = override.enabled ?? envFlags[standaloneId];
    event.locals.renderMode = 'ssr';
  } else {
    event.locals.app = 'home';
    event.locals.featureEnabled = true;
    event.locals.renderMode = 'ssr';
  }

  const langCookie = event.cookies.get('lang');
  event.locals.lang = langCookie === 'en' ? 'en' : 'ru';

  return resolve(event, {
    transformPageChunk({ html }) {
      if (dev) {
        return html.replace('</head>', `${REACT_PREAMBLE}</head>`);
      }
      return html;
    },
  });
};
