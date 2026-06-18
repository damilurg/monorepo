import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
  if (locals.isAuthenticated) redirect(302, '/admin/dashboard');
  redirect(302, '/admin/login');
};
