<script lang="ts">
  import { browser } from '$app/environment';
  import { langStore } from '$lib/lang-store.svelte.js';

  // ── Types ───────────────────────────────────────────────────────────────────

  type Lang = 'ru' | 'en';
  type CompositionGroup = 'portal' | 'modules' | 'classic';

  interface CompositionMeta {
    id: string;
    label: string;
    labelEn: string;
    group: CompositionGroup;
    icon: string;
    fps: number;
    durationInFrames: number;
    width: number;
    height: number;
    moduleKey?: string;
  }

  // ── Portal module context ────────────────────────────────────────────────────

  const portalModules = [
    {
      id: 'exchange',
      icon: '💱',
      color: '#059669',
      titleRu: 'Обменник',
      titleEn: 'Exchange',
      descRu: 'Курсы валют и конвертация в реальном времени',
      descEn: 'Real-time currency rates and conversion',
      api: 'api.frankfurter.dev',
      route: '/exchange',
    },
    {
      id: 'blog',
      icon: '📝',
      color: '#7c3aed',
      titleRu: 'Блог',
      titleEn: 'Blog',
      descRu: 'Статьи и публикации с детальными страницами',
      descEn: 'Articles and publications with detail pages',
      api: 'jsonplaceholder.typicode.com',
      route: '/blog',
    },
    {
      id: 'content',
      icon: '💡',
      color: '#d97706',
      titleRu: 'Контент',
      titleEn: 'Content',
      descRu: 'Цитаты и вдохновляющий контент с поиском',
      descEn: 'Quotes and inspiring content with search',
      api: 'dummyjson.com',
      route: '/content',
    },
    {
      id: 'weather',
      icon: '🌤',
      color: '#2563eb',
      titleRu: 'Погода',
      titleEn: 'Weather',
      descRu: 'Текущая погода и прогноз для любого города',
      descEn: 'Current weather and forecast for any city',
      api: 'api.open-meteo.com',
      route: '/weather',
    },
    {
      id: 'cars',
      icon: '🚗',
      color: '#dc2626',
      titleRu: 'Авто',
      titleEn: 'Cars',
      descRu: 'VIN-декодер — всё об автомобиле по номеру',
      descEn: 'VIN decoder — everything about a vehicle',
      api: 'vpic.nhtsa.dot.gov',
      route: '/cars',
    },
    {
      id: 'maps',
      icon: '🗺️',
      color: '#16a34a',
      titleRu: 'Карты',
      titleEn: 'Maps',
      descRu: 'Интерактивные карты OSM, маркеры, поиск',
      descEn: 'Interactive OSM maps, markers, search',
      api: 'OpenStreetMap / Nominatim',
      route: '/maps',
    },
  ];

  // ── Compositions list ────────────────────────────────────────────────────────

  const compositions: CompositionMeta[] = [
    {
      id: 'PortalSlideshow',
      label: '🎞 Полный слайдшоу',
      labelEn: '🎞 Full Slideshow',
      group: 'portal',
      icon: '🎞',
      fps: 30,
      durationInFrames: 900,
      width: 1920,
      height: 1080,
    },
    {
      id: 'PortalOverview',
      label: '🌐 Обзор портала',
      labelEn: '🌐 Portal Overview',
      group: 'portal',
      icon: '🌐',
      fps: 30,
      durationInFrames: 180,
      width: 1920,
      height: 1080,
    },
    ...portalModules.map((m) => ({
      id: `Module_${m.id}`,
      label: `${m.icon} ${m.titleRu}`,
      labelEn: `${m.icon} ${m.titleEn}`,
      group: 'modules' as CompositionGroup,
      icon: m.icon,
      fps: 30,
      durationInFrames: 120,
      width: 1920,
      height: 1080,
      moduleKey: m.id,
    })),
    {
      id: 'HelloWorld',
      label: '🎨 Hello World',
      labelEn: '🎨 Hello World',
      group: 'classic',
      icon: '🎨',
      fps: 30,
      durationInFrames: 150,
      width: 1920,
      height: 1080,
    },
    {
      id: 'DataViz',
      label: '📊 Data Viz',
      labelEn: '📊 Data Viz',
      group: 'classic',
      icon: '📊',
      fps: 30,
      durationInFrames: 120,
      width: 1920,
      height: 1080,
    },
  ];

  // ── State ────────────────────────────────────────────────────────────────────

  // Use portal-wide langStore so the lang toggle syncs across all pages.
  const lang = $derived<Lang>(langStore.current);
  let selectedComp = $state<CompositionMeta>(compositions[0]);
  let playerContainer = $state<HTMLDivElement | null>(null);
  let reactRoot: { unmount: () => void } | null = null;

  let isGenerating = $state(false);
  let generateResult = $state<{ success?: boolean; path?: string; error?: string } | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function compLabel(c: CompositionMeta): string {
    return lang === 'en' ? c.labelEn : c.label;
  }

  function resolveCompositionId(comp: CompositionMeta, l: Lang): string {
    if (comp.group === 'classic') return comp.id;
    if (comp.id === 'PortalSlideshow') return l === 'en' ? 'PortalSlideshowEn' : 'PortalSlideshow';
    if (comp.id === 'PortalOverview') return l === 'en' ? 'PortalOverviewEn' : 'PortalOverview';
    if (comp.group === 'modules' && comp.moduleKey) return `Module_${comp.moduleKey}_${l}`;
    return comp.id;
  }

  function buildInputProps(comp: CompositionMeta, l: Lang): Record<string, unknown> {
    if (comp.group === 'classic') return {};
    if (comp.group === 'modules') return { lang: l };
    return { lang: l };
  }

  const durationSeconds = $derived((selectedComp.durationInFrames / selectedComp.fps).toFixed(1));

  // ── Player mounting ──────────────────────────────────────────────────────────

  $effect(() => {
    if (!browser || !playerContainer) return;

    // Cancel any previous root.
    if (reactRoot) { reactRoot.unmount(); reactRoot = null; }
    if (!playerContainer.isConnected) return;

    // Dynamic import keeps React/Remotion out of SSR. The file IS .tsx so
    // @vitejs/plugin-react injects the HMR preamble into player-mount.tsx
    // (not into this .svelte file), which fixes the "can't detect preamble" error.
    const container = playerContainer;
    const comp = selectedComp;
    const l = lang;

    import('$lib/player-mount.js').then(({ mountReactPlayer }) => {
      if (!container.isConnected) return;
      try {
        reactRoot = mountReactPlayer(container, comp, l);
      } catch (e) {
        console.error('[remotion] mountReactPlayer failed:', e);
      }
    });

    return () => {
      if (reactRoot) { reactRoot.unmount(); reactRoot = null; }
    };
  });


  // ── Generate ─────────────────────────────────────────────────────────────────

  async function handleGenerate() {
    isGenerating = true;
    generateResult = null;
    try {
      const compositionId = resolveCompositionId(selectedComp, lang);
      const props = buildInputProps(selectedComp, lang);
      const res = await fetch('/remotion/api/render', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ compositionId, props }),
      });
      const data = await res.json();
      generateResult = res.ok
        ? { success: true, path: data.path }
        : { success: false, error: data.message ?? 'Render failed' };
    } catch (e) {
      generateResult = { success: false, error: String(e) };
    } finally {
      isGenerating = false;
    }
  }

  // ── Composition groups ───────────────────────────────────────────────────────

  const groupLabels: Record<CompositionGroup, { ru: string; en: string }> = {
    portal: { ru: 'Портал', en: 'Portal' },
    modules: { ru: 'Модули', en: 'Modules' },
    classic: { ru: 'Классика', en: 'Classic' },
  };

  const compositionGroups = $derived(
    (['portal', 'modules', 'classic'] as CompositionGroup[]).map((g) => ({
      key: g,
      label: lang === 'en' ? groupLabels[g].en : groupLabels[g].ru,
      items: compositions.filter((c) => c.group === g),
    }))
  );
