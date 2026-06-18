import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { geocodeAddress } from '$modules/maps/api/nominatim.js';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Maps module is disabled' });
  }

  const query = url.searchParams.get('q');

  if (!query || !query.trim()) {
    error(400, { message: 'Missing search query parameter "q"' });
  }

  try {
    const location = await geocodeAddress(query.trim());
    return json(location);
  } catch (err) {
    error(502, { message: 'Failed to geocode location' });
  }
};
