import type { PageServerLoad } from './$types';
import { loadExchangeData } from '$modules/exchange/server/load.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Exchange module is disabled' });
  }

  const base = params.base.toUpperCase();

  if (locals.renderMode === 'spa') {
    return { renderMode: 'spa' as const, rates: null, base };
  }

  const data = await loadExchangeData(base);
  return { renderMode: 'ssr' as const, ...data };
};
