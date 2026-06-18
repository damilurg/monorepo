<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/stores';
</script>

<div class="flex items-center justify-center h-full text-center py-20">
  <div>
    <div class="text-7xl font-bold text-slate-700 mb-3">{$page.status}</div>
    <div class="text-slate-400 text-lg mb-6">{$page.error?.message ?? 'An error occurred'}</div>
    <a
      href="{base}/"
      class="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
    >
      ← Back to Overview
    </a>
  </div>
</div>
