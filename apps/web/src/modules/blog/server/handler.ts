import { json, error } from '@sveltejs/kit';
import {
  fetchPostsRaw,
  fetchPostRaw,
  transformPost,
  transformPosts,
} from '../api/jsonplaceholder.js';
import type { RequestEvent } from '@sveltejs/kit';

export async function handleBlogGet(event: RequestEvent): Promise<Response> {
  if (!event.locals.featureEnabled) {
    error(403, { message: 'Blog module is disabled' });
  }

  const idParam = event.url.searchParams.get('id');

  try {
    if (idParam) {
      const raw = await fetchPostRaw(parseInt(idParam, 10));
      const dto = transformPost(raw);
      return json(dto);
    }
    const raw = await fetchPostsRaw();
    const dto = transformPosts(raw);
    return json(dto);
  } catch (err) {
    error(502, { message: 'Failed to fetch blog data' });
  }
}
