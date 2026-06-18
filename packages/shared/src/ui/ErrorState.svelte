<script lang="ts">
  interface Props {
    title?: string;
    message?: string;
    onRetry?: () => void;
  }

  let {
    title = 'Произошла ошибка',
    message = 'Попробуйте обновить страницу',
    onRetry,
  }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
  <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
    <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  </div>
  <h3 class="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
  <p class="text-sm text-gray-500 max-w-xs">{message}</p>
  {#if onRetry}
    <button
      class="mt-6 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
      onclick={onRetry}
    >
      Попробовать снова
    </button>
  {/if}
</div>
