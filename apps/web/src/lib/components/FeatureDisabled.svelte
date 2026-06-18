<script lang="ts">
  interface Props {
    title?: string;
    backHref?: string;
    backLabel?: string;
  }
  let {
    title = 'Раздел временно недоступен',
    backHref = '/',
    backLabel = '← На главную',
  }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
  <div class="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
    <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  </div>
  <h2 class="text-xl font-bold mb-2">{title}</h2>
  <p class="text-sm opacity-60 mb-6">
    Функция отключена через feature flag. Администратор может включить её в
    <a href="/admin" class="underline hover:opacity-80">Admin Panel</a>.
  </p>
  <a href={backHref} class="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
    {backLabel}
  </a>
</div>
