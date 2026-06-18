import { createI18nStore } from '@repo/shared/i18n';

const translations = {
  'app.title': { ru: 'DevTools', en: 'DevTools' },
  'app.subtitle': { ru: 'Симулятор мобильных устройств', en: 'Mobile Device Simulator' },
  'url.placeholder': { ru: 'https://example.com', en: 'https://example.com' },
  'url.open': { ru: 'Открыть', en: 'Open' },
  'device.portrait': { ru: 'Портрет', en: 'Portrait' },
  'device.landscape': { ru: 'Альбом', en: 'Landscape' },
  'device.zoom': { ru: 'Масштаб', en: 'Zoom' },
  'device.info.resolution': { ru: 'Разрешение', en: 'Resolution' },
  'device.info.pixelRatio': { ru: 'Пиксельная плотность', en: 'Pixel ratio' },
  'device.info.physicalPx': { ru: 'Физические пиксели', en: 'Physical pixels' },
  'device.info.year': { ru: 'Год', en: 'Year' },
  'device.filter.all': { ru: 'Все', en: 'All' },
  'empty.title': { ru: 'Введите URL выше и нажмите «Открыть»', en: 'Enter a URL above and click Open' },
  'empty.warning': { ru: 'Некоторые сайты блокируют встраивание через X-Frame-Options', en: 'Some sites block embedding via X-Frame-Options' },
  'hint.devAll': { ru: 'Запустите: yarn dev:all', en: 'Run: yarn dev:all' },
};

export const i18n = createI18nStore(translations, 'ru');
