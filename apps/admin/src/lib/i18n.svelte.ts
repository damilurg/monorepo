import { createI18nStore } from '@repo/shared/i18n';

const translations = {
  'nav.title': { ru: 'Панель управления', en: 'Admin Panel' },
  'nav.dashboard': { ru: 'Дашборд', en: 'Dashboard' },
  'dashboard.title': { ru: 'Feature Flags', en: 'Feature Flags' },
  'dashboard.subtitle': { ru: 'Управление модулями и режимами рендеринга', en: 'Manage modules and render modes' },
  'dashboard.module': { ru: 'Модуль', en: 'Module' },
  'dashboard.enabled': { ru: 'Включён', en: 'Enabled' },
  'dashboard.disabled': { ru: 'Отключён', en: 'Disabled' },
  'dashboard.renderMode': { ru: 'Режим рендера', en: 'Render Mode' },
  'dashboard.ssr': { ru: 'Серверный (SSR)', en: 'Server (SSR)' },
  'dashboard.spa': { ru: 'Клиентский (SPA)', en: 'Client (SPA)' },
  'dashboard.reset': { ru: 'Сбросить', en: 'Reset' },
  'dashboard.resetAll': { ru: 'Сбросить всё', en: 'Reset All' },
  'dashboard.envDefault': { ru: 'из .env', en: 'from .env' },
  'dashboard.banner.title': { ru: 'Изменения сохранены локально', en: 'Changes saved locally' },
  'dashboard.banner.desc': { ru: 'Настройки хранятся в localStorage и не влияют на других пользователей', en: 'Settings are stored in localStorage and do not affect other users' },
  'common.backHome': { ru: 'На главную', en: 'Home' },
  'common.loading': { ru: 'Загрузка...', en: 'Loading...' },
};

export const i18n = createI18nStore(translations, 'ru');
