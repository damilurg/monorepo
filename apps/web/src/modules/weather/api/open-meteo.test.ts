import { describe, it, expect } from 'vitest';
import {
  transformWeather,
  WEATHER_CODES,
  type OpenMeteoRawResponse,
  type GeocodingResult,
} from './open-meteo.js';

const mockRaw: OpenMeteoRawResponse = {
  latitude: 48.85,
  longitude: 2.35,
  generationtime_ms: 1.2,
  utc_offset_seconds: 3600,
  timezone: 'Europe/Paris',
  timezone_abbreviation: 'CET',
  elevation: 35,
  current_units: {},
  current: {
    time: '2024-01-15T12:00',
    interval: 900,
    temperature_2m: 8.4,
    relative_humidity_2m: 72,
    apparent_temperature: 5.1,
    weather_code: 3,
    wind_speed_10m: 15.2,
    is_day: 1,
  },
  hourly_units: {},
  hourly: {
    time: [],
    temperature_2m: [],
    weather_code: [],
    precipitation_probability: [],
  },
  daily_units: {},
  daily: {
    time: ['2024-01-15', '2024-01-16', '2024-01-17'],
    temperature_2m_max: [10, 12, 9],
    temperature_2m_min: [4, 5, 3],
    weather_code: [3, 61, 0],
    precipitation_probability_max: [0, 55, 10],
  },
};

const mockGeo: GeocodingResult = {
  name: 'Paris',
  country: 'France',
  country_code: 'FR',
  latitude: 48.85,
  longitude: 2.35,
};

describe('transformWeather', () => {
  it('maps current temperature correctly (not rounded in transform)', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.current.temperature).toBe(8.4);
    expect(dto.current.feelsLike).toBe(5.1);
    expect(dto.current.humidity).toBe(72);
  });

  it('sets city and country from geocoding result', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.city).toBe('Paris');
    expect(dto.country).toBe('France');
  });

  it('maps coordinates from raw response', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.coordinates.lat).toBe(48.85);
    expect(dto.coordinates.lon).toBe(2.35);
  });

  it('maps forecast days', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.forecast).toHaveLength(3);
    expect(dto.forecast[0].tempMax).toBe(10);
    expect(dto.forecast[0].tempMin).toBe(4);
    expect(dto.forecast[1].precipitation).toBe(55);
  });

  it('maps forecast condition codes', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.forecast[0].conditionCode).toBe(3);
    expect(dto.forecast[1].conditionCode).toBe(61);
    expect(dto.forecast[2].conditionCode).toBe(0);
  });

  it('maps forecast conditions to strings', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.forecast[0].condition).toBe('Overcast');
    expect(dto.forecast[1].condition).toBe('Slight rain');
    expect(dto.forecast[2].condition).toBe('Clear sky');
  });

  it('maps current weather condition', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.current.condition).toBe('Overcast');
    expect(dto.current.conditionCode).toBe(3);
  });

  it('maps is_day flag', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.current.isDay).toBe(true);

    const nightRaw = { ...mockRaw, current: { ...mockRaw.current, is_day: 0 } };
    const nightDto = transformWeather(nightRaw, mockGeo);
    expect(nightDto.current.isDay).toBe(false);
  });

  it('includes updatedAt timestamp from current.time', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.updatedAt).toBe('2024-01-15T12:00');
  });

  it('maps wind speed', () => {
    const dto = transformWeather(mockRaw, mockGeo);
    expect(dto.current.windSpeed).toBe(15.2);
  });
});

describe('WEATHER_CODES map', () => {
  it('has Clear sky for code 0', () => {
    expect(WEATHER_CODES[0]).toBe('Clear sky');
  });

  it('has Overcast for code 3', () => {
    expect(WEATHER_CODES[3]).toBe('Overcast');
  });

  it('has Rain entries for codes 61-67', () => {
    expect(WEATHER_CODES[61]).toContain('rain');
    expect(WEATHER_CODES[63]).toContain('rain');
  });

  it('has Thunderstorm for code 95', () => {
    expect(WEATHER_CODES[95]).toBe('Thunderstorm');
  });

  it('does not have an entry for unknown code 999', () => {
    expect(WEATHER_CODES[999]).toBeUndefined();
  });
});
