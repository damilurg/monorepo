import { decodeVin } from '../api/nhtsa.js';
import { parseVehicleInfo, isValidVin } from '../model/types.js';
import type { VehicleInfo } from '../model/types.js';

export interface CarsLoadResult {
  vehicle: VehicleInfo | null;
  vin: string;
  error: string | null;
}

export async function loadCarsData(vin: string): Promise<CarsLoadResult> {
  if (!vin) {
    return { vehicle: null, vin: '', error: null };
  }

  if (!isValidVin(vin)) {
    return { vehicle: null, vin, error: 'Некорректный VIN. Должен содержать 17 символов (A-Z, 0-9, без I, O, Q).' };
  }

  const response = await decodeVin(vin);
  const vehicle = parseVehicleInfo(vin, response.Results);

  if (!vehicle.make && !vehicle.model) {
    return { vehicle: null, vin, error: 'Автомобиль не найден. Проверьте VIN.' };
  }

  return { vehicle, vin, error: null };
}
