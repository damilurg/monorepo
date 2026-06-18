<script lang="ts">
  import '$lib/weather-theme.css';
  interface Props { children: import('svelte').Snippet }
  let { children }: Props = $props();
</script>
<div data-theme="cerberus" class="min-h-screen">
  {@render children()}
</div>
