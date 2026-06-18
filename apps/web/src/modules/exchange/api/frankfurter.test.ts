import { describe, it, expect } from 'vitest';
import { transformExchangeRates, type FrankfurterRawResponse } from './frankfurter.js';

const mockRaw: FrankfurterRawResponse = {
  amount: 1,
  base: 'EUR',
  date: '2024-01-15',
  rates: {
    USD: 1.095,
    GBP: 0.857,
    JPY: 160.23,
    CHF: 0.943,
    CAD: 1.471,
    AUD: 1.651,
    CNY: 7.821,
    RUB: 99.45,
    PLN: 4.34,
    CZK: 25.1,
  },
};

describe('transformExchangeRates', () => {
  it('preserves base and date', () => {
    const dto = transformExchangeRates(mockRaw);
    expect(dto.base).toBe('EUR');
    expect(dto.date).toBe('2024-01-15');
  });

  it('counts rates correctly', () => {
    const dto = transformExchangeRates(mockRaw);
    expect(dto.rateCount).toBe(10);
  });

  it('includes all rates', () => {
    const dto = transformExchangeRates(mockRaw);
    expect(dto.rates['USD']).toBe(1.095);
    expect(dto.rates['GBP']).toBe(0.857);
    expect(dto.rates['JPY']).toBe(160.23);
  });

  it('provides topRates array with up to 8 entries', () => {
    const dto = transformExchangeRates(mockRaw);
    expect(dto.topRates).toBeInstanceOf(Array);
    expect(dto.topRates.length).toBeGreaterThan(0);
    expect(dto.topRates.length).toBeLessThanOrEqual(8);
  });

  it('topRates entries have currency and rate properties', () => {
    const dto = transformExchangeRates(mockRaw);
    expect(dto.topRates[0]).toHaveProperty('currency');
    expect(dto.topRates[0]).toHaveProperty('rate');
  });

  it('topRates are sorted descending by rate', () => {
    const dto = transformExchangeRates(mockRaw);
    for (let i = 0; i < dto.topRates.length - 1; i++) {
      expect(dto.topRates[i].rate).toBeGreaterThanOrEqual(dto.topRates[i + 1].rate);
    }
  });

  it('topRates highest rate entry is RUB (99.45)', () => {
    const dto = transformExchangeRates(mockRaw);
    expect(dto.topRates[0].currency).toBe('RUB');
    expect(dto.topRates[0].rate).toBe(99.45);
  });

  it('includes updatedAt ISO timestamp', () => {
    const dto = transformExchangeRates(mockRaw);
    expect(dto.updatedAt).toBeTruthy();
    expect(new Date(dto.updatedAt).getTime()).toBeGreaterThan(0);
  });

  it('handles single-rate response', () => {
    const single: FrankfurterRawResponse = { amount: 1, base: 'USD', date: '2024-01-15', rates: { EUR: 0.91 } };
    const dto = transformExchangeRates(single);
    expect(dto.rateCount).toBe(1);
    expect(dto.topRates).toHaveLength(1);
    expect(dto.topRates[0].currency).toBe('EUR');
  });
});
