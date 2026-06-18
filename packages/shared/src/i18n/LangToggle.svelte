<script lang="ts">
  import type { I18nStore } from './types.js';

  interface Props {
    store: I18nStore;
    class?: string;
  }

  let { store, class: className = '' }: Props = $props();
</script>

<button
  onclick={() => store.toggle()}
  class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sm font-semibold text-slate-200 transition-all duration-200 select-none {className}"
  aria-label="Switch language"
  title={store.lang === 'ru' ? 'Switch to English' : 'Переключить на Русский'}
>
  <span class="text-base leading-none">{store.lang === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
  <span class="uppercase tracking-wide text-xs">{store.lang === 'ru' ? 'EN' : 'RU'}</span>
</button>
