import type { RequestHandler } from './$types';
import { handleBlogGet } from '$modules/blog/server/handler.js';

export const GET: RequestHandler = (event) => handleBlogGet(event);
