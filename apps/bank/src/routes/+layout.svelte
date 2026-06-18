<script lang="ts">
  import '../app.css';
  import { setContext } from 'svelte';
  import Nav from '$lib/components/Nav.svelte';
  import { LangToggle } from '@repo/shared/i18n';
  import { i18n } from '$lib/i18n.svelte.js';

  interface Props {
    children: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  setContext('i18n', i18n);
</script>

<div class="fixed top-4 right-4 z-50">
  <LangToggle store={i18n} />
</div>
<Nav />
{@render children()}
