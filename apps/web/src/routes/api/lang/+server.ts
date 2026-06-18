import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { lang } = await request.json();
  if (lang === 'ru' || lang === 'en') {
    cookies.set('lang', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      sameSite: 'lax',
    });
  }
  return json({ ok: true });
};
