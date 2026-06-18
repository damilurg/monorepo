import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    // React plugin BEFORE sveltekit — handles .tsx/.jsx files
    react({ include: /\.(tsx|jsx)$/ }),
    sveltekit(),
  ],
  server: {
    port: 5183,
    fs: {
      allow: ['../..'],
    },
  },
  optimizeDeps: {
    // Workspace .tsx packages must not be pre-bundled
    exclude: ['@repo/remotion-compositions'],
  },
  // All remotion packages are loaded via dynamic import() inside browser-only $effect.
  // They are never evaluated during SSR, so no ssr.noExternal config is needed.
});
