import { httpGet } from '@repo/shared/api';
import type { LocationDTO } from '../model/types.js';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export interface NominatimRawResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    country_code?: string;
  };
}

export function transformLocation(raw: NominatimRawResult): LocationDTO {
  const city =
    raw.address?.city ??
    raw.address?.town ??
    raw.address?.village ??
    null;

  return {
    displayName: raw.display_name,
    coordinates: {
      lat: parseFloat(raw.lat),
      lon: parseFloat(raw.lon),
    },
    city,
    country: raw.address?.country ?? null,
  };
}

export async function geocodeAddress(query: string): Promise<LocationDTO> {
  const results = await httpGet<NominatimRawResult[]>(
    `${NOMINATIM_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`,
    {
      headers: {
        'User-Agent': 'AutomotivePortal/1.0',
      },
    }
  );

  if (!results || results.length === 0) {
    throw new Error(`Location not found: ${query}`);
  }

  return transformLocation(results[0]);
}
