import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
    exclude: ['@repo/shared', '@repo/remotion-compositions'],
  },
  ssr: {
    // Do NOT externalize these — they must go through the compiler.
    // Remotion packages are loaded via dynamic import() inside browser-only
    // $effect, so they never run in SSR context.
    noExternal: ['@repo/shared'],
  },
});
