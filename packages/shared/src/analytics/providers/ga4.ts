import type { AnalyticsProvider, EventName, EventProps, UserTraits } from '../types.js';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export class GA4Provider implements AnalyticsProvider {
  readonly name = 'GA4';
  private measurementId = '';
  private ready = false;

  init({ measurementId }: { measurementId: string }) {
    if (typeof window === 'undefined' || !measurementId) return;
    this.measurementId = measurementId;

    // Inject gtag script
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    this.ready = true;
  }

  track<N extends EventName>(event: N, props: EventProps<N>) {
    if (!this.ready || typeof window === 'undefined') return;
    window.gtag('event', event, props);
  }

  identify(userId: string, traits: UserTraits = {}) {
    if (!this.ready || typeof window === 'undefined') return;
    window.gtag('config', this.measurementId, { user_id: userId, user_properties: traits });
  }

  page(path: string, title: string) {
    if (!this.ready || typeof window === 'undefined') return;
    window.gtag('event', 'page_view', { page_path: path, page_title: title });
  }

  reset() {
    if (!this.ready || typeof window === 'undefined') return;
    window.gtag('config', this.measurementId, { user_id: undefined });
  }
}
