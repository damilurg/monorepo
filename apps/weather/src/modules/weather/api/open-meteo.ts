import { httpGet } from '@repo/shared/api';
import type { GeoLocation, WeatherResponse } from '../model/types.js';

const GEO_URL = 'https://nominatim.openstreetmap.org';
const WEATHER_URL = 'https://api.open-meteo.com/v1';

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

export async function geocodeCity(city: string): Promise<GeoLocation> {
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

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<WeatherResponse> {
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

  return httpGet<WeatherResponse>(`${WEATHER_URL}/forecast?${params}`);
}
