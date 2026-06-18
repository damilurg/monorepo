<script lang="ts">
  import { onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  type CompositionId = 'HelloWorld' | 'DataViz';

  interface Composition {
    id: CompositionId;
    label: string;
    fps: number;
    durationInFrames: number;
    width: number;
    height: number;
  }

  const compositions: Composition[] = [
    { id: 'HelloWorld', label: '🎨 Hello World', fps: 30, durationInFrames: 150, width: 1920, height: 1080 },
    { id: 'DataViz', label: '📊 Data Viz', fps: 30, durationInFrames: 120, width: 1920, height: 1080 },
  ];

  let selectedComposition = $state<Composition>(compositions[0]);
  let playerContainer = $state<HTMLDivElement | null>(null);
  let reactRoot: { unmount: () => void } | null = null;

  async function mountPlayer(container: HTMLDivElement, compositionId: CompositionId): Promise<void> {
    // Clean up previous mount
    if (reactRoot) {
      reactRoot.unmount();
      reactRoot = null;
    }

    const [{ createRoot }, React, { Player }, { HelloWorld, DataViz }] = await Promise.all([
      import('react-dom/client'),
      import('react'),
      import('@remotion/player'),
      import('@repo/remotion-compositions'),
    ]);

    const component = compositionId === 'HelloWorld' ? HelloWorld : DataViz;
    const comp = compositions.find((c) => c.id === compositionId)!;

    const root = createRoot(container);
    root.render(
      React.createElement(Player, {
        component,
        durationInFrames: comp.durationInFrames,
        fps: comp.fps,
        compositionWidth: comp.width,
        compositionHeight: comp.height,
        style: { width: '100%', borderRadius: '12px' },
        controls: true,
        autoPlay: true,
        loop: true,
      })
    );
    reactRoot = root;
  }

  $effect(() => {
    if (browser && playerContainer) {
      void mountPlayer(playerContainer, selectedComposition.id);
    }
  });

  onDestroy(() => {
    if (reactRoot) reactRoot.unmount();
    if (pdsRoot) pdsRoot.unmount();
  });

  let pdsContainer = $state<HTMLDivElement | null>(null);
  let pdsRoot: { unmount: () => void } | null = null;

  $effect(() => {
    if (browser && pdsContainer) {
      void mountPDS(pdsContainer);
    }
  });

  async function mountPDS(container: HTMLDivElement): Promise<void> {
    if (pdsRoot) { pdsRoot.unmount(); pdsRoot = null; }

    const pkg = '@porsche-design-system/components-react';
    const [{ createRoot }, React, pds] = await Promise.all([
      import('react-dom/client'),
      import('react'),
      // Use vite-ignore since PDS React might not be installed yet
      import(/* @vite-ignore */ pkg).catch(() => null),
    ]);

    if (!pds) {
      // PDS not installed - show placeholder
      const root = createRoot(container);
      root.render(React.createElement('div', {
        style: { padding: '16px', background: '#f2f2f2', borderRadius: '8px', color: '#333', fontFamily: 'sans-serif' }
      }, '⚠️ Install @porsche-design-system/components-react to see PDS components'));
      pdsRoot = root;
      return;
    }

    const { PorscheDesignSystemProvider, PButton, PHeading, PText } = pds;

    const root = createRoot(container);
    root.render(
      React.createElement(PorscheDesignSystemProvider, null,
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
          React.createElement(PHeading, { size: 'large' }, 'PDS + Remotion + SvelteKit'),
          React.createElement(PText, null, 'Porsche Design System React components rendered inside SvelteKit via React-in-Svelte'),
          React.createElement('div', { style: { display: 'flex', gap: '8px' } },
            React.createElement(PButton, { variant: 'primary' }, 'Primary'),
            React.createElement(PButton, { variant: 'secondary' }, 'Secondary'),
            React.createElement(PButton, { variant: 'ghost' }, 'Ghost'),
          )
        )
      )
    );
    pdsRoot = root;
  }

  const stats = $derived([
    { label: 'FPS', value: String(selectedComposition.fps) },
    {
      label: 'Duration',
      value: `${(selectedComposition.durationInFrames / selectedComposition.fps).toFixed(1)}s (${selectedComposition.durationInFrames} frames)`,
    },
    { label: 'Resolution', value: `${selectedComposition.width}×${selectedComposition.height}` },
  ]);
</script>

<div class="max-w-5xl mx-auto px-6 py-8">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-white mb-1">Remotion Player</h1>
    <p class="text-slate-400 text-sm">
      React compositions running inside SvelteKit via React-in-Svelte pattern
    </p>
  </div>

  <!-- Composition selector -->
  <div class="flex gap-2 mb-6">
    {#each compositions as comp}
      <button
        onclick={() => (selectedComposition = comp)}
        class="px-4 py-2 rounded-xl text-sm font-medium transition-colors {selectedComposition.id ===
        comp.id
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
      >
        {comp.label}
      </button>
    {/each}
  </div>

  <!-- Player container (React mounts here) -->
  <div bind:this={playerContainer} class="w-full bg-black rounded-xl overflow-hidden aspect-video">
    <!-- React Player renders here -->
    <div class="flex items-center justify-center h-full text-slate-600">Loading player...</div>
  </div>

  <!-- Composition info -->
  <div class="mt-4 grid grid-cols-3 gap-4">
    {#each stats as stat}
      <div class="bg-slate-900 rounded-xl p-4">
        <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">{stat.label}</div>
        <div class="font-mono text-white">{stat.value}</div>
      </div>
    {/each}
  </div>

  <!-- Architecture note -->
  <div class="mt-6 bg-slate-900 rounded-xl p-5 border border-slate-700">
    <div class="text-sm font-semibold text-slate-300 mb-2">⚙️ Architecture</div>
    <div class="text-xs text-slate-400 font-mono space-y-1">
      <div>apps/remotion (+page.svelte)</div>
      <div class="pl-4">→ $effect: import('react-dom/client').createRoot(div)</div>
      <div class="pl-4">→ import('@remotion/player').Player</div>
      <div class="pl-4">→ import('@repo/remotion-compositions').HelloWorld</div>
      <div class="pl-4">→ React renders Remotion Player in div#remotion-container</div>
    </div>
  </div>

  <!-- PDS Demo section (React-in-Svelte) -->
  <div class="mt-8">
    <h2 class="text-lg font-semibold text-white mb-3">🏎️ Porsche Design System Demo</h2>
    <p class="text-slate-400 text-sm mb-4">PDS React components mounted via React-in-Svelte pattern</p>
    <div bind:this={pdsContainer} class="bg-white rounded-xl p-6 min-h-16"></div>
  </div>
</div>
