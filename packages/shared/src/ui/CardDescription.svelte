<script lang="ts">
  import { cn } from '../utils/cn.js';
  interface Props { class?: string; children: import('svelte').Snippet }
  let { class: className = '', children }: Props = $props();
</script>
<p class={cn('text-sm text-slate-500', className)}>{@render children()}</p>
