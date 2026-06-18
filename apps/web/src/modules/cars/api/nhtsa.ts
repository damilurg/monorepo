import { httpGet } from '@repo/shared/api';

const BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

// ============================================================
// 1. RAW API TYPES — exact shape returned by the external API
// ============================================================

export interface NHTSARawResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: Array<{
    Variable: string;
    Value: string | null;
    ValueId: string | null;
    VariableId: number;
  }>;
}

// ============================================================
// 2. INTERNAL DTO — simplified, client-safe shape
// ============================================================

export interface VehicleDTO {
  vin: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  bodyClass: string;
  engineCylinders: string;
  engineDisplacementL: string;
  fuelTypePrimary: string;
  driveType: string;
  transmissionStyle: string;
  manufacturerName: string;
  plantCountry: string;
  vehicleType: string;
  errorCode: string;
  errorText: string;
  isValid: boolean;
}

// ============================================================
// 3. TRANSFORM — pure function, easy to unit test
// ============================================================

export function transformVehicle(raw: NHTSARawResponse, vin: string): VehicleDTO {
  const get = (name: string): string =>
    raw.Results.find((r) => r.Variable === name)?.Value ?? '';

  const make = get('Make');
  const model = get('Model');
  const errorCode = get('Error Code');

  return {
    vin,
    make,
    model,
    year: get('Model Year'),
    trim: get('Trim'),
    bodyClass: get('Body Class'),
    engineCylinders: get('Engine Number of Cylinders'),
    engineDisplacementL: get('Displacement (L)'),
    fuelTypePrimary: get('Fuel Type - Primary'),
    driveType: get('Drive Type'),
    transmissionStyle: get('Transmission Style'),
    manufacturerName: get('Manufacturer Name'),
    plantCountry: get('Plant Country'),
    vehicleType: get('Vehicle Type'),
    errorCode,
    errorText: get('Error Text'),
    isValid: !!(make && model) && errorCode === '0',
  };
}

// ============================================================
// 4. FETCH FUNCTIONS
// ============================================================

export async function decodeVinRaw(vin: string): Promise<NHTSARawResponse> {
  return httpGet<NHTSARawResponse>(
    `${BASE_URL}/vehicles/decodevin/${vin.toUpperCase()}?format=json`
  );
}

/** @deprecated Use decodeVinRaw + transformVehicle instead */
export async function decodeVin(vin: string): Promise<NHTSARawResponse> {
  return decodeVinRaw(vin);
}
