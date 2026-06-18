import type { RequestHandler } from './$types';
import { handleMapsSearch } from '$modules/maps/server/handler.js';

export const GET: RequestHandler = (event) => handleMapsSearch(event);
