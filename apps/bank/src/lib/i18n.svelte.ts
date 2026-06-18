import { createI18nStore } from '@repo/shared/i18n';

const translations = {
  // Landing page
  'landing.hero.badge': { ru: 'Цифровой банкинг', en: 'Digital Banking' },
  'landing.hero.title': { ru: 'Банкинг нового поколения', en: 'Next-Gen Banking' },
  'landing.hero.subtitle': { ru: 'Управляйте финансами умно, быстро и безопасно', en: 'Manage your finances smartly, quickly and securely' },
  'landing.hero.cta': { ru: 'Открыть счёт', en: 'Open Account' },
  'landing.hero.demo': { ru: 'Смотреть демо', en: 'Watch Demo' },
  'landing.features.title': { ru: 'Возможности', en: 'Features' },
  'landing.nav.dashboard': { ru: 'Дашборд', en: 'Dashboard' },
  'landing.nav.devtools': { ru: 'DevTools', en: 'DevTools' },
  // Dashboard
  'dashboard.title': { ru: 'Финансовый дашборд', en: 'Financial Dashboard' },
  'dashboard.balance': { ru: 'Баланс', en: 'Balance' },
  'dashboard.income': { ru: 'Доходы', en: 'Income' },
  'dashboard.expenses': { ru: 'Расходы', en: 'Expenses' },
  'dashboard.transactions': { ru: 'Транзакции', en: 'Transactions' },
  'dashboard.analytics': { ru: 'Аналитика', en: 'Analytics' },
  // DevTools
  'devtools.title': { ru: 'WebView DevTools', en: 'WebView DevTools' },
  'devtools.url.placeholder': { ru: 'Введите URL...', en: 'Enter URL...' },
  'devtools.preview': { ru: 'Открыть', en: 'Open' },
  // Common
  'common.backHome': { ru: 'На главную', en: 'Home' },
  'common.loading': { ru: 'Загрузка...', en: 'Loading...' },
};

export const i18n = createI18nStore(translations, 'ru');
