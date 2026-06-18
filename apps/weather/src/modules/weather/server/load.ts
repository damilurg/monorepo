import { geocodeCity, fetchWeather } from '../api/open-meteo.js';
import type { WeatherData } from '../model/types.js';

export interface WeatherLoadResult {
  weather: WeatherData;
  city: string;
}

export async function loadWeatherData(city: string): Promise<WeatherLoadResult> {
  const location = await geocodeCity(city);
  const response = await fetchWeather(location.latitude, location.longitude);

  return {
    weather: {
      city: location.name,
      country: location.country,
      current: response.current,
      daily: response.daily,
    },
    city: location.name,
  };
}
