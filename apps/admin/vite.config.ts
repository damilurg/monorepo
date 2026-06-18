import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5174,
    fs: {
      allow: ['../..'],
    },
  },
  optimizeDeps: {
    exclude: ['@repo/shared'],
  },
  ssr: {
    noExternal: ['@repo/shared'],
  },
});
