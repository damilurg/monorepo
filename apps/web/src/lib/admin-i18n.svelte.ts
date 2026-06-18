import { createI18nStore } from '@repo/shared/i18n';

// Module-level singleton — avoids setContext/getContext across the admin route tree.
export const adminI18n = createI18nStore({
  'nav.title': { ru: 'Панель управления', en: 'Admin Panel' },
  'dashboard.module': { ru: 'Модуль', en: 'Module' },
  'dashboard.enabled': { ru: 'Включён', en: 'Enabled' },
  'dashboard.disabled': { ru: 'Отключён', en: 'Disabled' },
  'dashboard.renderMode': { ru: 'Режим рендера', en: 'Render Mode' },
  'dashboard.reset': { ru: 'Сбросить', en: 'Reset' },
  'dashboard.resetAll': { ru: 'Сбросить всё', en: 'Reset All' },
  'common.backHome': { ru: 'На главную', en: 'Home' },
}, 'ru');
