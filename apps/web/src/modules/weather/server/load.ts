import { geocodeCity, fetchWeatherRaw, transformWeather } from '../api/open-meteo.js';
import type { WeatherDTO, GeocodingResult } from '../model/types.js';

export interface WeatherLoadResult {
  weather: WeatherDTO;
  city: string;
}

export async function loadWeatherData(city: string): Promise<WeatherLoadResult> {
  const geo: GeocodingResult = await geocodeCity(city);
  const raw = await fetchWeatherRaw(geo.latitude, geo.longitude);
  const weather = transformWeather(raw, geo);

  return {
    weather,
    city: geo.name,
  };
}
