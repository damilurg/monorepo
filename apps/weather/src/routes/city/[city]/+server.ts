import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { geocodeCity, fetchWeather } from '$modules/weather/api/open-meteo.js';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Weather module is disabled' });
  }

  const city = params.city;

  try {
    const location = await geocodeCity(city);
    const weather = await fetchWeather(location.latitude, location.longitude);
    return json({ location, weather });
  } catch (err) {
    error(502, { message: 'Failed to fetch weather data' });
  }
};
