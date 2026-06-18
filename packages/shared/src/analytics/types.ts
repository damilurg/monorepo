// ─── Core event catalog ──────────────────────────────────────────────────────
// All tracked events are defined here. Adding a new event = add to this union.
// This prevents magic strings and gives autocomplete across all apps.

export type AnalyticsEvent =
  // Navigation
  | { name: 'page_view'; props: { path: string; title: string; lang: string } }
  | { name: 'module_opened'; props: { module: string; render_mode: 'ssr' | 'spa' } }
  // Exchange
  | { name: 'exchange_base_changed'; props: { from: string; to: string } }
  | { name: 'exchange_converted'; props: { from: string; to: string; amount: number } }
  // Weather
  | { name: 'weather_city_searched'; props: { city: string } }
  | { name: 'weather_city_switched'; props: { from: string; to: string } }
  // Blog
  | { name: 'blog_post_opened'; props: { post_id: number; title: string } }
  | { name: 'blog_post_read'; props: { post_id: number; read_pct: number } }
  // Cars
  | { name: 'vin_decoded'; props: { make: string; model: string; year: string; valid: boolean } }
  | { name: 'vin_decode_failed'; props: { vin_length: number } }
  // Content
  | { name: 'quote_searched'; props: { query: string; results_count: number } }
  | { name: 'quote_copied'; props: { author: string } }
  // Feature flags
  | { name: 'feature_flag_blocked'; props: { module: string } }
  // Language
  | { name: 'lang_switched'; props: { from: string; to: string } }
  // Maps
  | { name: 'map_location_searched'; props: { query: string } }
  | { name: 'map_marker_added'; props: { lat: number; lon: number } }
  | { name: 'map_marker_removed'; props: { id: string } };

export type EventName = AnalyticsEvent['name'];
export type EventProps<N extends EventName> = Extract<AnalyticsEvent, { name: N }>['props'];

// ─── User identity ────────────────────────────────────────────────────────────
export interface UserTraits {
  userId?: string;
  email?: string;       // NEVER send raw email in production — hash it
  lang?: string;
  plan?: string;
  [key: string]: string | number | boolean | undefined;
}

// ─── Provider interface ───────────────────────────────────────────────────────
// Every analytics provider implements this contract.
export interface AnalyticsProvider {
  readonly name: string;
  init(config: Record<string, string>): void | Promise<void>;
  track<N extends EventName>(event: N, props: EventProps<N>): void;
  identify(userId: string, traits?: UserTraits): void;
  page(path: string, title: string): void;
  reset(): void;  // call on logout
}

// ─── Manager config ───────────────────────────────────────────────────────────
export interface AnalyticsConfig {
  ga4?: { measurementId: string };
  heap?: { appId: string };
  amplitude?: { apiKey: string };
  debug?: boolean;
}
