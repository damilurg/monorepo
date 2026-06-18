import { fetchLatestRatesRaw, transformExchangeRates } from '../api/frankfurter.js';
import type { ExchangeRatesDTO } from '../model/types.js';

export interface ExchangeLoadResult {
  rates: ExchangeRatesDTO;
  base: string;
}

export async function loadExchangeData(base = 'USD'): Promise<ExchangeLoadResult> {
  const raw = await fetchLatestRatesRaw(base);
  const rates = transformExchangeRates(raw);
  return { rates, base };
}
