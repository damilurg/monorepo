import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://example.com/sitemap.xml`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
