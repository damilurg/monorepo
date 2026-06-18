import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, cookies }) => {
  const lang = (cookies.get('lang') as 'ru' | 'en') ?? 'ru';
  return {
    app: locals.app,
    featureEnabled: locals.featureEnabled,
    lang,
  };
};
