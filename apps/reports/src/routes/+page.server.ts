import type { PageServerLoad } from './$types';

interface CoinData {
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

export const load: PageServerLoad = async ({ fetch }) => {
  const [cryptoRes, exchangeRes, countriesRes] = await Promise.allSettled([
    fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1',
    ),
    fetch('https://api.frankfurter.app/latest'),
    fetch(
      'https://restcountries.com/v3.1/all?fields=name,population,region,flags,capital,area',
    ),
  ]);

  const crypto: CoinData[] =
    cryptoRes.status === 'fulfilled' && cryptoRes.value.ok
      ? await cryptoRes.value.json()
      : [];

  const exchange: ExchangeRates =
    exchangeRes.status === 'fulfilled' && exchangeRes.value.ok
      ? await exchangeRes.value.json()
      : { base: 'EUR', date: '', rates: {} };

  const rawCountries: RestCountry[] =
    countriesRes.status === 'fulfilled' && countriesRes.value.ok
      ? await countriesRes.value.json()
      : [];

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
