import { httpGet } from '@repo/shared/api';
import type { QuotesResponse } from '../model/types.js';

const BASE_URL = 'https://dummyjson.com';

export async function fetchQuotes(limit = 150): Promise<QuotesResponse> {
  return httpGet<QuotesResponse>(`${BASE_URL}/quotes?limit=${limit}`);
}
