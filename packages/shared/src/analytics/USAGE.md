# Analytics Usage

## Track an event
```typescript
import { analytics } from '@repo/shared/analytics';
// or from the app:
import { analytics } from '$lib/analytics';

// Fully typed — TypeScript enforces event name + props shape
analytics.track('exchange_base_changed', { from: 'EUR', to: 'USD' });
analytics.track('weather_city_searched', { city: 'paris' });
analytics.track('vin_decoded', { make: 'HONDA', model: 'Civic', year: '2021', valid: true });
```

## Identify a user
```typescript
analytics.identify('user-123', { lang: 'ru', plan: 'free' });
```

## Add a new event
1. Add the event type to `packages/shared/src/analytics/types.ts`:
   ```typescript
   | { name: 'insurance_quote_started'; props: { type: string; premium: number } }
   ```
2. TypeScript now enforces the props everywhere automatically.

## Add a new provider (e.g., Mixpanel)
1. Create `packages/shared/src/analytics/providers/mixpanel.ts` implementing `AnalyticsProvider`
2. Add `mixpanel?: { token: string }` to `AnalyticsConfig`
3. Instantiate it in `AnalyticsManager.init()`
4. Add `PUBLIC_MIXPANEL_TOKEN` to `.env.example`
