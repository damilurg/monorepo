import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({ fetch }) => {
  let coins: CoinData[] = [];

  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false',
    );
    if (res.ok) {
      coins = await res.json();
    }
  } catch {
    // Return empty array on failure
  }

  const totalMarketCap = coins.reduce((s, c) => s + c.market_cap, 0);
  const btc = coins.find((c) => c.id === 'bitcoin');
  const btcDominance = btc ? (btc.market_cap / totalMarketCap) * 100 : 0;

  const sorted24h = [...coins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  );
  const topGainer = sorted24h[0];
  const topLoser = sorted24h[sorted24h.length - 1];

  return { coins, totalMarketCap, btcDominance, topGainer, topLoser };
};
