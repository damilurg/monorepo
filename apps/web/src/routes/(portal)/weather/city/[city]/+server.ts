import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { geocodeCity, fetchWeatherRaw, transformWeather } from '$modules/weather/api/open-meteo.js';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Weather module is disabled' });
  }

  const cityName = decodeURIComponent(params.city);

  try {
    const geo = await geocodeCity(cityName);
    const raw = await fetchWeatherRaw(geo.latitude, geo.longitude);
    const dto = transformWeather(raw, geo);
    return json(dto);
  } catch (err) {
    error(502, { message: 'Failed to fetch weather data' });
  }
};
