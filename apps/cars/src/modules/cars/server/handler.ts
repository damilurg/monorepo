import { json, error } from '@sveltejs/kit';
import { decodeVin } from '../api/nhtsa.js';
import { parseVehicleInfo, isValidVin } from '../model/types.js';
import type { RequestEvent } from '@sveltejs/kit';

export async function handleCarsGet(event: RequestEvent): Promise<Response> {
  if (!event.locals.featureEnabled) {
    error(403, { message: 'Cars module is disabled' });
  }

  const vin = event.url.searchParams.get('vin');

  if (!vin) {
    error(400, { message: 'VIN parameter is required' });
  }

  if (!isValidVin(vin)) {
    error(400, { message: 'Invalid VIN format' });
  }

  try {
    const response = await decodeVin(vin);
    const vehicle = parseVehicleInfo(vin, response.Results);
    return json(vehicle);
  } catch (err) {
    error(502, { message: 'Failed to decode VIN' });
  }
}
