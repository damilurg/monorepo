export type {
  OpenMeteoRawResponse,
  GeocodingResult,
  WeatherDTO,
} from '../api/open-meteo.js';

export { WEATHER_CODES } from '../api/open-meteo.js';

// Legacy aliases kept for backward compatibility
export type GeoLocation = import('../api/open-meteo.js').GeocodingResult;

export function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '🌤';
  if (code <= 48) return '🌫';
  if (code <= 67) return '🌧';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦';
  if (code <= 99) return '⛈';
  return '🌈';
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Ясно';
  if (code <= 3) return 'Переменная облачность';
  if (code <= 48) return 'Туман';
  if (code <= 55) return 'Морось';
  if (code <= 67) return 'Дождь';
  if (code <= 77) return 'Снег';
  if (code <= 82) return 'Ливень';
  if (code <= 99) return 'Гроза';
  return 'Переменная погода';
}
