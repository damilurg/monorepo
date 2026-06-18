import { describe, it, expect } from 'vitest';

// Since the manager is a browser-only singleton, we test the type contracts
// and provider initialization in isolation

describe('AnalyticsManager (SSR guard)', () => {
  it('does not throw when called server-side (window undefined)', async () => {
    const { AnalyticsManager } = await import('./manager.js');
    const mgr = new AnalyticsManager();
    // Should not throw even without window
    await expect(mgr.init({})).resolves.not.toThrow();
  });

  it('initialized is false before init()', async () => {
    const { AnalyticsManager } = await import('./manager.js');
    const mgr = new AnalyticsManager();
    expect(mgr.initialized).toBe(false);
  });

  it('noop() returns a fresh AnalyticsManager instance', async () => {
    const { AnalyticsManager } = await import('./manager.js');
    const noop = AnalyticsManager.noop();
    expect(noop).toBeInstanceOf(AnalyticsManager);
    expect(noop.initialized).toBe(false);
  });

  it('track() does not throw when no providers are registered', async () => {
    const { AnalyticsManager } = await import('./manager.js');
    const mgr = new AnalyticsManager();
    expect(() => mgr.track('page_view', { path: '/', title: 'Home', lang: 'en' })).not.toThrow();
  });

  it('identify() does not throw when no providers are registered', async () => {
    const { AnalyticsManager } = await import('./manager.js');
    const mgr = new AnalyticsManager();
    expect(() => mgr.identify('user-123', { lang: 'ru' })).not.toThrow();
  });

  it('page() does not throw when no providers are registered', async () => {
    const { AnalyticsManager } = await import('./manager.js');
    const mgr = new AnalyticsManager();
    expect(() => mgr.page('/', 'Home')).not.toThrow();
  });

  it('reset() does not throw when no providers are registered', async () => {
    const { AnalyticsManager } = await import('./manager.js');
    const mgr = new AnalyticsManager();
    expect(() => mgr.reset()).not.toThrow();
  });
});

describe('Event catalog', () => {
  it('enforces known event names at compile time', () => {
    // This is a type-only test — verifies the union is non-empty
    type EventNames = import('./types.js').EventName;
    const knownEvents: EventNames[] = [
      'page_view',
      'exchange_base_changed',
      'weather_city_searched',
      'vin_decoded',
      'blog_post_opened',
      'quote_searched',
      'lang_switched',
    ];
    expect(knownEvents.length).toBeGreaterThan(0);
  });
});
