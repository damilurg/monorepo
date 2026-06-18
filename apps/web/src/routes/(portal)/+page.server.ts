import type { PageServerLoad } from './$types';
import { getFeatureFlagsFromEnv } from '@repo/shared/feature-flags';
import { env } from '$env/dynamic/public';
import { readOverrides } from '@repo/flags-store';

export const load: PageServerLoad = () => {
  const envFlags = getFeatureFlagsFromEnv(env);
  const overrides = readOverrides();

  function isEnabled(id: keyof typeof envFlags): boolean {
    return overrides[id]?.enabled ?? envFlags[id];
  }

  const modules = [
    { id: 'exchange', title: 'Обменник',  description: 'Курсы валют и конвертация в реальном времени', route: '/exchange', icon: '💱', enabled: isEnabled('exchange') },
    { id: 'blog',     title: 'Блог',      description: 'Статьи и публикации',                          route: '/blog',     icon: '📝', enabled: isEnabled('blog') },
    { id: 'content',  title: 'Контент',   description: 'Цитаты и вдохновляющий контент с поиском',     route: '/content',  icon: '💡', enabled: isEnabled('content') },
    { id: 'weather',  title: 'Погода',    description: 'Прогноз погоды для любого города',              route: '/weather',  icon: '🌤', enabled: isEnabled('weather') },
    { id: 'cars',     title: 'Авто',      description: 'Декодер VIN — узнайте всё об автомобиле',      route: '/cars',     icon: '🚗', enabled: isEnabled('cars') },
    { id: 'maps',     title: 'Карты',     description: 'Интерактивные карты OSM, маркеры, поиск мест', route: '/maps',     icon: '🗺️', enabled: isEnabled('maps') },
  ];

  const standaloneApps = [
    { id: 'admin',    title: 'Admin Panel', description: 'Feature flags, runtime overrides',       route: '/admin',    icon: '⚙️', gradient: 'from-slate-400 to-slate-600', badge: 'Auth',            enabled: isEnabled('admin') },
    { id: 'bank',     title: 'Bank',        description: 'Банковский лендинг + дашборд',           route: '/bank',     icon: '🏦', gradient: 'from-blue-400 to-indigo-500',                           enabled: isEnabled('bank') },
    { id: 'devtools', title: 'DevTools',    description: 'Симулятор мобильных устройств WebView',   route: '/devtools', icon: '🔧', gradient: 'from-orange-400 to-amber-500',                          enabled: isEnabled('devtools') },
    { id: 'remotion', title: 'Remotion',    description: 'Видео-генерация — React + Remotion',      route: '/remotion', icon: '🎬', gradient: 'from-pink-400 to-rose-500',   badge: 'React-in-Svelte', enabled: isEnabled('remotion') },
    { id: 'reports',  title: 'Reports',     description: 'Аналитика: крипто, страны, валюты',       route: '/reports',  icon: '📊', gradient: 'from-indigo-400 to-violet-500',                         enabled: isEnabled('reports') },
  ];

  return { modules, standaloneApps };
};
