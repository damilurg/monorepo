import { createI18nStore } from '@repo/shared/i18n';

const translations = {
  // Nav
  'nav.title': { ru: 'Отчёты', en: 'Reports' },
  'nav.overview': { ru: 'Обзор', en: 'Overview' },
  'nav.crypto': { ru: 'Крипто', en: 'Crypto' },
  'nav.countries': { ru: 'Страны', en: 'Countries' },
  'nav.exchange': { ru: 'Валюты', en: 'Exchange' },
  // Overview
  'overview.worldPop': { ru: 'Население мира', en: 'World Population' },
  'overview.countries': { ru: 'Стран в мире', en: 'Countries' },
  'overview.topCrypto': { ru: 'Bitcoin', en: 'Bitcoin' },
  'overview.eurUsd': { ru: 'EUR/USD', en: 'EUR/USD' },
  'overview.byRegion': { ru: 'По регионам', en: 'By Region' },
  'overview.topCountries': { ru: 'Топ стран по населению', en: 'Top Countries by Population' },
  // Crypto
  'crypto.title': { ru: 'Крипторынок', en: 'Crypto Market' },
  'crypto.rank': { ru: '№', en: '#' },
  'crypto.price': { ru: 'Цена', en: 'Price' },
  'crypto.change24h': { ru: '24ч %', en: '24h %' },
  'crypto.marketCap': { ru: 'Капитализация', en: 'Market Cap' },
  // Countries
  'countries.search': { ru: 'Поиск страны...', en: 'Search country...' },
  'countries.population': { ru: 'Население', en: 'Population' },
  'countries.capital': { ru: 'Столица', en: 'Capital' },
  'countries.region': { ru: 'Регион', en: 'Region' },
  'countries.area': { ru: 'Площадь', en: 'Area' },
  'countries.filter.all': { ru: 'Все', en: 'All' },
  // Exchange
  'exchange.title': { ru: 'Курсы валют', en: 'Exchange Rates' },
  'exchange.converter': { ru: 'Конвертер', en: 'Converter' },
  'exchange.base': { ru: 'Базовая', en: 'Base' },
  'exchange.amount': { ru: 'Сумма', en: 'Amount' },
  'exchange.result': { ru: 'Результат', en: 'Result' },
  // Common
  'common.loading': { ru: 'Загрузка...', en: 'Loading...' },
  'common.error': { ru: 'Ошибка загрузки данных', en: 'Failed to load data' },
  'data.source': { ru: 'Данные: REST Countries, CoinGecko, Frankfurter', en: 'Data: REST Countries, CoinGecko, Frankfurter' },
};

export const i18n = createI18nStore(translations, 'ru');
