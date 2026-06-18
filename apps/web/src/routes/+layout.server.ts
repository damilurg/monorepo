import type { LayoutServerLoad } from './$types';

// Root layout: minimal — just lang for analytics.
// Portal data (featureEnabled, app) lives in (portal)/+layout.server.ts.
export const load: LayoutServerLoad = ({ cookies }) => {
  const lang = (cookies.get('lang') as 'ru' | 'en') ?? 'ru';
  return { lang };
};
