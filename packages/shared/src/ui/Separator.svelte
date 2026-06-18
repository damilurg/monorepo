<script lang="ts">
  import { cn } from '../utils/cn.js';
  interface Props { orientation?: 'horizontal' | 'vertical'; class?: string }
  let { orientation = 'horizontal', class: className = '' }: Props = $props();
</script>
<div
  role="separator"
  class={cn(
    'shrink-0 bg-slate-200',
    orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
    className
  )}
></div>
