import { json, error } from '@sveltejs/kit';
import { fetchQuotes } from '../api/dummyjson.js';
import type { RequestEvent } from '@sveltejs/kit';

export async function handleContentGet(event: RequestEvent): Promise<Response> {
  if (!event.locals.featureEnabled) {
    error(403, { message: 'Content module is disabled' });
  }

  try {
    const data = await fetchQuotes();
    return json(data);
  } catch (err) {
    error(502, { message: 'Failed to fetch content' });
  }
}
