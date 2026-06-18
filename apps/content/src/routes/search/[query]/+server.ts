import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { fetchQuotes } from '$modules/content/api/dummyjson.js';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Content module is disabled' });
  }

  const query = params.query.toLowerCase();

  try {
    const data = await fetchQuotes();
    const filtered = data.quotes.filter(
      (quote) =>
        quote.quote.toLowerCase().includes(query) ||
        quote.author.toLowerCase().includes(query)
    );
    return json({ quotes: filtered, total: filtered.length });
  } catch (err) {
    error(502, { message: 'Failed to fetch content' });
  }
};
