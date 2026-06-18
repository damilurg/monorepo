import type { MapsPageDTO, Coordinates } from '../model/types.js';

export function buildMapsPageData(
  lat: number,
  lon: number,
  locationName?: string
): MapsPageDTO {
  const center: Coordinates = { lat, lon };

  return {
    center,
    zoom: 12,
    locationName: locationName ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
  };
}
