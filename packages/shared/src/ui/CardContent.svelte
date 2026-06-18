<script lang="ts">
  import { cn } from '../utils/cn.js';
  interface Props { class?: string; children: import('svelte').Snippet }
  let { class: className = '', children }: Props = $props();
</script>
<div class={cn('p-6 pt-0', className)}>{@render children()}</div>
