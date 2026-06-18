import type { RequestHandler } from './$types';
import { handleContentGet } from '$modules/content/server/handler.js';

export const GET: RequestHandler = (event) => handleContentGet(event);
