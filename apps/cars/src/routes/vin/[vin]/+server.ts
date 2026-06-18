import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { decodeVin } from '$modules/cars/api/nhtsa.js';
import { parseVehicleInfo, isValidVin } from '$modules/cars/model/types.js';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Cars module is disabled' });
  }

  const vin = params.vin.toUpperCase();

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
};
