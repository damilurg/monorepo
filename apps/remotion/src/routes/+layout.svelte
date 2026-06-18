<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';

  interface Props {
    children: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const links = [
    { href: '/', label: '📺 Studio' },
    { href: '/docs', label: '📚 Docs' },
  ];
</script>

<div class="min-h-screen bg-slate-950 text-white">
  <nav
    class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 py-3 flex items-center gap-6"
  >
    <div class="flex items-center gap-2 font-bold text-lg mr-4">
      <span class="text-2xl">🎬</span> Remotion Studio
    </div>
    {#each links as link}
      <a
        href={link.href}
        class="text-sm font-medium transition-colors {$page.url.pathname === link.href
          ? 'text-white'
          : 'text-slate-400 hover:text-white'}"
      >
        {link.label}
      </a>
    {/each}
  </nav>
  {@render children()}
</div>
