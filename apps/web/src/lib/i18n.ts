import { browser } from '$app/environment';

export const SUPPORTED_LANGS = ['ru', 'en'] as const;
export type Lang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: Lang = 'ru';

export function getLangFromPath(pathname: string): Lang {
  const seg = pathname.split('/')[1];
  return SUPPORTED_LANGS.includes(seg as Lang) ? (seg as Lang) : DEFAULT_LANG;
}

export function getAlternateLang(current: Lang): Lang {
  return current === 'ru' ? 'en' : 'ru';
}
