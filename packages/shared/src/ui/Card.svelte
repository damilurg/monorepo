<script lang="ts">
  import { cn } from '../utils/cn.js';

  interface Props {
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children: import('svelte').Snippet;
  }

  let { class: className = '', onclick, children }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
  class={cn('rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm', onclick && 'cursor-pointer hover:shadow-md transition-shadow', className)}
  {onclick}
>
  {@render children()}
</div>
