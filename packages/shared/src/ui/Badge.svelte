<script lang="ts">
  import { cn } from '../utils/cn.js';

  type Variant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

  interface Props {
    variant?: Variant;
    class?: string;
    children: import('svelte').Snippet;
  }

  let { variant = 'default', class: className = '', children }: Props = $props();

  const variants: Record<Variant, string> = {
    default: 'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80',
    secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80',
    destructive: 'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80',
    outline: 'text-slate-950',
    success: 'border-transparent bg-emerald-500 text-white hover:bg-emerald-500/80',
    warning: 'border-transparent bg-amber-500 text-white hover:bg-amber-500/80',
  };
</script>

<div class={cn('inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors', variants[variant], className)}>
  {@render children()}
</div>
