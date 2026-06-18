import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { setAuthCookie } from '$lib/server/auth.js';

export const load: PageServerLoad = ({ locals }) => {
  if (locals.isAuthenticated) redirect(302, '/admin/dashboard');
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const secret = data.get('secret')?.toString() ?? '';
    const ok = setAuthCookie(event, secret);
    if (!ok) return fail(401, { error: 'Неверный пароль' });
    redirect(302, '/admin/dashboard');
  },
};
