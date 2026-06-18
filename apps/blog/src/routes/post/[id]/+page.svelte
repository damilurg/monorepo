<script lang="ts">
  import type { PageData } from './$types';
  import { PageHeader, Card, Loader, ErrorState } from '@repo/shared/ui';
  import { formatApiError } from '@repo/shared';
  import type { Post, Comment } from '$modules/blog/model/types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let spaPost = $state<Post | null>(null);
  let spaComments = $state<Comment[]>([]);
  let spaLoading = $state(false);
  let spaError = $state('');

  async function fetchPost() {
    spaLoading = true;
    spaError = '';
    try {
      const [postRes, commentsRes] = await Promise.all([
        fetch(`/?id=${data.postId}`),
        fetch(`/?id=${data.postId}&comments=1`),
      ]);
      if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
      spaPost = await postRes.json() as Post;
      spaComments = commentsRes.ok ? await commentsRes.json() as Comment[] : [];
    } catch (e) {
      spaError = formatApiError(e);
    } finally {
      spaLoading = false;
    }
  }

  $effect(() => {
    if (data.renderMode === 'spa') {
      void fetchPost();
    }
  });

  let post = $derived(data.renderMode === 'ssr' ? data.post : spaPost);
  let comments = $derived(data.renderMode === 'ssr' ? data.comments : spaComments);
</script>

<svelte:head>
  <title>{post?.title ?? 'Загрузка...'} — Блог</title>
</svelte:head>

<PageHeader
  title={post?.title ?? 'Загрузка...'}
  backHref="/"
  backLabel="Все статьи"
/>

<div class="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

  {#if data.renderMode === 'spa' && spaLoading}
    <Loader text="Загружаем статью..." />
  {:else if spaError}
    <ErrorState message={spaError} onRetry={fetchPost} />
  {:else if post}

    <Card>
      <p class="text-gray-700 leading-relaxed text-base">{post.body}</p>
      <div class="mt-4 pt-4 border-t border-gray-50">
        <span class="text-xs text-gray-400">Автор #{post.userId} · Пост #{post.id}</span>
      </div>
    </Card>

    {#if comments.length > 0}
      <div>
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
          Комментарии ({comments.length})
        </h2>
        <div class="flex flex-col gap-3">
          {#each comments as comment (comment.id)}
            <Card padding="sm">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-semibold text-gray-800 capitalize">{comment.name}</span>
                  <span class="text-xs text-gray-400">{comment.email}</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{comment.body}</p>
              </div>
            </Card>
          {/each}
        </div>
      </div>
    {/if}

  {/if}
</div>
