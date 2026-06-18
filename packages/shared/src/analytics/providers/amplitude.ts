import type { AnalyticsProvider, EventName, EventProps, UserTraits } from '../types.js';

export class AmplitudeProvider implements AnalyticsProvider {
  readonly name = 'Amplitude';
  private sdk: {
    track: (name: string, props?: Record<string, unknown>) => void;
    setUserId: (id: string | undefined) => void;
    identify: (identity: unknown) => void;
    reset: () => void;
  } | null = null;

  async init({ apiKey }: { apiKey: string }) {
    if (typeof window === 'undefined' || !apiKey) return;

    // Use a variable so Vite's static analyzer can't resolve the package name
    // at build/SSR time. The .catch() handles the case where the SDK is not installed.
    const pkg = '@amplitude/analytics-browser';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const amplitude = await import(/* @vite-ignore */ pkg).catch(() => null);
    if (!amplitude) return;

    amplitude.init(apiKey, undefined, {
      defaultTracking: { sessions: true, pageViews: false, formInteractions: false },
    });

    this.sdk = amplitude;
  }

  track<N extends EventName>(event: N, props: EventProps<N>) {
    this.sdk?.track(event, props as Record<string, unknown>);
  }

  identify(userId: string, traits: UserTraits = {}) {
    if (!this.sdk) return;
    this.sdk.setUserId(userId);
    const { Identify } = this.sdk as unknown as { Identify: new () => { set: (k: string, v: unknown) => unknown } };
    if (Identify && Object.keys(traits).length > 0) {
      const id = new Identify();
      for (const [k, v] of Object.entries(traits)) {
        if (v !== undefined) id.set(k, v);
      }
      this.sdk.identify(id);
    }
  }

  page(path: string, title: string) {
    this.track('page_view' as never, { path, title, lang: '' } as never);
  }

  reset() {
    this.sdk?.reset();
  }
}
