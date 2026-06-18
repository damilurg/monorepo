<script lang="ts">
  interface Props {
    status: number;
    message?: string;
    homeHref?: string;
  }

  let { status, message = 'Что-то пошло не так', homeHref = '/' }: Props = $props();

  const titles: Record<number, string> = {
    404: 'Страница не найдена',
    403: 'Доступ запрещён',
    500: 'Ошибка сервера',
    503: 'Сервис недоступен',
  };

  const subtitles: Record<number, string> = {
    404: 'Мы не смогли найти то, что вы ищете. Возможно, страница была удалена или URL введён неверно.',
    403: 'У вас нет прав для просмотра этой страницы.',
    500: 'На сервере произошла непредвиденная ошибка. Мы уже работаем над исправлением.',
    503: 'Сервис временно недоступен. Попробуйте немного позже.',
  };

  let title = $derived(titles[status] ?? 'Неизвестная ошибка');
  let subtitle = $derived(subtitles[status] ?? message);
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
  <!-- Decorative blobs -->
  <div class="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl"></div>
  <div class="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl"></div>

  <div class="relative flex flex-col items-center text-center">
    <!-- Status code -->
    <span class="select-none bg-gradient-to-b from-slate-300 to-slate-500 bg-clip-text text-[9rem] font-black leading-none tracking-tighter text-transparent sm:text-[12rem]">
      {status}
    </span>

    <!-- Title -->
    <h1 class="mt-2 text-2xl font-bold text-white sm:text-3xl">
      {title}
    </h1>

    <!-- Subtitle -->
    <p class="mt-3 max-w-sm text-sm leading-relaxed text-slate-400 sm:text-base">
      {subtitle}
    </p>

    <!-- Divider -->
    <div class="my-8 h-px w-24 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>

    <!-- Actions -->
    <div class="flex flex-col items-center gap-3 sm:flex-row">
      <a
        href={homeHref}
        class="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-800/40 active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        На главную
      </a>
      <button
        onclick={() => history.back()}
        class="inline-flex items-center gap-2 rounded-full border border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-slate-500 hover:text-white active:scale-95"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Назад
      </button>
    </div>

    <!-- Error detail (dev only) -->
    {#if message && message !== subtitles[status]}
      <p class="mt-6 rounded-lg bg-slate-800/60 px-4 py-2 font-mono text-xs text-slate-500">
        {message}
      </p>
    {/if}
  </div>
</div>
