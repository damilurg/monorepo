<script lang="ts">
  import type { PageData } from './$types';
  import { PageHeader, Card, Input, EmptyState, Loader, ErrorState } from '@repo/shared/ui';
  import { formatApiError } from '@repo/shared';
  import type { Quote, QuotesResponse } from '$modules/content/model/types.js';
  import { goto } from '$app/navigation';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let spaQuotes = $state<Quote[]>([]);
  let spaTotal = $state(0);
  let spaLoading = $state(false);
  let spaError = $state('');

  async function fetchSearch(query: string) {
    spaLoading = true;
    spaError = '';
    try {
      const res = await fetch(`/content/search/${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as QuotesResponse;
      spaQuotes = json.quotes;
      spaTotal = json.total;
    } catch (e) {
      spaError = formatApiError(e);
    } finally {
      spaLoading = false;
    }
  }

  $effect(() => {
    if (data.renderMode === 'spa') {
      void fetchSearch(data.query);
    }
  });

  let quotes = $derived(data.renderMode === 'ssr' ? data.quotes : spaQuotes);
  let total = $derived(data.renderMode === 'ssr' ? data.total : spaTotal);

  let searchQuery = $state(data.query);

  function submitSearch() {
    const q = searchQuery.trim();
    if (!q) {
      goto('/content');
      return;
    }
    goto(`/content/search/${encodeURIComponent(q)}`);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') submitSearch();
  }
</script>

<svelte:head>
  <title>Поиск: {data.query} — Контент — Automotive Portal</title>
</svelte:head>

<PageHeader title="Контент" subtitle={total > 0 ? `${total} результатов по «${data.query}»` : `По запросу «${data.query}»`} backHref="/content" backLabel="Все цитаты" />
<span data-testid="search-query" class="sr-only">{data.query}</span>

<div class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

  <div class="flex gap-2">
    <div class="flex-1">
      <Input placeholder="Поиск по цитате или автору..." type="search" bind:value={searchQuery} onkeydown={handleKeydown} />
    </div>
    <button onclick={submitSearch} class="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex-shrink-0">
      Найти
    </button>
  </div>

  {#if data.renderMode === 'spa' && spaLoading}
    <Loader text="Ищем цитаты..." />
  {:else if spaError}
    <ErrorState message={spaError} onRetry={() => fetchSearch(data.query)} />
  {:else if quotes.length === 0}
    <EmptyState title="Ничего не найдено" description="Попробуйте другой запрос" icon="🔍" />
  {:else}
    <p class="text-xs text-gray-400 px-1">{quotes.length} результатов</p>
    <div data-testid="quotes-list" class="flex flex-col gap-3">
      {#each quotes as quote (quote.id)}
        <Card padding="md" data-testid="quote-card">
          <blockquote class="flex flex-col gap-3">
            <p class="text-gray-800 leading-relaxed text-base">"{quote.quote}"</p>
            <footer class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold text-blue-600">{quote.author[0]}</span>
              </div>
              <cite class="text-sm text-gray-500 not-italic font-medium">{quote.author}</cite>
            </footer>
          </blockquote>
        </Card>
      {/each}
    </div>
  {/if}

</div>
