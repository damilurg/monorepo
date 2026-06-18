<script lang="ts">
  import type { PageData } from './$types';
  import Seo from '$lib/components/Seo.svelte';
  import { langStore } from '$lib/lang-store.svelte.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const moduleGradients: Record<string, string> = {
    exchange: 'from-emerald-400 to-teal-500',
    blog: 'from-violet-400 to-purple-500',
    content: 'from-amber-400 to-orange-500',
    weather: 'from-sky-400 to-blue-500',
    cars: 'from-rose-400 to-red-500',
    maps: 'from-green-400 to-emerald-500',
  };

  const T = {
    ru: {
      heroTitle1: 'Всё в одном',
      heroTitle2: 'месте',
      heroSubtitle: 'Курсы валют, погода, блог, VIN-декодер и многое другое',
      unavailable: 'Недоступен',
      sectionsAvailable: (enabled: number, total: number) => `${enabled} из ${total} разделов доступно`,
      standaloneApps: 'Отдельные приложения',
      standaloneHintPrefix: 'Все приложения доступны с',
    },
    en: {
      heroTitle1: 'Everything in one',
      heroTitle2: 'place',
      heroSubtitle: 'Exchange rates, weather, blog, VIN decoder and much more',
      unavailable: 'Unavailable',
      sectionsAvailable: (enabled: number, total: number) => `${enabled} of ${total} sections available`,
      standaloneApps: 'Standalone Apps',
      standaloneHintPrefix: 'All apps available at',
    },
  };
  const t = $derived(T[langStore.current]);

</script>

<Seo
  title="Automotive Portal"
  description="Единый портал: курсы валют, блог, погода, автомобили и многое другое"
  canonical="https://example.com"
  jsonLd={{
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Automotive Portal',
    url: 'https://example.com',
    description: 'Единый портал: курсы валют, блог, погода, автомобили и многое другое',
  }}
/>

<!-- Hero -->
<div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 pt-16 pb-20">
  <div class="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600 opacity-10 blur-3xl"></div>
  <div class="pointer-events-none absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-indigo-500 opacity-10 blur-3xl"></div>
  <div class="relative mx-auto max-w-lg text-center">
    <span class="mb-4 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300 ring-1 ring-blue-500/30">
      Automotive Portal
    </span>
    <h1 class="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
      {t.heroTitle1}
      <span class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> {t.heroTitle2}</span>
    </h1>
    <p class="mt-4 text-base text-slate-400">
      {t.heroSubtitle}
    </p>
  </div>
</div>

<!-- Cards -->
<div class="mx-auto -mt-8 max-w-lg px-4 pb-12">
  <div class="flex flex-col gap-3">
    {#each data.modules as mod (mod.id)}
      {@const gradient = moduleGradients[mod.id] ?? 'from-slate-400 to-slate-500'}

      <a
        href={mod.enabled ? mod.route : undefined}
        class="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all duration-200
          {mod.enabled ? 'hover:-translate-y-0.5 hover:shadow-lg cursor-pointer' : 'opacity-60 cursor-not-allowed'}"
        aria-disabled={!mod.enabled}
      >
        <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br {gradient} shadow-sm text-2xl">
          {mod.icon}
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900">{mod.title}</span>
            {#if !mod.enabled}
              <span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {t.unavailable}
              </span>
            {/if}
          </div>
          <p class="mt-0.5 truncate text-sm text-gray-400">{mod.description}</p>
        </div>

        {#if mod.enabled}
          <svg class="h-5 w-5 flex-shrink-0 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <div class="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r {gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
        {/if}
      </a>
    {/each}
  </div>

  <p class="mt-8 text-center text-xs text-gray-400">
    {t.sectionsAvailable(data.modules.filter(m => m.enabled).length, data.modules.length)}
  </p>

  <!-- Standalone apps section -->
  <div class="mt-10">
    <div class="mb-4 flex items-center gap-3">
      <div class="h-px flex-1 bg-gray-200"></div>
      <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{t.standaloneApps}</span>
      <div class="h-px flex-1 bg-gray-200"></div>
    </div>

    <div class="flex flex-col gap-3">
      {#each data.standaloneApps as app (app.id)}
        <a
          href={app.enabled ? app.route : undefined}
          class="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all duration-200
            {app.enabled ? 'hover:-translate-y-0.5 hover:shadow-lg cursor-pointer' : 'opacity-60 cursor-not-allowed'}"
          aria-disabled={!app.enabled}
        >
          <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br {app.gradient} shadow-sm text-2xl">
            {app.icon}
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-900">{app.title}</span>
              {#if !app.enabled}
                <span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">{t.unavailable}</span>
              {:else if app.badge}
                <span class="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                  {app.badge}
                </span>
              {/if}
            </div>
            <p class="mt-0.5 truncate text-sm text-gray-400">{app.description}</p>
          </div>

          {#if app.enabled}
            <svg class="h-5 w-5 flex-shrink-0 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <div class="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r {app.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
          {/if}
        </a>
      {/each}
    </div>

    <p class="mt-4 text-center text-xs text-gray-400">
      {t.standaloneHintPrefix} <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-gray-600">localhost:5173</code>
    </p>
  </div>

  <!-- API Docs link -->
  <div class="mt-6 text-center">
    <a href="/api-docs" class="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 transition-colors">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      API Docs
    </a>
  </div>
</div>
