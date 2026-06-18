<script lang="ts">

  import { onMount } from 'svelte';
  import type { LayoutData } from './$types';
  import { langStore } from '$lib/lang-store.svelte.js';
  import { initWebVitals } from '$lib/web-vitals.js';
  import { env } from '$env/dynamic/public';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { initAnalytics, analytics } from '$lib/analytics';

  interface Props {
    data: LayoutData;
    children: import('svelte').Snippet;
  }

  let { data, children }: Props = $props();

  onMount(async () => {
    // Initialize lang from server data (cookie), then sync with DOM
    langStore.init(data.lang ?? 'ru');
    initWebVitals();

    await initAnalytics(env);

    // Track page views on navigation (SPA mode navigations)
    if (browser) {
      const unsubscribe = page.subscribe((p) => {
        if (analytics.initialized) {
          analytics.page(p.url.pathname, document.title);
        }
      });
      return unsubscribe;
    }
  });

  async function toggleLang() {
    langStore.toggle();
    // Persist to server cookie
    await fetch('/api/lang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: langStore.current }),
    });
  }
</script>

<svelte:head>
  <meta name="theme-color" content="#2563eb" />
</svelte:head>

<!-- Floating language toggle -->
<div class="fixed top-4 right-4 z-50">
  <button
    onclick={toggleLang}
    class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md ring-1 ring-black/10 text-sm font-semibold text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-200 select-none"
    aria-label="Switch language"
    title="Switch language"
  >
    <span class="text-base leading-none">{langStore.current === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
    <span class="uppercase tracking-wide">{langStore.current === 'ru' ? 'EN' : 'RU'}</span>
  </button>
</div>

<div class="min-h-screen bg-gray-50 font-sans antialiased">
  {#if !data.featureEnabled}
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div class="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">
        {langStore.current === 'ru' ? 'Раздел временно недоступен' : 'Section temporarily unavailable'}
      </h2>
      <p class="text-gray-500 text-sm mb-6">
        {langStore.current === 'ru' ? 'Мы уже работаем над этим. Попробуйте позже.' : 'We are already working on this. Please try again later.'}
      </p>
      <a href="/" class="text-blue-600 font-medium text-sm hover:underline">
        ← {langStore.current === 'ru' ? 'На главную' : 'Home'}
      </a>
    </div>
  {:else}
    {@render children()}
  {/if}
</div>
