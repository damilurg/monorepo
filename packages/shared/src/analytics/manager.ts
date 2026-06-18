import type { AnalyticsConfig, AnalyticsProvider, EventName, EventProps, UserTraits } from './types.js';
import { GA4Provider } from './providers/ga4.js';
import { HeapProvider } from './providers/heap.js';
import { AmplitudeProvider } from './providers/amplitude.js';

/**
 * AnalyticsManager
 *
 * Sends every event to ALL configured providers simultaneously.
 * Usage:
 *   analytics.track('exchange_base_changed', { from: 'EUR', to: 'USD' });
 *   analytics.identify('user-123', { lang: 'ru' });
 *
 * In tests: replace with NoopAnalytics.
 */
export class AnalyticsManager {
  private providers: AnalyticsProvider[] = [];
  private debug = false;
  private _initialized = false;

  async init(config: AnalyticsConfig): Promise<void> {
    if (this._initialized || typeof window === 'undefined') return;
    this.debug = config.debug ?? import.meta.env?.DEV ?? false;

    const pending: Promise<void>[] = [];

    if (config.ga4?.measurementId) {
      const p = new GA4Provider();
      p.init({ measurementId: config.ga4.measurementId });
      this.providers.push(p);
    }

    if (config.heap?.appId) {
      const p = new HeapProvider();
      p.init({ appId: config.heap.appId });
      this.providers.push(p);
    }

    if (config.amplitude?.apiKey) {
      const p = new AmplitudeProvider();
      pending.push(p.init({ apiKey: config.amplitude.apiKey }).then(() => { this.providers.push(p); }));
    }

    await Promise.allSettled(pending);
    this._initialized = true;

    if (this.debug) {
      console.log(`[Analytics] Initialized providers: ${this.providers.map(p => p.name).join(', ') || 'none'}`);
    }
  }

  track<N extends EventName>(event: N, props: EventProps<N>): void {
    if (this.debug) {
      console.log(`[Analytics] track: ${event}`, props);
    }
    for (const provider of this.providers) {
      try {
        provider.track(event, props);
      } catch (err) {
        console.warn(`[Analytics] ${provider.name} track failed:`, err);
      }
    }
  }

  identify(userId: string, traits?: UserTraits): void {
    if (this.debug) console.log(`[Analytics] identify: ${userId}`, traits);
    for (const provider of this.providers) {
      try { provider.identify(userId, traits); } catch { /* noop */ }
    }
  }

  page(path: string, title: string): void {
    if (this.debug) console.log(`[Analytics] page: ${path}`);
    for (const provider of this.providers) {
      try { provider.page(path, title); } catch { /* noop */ }
    }
  }

  reset(): void {
    for (const provider of this.providers) {
      try { provider.reset(); } catch { /* noop */ }
    }
  }

  /** For testing: returns a no-op instance */
  static noop(): AnalyticsManager {
    return new AnalyticsManager();
  }

  get initialized(): boolean {
    return this._initialized;
  }
}

// Singleton — import `analytics` everywhere
export const analytics = new AnalyticsManager();
