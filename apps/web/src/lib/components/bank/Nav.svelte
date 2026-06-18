<script lang="ts">
  import { page } from '$app/stores';

  const links = [
    { href: '/', label: 'На главную' },
    { href: '/bank/dashboard', label: 'Dashboard' },
    { href: '/devtools', label: 'DevTools' },
  ];
</script>

<nav class="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-md">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
    <a href="/bank" class="flex items-center gap-2 text-xl font-bold text-indigo-600">
      <span class="text-2xl">◆</span> NovaBank
    </a>
    <div class="flex items-center gap-6">
      {#each links as link}
        <a
          href={link.href}
          class="text-sm font-medium transition-colors {$page.url.pathname === link.href
            ? 'text-indigo-600'
            : 'text-gray-600 hover:text-gray-900'}"
        >
          {link.label}
        </a>
      {/each}
      <a
        href="/bank/dashboard"
        class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Dashboard
      </a>
    </div>
  </div>
</nav>
