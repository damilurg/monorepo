import type { RequestHandler } from './$types';
import { handleExchangeGet } from '$modules/exchange/server/handler.js';

export const GET: RequestHandler = (event) => handleExchangeGet(event);
