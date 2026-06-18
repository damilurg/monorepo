<script lang="ts">
  import { cn } from '../utils/cn.js';
  interface Props { class?: string; children: import('svelte').Snippet }
  let { class: className = '', children }: Props = $props();
</script>
<div class={cn('flex flex-col space-y-1.5 p-6', className)}>{@render children()}</div>
