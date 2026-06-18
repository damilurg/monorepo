<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';
  interface Props { form: ActionData; }
  let { form }: Props = $props();
</script>

<svelte:head><title>Вход — Admin</title></svelte:head>

<div class="min-h-screen flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <div class="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">⚙️</div>
      <h1 class="text-2xl font-bold text-white">Admin Panel</h1>
      <p class="text-gray-400 text-sm mt-1">Feature Flag Manager</p>
    </div>

    <form method="POST" use:enhance class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="secret" class="text-sm font-medium text-gray-300">Пароль</label>
        <input
          id="secret" name="secret" type="password"
          placeholder="••••••••" required autocomplete="current-password"
          class="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
        />
        {#if form?.error}
          <p class="text-sm text-red-400">{form.error}</p>
        {/if}
      </div>
      <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors">
        Войти
      </button>
    </form>

    <p class="text-center mt-6 text-xs text-slate-500">
      <a href="/" class="hover:text-slate-300 transition-colors">← На главную</a>
    </p>
  </div>
</div>
