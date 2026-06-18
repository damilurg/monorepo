<script lang="ts">
  interface Props {
    title: string;
    description: string;
    canonical?: string;
    ogType?: 'website' | 'article';
    ogImage?: string;
    noindex?: boolean;
    jsonLd?: object;
    lang?: string;
  }

  let {
    title,
    description,
    canonical = '',
    ogType = 'website',
    ogImage = '/og-default.png',
    noindex = false,
    jsonLd,
    lang = 'ru',
  }: Props = $props();

  const siteName = 'Automotive Portal';
  const fullTitle = $derived(title === siteName ? title : `${title} — ${siteName}`);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
  {#if canonical}
    <link rel="canonical" href={canonical} />
  {/if}
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={ogType} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:locale" content={lang === 'ru' ? 'ru_RU' : 'en_US'} />
  <meta property="og:locale:alternate" content={lang === 'ru' ? 'en_US' : 'ru_RU'} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
  {#if jsonLd}
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<` + `/script>`}
  {/if}
</svelte:head>
