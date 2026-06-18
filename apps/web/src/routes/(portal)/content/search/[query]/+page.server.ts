import type { PageServerLoad } from './$types';
import { loadContentData } from '$modules/content/server/load.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Content module is disabled' });
  }

  const query = params.query;

  if (locals.renderMode === 'spa') {
    return { renderMode: 'spa' as const, quotes: [], total: 0, query };
  }

  // Load all quotes and filter server-side
  const data = await loadContentData();
  const q = query.toLowerCase();
  const filtered = data.quotes.filter(
    (quote) =>
      quote.quote.toLowerCase().includes(q) ||
      quote.author.toLowerCase().includes(q)
  );
  return { renderMode: 'ssr' as const, quotes: filtered, total: filtered.length, query };
};