</script>

<div class="max-w-6xl mx-auto px-4 py-6 space-y-6">

  <!-- Header -->
  <div class="flex items-start justify-between gap-4 flex-wrap">
    <div>
      <h1 class="text-2xl font-bold text-white">
        {lang === 'ru' ? 'Remotion — Видео-генератор' : 'Remotion — Video Generator'}
      </h1>
      <p class="text-slate-400 text-sm mt-1">
        {lang === 'ru'
          ? 'Слайды и видео о портале — мультиязычно, один клик'
          : 'Portal slides and video — multilingual, one click'}
      </p>
    </div>

    <!-- Lang toggle -->
    <button
      onclick={() => langStore.toggle()}
      class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-semibold text-slate-200 border border-slate-700"
    >
      <span class="text-base">{lang === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
      {lang === 'ru' ? 'RU → EN' : 'EN → RU'}
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

    <!-- LEFT: Composition selector -->
    <div class="lg:col-span-1 space-y-4">
      <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800">
        <div class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 px-1">
          {lang === 'ru' ? 'Выберите композицию' : 'Select composition'}
        </div>

        {#each compositionGroups as group}
          <div class="mb-4 last:mb-0">
            <div class="text-[10px] uppercase tracking-widest text-slate-600 px-2 mb-1.5">
              {group.label}
            </div>
            <div class="space-y-1">
              {#each group.items as comp}
                <button
                  onclick={() => (selectedComp = comp)}
                  class="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2.5
                    {selectedComp.id === comp.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'}"
                >
                  <span class="text-base leading-none">{comp.icon}</span>
                  <span class="flex-1 truncate">{compLabel(comp)}</span>
                  <span class="text-[10px] opacity-50 font-mono shrink-0">
                    {(comp.durationInFrames / comp.fps).toFixed(0)}s
                  </span>
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- Generate button -->
      <button
        onclick={handleGenerate}
        disabled={isGenerating}
        class="w-full py-3 rounded-xl font-semibold text-sm transition-all
          {isGenerating
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-900/40'}"
      >
        {#if isGenerating}
          <span class="flex items-center justify-center gap-2">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {lang === 'ru' ? 'Рендеринг...' : 'Rendering...'}
          </span>
        {:else}
          🎬 {lang === 'ru' ? 'Сгенерировать видео' : 'Generate video'}
        {/if}
      </button>

      {#if generateResult}
        <div
          class="rounded-xl p-3 text-sm {generateResult.success
            ? 'bg-emerald-900/40 border border-emerald-700 text-emerald-300'
            : 'bg-red-900/40 border border-red-700 text-red-300'}"
        >
          {#if generateResult.success}
            ✅ {lang === 'ru' ? 'Готово:' : 'Done:'}
            <code class="font-mono text-xs">{generateResult.path}</code>
          {:else}
            ⚠️ {generateResult.error}
            <div class="mt-1 text-xs opacity-70">
              {lang === 'ru'
                ? 'Требуется ffmpeg. Для продакшна — Remotion Lambda.'
                : 'Requires ffmpeg. For production use Remotion Lambda.'}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Stats -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800">
        <div class="grid grid-cols-2 divide-x divide-slate-800">
          <div class="p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest text-slate-600 mb-1">FPS</div>
            <div class="font-mono text-sm text-white">{selectedComp.fps}</div>
          </div>
          <div class="p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest text-slate-600 mb-1">
              {lang === 'ru' ? 'Длина' : 'Duration'}
            </div>
            <div class="font-mono text-sm text-white">{durationSeconds}s</div>
          </div>
        </div>
        <div class="grid grid-cols-2 divide-x divide-slate-800">
          <div class="p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest text-slate-600 mb-1">
              {lang === 'ru' ? 'Кадров' : 'Frames'}
            </div>
            <div class="font-mono text-sm text-white">{selectedComp.durationInFrames}</div>
          </div>
          <div class="p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest text-slate-600 mb-1">
              {lang === 'ru' ? 'Размер' : 'Size'}
            </div>
            <div class="font-mono text-sm text-white">{selectedComp.width}×{selectedComp.height}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT: Player + portal context -->
    <div class="lg:col-span-2 space-y-6">

      <!-- Player -->
      <div bind:this={playerContainer} class="w-full bg-black rounded-2xl overflow-hidden aspect-video">
        <div class="flex items-center justify-center h-full text-slate-600 text-sm">
          {lang === 'ru' ? 'Загрузка плеера...' : 'Loading player...'}
        </div>
      </div>

      <!-- Portal context cards -->
      <div>
        <div class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          {lang === 'ru' ? 'Контекст портала' : 'Portal context'}
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {#each portalModules as mod}
            <a
              href={mod.route}
              class="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors"
            >
              <div class="flex items-center gap-2">
                <span class="text-base">{mod.icon}</span>
                <span class="font-semibold text-sm text-white">
                  {lang === 'ru' ? mod.titleRu : mod.titleEn}
                </span>
              </div>
              <p class="text-xs text-slate-500 leading-snug">
                {lang === 'ru' ? mod.descRu : mod.descEn}
              </p>
              <div class="text-[10px] font-mono text-slate-700 truncate">{mod.api}</div>
            </a>
          {/each}
        </div>
      </div>

      <!-- Architecture note -->
      <div class="bg-slate-900 rounded-xl p-4 border border-slate-800">
        <div class="text-xs font-semibold text-slate-400 mb-2">
          ⚙️ {lang === 'ru' ? 'Архитектура' : 'Architecture'}
        </div>
        <div class="text-xs text-slate-600 font-mono space-y-0.5">
          <div>packages/remotion-compositions/</div>
          <div class="pl-4 text-slate-500">PortalOverview · ModuleSlide · PortalSlideshow</div>
          <div class="mt-1">apps/web/routes/remotion/+page.svelte</div>
          <div class="pl-4 text-slate-500">→ $effect → createRoot → &lt;Player inputProps={'{'}lang{'}'} /&gt;</div>
          <div class="mt-1">apps/web/routes/remotion/api/render/+server.ts</div>
          <div class="pl-4 text-slate-500">→ POST compositionId → renderMedia (ffmpeg)</div>
        </div>
      </div>
    </div>
  </div>
</div>
