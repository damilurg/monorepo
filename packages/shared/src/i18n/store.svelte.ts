import { browser } from '$app/environment';
import type { Lang, Translations, I18nStore } from './types.js';

const STORAGE_KEY = 'portal_lang';

export function createI18nStore(translations: Translations, defaultLang: Lang = 'ru'): I18nStore {
  let lang = $state<Lang>(defaultLang);

  // Initialize from localStorage on client
  if (browser) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ru' || stored === 'en') {
      lang = stored;
    }
  }

  return {
    get lang() { return lang; },
    t(key: string): string {
      return translations[key]?.[lang] ?? translations[key]?.['ru'] ?? key;
    },
    setLang(newLang: Lang): void {
      lang = newLang;
      if (browser) localStorage.setItem(STORAGE_KEY, newLang);
    },
    toggle(): void {
      const next: Lang = lang === 'ru' ? 'en' : 'ru';
      lang = next;
      if (browser) localStorage.setItem(STORAGE_KEY, next);
    },
  };
}
