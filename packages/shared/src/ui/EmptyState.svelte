<script lang="ts">
  interface Props {
    title?: string;
    description?: string;
    icon?: string;
    action?: import('svelte').Snippet;
  }

  let {
    title = 'Ничего не найдено',
    description = '',
    icon = '📭',
    action,
  }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
  <span class="text-5xl mb-4" role="img" aria-label="empty">{icon}</span>
  <h3 class="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
  {#if description}
    <p class="text-sm text-gray-500 max-w-xs">{description}</p>
  {/if}
  {#if action}
    <div class="mt-6">
      {@render action()}
    </div>
  {/if}
</div>
