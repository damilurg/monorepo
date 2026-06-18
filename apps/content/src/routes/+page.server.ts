import type { PageServerLoad } from './$types';
import { loadContentData } from '$modules/content/server/load.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Content module is disabled' });
  }

  if (locals.renderMode === 'spa') {
    return { renderMode: 'spa' as const, quotes: [], total: 0 };
  }

  const data = await loadContentData();
  return { renderMode: 'ssr' as const, ...data };
};
