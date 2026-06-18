import type { PageServerLoad } from './$types';

export interface RateEntry {
  currency: string;
  rate: number;
}

export const load: PageServerLoad = async ({ fetch }) => {
  let rates: Record<string, number> = {};
  let base = 'EUR';
  let date = '';

  try {
    const res = await fetch('https://api.frankfurter.app/latest');
    if (res.ok) {
      const data = await res.json();
      rates = data.rates;
      base = data.base;
      date = data.date;
    }
  } catch {
    // Return empty on failure
  }

  const allRates: RateEntry[] = Object.entries(rates)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([currency, rate]) => ({ currency, rate: rate as number }));

  const majorCurrencies = ['USD', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY'];
  const majorRates: RateEntry[] = majorCurrencies
    .map((c) => ({ currency: c, rate: rates[c] ?? 0 }))
    .filter((r) => r.rate > 0);

  return { rates, allRates, majorRates, base, date };
};
