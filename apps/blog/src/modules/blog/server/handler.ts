import { json, error } from '@sveltejs/kit';
import { fetchPosts, fetchPost } from '../api/jsonplaceholder.js';
import type { RequestEvent } from '@sveltejs/kit';

export async function handleBlogGet(event: RequestEvent): Promise<Response> {
  if (!event.locals.featureEnabled) {
    error(403, { message: 'Blog module is disabled' });
  }

  const idParam = event.url.searchParams.get('id');

  try {
    if (idParam) {
      const post = await fetchPost(parseInt(idParam, 10));
      return json(post);
    }
    const posts = await fetchPosts();
    return json(posts);
  } catch (err) {
    error(502, { message: 'Failed to fetch blog data' });
  }
}
