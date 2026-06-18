<script lang="ts">
  import { cn } from '../utils/cn.js';

  type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  type Size = 'default' | 'sm' | 'lg' | 'icon';

  interface Props {
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children: import('svelte').Snippet;
  }

  let {
    variant = 'default',
    size = 'default',
    disabled = false,
    loading = false,
    type = 'button',
    class: className = '',
    onclick,
    children,
  }: Props = $props();

  const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

  const variants: Record<Variant, string> = {
    default: 'bg-slate-900 text-slate-50 hover:bg-slate-900/90 shadow',
    destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/90 shadow-sm',
    outline: 'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 shadow-sm',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80 shadow-sm',
    ghost: 'hover:bg-slate-100 hover:text-slate-900',
    link: 'text-slate-900 underline-offset-4 hover:underline',
  };

  const sizes: Record<Size, string> = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
  };
</script>

<button
  {type}
  class={cn(base, variants[variant], sizes[size], className)}
  disabled={disabled || loading}
  {onclick}
>
  {#if loading}
    <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  {/if}
  {@render children()}
</button>
