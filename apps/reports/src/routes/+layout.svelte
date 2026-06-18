<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { setContext } from 'svelte';
  import { LangToggle } from '@repo/shared/i18n';
  import { i18n } from '$lib/i18n.svelte.js';

  interface Props {
    children: import('svelte').Snippet;
  }
  let { children }: Props = $props();

  setContext('i18n', i18n);

  let navItems = $derived([
    { href: `${base}/`, icon: '📊', label: i18n.t('nav.overview') },
    { href: `${base}/crypto`, icon: '₿', label: i18n.t('nav.crypto') },
    { href: `${base}/countries`, icon: '🌍', label: i18n.t('nav.countries') },
    { href: `${base}/exchange`, icon: '💱', label: i18n.t('nav.exchange') },
  ]);
</script>

<div class="flex h-screen bg-slate-950 text-slate-100">
  <!-- Sidebar (hidden on mobile) -->
  <aside class="hidden md:flex flex-col w-56 bg-slate-900 border-r border-slate-800 p-4">
    <!-- Logo -->
    <div class="flex items-center gap-2 mb-8 px-2">
      <span class="text-2xl">📊</span>
      <span class="font-bold text-white text-lg">{i18n.t('nav.title')}</span>
    </div>
    <!-- Nav -->
    <nav class="flex flex-col gap-1">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors {$page.url.pathname === item.href
            ? 'bg-indigo-600 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
        >
          <span class="text-lg">{item.icon}</span>
          {item.label}
        </a>
      {/each}
    </nav>
    <!-- Bottom: lang toggle + data attribution -->
    <div class="mt-auto flex flex-col gap-3 px-2">
      <LangToggle store={i18n} />
      <div class="text-xs text-slate-600 leading-relaxed">
        {i18n.t('data.source')}
      </div>
    </div>
  </aside>

  <!-- Main content area -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Top bar -->
    <header
      class="bg-slate-900/50 border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0"
    >
      <h1 class="font-semibold text-white">
        {navItems.find((n) => n.href === $page.url.pathname)?.label ?? i18n.t('nav.title')}
      </h1>
      <div class="flex items-center gap-3">
        <div class="text-xs text-slate-500">Live data · Refreshes on load</div>
        <div class="md:hidden">
          <LangToggle store={i18n} />
        </div>
      </div>
    </header>
    <!-- Page content -->
    <main class="flex-1 overflow-y-auto p-6">
      {@render children()}
    </main>
  </div>

  <!-- Mobile bottom tab bar -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex">
    {#each navItems as item}
      <a
        href={item.href}
        class="flex-1 flex flex-col items-center py-2 text-xs {$page.url.pathname === item.href
          ? 'text-indigo-400'
          : 'text-slate-500'}"
      >
        <span class="text-xl">{item.icon}</span>
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
</div>
