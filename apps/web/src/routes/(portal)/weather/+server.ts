import type { RequestHandler } from './$types';
import { handleWeatherGet } from '$modules/weather/server/handler.js';

export const GET: RequestHandler = (event) => handleWeatherGet(event);
