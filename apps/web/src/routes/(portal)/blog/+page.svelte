<script lang="ts">
  import type { PageData } from './$types';
  import { PageHeader, Card, Loader, ErrorState } from '@repo/shared/ui';
  import { truncate, formatApiError } from '@repo/shared';
  import type { Post } from '$modules/blog/model/types.js';
  import { langStore } from '$lib/lang-store.svelte.js';

  const T = {
    ru: {
      title: 'Блог',
      posts: 'публикаций',
      loadingPosts: 'Загружаем статьи...',
      readMore: 'Читать далее',
      back: 'На главную',
    },
    en: {
      title: 'Blog',
      posts: 'publications',
      loadingPosts: 'Loading articles...',
      readMore: 'Read more',
      back: 'Home',
    },
  };
  const t = $derived(T[langStore.current]);

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let spaPosts = $state<Post[]>([]);
  let spaLoading = $state(false);
  let spaError = $state('');

  async function fetchPosts() {
    spaLoading = true;
    spaError = '';
    try {
      const res = await fetch('/blog');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      spaPosts = await res.json() as Post[];
    } catch (e) {
      spaError = formatApiError(e);
    } finally {
      spaLoading = false;
    }
  }

  $effect(() => {
    if (data.renderMode === 'spa') {
      void fetchPosts();
    }
  });

  let posts = $derived(data.renderMode === 'ssr' ? data.posts : spaPosts);
</script>

<svelte:head>
  <title>{t.title} — Automotive Portal</title>
</svelte:head>

<PageHeader
  title={t.title}
  subtitle={posts.length > 0 ? `${posts.length} ${t.posts}` : ''}
  backHref="/"
  backLabel={t.back}
/>

<div class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-3">

  {#if data.renderMode === 'spa' && spaLoading}
    <Loader text={t.loadingPosts} />
  {:else if spaError}
    <ErrorState message={spaError} onRetry={fetchPosts} />
  {:else}
    <div data-testid="posts-list">
    {#each posts as post (post.id)}
      <a href="/blog/post/{post.id}" class="block" data-testid="post-card">
        <Card padding="md">
          <div class="flex flex-col gap-2">
            <div class="flex items-start justify-between gap-3">
              <h2 class="font-semibold text-gray-900 leading-tight capitalize">
                {truncate(post.title, 60)}
              </h2>
              <span class="text-xs text-gray-400 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-lg">#{post.id}</span>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed">{truncate(post.body, 100)}</p>
            <div class="flex items-center gap-1 text-blue-600 text-sm font-medium mt-1">
              {t.readMore}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Card>
      </a>
    {/each}
    </div>
  {/if}

</div>
