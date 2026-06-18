import { json, error } from '@sveltejs/kit';
import { decodeVinRaw, transformVehicle } from '../api/nhtsa.js';
import { isValidVin } from '../model/types.js';
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
    const raw = await decodeVinRaw(vin);
    const dto = transformVehicle(raw, vin);
    return json(dto);
  } catch (err) {
    error(502, { message: 'Failed to decode VIN' });
  }
}
