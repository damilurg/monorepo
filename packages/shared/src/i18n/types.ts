export type Lang = 'ru' | 'en';

export type Translations = Record<string, Record<Lang, string>>;

export interface I18nStore {
  readonly lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}
