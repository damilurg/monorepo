import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import repoPlugin from './rules/index.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        extraFileExtensions: ['.svelte'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      repo: repoPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // ─── Regex safety ─────────────────────────────────────────────
      // Require /u flag when regex uses \w, \d, \s or character classes
      'repo/require-unicode-flag': 'warn',

      // Forbid using regex to parse structured formats
      'repo/no-regex-for-structured-data': 'error',

      // In unicode-flagged patterns, suggest \p{L} over \w
      'repo/prefer-unicode-property-escapes': 'warn',

      // Warn on ReDoS-prone nested quantifiers
      'repo/no-backtracking-regex': 'error',
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      svelte: sveltePlugin,
      '@typescript-eslint': tsPlugin,
      repo: repoPlugin,
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,

      // ─── Regex safety ─────────────────────────────────────────────
      'repo/require-unicode-flag': 'warn',
      'repo/no-regex-for-structured-data': 'error',
      'repo/prefer-unicode-property-escapes': 'warn',
      'repo/no-backtracking-regex': 'error',
    },
  },
  {
    ignores: ['.svelte-kit/', 'build/', 'node_modules/', 'dist/'],
  },
];
