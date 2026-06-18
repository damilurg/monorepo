import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { clearAuthCookie } from '$lib/server/auth.js';

export const load: PageServerLoad = ({ event }) => {
  clearAuthCookie(event);
  redirect(302, '/admin/login');
};
