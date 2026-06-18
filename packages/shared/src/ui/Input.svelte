<script lang="ts">
  import { cn } from '../utils/cn.js';

  interface Props {
    value?: string;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    readonly?: boolean;
    class?: string;
    id?: string;
    name?: string;
    onchange?: (e: Event) => void;
    oninput?: (e: Event) => void;
    onkeydown?: (e: KeyboardEvent) => void;
  }

  let {
    value = $bindable(''),
    placeholder = '',
    type = 'text',
    disabled = false,
    readonly = false,
    class: className = '',
    id,
    name,
    onchange,
    oninput,
    onkeydown,
  }: Props = $props();
</script>

<input
  {type}
  {id}
  {name}
  bind:value
  {placeholder}
  {disabled}
  {readonly}
  {onchange}
  {oninput}
  {onkeydown}
  class={cn(
    'flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    className
  )}
/>
