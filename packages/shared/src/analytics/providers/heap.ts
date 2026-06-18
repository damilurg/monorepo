import type { AnalyticsProvider, EventName, EventProps, UserTraits } from '../types.js';

declare global {
  interface Window {
    heap: {
      load: (id: string, config?: Record<string, unknown>) => void;
      track: (event: string, props?: Record<string, unknown>) => void;
      identify: (identity: string) => void;
      addUserProperties: (props: Record<string, unknown>) => void;
      resetIdentity: () => void;
    };
  }
}

export class HeapProvider implements AnalyticsProvider {
  readonly name = 'Heap';
  private ready = false;

  init({ appId }: { appId: string }) {
    if (typeof window === 'undefined' || !appId) return;

    // Heap snippet (minimal inline loader)
    const heap = (window.heap = window.heap ?? ({} as typeof window.heap));
    heap.load(appId);

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://cdn.heapanalytics.com/js/heap-' + appId + '.js';
    document.head.appendChild(script);

    this.ready = true;
  }

  track<N extends EventName>(event: N, props: EventProps<N>) {
    if (!this.ready || typeof window?.heap?.track !== 'function') return;
    window.heap.track(event, props as Record<string, unknown>);
  }

  identify(userId: string, traits: UserTraits = {}) {
    if (!this.ready || typeof window?.heap?.identify !== 'function') return;
    window.heap.identify(userId);
    if (Object.keys(traits).length > 0) {
      window.heap.addUserProperties(traits as Record<string, unknown>);
    }
  }

  page(path: string, _title: string) {
    // Heap autocaptures page views; manual call available if needed
    this.track('page_view' as never, { path, title: _title, lang: '' } as never);
  }

  reset() {
    if (!this.ready || typeof window?.heap?.resetIdentity !== 'function') return;
    window.heap.resetIdentity();
  }
}
