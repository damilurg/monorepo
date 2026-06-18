<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
    backHref?: string;
    backLabel?: string;
    actions?: import('svelte').Snippet;
  }

  let { title, subtitle = '', backHref = '', backLabel = 'Назад', actions }: Props = $props();
</script>

<header class="bg-white border-b border-gray-100 sticky top-0 z-10">
  <div class="max-w-2xl mx-auto px-4 py-4">
    {#if backHref}
      <a
        href={backHref}
        class="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-2 font-medium"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {backLabel}
      </a>
    {/if}
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
        {#if subtitle}
          <p class="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        {/if}
      </div>
      {#if actions}
        <div class="flex-shrink-0">
          {@render actions()}
        </div>
      {/if}
    </div>
  </div>
</header>
