import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface VitalsPayload {
  name: string;
  value: number;
  rating: string;
}

/**
 * POST /api/vitals
 * Receives Core Web Vitals metrics sent by web-vitals via navigator.sendBeacon.
 * Extend this handler to forward to your analytics backend (Datadog, Grafana, etc.).
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const text = await request.text();
    const metric = JSON.parse(text) as VitalsPayload;

    // Validate minimal shape
    if (!metric.name || typeof metric.value !== 'number') {
      return json({ error: 'Invalid payload' }, { status: 400 });
    }

    // TODO: forward to your observability backend, e.g.:
    //   await sendToDatadog(metric);
    //   await sendToGrafana(metric);
    // For now we log server-side (visible in Node stdout / cloud logs).
    console.info(`[web-vitals] ${metric.name}: ${Math.round(metric.value)} (${metric.rating})`);

    return json({ ok: true });
  } catch {
    return json({ error: 'Bad request' }, { status: 400 });
  }
};
