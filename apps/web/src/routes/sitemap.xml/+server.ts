import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  const base = 'https://example.com';

  const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/exchange', changefreq: 'hourly', priority: '0.9' },
    { url: '/weather', changefreq: 'hourly', priority: '0.9' },
    { url: '/blog', changefreq: 'daily', priority: '0.8' },
    { url: '/content', changefreq: 'weekly', priority: '0.7' },
    { url: '/cars', changefreq: 'monthly', priority: '0.7' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${base}${r.url}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600',
    },
  });
};
