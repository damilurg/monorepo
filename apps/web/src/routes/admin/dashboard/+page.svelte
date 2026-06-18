<script lang="ts">
  import type { PageData } from './$types';
  import type { ModuleId, RenderMode } from '@repo/flags-store';
  import { adminI18n as i18n } from '$lib/admin-i18n.svelte.js';

  interface Props { data: PageData; }
  let { data }: Props = $props();

  async function patch(body: object) {
    const res = await fetch('/admin/api/flags', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed');
    window.location.reload();
  }

  const toggleEnabled = (id: ModuleId, cur: boolean) => patch({ action: 'set', moduleId: id, enabled: !cur });
  const toggleMode    = (id: ModuleId, cur: RenderMode) => patch({ action: 'set', moduleId: id, renderMode: cur === 'ssr' ? 'spa' : 'ssr' });
  const resetModule   = (id: ModuleId) => patch({ action: 'reset', moduleId: id });
  const resetAll      = () => { if (confirm('Reset all overrides?')) patch({ action: 'reset-all' }); };

  const webModules        = $derived(data.modules.filter(m => !m.standalone));
  const standaloneModules = $derived(data.modules.filter(m => m.standalone));
</script>

<svelte:head><title>Feature Flags — Admin</title></svelte:head>

<!-- Sticky header -->
<header class="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
  <div class="flex items-center gap-4">
    <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="20" font-size="18" font-weight="700" fill="white" letter-spacing="2" font-family="Arial, sans-serif">PORTAL</text>
    </svg>
    <div class="h-6 w-px bg-slate-700"></div>
    <span class="text-slate-400 text-xs">Feature Flags Manager</span>
  </div>
  <button
    onclick={() => window.location.href = '/admin/logout'}
    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
    Logout
  </button>
</header>

<main class="max-w-4xl mx-auto px-6 py-8">

  <!-- Page title row -->
  <div class="flex items-end justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold text-white">Module Configuration</h1>
      <p class="text-slate-400 text-sm mt-1">
        Runtime feature flags — changes apply instantly without restart
      </p>
    </div>
    <button
      onclick={resetAll}
      class="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
    >
      {i18n.t('dashboard.resetAll')}
    </button>
  </div>

  <!-- Store path info -->
  <div class="rounded-xl bg-amber-900/30 border border-amber-700 p-4 mb-8 text-sm text-amber-200">
    Flags file: {data.storeFile}
  </div>

  <!-- Web Modules section -->
  <h2 class="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
    <span class="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
    Web Modules
  </h2>

  {#each webModules as mod (mod.id)}
    {@render moduleCard(mod)}
  {/each}

  <!-- Standalone Apps section -->
  <h2 class="text-lg font-semibold text-slate-300 mt-10 mb-4 flex items-center gap-2">
    <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
    Standalone Apps
    <span class="text-xs text-slate-500 font-normal">(proxied via /prefix)</span>
  </h2>

  {#each standaloneModules as mod (mod.id)}
    {@render moduleCard(mod)}
  {/each}

</main>

{#snippet moduleCard(mod: typeof data.modules[number])}
  <div class="rounded-xl border {mod.hasOverride ? 'border-red-700 bg-slate-900' : 'border-slate-700 bg-slate-900'} p-6 mb-4">

    <!-- Module header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <span class="text-2xl">{mod.icon}</span>
        <div>
          <h3 class="text-lg font-semibold text-white">{mod.title}</h3>
          <p class="text-xs text-slate-400">/{mod.id}</p>
        </div>
        {#if mod.hasOverride}
          <span class="rounded-full bg-slate-800 border border-slate-600 px-2.5 py-0.5 text-xs text-slate-300">
            Runtime override
          </span>
        {/if}
      </div>
      <button
        onclick={() => resetModule(mod.id)}
        class="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
      >
        {i18n.t('dashboard.reset')}
      </button>
    </div>

    <hr class="border-slate-700 mb-4" />

    <!-- Controls row -->
    <div class="flex flex-wrap gap-12 items-start">

      <!-- Enabled toggle -->
      <div>
        <p class="text-sm font-semibold text-slate-200 mb-2">{i18n.t('dashboard.module')}</p>
        <label class="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            class="sr-only peer"
            checked={mod.runtimeEnabled}
            onchange={() => toggleEnabled(mod.id, mod.runtimeEnabled)}
          />
          <div class="relative w-10 h-6 bg-slate-700 peer-checked:bg-indigo-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-4"></div>
          <span class="text-sm text-slate-300">{mod.runtimeEnabled ? i18n.t('dashboard.enabled') : i18n.t('dashboard.disabled')}</span>
        </label>
        <p class="text-xs text-slate-500 mt-1">
          ENV: {mod.envEnabled ? 'true' : 'false'}
          {#if mod.overrideEnabled !== null}· override: {mod.overrideEnabled}{/if}
        </p>
      </div>

      <!-- Render mode (web modules only — standalone apps are full apps, no SSR/SPA toggle) -->
      {#if !mod.standalone}
        <div>
          <p class="text-sm font-semibold text-slate-200 mb-2">{i18n.t('dashboard.renderMode')}</p>
          <div class="flex gap-2">
            <button
              onclick={() => { if (mod.runtimeRenderMode !== 'ssr') toggleMode(mod.id, mod.runtimeRenderMode); }}
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {mod.runtimeRenderMode === 'ssr' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'}"
            >SSR</button>
            <button
              onclick={() => { if (mod.runtimeRenderMode !== 'spa') toggleMode(mod.id, mod.runtimeRenderMode); }}
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {mod.runtimeRenderMode === 'spa' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'}"
            >SPA</button>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            ENV: {mod.envRenderMode}
            {#if mod.overrideRenderMode !== null}· override: {mod.overrideRenderMode}{/if}
          </p>
        </div>
      {/if}

      <!-- ENV source -->
      <div class="ml-auto">
        <p class="text-xs text-slate-500">ENV source</p>
        <p class="font-mono text-sm text-slate-300">
          PUBLIC_FEATURE_{mod.id.toUpperCase()}={mod.envEnabled}
        </p>
        {#if !mod.standalone}
          <p class="font-mono text-sm text-slate-300">
            PUBLIC_RENDER_MODE_{mod.id.toUpperCase()}={mod.envRenderMode}
          </p>
        {/if}
      </div>

    </div>
  </div>
{/snippet}
