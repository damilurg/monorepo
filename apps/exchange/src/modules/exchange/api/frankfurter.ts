import { httpGet } from '@repo/shared/api';
import type { ExchangeRates } from '../model/types.js';

const BASE_URL = 'https://api.frankfurter.dev/v1';

export async function fetchLatestRates(base = 'USD'): Promise<ExchangeRates> {
  return httpGet<ExchangeRates>(`${BASE_URL}/latest?base=${base}`);
}

export async function fetchCurrencies(): Promise<Record<string, string>> {
  return httpGet<Record<string, string>>(`${BASE_URL}/currencies`);
}
