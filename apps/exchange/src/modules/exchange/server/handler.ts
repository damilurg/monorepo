import { json, error } from '@sveltejs/kit';
import { fetchLatestRates } from '../api/frankfurter.js';
import type { RequestEvent } from '@sveltejs/kit';

export async function handleExchangeGet(event: RequestEvent): Promise<Response> {
  if (!event.locals.featureEnabled) {
    error(403, { message: 'Exchange module is disabled' });
  }

  const base = event.url.searchParams.get('base') ?? 'USD';

  try {
    const rates = await fetchLatestRates(base);
    return json(rates);
  } catch (err) {
    error(502, { message: 'Failed to fetch exchange rates' });
  }
}
