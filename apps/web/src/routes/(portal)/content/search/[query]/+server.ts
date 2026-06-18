import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { fetchQuotesRaw, transformQuote } from '$modules/content/api/dummyjson.js';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Content module is disabled' });
  }

  const query = params.query.toLowerCase();

  try {
    const raw = await fetchQuotesRaw();
    const filtered = raw.quotes.filter(
      (quote) =>
        quote.quote.toLowerCase().includes(query) ||
        quote.author.toLowerCase().includes(query)
    );
    const quotes = filtered.map(transformQuote);
    return json({ quotes, total: quotes.length });
  } catch (err) {
    error(502, { message: 'Failed to fetch content' });
  }
};
