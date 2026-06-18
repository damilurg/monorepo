import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { fetchLatestRatesRaw, transformExchangeRates } from '$modules/exchange/api/frankfurter.js';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Exchange module is disabled' });
  }

  const base = params.base.toUpperCase();

  try {
    const raw = await fetchLatestRatesRaw(base);
    const dto = transformExchangeRates(raw);
    return json(dto);
  } catch (err) {
    error(502, { message: 'Failed to fetch exchange rates' });
  }
};
