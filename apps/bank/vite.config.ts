import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: { port: 5181, fs: { allow: ['../..'] } },
  optimizeDeps: { exclude: ['@repo/shared'] },
  ssr: { noExternal: ['@repo/shared'] },
});
