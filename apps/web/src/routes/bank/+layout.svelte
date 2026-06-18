<script lang="ts">
  import Nav from '$lib/components/bank/Nav.svelte';
  import FeatureDisabled from '$lib/components/FeatureDisabled.svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children: import('svelte').Snippet;
  }
  let { data, children }: Props = $props();
</script>

{#if !data.featureEnabled}
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <FeatureDisabled title="Bank временно недоступен" />
  </div>
{:else}
  <Nav />
  {@render children()}
{/if}
