import { decodeVinRaw, transformVehicle } from '../api/nhtsa.js';
import { isValidVin } from '../model/types.js';
import type { VehicleDTO } from '../model/types.js';

export interface CarsLoadResult {
  vehicle: VehicleDTO | null;
  vin: string;
  error: string | null;
}

export async function loadCarsData(vin: string): Promise<CarsLoadResult> {
  if (!vin) {
    return { vehicle: null, vin: '', error: null };
  }

  if (!isValidVin(vin)) {
    return {
      vehicle: null,
      vin,
      error: 'Некорректный VIN. Должен содержать 17 символов (A-Z, 0-9, без I, O, Q).',
    };
  }

  const raw = await decodeVinRaw(vin);
  const vehicle = transformVehicle(raw, vin);

  if (!vehicle.make && !vehicle.model) {
    return { vehicle: null, vin, error: 'Автомобиль не найден. Проверьте VIN.' };
  }

  return { vehicle, vin, error: null };
}
