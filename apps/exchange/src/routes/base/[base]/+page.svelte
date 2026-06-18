<script lang="ts">
  import type { PageData } from './$types';
  import { PageHeader, Card, Input, Loader, ErrorState } from '@repo/shared/ui';
  import { formatCurrency, formatApiError } from '@repo/shared';
  import { POPULAR_CURRENCIES } from '$modules/exchange/model/types.js';
  import type { ExchangeRates } from '$modules/exchange/model/types.js';
  import { goto } from '$app/navigation';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let spaRates = $state<ExchangeRates | null>(null);
  let spaLoading = $state(false);
  let spaError = $state('');

  async function fetchRates(base: string) {
    spaLoading = true;
    spaError = '';
    try {
      const res = await fetch(`/base/${base.toLowerCase()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      spaRates = await res.json() as ExchangeRates;
    } catch (e) {
      spaError = formatApiError(e);
    } finally {
      spaLoading = false;
    }
  }

  $effect(() => {
    if (data.renderMode === 'spa') {
      void fetchRates(data.base);
    }
  });

  let rates = $derived(data.renderMode === 'ssr' ? data.rates : spaRates);
  let currentBase = $derived(rates?.base ?? data.base);

  let fromCurrency = $state('USD');
  let toCurrency = $state('EUR');
  let amount = $state('1');

  let result = $derived.by(() => {
    if (!rates) return null;
    const num = parseFloat(amount);
    if (!num || isNaN(num)) return null;

    let inBase: number;
    if (fromCurrency === rates.base) {
      inBase = num;
    } else {
      const fromRate = rates.rates[fromCurrency];
      if (!fromRate) return null;
      inBase = num / fromRate;
    }

    if (toCurrency === rates.base) {
      return { value: inBase, rate: 1 / (rates.rates[fromCurrency] ?? 1) };
    }

    const toRate = rates.rates[toCurrency];
    if (!toRate) return null;
    return { value: inBase * toRate, rate: toRate / (rates.rates[fromCurrency] ?? 1) };
  });

  const availableCurrencies = $derived(
    rates ? [rates.base, ...Object.keys(rates.rates)] : []
  );

  function swapCurrencies() {
    [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
  }

  function formatResult(value: number, currency: string): string {
    try {
      return formatCurrency(value, currency);
    } catch {
      return `${value.toFixed(4)} ${currency}`;
    }
  }

  function handleBaseChange(base: string) {
    goto(`/base/${base.toLowerCase()}`);
  }
</script>

<svelte:head>
  <title>Обменник — Automotive Portal</title>
</svelte:head>

<PageHeader
  title="Обменник"
  subtitle={rates ? `Курсы на ${rates.date}` : 'Загрузка...'}
  backHref="/"
  backLabel="На главную"
/>

<div class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

  {#if data.renderMode === 'spa' && spaLoading}
    <Loader text="Загружаем курсы..." />
  {:else if spaError}
    <ErrorState message={spaError} onRetry={() => fetchRates(currentBase)} />
  {:else if rates}

    <!-- Base currency selector -->
    <Card>
      <div class="flex flex-col gap-3">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Базовая валюта</p>
        <div class="flex flex-wrap gap-2">
          {#each POPULAR_CURRENCIES as cur (cur.code)}
            {#if availableCurrencies.includes(cur.code) || data.renderMode === 'ssr'}
              <a
                href="/base/{cur.code.toLowerCase()}"
                onclick={(e) => { e.preventDefault(); handleBaseChange(cur.code); }}
                class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  {currentBase === cur.code ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
              >
                {cur.code}
              </a>
            {/if}
          {/each}
        </div>
      </div>
    </Card>

    <!-- Converter -->
    <Card>
      <div class="flex flex-col gap-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Конвертер</p>
        <Input label="Сумма" type="number" bind:value={amount} placeholder="1" />

        <div class="flex gap-3 items-end">
          <div class="flex-1">
            <label class="text-sm font-medium text-gray-700 block mb-1.5">Из</label>
            <select bind:value={fromCurrency} class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300">
              {#each availableCurrencies as code (code)}
                <option value={code}>{code}</option>
              {/each}
            </select>
          </div>

          <button onclick={swapCurrencies} class="mb-0.5 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0" aria-label="Поменять">⇄</button>

          <div class="flex-1">
            <label class="text-sm font-medium text-gray-700 block mb-1.5">В</label>
            <select bind:value={toCurrency} class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300">
              {#each availableCurrencies as code (code)}
                <option value={code}>{code}</option>
              {/each}
            </select>
          </div>
        </div>

        {#if result}
          <div class="bg-blue-50 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-blue-700">{formatResult(result.value, toCurrency)}</p>
            <p class="text-xs text-blue-500 mt-1">1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}</p>
          </div>
        {/if}
      </div>
    </Card>

    <!-- All rates -->
    <Card>
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Все курсы к {rates.base}</p>
      <div class="flex flex-col divide-y divide-gray-50">
        {#each Object.entries(rates.rates) as [code, rate] (code)}
          <div class="flex justify-between items-center py-2.5">
            <span class="font-medium text-gray-800">{code}</span>
            <span class="text-gray-600 tabular-nums">{rate.toFixed(4)}</span>
          </div>
        {/each}
      </div>
    </Card>

  {/if}
</div>
