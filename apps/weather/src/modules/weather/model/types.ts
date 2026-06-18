export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
}

export interface CurrentWeather {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
  is_day: number;
  time: string;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  precipitation_probability_max: number[];
}

export interface WeatherResponse {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
}

export interface WeatherData {
  city: string;
  country: string;
  current: CurrentWeather;
  daily: DailyForecast;
}

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
