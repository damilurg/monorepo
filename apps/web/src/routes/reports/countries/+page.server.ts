import type { PageServerLoad } from './$types';

interface RawCountry {
  name: { common: string; official: string };
  population: number;
  region: string;
  subregion: string;
  flags: { emoji: string; png: string };
  capital?: string[];
  area: number;
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
}

export interface CountryCard {
  name: string;
  officialName: string;
  population: number;
  region: string;
  subregion: string;
  flag: string;
  capital: string;
  area: number;
  currencies: string[];
  languages: string[];
}

export const load: PageServerLoad = async ({ fetch }) => {
  let countries: CountryCard[] = [];
  let worldPopulation = 0;

  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,population,region,subregion,flags,capital,area,currencies,languages',
    );
    if (res.ok) {
      const raw: RawCountry[] = await res.json();
      worldPopulation = raw.reduce((s, c) => s + c.population, 0);
      countries = raw
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
        .map((c) => ({
          name: c.name.common,
          officialName: c.name.official,
          population: c.population,
          region: c.region,
          subregion: c.subregion,
          flag: c.flags.emoji,
          capital: c.capital?.[0] ?? 'N/A',
          area: c.area,
          currencies: c.currencies
            ? Object.values(c.currencies).map((cur) => `${cur.name} (${cur.symbol})`)
            : [],
          languages: c.languages ? Object.values(c.languages) : [],
        }));
    }
  } catch {
    // Return empty on failure
  }

  const largest = [...countries].sort((a, b) => b.population - a.population)[0];
  const smallest = [...countries]
    .filter((c) => c.population > 0)
    .sort((a, b) => a.population - b.population)[0];

  const regions = [...new Set(countries.map((c) => c.region).filter(Boolean))].sort();

  return { countries, worldPopulation, largest, smallest, regions };
};
