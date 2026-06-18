import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Canonical node_modules inside apps/web — used by resolve.alias below.
const webRoot = fileURLToPath(new URL('.', import.meta.url));
const nm = (pkg: string) => resolve(webRoot, 'node_modules', pkg);

export default defineConfig({
  plugins: [
    tailwindcss(),
    // React plugin BEFORE sveltekit — handles .tsx/.jsx files for /remotion route
    react({ include: /\.(tsx|jsx)$/ }),
    sveltekit(),
  ],
  resolve: {
    // @zag-js/svelte (used by bits-ui / shadcn-svelte) only exposes
    // a "svelte" export condition — add it so Vite can resolve the package.
    conditions: ['svelte'],
    // packages/remotion-compositions has its own node_modules/ with separate
    // copies of react, react-dom, and remotion.  Two separate module instances
    // break @remotion/player: the Player sets up its hooks context via instance
    // A (from apps/web/node_modules/), while composition hooks (useCurrentFrame
    // etc.) run via instance B (from packages/remotion-compositions/node_modules/)
    // → "can only be called inside a component passed to <Player>".
    //
    // resolve.alias with absolute paths makes Vite rewrite every import of these
    // specifiers — regardless of which workspace package the file lives in — to
    // the canonical copy in apps/web/node_modules/.  Vite applies aliases during
    // its transform pass, so even files served as raw ESM get the correct URL
    // and the browser module cache sees a single instance.
    //
    // Note: resolve.dedupe was tried first but causes "Importing a module script
    // failed" when combined with optimizeDeps.exclude.  Explicit alias is safer.
    alias: [
      // Bare specifiers — match exactly (regex avoids false-prefix matches like
      // aliasing "react" accidentally catching "react-dom").
      { find: /^react$/, replacement: nm('react') },
      { find: /^react-dom$/, replacement: nm('react-dom') },
      { find: /^remotion$/, replacement: nm('remotion') },
      { find: /^@remotion\/player$/, replacement: nm('@remotion/player') },
      // Sub-path imports used by React's automatic JSX transform and DOM client.
      { find: /^react\/jsx-runtime$/, replacement: nm('react/jsx-runtime.js') },
      { find: /^react\/jsx-dev-runtime$/, replacement: nm('react/jsx-dev-runtime.js') },
      { find: /^react-dom\/client$/, replacement: nm('react-dom/client.js') },
    ],
  },
  server: {
    port: 5173,
    fs: {
      // Allow serving files from monorepo root so
      // packages/shared and packages/remotion-compositions are accessible
      allow: ['../..'],
    },
  },
  optimizeDeps: {
    // @repo/* packages must be excluded so Vite serves them as raw ES modules
    // (they contain .svelte / .tsx source files that need Vite transforms).
    //
    // remotion + @remotion/player MUST also be excluded together.
    // When @remotion/player is pre-bundled, esbuild inlines remotion's code
    // into the chunk, creating a separate module instance from the raw
    // `remotion` module that the composition files import directly.
    // The Player sets up its hooks context via the bundled copy; compositions
    // call useCurrentFrame() via the raw copy → "can only be called inside a
    // component passed to <Player>" even though they ARE inside one.
    // Excluding both forces them to share the same raw node_modules/remotion
    // instance so context is visible across the boundary.
    exclude: [
      '@repo/shared',
      '@repo/remotion-compositions',
      'remotion',
      '@remotion/player',
    ],
  },
  ssr: {
    // Do NOT externalize these — they must go through the compiler.
    // Remotion packages are loaded via dynamic import() inside browser-only
    // $effect, so they never run in SSR context.
    noExternal: ['@repo/shared'],
  },
});
