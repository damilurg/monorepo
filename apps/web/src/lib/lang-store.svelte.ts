import { browser } from '$app/environment';
import type { Lang } from './i18n.js';
import { SUPPORTED_LANGS, DEFAULT_LANG } from './i18n.js';

function createLangStore() {
  let current = $state<Lang>(DEFAULT_LANG);

  function init(lang: Lang) {
    current = lang;
    if (browser) {
      document.documentElement.lang = lang;
      localStorage.setItem('lang', lang);
    }
  }

  function toggle() {
    init(current === 'ru' ? 'en' : 'ru');
  }

  function fromStorage(): Lang {
    if (!browser) return DEFAULT_LANG;
    const stored = localStorage.getItem('lang') as Lang | null;
    return stored && SUPPORTED_LANGS.includes(stored) ? stored : DEFAULT_LANG;
  }

  return {
    get current() { return current; },
    init,
    toggle,
    fromStorage,
  };
}

export const langStore = createLangStore();
