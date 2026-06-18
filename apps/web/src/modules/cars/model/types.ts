export type {
  NHTSARawResponse,
  VehicleDTO,
} from '../api/nhtsa.js';

// Legacy aliases kept for backward compatibility
export type NHTSAVariable = {
  Value: string | null;
  ValueId: string | null;
  Variable: string;
  VariableId: number;
};

export type NHTSADecodeResponse = import('../api/nhtsa.js').NHTSARawResponse;

// VehicleInfo kept as a legacy alias for VehicleDTO
export type VehicleInfo = import('../api/nhtsa.js').VehicleDTO;

/** @deprecated Use transformVehicle from api/nhtsa.js instead */
export function parseVehicleInfo(
  vin: string,
  results: Array<{ Variable: string; Value: string | null; ValueId: string | null; VariableId: number }>
): VehicleInfo {
  const get = (name: string) => results.find((r) => r.Variable === name)?.Value ?? '';
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

export function isValidVin(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
}
