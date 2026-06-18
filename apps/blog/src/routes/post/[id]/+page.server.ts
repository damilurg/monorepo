import type { PageServerLoad } from './$types';
import { loadBlogDetail } from '$modules/blog/server/load.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Blog module is disabled' });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id) || id < 1) {
    error(404, { message: 'Post not found' });
  }

  if (locals.renderMode === 'spa') {
    return { renderMode: 'spa' as const, post: null, comments: [], postId: id };
  }

  const data = await loadBlogDetail(id);
  return { renderMode: 'ssr' as const, postId: id, ...data };
};
