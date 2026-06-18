<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  // Converter state
  let amount = $state('100');
  let fromCurrency = $state(data.base);
  let toCurrency = $state('USD');

  const currencies = $derived([data.base, ...Object.keys(data.rates)].sort());

  function convert(amt: number, from: string, to: string): number {
    if (from === data.base) {
      return amt * (data.rates[to] ?? 1);
    } else if (to === data.base) {
      return amt / (data.rates[from] ?? 1);
    } else {
      // Cross-rate via base
      const fromRate = data.rates[from] ?? 1;
      const toRate = data.rates[to] ?? 1;
      return (amt / fromRate) * toRate;
    }
  }

  const result = $derived(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return null;
    return convert(num, fromCurrency, toCurrency);
  });

  function swapCurrencies() {
    const tmp = fromCurrency;
    fromCurrency = toCurrency;
    toCurrency = tmp;
  }

  const maxMajorRate = $derived(Math.max(...data.majorRates.map((r) => r.rate)));

  const searchQuery = $state('');
  let rateSearch = $state('');

  const filteredRates = $derived(
    rateSearch
      ? data.allRates.filter((r) => r.currency.toLowerCase().includes(rateSearch.toLowerCase()))
      : data.allRates,
  );
</script>

<div class="space-y-6 pb-16 md:pb-0">
  <!-- Header info -->
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Base Currency</div>
      <div class="text-2xl font-bold text-white">{data.base}</div>
      <div class="text-xs text-slate-400 mt-1">Euro</div>
    </div>
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Currencies</div>
      <div class="text-2xl font-bold text-white">{data.allRates.length}</div>
      <div class="text-xs text-slate-400 mt-1">available pairs</div>
    </div>
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800 col-span-2 lg:col-span-1">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Last Updated</div>
      <div class="text-lg font-bold text-white">{data.date || 'Today'}</div>
      <div class="text-xs text-slate-400 mt-1">Frankfurter API</div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Converter widget -->
    <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <h2 class="text-sm font-semibold text-slate-300 mb-4">Currency Converter</h2>
      <div class="space-y-3">
        <div class="flex gap-2">
          <div class="flex-1">
            <label class="text-xs text-slate-500 mb-1 block">Amount</label>
            <input
              type="number"
              bind:value={amount}
              min="0"
              step="any"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div class="w-28">
            <label class="text-xs text-slate-500 mb-1 block">From</label>
            <select
              bind:value={fromCurrency}
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {#each currencies as c}
                <option value={c}>{c}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="flex items-center justify-center">
          <button
            onclick={swapCurrencies}
            class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
            title="Swap currencies"
          >
            ⇅
          </button>
        </div>

        <div class="flex gap-2">
          <div class="flex-1">
            <label class="text-xs text-slate-500 mb-1 block">Result</label>
            <div
              class="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 font-mono text-indigo-300 text-lg"
            >
              {#if result() !== null}
                {result()!.toFixed(4)}
              {:else}
                —
              {/if}
            </div>
          </div>
          <div class="w-28">
            <label class="text-xs text-slate-500 mb-1 block">To</label>
            <select
              bind:value={toCurrency}
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {#each currencies as c}
                <option value={c}>{c}</option>
              {/each}
            </select>
          </div>
        </div>

        {#if result() !== null && parseFloat(amount) > 0}
          <div class="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
            <span class="font-mono"
              >{parseFloat(amount).toLocaleString()} {fromCurrency}</span
            >
            <span class="mx-2 text-slate-600">=</span>
            <span class="font-mono text-indigo-400"
              >{result()!.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })} {toCurrency}</span
            >
          </div>
        {/if}
      </div>
    </div>

    <!-- Major currencies bar chart -->
    <div class="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <h2 class="text-sm font-semibold text-slate-300 mb-4">
        Major Currencies vs {data.base}
      </h2>
      <div class="space-y-2">
        {#each data.majorRates as { currency, rate }}
          <div class="flex items-center gap-3">
            <span class="font-mono text-sm w-10 text-slate-400 shrink-0">{currency}</span>
            <div class="flex-1 bg-slate-800 rounded h-7 relative overflow-hidden">
              <div
                class="h-7 rounded bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all"
                style="width:{Math.min(100, (rate / maxMajorRate) * 100).toFixed(1)}%"
              ></div>
              <span
                class="absolute inset-y-0 right-3 flex items-center text-xs font-mono text-white/90"
              >
                {rate.toFixed(4)}
              </span>
            </div>
          </div>
        {/each}
      </div>
      <p class="text-xs text-slate-600 mt-3">Bars show relative scale among displayed currencies</p>
    </div>
  </div>

  <!-- All rates table -->
  <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
    <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
      <h2 class="text-sm font-semibold text-slate-300">All Exchange Rates (Base: {data.base})</h2>
      <input
        type="search"
        bind:value={rateSearch}
        placeholder="Filter..."
        class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 w-28"
      />
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
            <th class="text-left px-5 py-3">Currency</th>
            <th class="text-right px-5 py-3">Rate vs {data.base}</th>
            <th class="text-right px-5 py-3">{data.base} → 100 {'{currency}'}</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredRates as { currency, rate }, i}
            <tr
              class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors {i % 2 === 0
                ? ''
                : 'bg-slate-800/10'}"
            >
              <td class="px-5 py-2.5 font-mono font-semibold text-slate-200">{currency}</td>
              <td class="px-5 py-2.5 text-right font-mono text-indigo-400">{rate.toFixed(6)}</td>
              <td class="px-5 py-2.5 text-right font-mono text-slate-400">
                {(100 / rate).toFixed(4)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
