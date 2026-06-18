import { fetchLatestRates } from '../api/frankfurter.js';
import type { ExchangeRates } from '../model/types.js';

export interface ExchangeLoadResult {
  rates: ExchangeRates;
  base: string;
}

export async function loadExchangeData(base = 'USD'): Promise<ExchangeLoadResult> {
  const rates = await fetchLatestRates(base);
  return { rates, base };
}
