import type { RequestHandler } from './$types';
import { handleCarsGet } from '$modules/cars/server/handler.js';

export const GET: RequestHandler = (event) => handleCarsGet(event);
