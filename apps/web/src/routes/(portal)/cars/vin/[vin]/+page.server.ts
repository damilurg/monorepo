import type { PageServerLoad } from './$types';
import { loadCarsData } from '$modules/cars/server/load.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Cars module is disabled' });
  }

  const vin = params.vin.toUpperCase();

  if (locals.renderMode === 'spa') {
    return { renderMode: 'spa' as const, vehicle: null, vin, error: null };
  }

  const data = await loadCarsData(vin);
  return { renderMode: 'ssr' as const, ...data };
};
