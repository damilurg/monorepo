<script lang="ts">
  import { cn } from '../utils/cn.js';

  interface Props {
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children: import('svelte').Snippet;
  }

  let { class: className = '', onclick, children }: Props = $props();

  const base = 'rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm';
  const interactive = 'cursor-pointer hover:shadow-md transition-shadow';
</script>

{#if onclick}
  <button
    type="button"
    class={cn(base, interactive, className)}
    {onclick}
  >
    {@render children()}
  </button>
{:else}
  <div class={cn(base, className)}>
    {@render children()}
  </div>
{/if}
