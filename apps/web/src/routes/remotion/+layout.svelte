<script lang="ts">
  import FeatureDisabled from '$lib/components/FeatureDisabled.svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children: import('svelte').Snippet;
  }
  let { data, children }: Props = $props();
</script>

{#if !data.featureEnabled}
  <div class="min-h-screen bg-slate-950 text-white font-sans">
    <FeatureDisabled title="Remotion Studio временно недоступен" />
  </div>
{:else}
  <div class="min-h-screen bg-slate-950 text-white font-sans">
    <header class="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur px-6 py-3 flex items-center justify-between">
      <span class="font-bold text-lg tracking-tight">🎬 Remotion Studio</span>
      <div class="flex gap-4 text-sm">
        <a href="/remotion" class="text-slate-400 hover:text-white transition-colors">Player</a>
        <a href="/remotion/docs" class="text-slate-400 hover:text-white transition-colors">Docs</a>
        <a href="/" class="text-slate-500 hover:text-slate-300 transition-colors">← Portal</a>
      </div>
    </header>
    {@render children()}
  </div>
{/if}
