import type { PageServerLoad } from './$types';

// CoinCap v2 — free, no API key required.
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
  total_volume: number;
  image: string;
  market_cap_rank: number;
}

function toCoinData(a: CoinCapAsset): CoinData {
  return {
    id: a.id,
    symbol: a.symbol.toLowerCase(),
    name: a.name,
    current_price: parseFloat(a.priceUsd) || 0,
    price_change_percentage_24h: parseFloat(a.changePercent24Hr) || 0,
    market_cap: parseFloat(a.marketCapUsd) || 0,
    total_volume: parseFloat(a.volumeUsd24Hr) || 0,
    image: `https://assets.coincap.io/assets/icons/${a.symbol.toLowerCase()}@2x.png`,
    market_cap_rank: parseInt(a.rank, 10) || 0,
  };
}

export const load: PageServerLoad = async ({ fetch }) => {
  let coins: CoinData[] = [];

  try {
    const res = await fetch('https://api.coincap.io/v2/assets?limit=20');
    if (res.ok) {
      const json = (await res.json()) as { data: CoinCapAsset[] };
      coins = (json.data ?? []).map(toCoinData);
    }
  } catch {
    // Return empty array on failure
  }

  const totalMarketCap = coins.reduce((s, c) => s + c.market_cap, 0);
  const btc = coins.find((c) => c.id === 'bitcoin');
  const btcDominance = btc && totalMarketCap > 0 ? (btc.market_cap / totalMarketCap) * 100 : 0;

  const sorted24h = [...coins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  );
  const topGainer = sorted24h[0] ?? null;
  const topLoser = sorted24h[sorted24h.length - 1] ?? null;

  return { coins, totalMarketCap, btcDominance, topGainer, topLoser };
};
