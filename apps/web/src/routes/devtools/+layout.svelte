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
  <div class="min-h-screen bg-slate-900 text-slate-100 font-sans">
    <FeatureDisabled title="DevTools временно недоступен" />
  </div>
{:else}
  <div class="min-h-screen bg-slate-900 text-slate-100 font-sans">
    <div class="fixed top-3 left-4 z-50">
      <a href="/" class="text-xs text-slate-500 hover:text-slate-300 transition-colors">← Portal</a>
    </div>
    {@render children()}
  </div>
{/if}
