import { regexRules } from './regex.js';

/**
 * @repo/eslint-config custom rules plugin.
 * Usage in flat config:
 *   import repoPlugin from '@repo/eslint-config/plugin';
 *   { plugins: { repo: repoPlugin }, rules: { 'repo/require-unicode-flag': 'warn' } }
 */
export default {
  meta: {
    name: '@repo/eslint-plugin',
    version: '0.0.1',
  },
  rules: {
    ...regexRules,
  },
};
