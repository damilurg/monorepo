<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  let searchQuery = $state('');
  let selectedRegion = $state('All');

  const filteredCountries = $derived(
    data.countries.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.capital.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
      return matchesSearch && matchesRegion;
    }),
  );

  function formatPopulation(n: number): string {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return n.toString();
  }

  function formatArea(n: number): string {
    return n.toLocaleString('en-US') + ' km²';
  }
</script>

<div class="space-y-6 pb-16 md:pb-0">
  <!-- Stats -->
  <div class="grid grid-cols-3 gap-4">
    <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">World Population</div>
      <div class="text-xl font-bold text-white">{formatPopulation(data.worldPopulation)}</div>
    </div>
    {#if data.largest}
      <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
        <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Most Populous</div>
        <div class="text-base font-bold text-white flex items-center gap-1">
          <span>{data.largest.flag}</span>
          <span>{data.largest.name}</span>
        </div>
        <div class="text-xs text-slate-400 mt-1">{formatPopulation(data.largest.population)}</div>
      </div>
    {/if}
    {#if data.smallest}
      <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
        <div class="text-xs text-slate-500 uppercase tracking-wider mb-1">Least Populous</div>
        <div class="text-base font-bold text-white flex items-center gap-1">
          <span>{data.smallest.flag}</span>
          <span>{data.smallest.name}</span>
        </div>
        <div class="text-xs text-slate-400 mt-1">{formatPopulation(data.smallest.population)}</div>
      </div>
    {/if}
  </div>

  <!-- Search + filter -->
  <div class="flex flex-col sm:flex-row gap-3">
    <input
      type="search"
      bind:value={searchQuery}
      placeholder="Search by country or capital..."
      class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    />
    <div class="flex gap-2 flex-wrap">
      <button
        onclick={() => (selectedRegion = 'All')}
        class="px-3 py-2 rounded-xl text-xs font-medium transition-colors {selectedRegion === 'All'
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}"
      >
        All
      </button>
      {#each data.regions as region}
        <button
          onclick={() => (selectedRegion = region)}
          class="px-3 py-2 rounded-xl text-xs font-medium transition-colors {selectedRegion ===
          region
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}"
        >
          {region}
        </button>
      {/each}
    </div>
  </div>

  <!-- Results count -->
  <div class="text-xs text-slate-500">
    Showing {filteredCountries.length} of {data.countries.length} countries
  </div>

  <!-- Country cards grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {#each filteredCountries as country}
      <div
        class="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-slate-600 transition-colors"
      >
        <div class="flex items-start gap-3 mb-3">
          <span class="text-3xl leading-none">{country.flag}</span>
          <div>
            <div class="font-semibold text-slate-100">{country.name}</div>
            {#if country.officialName !== country.name}
              <div class="text-xs text-slate-500 mt-0.5 leading-tight">{country.officialName}</div>
            {/if}
          </div>
        </div>
        <div class="space-y-1.5 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500">Population</span>
            <span class="text-slate-300 font-mono">{formatPopulation(country.population)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Capital</span>
            <span class="text-slate-300">{country.capital}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Region</span>
            <span class="text-slate-300">{country.region}</span>
          </div>
          {#if country.subregion}
            <div class="flex justify-between">
              <span class="text-slate-500">Subregion</span>
              <span class="text-slate-300 text-right max-w-40">{country.subregion}</span>
            </div>
          {/if}
          <div class="flex justify-between">
            <span class="text-slate-500">Area</span>
            <span class="text-slate-300 font-mono">{formatArea(country.area)}</span>
          </div>
          {#if country.currencies.length > 0}
            <div class="flex justify-between gap-2">
              <span class="text-slate-500 shrink-0">Currency</span>
              <span class="text-slate-300 text-right text-xs">{country.currencies[0]}</span>
            </div>
          {/if}
          {#if country.languages.length > 0}
            <div class="flex justify-between gap-2">
              <span class="text-slate-500 shrink-0">Language</span>
              <span class="text-slate-300 text-right text-xs"
                >{country.languages.slice(0, 2).join(', ')}</span
              >
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  {#if filteredCountries.length === 0}
    <div class="text-center py-12 text-slate-500">
      <div class="text-4xl mb-3">🔍</div>
      <div>No countries found matching your search.</div>
    </div>
  {/if}
</div>
