import { type Handle } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/server/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.isAuthenticated = isAuthenticated(event);
  return resolve(event);
};
