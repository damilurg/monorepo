import { json, error } from '@sveltejs/kit';
import { geocodeAddress } from '../api/nominatim.js';
import type { RequestEvent } from '@sveltejs/kit';

export async function handleMapsSearch(event: RequestEvent): Promise<Response> {
  if (!event.locals.featureEnabled) {
    error(403, { message: 'Maps module is disabled' });
  }

  const query = event.url.searchParams.get('q');

  if (!query || !query.trim()) {
    error(400, { message: 'Missing search query parameter "q"' });
  }

  try {
    const location = await geocodeAddress(query.trim());
    return json(location);
  } catch (err) {
    error(502, { message: 'Failed to geocode location' });
  }
}
