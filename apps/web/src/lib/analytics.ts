/**
 * App-level analytics initialization.
 * Called once from +layout.svelte on mount.
 * Reads provider keys from SvelteKit public env.
 */
import { analytics } from '@repo/shared/analytics';
import { browser } from '$app/environment';
import { page } from '$app/stores';
import { get } from 'svelte/store';

export async function initAnalytics(env: {
  PUBLIC_GA4_ID?: string;
  PUBLIC_HEAP_APP_ID?: string;
  PUBLIC_AMPLITUDE_API_KEY?: string;
}) {
  if (!browser) return;

  await analytics.init({
    ga4: env.PUBLIC_GA4_ID ? { measurementId: env.PUBLIC_GA4_ID } : undefined,
    heap: env.PUBLIC_HEAP_APP_ID ? { appId: env.PUBLIC_HEAP_APP_ID } : undefined,
    amplitude: env.PUBLIC_AMPLITUDE_API_KEY ? { apiKey: env.PUBLIC_AMPLITUDE_API_KEY } : undefined,
    debug: import.meta.env.DEV,
  });

  // Track initial page view
  const currentPage = get(page);
  analytics.page(currentPage.url.pathname, document.title);
}

// Re-export the singleton for convenience
export { analytics } from '@repo/shared/analytics';
