import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

const COOKIE_NAME = 'admin_auth';

export function getAdminSecret(): string {
  return process.env['ADMIN_SECRET'] ?? 'changeme';
}

export function isAuthenticated(event: RequestEvent): boolean {
  return event.cookies.get(COOKIE_NAME) === getAdminSecret();
}

export function setAuthCookie(event: RequestEvent, secret: string): boolean {
  if (secret !== getAdminSecret()) return false;
  event.cookies.set(COOKIE_NAME, secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
  });
  return true;
}

export function clearAuthCookie(event: RequestEvent): void {
  event.cookies.delete(COOKIE_NAME, { path: '/' });
}

export function requireAuth(event: RequestEvent): void {
  if (!isAuthenticated(event)) {
    redirect(302, '/admin/login');
  }
}
