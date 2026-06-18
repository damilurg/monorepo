import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    svelte({ hot: !process.env.VITEST }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['apps/*/src/**/*.test.ts', 'packages/*/src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/.svelte-kit/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: [
        'apps/web/src/modules/**/*.ts',
        'packages/shared/src/**/*.ts',
      ],
      exclude: [
        '**/*.d.ts',
        '**/*.test.ts',
        '**/index.ts',
        '**/.svelte-kit/**',
      ],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '$modules': resolve(__dirname, 'apps/web/src/modules'),
      '$lib': resolve(__dirname, 'apps/web/src/lib'),
      '@repo/shared': resolve(__dirname, 'packages/shared/src/index.ts'),
      '$app/environment': resolve(__dirname, 'vitest.mocks/app-environment.ts'),
      '$app/navigation': resolve(__dirname, 'vitest.mocks/app-navigation.ts'),
      '$app/stores': resolve(__dirname, 'vitest.mocks/app-stores.ts'),
    },
  },
});
