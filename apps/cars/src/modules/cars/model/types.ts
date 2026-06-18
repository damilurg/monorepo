export interface NHTSAVariable {
  Value: string | null;
  ValueId: string;
  Variable: string;
  VariableId: number;
}

export interface NHTSADecodeResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: NHTSAVariable[];
}

export interface VehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: string;
  engineDisplacement: string;
  engineCylinders: string;
  fuelType: string;
  vehicleType: string;
  bodyClass: string;
  manufacturer: string;
  plantCountry: string;
  driveType: string;
  transmissionStyle: string;
  doors: string;
}

export function parseVehicleInfo(vin: string, results: NHTSAVariable[]): VehicleInfo {
  const get = (name: string) =>
    results.find((r) => r.Variable === name)?.Value ?? '';

  return {
    vin,
    make: get('Make'),
    model: get('Model'),
    year: get('Model Year'),
    engineDisplacement: get('Displacement (L)'),
    engineCylinders: get('Engine Number of Cylinders'),
    fuelType: get('Fuel Type - Primary'),
    vehicleType: get('Vehicle Type'),
    bodyClass: get('Body Class'),
    manufacturer: get('Manufacturer Name'),
    plantCountry: get('Plant Country'),
    driveType: get('Drive Type'),
    transmissionStyle: get('Transmission Style'),
    doors: get('Doors'),
  };
}

export function isValidVin(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
}
