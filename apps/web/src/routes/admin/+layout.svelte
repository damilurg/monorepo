<script lang="ts">
  import { LangToggle } from '@repo/shared/i18n';
  import { adminI18n } from '$lib/admin-i18n.svelte.js';

  interface Props { children: import('svelte').Snippet }
  let { children }: Props = $props();
</script>

<div class="min-h-screen bg-slate-950 text-slate-100">
  <div class="fixed top-4 right-4 z-50">
    <LangToggle store={adminI18n} />
  </div>
  {@render children()}
</div>
