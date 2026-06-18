export function initWebVitals() {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    const report = (metric: { name: string; value: number; rating: string }) => {
      // Log to console in dev
      if (import.meta.env.DEV) {
        const color = metric.rating === 'good' ? '🟢' : metric.rating === 'needs-improvement' ? '🟡' : '🔴';
        console.log(`${color} ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`);
      }

      // Send to analytics endpoint in production
      if (!import.meta.env.DEV && navigator.sendBeacon) {
        navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
      }
    };

    onCLS(report);
    onINP(report);
    onLCP(report);
    onFCP(report);
    onTTFB(report);
  }).catch(() => {/* web-vitals not available */});
}
