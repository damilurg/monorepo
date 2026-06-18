import { httpGet } from '@repo/shared/api';

const BASE_URL = 'https://api.frankfurter.dev/v1';

// ============================================================
// 1. RAW API TYPES — exact shape returned by the external API
// ============================================================

export interface FrankfurterRawResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

// ============================================================
// 2. INTERNAL DTO — simplified, client-safe shape
// ============================================================

export interface ExchangeRatesDTO {
  base: string;
  date: string;
  rates: Record<string, number>;
  rateCount: number;
  topRates: Array<{ currency: string; rate: number }>;
  updatedAt: string;
}

// ============================================================
// 3. TRANSFORM — pure function, easy to unit test
// ============================================================

export function transformExchangeRates(raw: FrankfurterRawResponse): ExchangeRatesDTO {
  const entries = Object.entries(raw.rates).sort((a, b) => b[1] - a[1]);
  const topRates = entries.slice(0, 8).map(([currency, rate]) => ({ currency, rate }));

  return {
    base: raw.base,
    date: raw.date,
    rates: raw.rates,
    rateCount: entries.length,
    topRates,
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================
// 4. FETCH FUNCTIONS
// ============================================================

export async function fetchLatestRatesRaw(base = 'USD'): Promise<FrankfurterRawResponse> {
  return httpGet<FrankfurterRawResponse>(`${BASE_URL}/latest?base=${base}`);
}

/** @deprecated Use fetchLatestRatesRaw + transformExchangeRates instead */
export async function fetchLatestRates(base = 'USD'): Promise<FrankfurterRawResponse> {
  return fetchLatestRatesRaw(base);
}

export async function fetchCurrencies(): Promise<Record<string, string>> {
  return httpGet<Record<string, string>>(`${BASE_URL}/currencies`);
}
