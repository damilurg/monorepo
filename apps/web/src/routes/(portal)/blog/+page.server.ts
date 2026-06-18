import type { PageServerLoad } from './$types';
import { loadBlogList } from '$modules/blog/server/load.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Blog module is disabled' });
  }

  if (locals.renderMode === 'spa') {
    return { renderMode: 'spa' as const, posts: [] };
  }

  const data = await loadBlogList();
  return { renderMode: 'ssr' as const, ...data };
};
