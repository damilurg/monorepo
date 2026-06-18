<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  function formatPopulation(n: number): string {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return n.toString();
  }

  function formatPrice(n: number): string {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatMarketCap(n: number): string {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    return '$' + n.toLocaleString();
  }

  const bitcoin = $derived(data.crypto.find((c) => c.id === 'bitcoin'));
  const usdRate = $derived(data.topRates.find((r) => r.currency === 'USD'));
</script>

<div class="space-y-6 pb-16 md:pb-0">
  <!-- Stat cards row -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">World Population</div>
      <div class="text-2xl font-bold text-white">{formatPopulation(data.worldPopulation)}</div>
      <div class="text-xs text-slate-400 mt-1">across {data.totalCountries} countries</div>
    </div>
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Countries</div>
      <div class="text-2xl font-bold text-white">{data.totalCountries}</div>
      <div class="text-xs text-slate-400 mt-1">recognized nations</div>
    </div>
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Bitcoin Price</div>
      <div class="text-2xl font-bold text-white">
        {bitcoin ? formatPrice(bitcoin.current_price) : 'N/A'}
      </div>
      {#if bitcoin}
        <div
          class="text-xs mt-1 {bitcoin.price_change_percentage_24h >= 0
            ? 'text-emerald-400'
            : 'text-red-400'}"
        >
          {bitcoin.price_change_percentage_24h >= 0 ? '↑' : '↓'}
          {Math.abs(bitcoin.price_change_percentage_24h).toFixed(2)}% (24h)
        </div>
      {/if}
    </div>
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">EUR / USD</div>
      <div class="text-2xl font-bold text-white">
        {usdRate ? usdRate.rate.toFixed(4) : 'N/A'}
      </div>
      <div class="text-xs text-slate-400 mt-1">as of {data.exchange.date || 'today'}</div>
    </div>
  </div>

  <!-- Crypto ticker -->
  {#if data.crypto.length > 0}
    <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <h2 class="text-sm font-semibold text-slate-300 mb-4">Top Cryptocurrencies</h2>
      <div class="overflow-x-auto">
        <div class="flex gap-3 min-w-max">
          {#each data.crypto as coin}
            <div class="bg-slate-800 rounded-xl p-3 w-36 flex-shrink-0">
              <div class="flex items-center gap-2 mb-2">
                <img src={coin.image} alt={coin.name} class="w-6 h-6 rounded-full" />
                <span class="text-xs font-semibold text-slate-200 uppercase">{coin.symbol}</span>
              </div>
              <div class="text-sm font-bold text-white">{formatPrice(coin.current_price)}</div>
              <div
                class="text-xs mt-1 {coin.price_change_percentage_24h >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'}"
              >
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
              <div class="text-xs text-slate-500 mt-1">{formatMarketCap(coin.market_cap)}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Regional population breakdown -->
    <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <h2 class="text-sm font-semibold text-slate-300 mb-4">Population by Region</h2>
      <div class="space-y-3">
        {#each data.byRegion as { region, population }}
          <div class="flex items-center gap-3">
            <div class="text-sm text-slate-400 w-20 shrink-0">{region}</div>
            <div class="flex-1 bg-slate-800 rounded-full h-2">
              <div
                class="h-2 rounded-full bg-indigo-500"
                style="width:{((population / data.worldPopulation) * 100).toFixed(1)}%"
              ></div>
            </div>
            <div class="text-sm font-mono w-16 text-right text-slate-300">
              {(population / 1e9).toFixed(2)}B
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Exchange rates -->
    {#if data.topRates.length > 0}
      <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <h2 class="text-sm font-semibold text-slate-300 mb-4">
          Exchange Rates (Base: {data.exchange.base})
        </h2>
        <div class="grid grid-cols-2 gap-2">
          {#each data.topRates as { currency, rate }}
            <div class="bg-slate-800 rounded-xl p-3 flex justify-between items-center">
              <span class="font-mono text-sm font-semibold text-slate-200">{currency}</span>
              <span class="font-mono text-sm text-indigo-400">{rate.toFixed(4)}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Countries top-15 table -->
  <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
    <div class="px-5 py-4 border-b border-slate-800">
      <h2 class="text-sm font-semibold text-slate-300">Most Populous Countries</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
            <th class="text-left px-5 py-3">Flag</th>
            <th class="text-left px-5 py-3">Country</th>
            <th class="text-right px-5 py-3">Population</th>
            <th class="text-left px-5 py-3">Region</th>
            <th class="text-left px-5 py-3">Capital</th>
          </tr>
        </thead>
        <tbody>
          {#each data.countries as country, i}
            <tr
              class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors {i % 2 === 0
                ? ''
                : 'bg-slate-800/10'}"
            >
              <td class="px-5 py-3 text-xl">{country.flag}</td>
              <td class="px-5 py-3 font-medium text-slate-200">{country.name}</td>
              <td class="px-5 py-3 text-right font-mono text-slate-300">
                {formatPopulation(country.population)}
              </td>
              <td class="px-5 py-3 text-slate-400">{country.region}</td>
              <td class="px-5 py-3 text-slate-400">{country.capital}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
