import { describe, it, expect } from 'vitest';
import { parseVehicleInfo, isValidVin, type NHTSAVariable } from './types.js';

const mockResults: NHTSAVariable[] = [
  { Variable: 'Make', Value: 'HONDA', ValueId: '474', VariableId: 26 },
  { Variable: 'Model', Value: 'Civic', ValueId: '1861', VariableId: 28 },
  { Variable: 'Model Year', Value: '2021', ValueId: null, VariableId: 29 },
  { Variable: 'Body Class', Value: 'Sedan/Saloon', ValueId: '2', VariableId: 5 },
  { Variable: 'Engine Number of Cylinders', Value: '4', ValueId: null, VariableId: 9 },
  { Variable: 'Fuel Type - Primary', Value: 'Gasoline', ValueId: '3', VariableId: 24 },
  { Variable: 'Drive Type', Value: 'FWD/Front-Wheel Drive', ValueId: '1', VariableId: 15 },
  { Variable: 'Manufacturer Name', Value: 'HONDA MOTOR CO., LTD', ValueId: null, VariableId: 27 },
  { Variable: 'Displacement (L)', Value: '1.5', ValueId: null, VariableId: 13 },
  { Variable: 'Vehicle Type', Value: 'PASSENGER CAR', ValueId: '5', VariableId: 39 },
  { Variable: 'Plant Country', Value: 'UNITED STATES (USA)', ValueId: null, VariableId: 75 },
  { Variable: 'Transmission Style', Value: 'CVT', ValueId: null, VariableId: 37 },
  { Variable: 'Doors', Value: '4', ValueId: null, VariableId: 14 },
];

describe('parseVehicleInfo', () => {
  it('extracts make, model, year', () => {
    const info = parseVehicleInfo('1HGBH41JXMN109186', mockResults);
    expect(info.make).toBe('HONDA');
    expect(info.model).toBe('Civic');
    expect(info.year).toBe('2021');
  });

  it('sets vin from parameter', () => {
    const info = parseVehicleInfo('1HGBH41JXMN109186', mockResults);
    expect(info.vin).toBe('1HGBH41JXMN109186');
  });

  it('extracts body class', () => {
    const info = parseVehicleInfo('1HGBH41JXMN109186', mockResults);
    expect(info.bodyClass).toBe('Sedan/Saloon');
  });

  it('extracts engine cylinders and fuel type', () => {
    const info = parseVehicleInfo('1HGBH41JXMN109186', mockResults);
    expect(info.engineCylinders).toBe('4');
    expect(info.fuelType).toBe('Gasoline');
  });

  it('extracts drive type', () => {
    const info = parseVehicleInfo('1HGBH41JXMN109186', mockResults);
    expect(info.driveType).toBe('FWD/Front-Wheel Drive');
  });

  it('extracts manufacturer name', () => {
    const info = parseVehicleInfo('1HGBH41JXMN109186', mockResults);
    expect(info.manufacturer).toBe('HONDA MOTOR CO., LTD');
  });

  it('returns empty string for missing variables', () => {
    const sparse: NHTSAVariable[] = [
      { Variable: 'Make', Value: 'FORD', ValueId: null, VariableId: 26 },
    ];
    const info = parseVehicleInfo('ABCDEFGH12345678X', sparse);
    expect(info.model).toBe('');
    expect(info.year).toBe('');
    expect(info.bodyClass).toBe('');
  });

  it('handles null Value as empty string', () => {
    const withNull: NHTSAVariable[] = [
      { Variable: 'Make', Value: null, ValueId: null, VariableId: 26 },
    ];
    const info = parseVehicleInfo('ABCDEFGH12345678X', withNull);
    expect(info.make).toBe('');
  });
});

describe('isValidVin', () => {
  it('returns true for a valid 17-char VIN', () => {
    expect(isValidVin('1HGBH41JXMN109186')).toBe(true);
    expect(isValidVin('2T1BURHE0JC043821')).toBe(true);
  });

  it('returns false for VINs shorter than 17 chars', () => {
    expect(isValidVin('1HGBH41JXMN10918')).toBe(false);
  });

  it('returns false for VINs longer than 17 chars', () => {
    expect(isValidVin('1HGBH41JXMN1091860')).toBe(false);
  });

  it('returns false for VINs containing invalid characters I, O, Q', () => {
    expect(isValidVin('1HGBH41JXON109186')).toBe(false); // O
    expect(isValidVin('1HGBH41JXIN109186')).toBe(false); // I
    expect(isValidVin('1HGBH41JXQN109186')).toBe(false); // Q
  });

  it('returns false for empty string', () => {
    expect(isValidVin('')).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(isValidVin('1hgbh41jxmn109186')).toBe(true);
  });
});
