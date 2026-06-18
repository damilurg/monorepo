import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.featureEnabled) {
    error(403, { message: 'Cars module is disabled' });
  }

  return {};
};
