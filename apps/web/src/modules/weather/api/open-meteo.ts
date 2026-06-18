import { httpGet } from '@repo/shared/api';

const GEO_URL = 'https://nominatim.openstreetmap.org';
const WEATHER_URL = 'https://api.open-meteo.com/v1';

// ============================================================
// 1. RAW API TYPES — exact shape returned by the external API
// ============================================================

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    country?: string;
    country_code?: string;
    city?: string;
    town?: string;
    village?: string;
  };
}

export interface OpenMeteoRawResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly_units: Record<string, string>;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
  };
  daily_units: Record<string, string>;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
}

/** Geocoding result used as a parameter to transformWeather */
export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
}

// ============================================================
// 2. INTERNAL DTO — simplified, client-safe shape
// ============================================================

export interface WeatherDTO {
  city: string;
  country: string;
  coordinates: { lat: number; lon: number };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    condition: string;
    conditionCode: number;
    isDay: boolean;
  };
  forecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    condition: string;
    conditionCode: number;
  }>;
  updatedAt: string;
}

// ============================================================
// 3. WEATHER CODE MAP
// ============================================================

export const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

function weatherCodeToCondition(code: number): string {
  return WEATHER_CODES[code] ?? 'Unknown';
}

// ============================================================
// 4. TRANSFORM — pure function, easy to unit test
// ============================================================

export function transformWeather(
  raw: OpenMeteoRawResponse,
  geo: GeocodingResult
): WeatherDTO {
  const forecast = raw.daily.time.map((date, i) => ({
    date,
    tempMax: raw.daily.temperature_2m_max[i] ?? 0,
    tempMin: raw.daily.temperature_2m_min[i] ?? 0,
    precipitation: raw.daily.precipitation_probability_max[i] ?? 0,
    conditionCode: raw.daily.weather_code[i] ?? 0,
    condition: weatherCodeToCondition(raw.daily.weather_code[i] ?? 0),
  }));

  return {
    city: geo.name,
    country: geo.country,
    coordinates: { lat: raw.latitude, lon: raw.longitude },
    current: {
      temperature: raw.current.temperature_2m,
      feelsLike: raw.current.apparent_temperature,
      humidity: raw.current.relative_humidity_2m,
      windSpeed: raw.current.wind_speed_10m,
      precipitation: 0,
      conditionCode: raw.current.weather_code,
      condition: weatherCodeToCondition(raw.current.weather_code),
      isDay: raw.current.is_day === 1,
    },
    forecast,
    updatedAt: raw.current.time,
  };
}

// ============================================================
// 5. FETCH FUNCTIONS
// ============================================================

export async function geocodeCity(city: string): Promise<GeocodingResult> {
  const results = await httpGet<NominatimResult[]>(
    `${GEO_URL}/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=1`,
    {
      headers: {
        'User-Agent': 'AutomotivePortal/1.0',
      },
    }
  );

  if (!results || results.length === 0) {
    throw new Error(`City not found: ${city}`);
  }

  const r = results[0];
  const name =
    r.address?.city ??
    r.address?.town ??
    r.address?.village ??
    city;

  return {
    name,
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
    country: r.address?.country ?? '',
    country_code: r.address?.country_code?.toUpperCase() ?? '',
  };
}

export async function fetchWeatherRaw(
  lat: number,
  lon: number
): Promise<OpenMeteoRawResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'wind_speed_10m',
      'weather_code',
      'is_day',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weather_code',
      'precipitation_probability_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  return httpGet<OpenMeteoRawResponse>(`${WEATHER_URL}/forecast?${params}`);
}

/** @deprecated Use fetchWeatherRaw + transformWeather instead */
export async function fetchWeather(lat: number, lon: number): Promise<OpenMeteoRawResponse> {
  return fetchWeatherRaw(lat, lon);
}
