import { json, error } from '@sveltejs/kit';
import { geocodeCity, fetchWeatherRaw, transformWeather } from '../api/open-meteo.js';
import type { RequestEvent } from '@sveltejs/kit';

export async function handleWeatherGet(event: RequestEvent): Promise<Response> {
  if (!event.locals.featureEnabled) {
    error(403, { message: 'Weather module is disabled' });
  }

  const city = event.url.searchParams.get('city') ?? 'Moscow';

  try {
    const geo = await geocodeCity(city);
    const raw = await fetchWeatherRaw(geo.latitude, geo.longitude);
    const dto = transformWeather(raw, geo);
    return json(dto);
  } catch (err) {
    error(502, { message: 'Failed to fetch weather data' });
  }
}
