import type { PageServerLoad } from './$types';

// CoinCap v2 — free, no API key required.
// https://docs.coincap.io/
interface CoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
}

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

interface RestCountry {
  name: { common: string };
  population: number;
  region: string;
  flags: { emoji: string };
  capital?: string[];
  area: number;
}

export interface CountryStat {
  name: string;
  population: number;
  region: string;
  flag: string;
  capital: string;
  area: number;
}

export interface TopRate {
  currency: string;
  rate: number;
}

export interface RegionStat {
  region: string;
  population: number;
}

function coinCapToCoinData(a: CoinCapAsset): CoinData {
  return {
    id: a.id,
    symbol: a.symbol.toLowerCase(),
    name: a.name,
    current_price: parseFloat(a.priceUsd) || 0,
    price_change_percentage_24h: parseFloat(a.changePercent24Hr) || 0,
    market_cap: parseFloat(a.marketCapUsd) || 0,
    // CoinCap doesn't provide logo URLs; use a generic crypto icon service
    image: `https://assets.coincap.io/assets/icons/${a.symbol.toLowerCase()}@2x.png`,
  };
}

const TIMEOUT_MS = 8_000;

export const load: PageServerLoad = async ({ fetch }) => {
  const [cryptoRes, exchangeRes, countriesRes] = await Promise.allSettled([
    fetch('https://api.coincap.io/v2/assets?limit=8', { signal: AbortSignal.timeout(TIMEOUT_MS) }),
    fetch('https://api.frankfurter.app/latest', { signal: AbortSignal.timeout(TIMEOUT_MS) }),
    fetch('https://restcountries.com/v3.1/all?fields=name,population,region,flags,capital,area', { signal: AbortSignal.timeout(TIMEOUT_MS) }),
  ]);

  let crypto: CoinData[] = [];
  if (cryptoRes.status === 'fulfilled' && cryptoRes.value.ok) {
    try {
      // CoinCap wraps data in { data: [...] }
      const json = (await cryptoRes.value.json()) as { data: CoinCapAsset[] };
      crypto = (json.data ?? []).map(coinCapToCoinData);
    } catch {
      // leave as []
    }
  }

  const exchangeJson =
    exchangeRes.status === 'fulfilled' && exchangeRes.value.ok
      ? await exchangeRes.value.json()
      : null;
  const exchange: ExchangeRates =
    exchangeJson && typeof exchangeJson === 'object' && 'rates' in exchangeJson
      ? (exchangeJson as ExchangeRates)
      : { base: 'EUR', date: '', rates: {} };

  const rawCountriesJson =
    countriesRes.status === 'fulfilled' && countriesRes.value.ok
      ? await countriesRes.value.json()
      : [];
  // API may return an error object instead of an array on failures/rate-limits
  const rawCountries: RestCountry[] = Array.isArray(rawCountriesJson) ? rawCountriesJson : [];

  const countries: CountryStat[] = rawCountries
    .sort((a, b) => b.population - a.population)
    .slice(0, 15)
    .map((c) => ({
      name: c.name.common,
      population: c.population,
      region: c.region,
      flag: c.flags.emoji,
      capital: c.capital?.[0] ?? 'N/A',
      area: c.area,
    }));

  const worldPopulation = rawCountries.reduce((s, c) => s + c.population, 0);
  const totalCountries = rawCountries.length;

  const topRates: TopRate[] = Object.entries(exchange.rates)
    .filter(([k]) => ['USD', 'GBP', 'JPY', 'CHF', 'CNY', 'AED', 'RUB'].includes(k))
    .map(([currency, rate]) => ({ currency, rate: rate as number }));

  // Aggregate population by region
  const regionMap = rawCountries.reduce<Record<string, number>>((acc, c) => {
    const region = c.region || 'Other';
    acc[region] = (acc[region] ?? 0) + c.population;
    return acc;
  }, {});

  const byRegion: RegionStat[] = Object.entries(regionMap)
    .sort(([, a], [, b]) => b - a)
    .map(([region, population]) => ({ region, population }));

  return {
    crypto,
    exchange,
    countries,
    topRates,
    worldPopulation,
    totalCountries,
    byRegion,
  };
};
