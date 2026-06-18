import { json, error } from '@sveltejs/kit';
import { geocodeCity, fetchWeather } from '../api/open-meteo.js';
import type { RequestEvent } from '@sveltejs/kit';

export async function handleWeatherGet(event: RequestEvent): Promise<Response> {
  if (!event.locals.featureEnabled) {
    error(403, { message: 'Weather module is disabled' });
  }

  const city = event.url.searchParams.get('city') ?? 'Moscow';

  try {
    const location = await geocodeCity(city);
    const weather = await fetchWeather(location.latitude, location.longitude);
    return json({ location, weather });
  } catch (err) {
    error(502, { message: 'Failed to fetch weather data' });
  }
}
