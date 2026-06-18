import type { PageServerLoad } from './$types';
import { loadWeatherData } from '$modules/weather/server/load.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Weather module is disabled' });
  }

  const city = params.city;

  if (locals.renderMode === 'spa') {
    return { renderMode: 'spa' as const, weather: null, city };
  }

  const data = await loadWeatherData(city);
  return { renderMode: 'ssr' as const, ...data };
};
