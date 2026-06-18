<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap';
  let sortKey = $state<SortKey>('market_cap_rank');
  let sortAsc = $state(true);

  const sortedCoins = $derived(
    [...data.coins].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortAsc ? diff : -diff;
    }),
  );

  function setSort(key: SortKey) {
    if (sortKey === key) {
      sortAsc = !sortAsc;
    } else {
      sortKey = key;
      sortAsc = key === 'market_cap_rank';
    }
  }

  function formatPrice(n: number): string {
    if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (n >= 1) return '$' + n.toFixed(2);
    return '$' + n.toPrecision(4);
  }

  function formatMarketCap(n: number): string {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    return '$' + n.toLocaleString();
  }

  function formatVolume(n: number): string {
    return formatMarketCap(n);
  }

  function mockSparklinePath(changePercent: number): string {
    const points = [0, 1, 2, 3, 4].map((i) => {
      const variance = Math.sin(i * 1.7 + changePercent) * 0.3 + (i * changePercent) / 20;
      return Math.max(2, Math.min(28, 15 + variance * 5));
    });
    return `M 0 ${points[0]} L 15 ${points[1]} L 30 ${points[2]} L 45 ${points[3]} L 60 ${points[4]}`;
  }

  const maxMarketCap = $derived(
    data.coins.length > 0 ? Math.max(...data.coins.slice(0, 10).map((c) => c.market_cap)) : 1,
  );

  function sortArrow(key: SortKey): string {
    if (sortKey !== key) return '↕';
    return sortAsc ? '↑' : '↓';
  }
</script>

<div class="space-y-6 pb-16 md:pb-0">
  <!-- Stats bar -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Market Cap</div>
      <div class="text-xl font-bold text-white">{formatMarketCap(data.totalMarketCap)}</div>
    </div>
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">BTC Dominance</div>
      <div class="text-xl font-bold text-white">{data.btcDominance.toFixed(1)}%</div>
    </div>
    {#if data.topGainer}
      <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
        <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Top Gainer (24h)</div>
        <div class="text-xl font-bold text-emerald-400">
          {data.topGainer.symbol.toUpperCase()}
        </div>
        <div class="text-xs text-emerald-400 mt-1">
          +{data.topGainer.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>
    {/if}
    {#if data.topLoser}
      <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
        <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Top Loser (24h)</div>
        <div class="text-xl font-bold text-red-400">
          {data.topLoser.symbol.toUpperCase()}
        </div>
        <div class="text-xs text-red-400 mt-1">
          {data.topLoser.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>
    {/if}
  </div>

  <!-- Market cap chart for top 10 -->
  <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800">
    <h2 class="text-sm font-semibold text-slate-300 mb-4">Market Cap Distribution (Top 10)</h2>
    <div class="space-y-2">
      {#each data.coins.slice(0, 10) as coin}
        <div class="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} class="w-5 h-5 rounded-full flex-shrink-0" />
          <span class="font-mono text-xs text-slate-400 w-10 shrink-0"
            >{coin.symbol.toUpperCase()}</span
          >
          <div class="flex-1 bg-slate-800 rounded h-5 relative overflow-hidden">
            <div
              class="h-5 rounded bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all"
              style="width:{((coin.market_cap / maxMarketCap) * 100).toFixed(1)}%"
            ></div>
            <span
              class="absolute inset-y-0 right-3 flex items-center text-xs font-mono text-white/80"
            >
              {formatMarketCap(coin.market_cap)}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Full table -->
  <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
    <div class="px-5 py-4 border-b border-slate-800">
      <h2 class="text-sm font-semibold text-slate-300">All Coins</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
            <th class="text-left px-5 py-3">
              <button
                onclick={() => setSort('market_cap_rank')}
                class="hover:text-slate-300 transition-colors"
              >
                # {sortArrow('market_cap_rank')}
              </button>
            </th>
            <th class="text-left px-5 py-3">Coin</th>
            <th class="text-right px-5 py-3">
              <button
                onclick={() => setSort('current_price')}
                class="hover:text-slate-300 transition-colors"
              >
                Price {sortArrow('current_price')}
              </button>
            </th>
            <th class="text-right px-5 py-3">
              <button
                onclick={() => setSort('price_change_percentage_24h')}
                class="hover:text-slate-300 transition-colors"
              >
                24h {sortArrow('price_change_percentage_24h')}
              </button>
            </th>
            <th class="text-right px-5 py-3 hidden lg:table-cell">
              <button
                onclick={() => setSort('market_cap')}
                class="hover:text-slate-300 transition-colors"
              >
                Market Cap {sortArrow('market_cap')}
              </button>
            </th>
            <th class="text-right px-5 py-3 hidden xl:table-cell">Volume (24h)</th>
            <th class="text-center px-5 py-3 hidden md:table-cell">7d Trend</th>
          </tr>
        </thead>
        <tbody>
          {#each sortedCoins as coin, i}
            <tr
              class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors {i % 2 === 0
                ? ''
                : 'bg-slate-800/10'}"
            >
              <td class="px-5 py-3 text-slate-500 font-mono">{coin.market_cap_rank}</td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} class="w-7 h-7 rounded-full" />
                  <div>
                    <div class="font-medium text-slate-200">{coin.name}</div>
                    <div class="text-xs text-slate-500 uppercase">{coin.symbol}</div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3 text-right font-mono text-slate-200">
                {formatPrice(coin.current_price)}
              </td>
              <td
                class="px-5 py-3 text-right font-mono {coin.price_change_percentage_24h >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'}"
              >
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(
                  2,
                )}%
              </td>
              <td class="px-5 py-3 text-right font-mono text-slate-300 hidden lg:table-cell">
                {formatMarketCap(coin.market_cap)}
              </td>
              <td class="px-5 py-3 text-right font-mono text-slate-400 hidden xl:table-cell">
                {formatVolume(coin.total_volume)}
              </td>
              <td class="px-5 py-3 text-center hidden md:table-cell">
                <svg width="60" height="30" viewBox="0 0 60 30" class="inline-block">
                  <path
                    d={mockSparklinePath(coin.price_change_percentage_24h)}
                    fill="none"
                    stroke={coin.price_change_percentage_24h >= 0 ? '#34d399' : '#f87171'}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
