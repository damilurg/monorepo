<script lang="ts">
  import { page } from '$app/stores';
  import { ErrorPage } from '@repo/shared/ui';
</script>

<ErrorPage status={$page.status} message={$page.error?.message} homeHref="/" />
