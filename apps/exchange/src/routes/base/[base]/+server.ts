import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { fetchLatestRates } from '$modules/exchange/api/frankfurter.js';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Exchange module is disabled' });
  }

  const base = params.base.toUpperCase();

  try {
    const rates = await fetchLatestRates(base);
    return json(rates);
  } catch (err) {
    error(502, { message: 'Failed to fetch exchange rates' });
  }
};
