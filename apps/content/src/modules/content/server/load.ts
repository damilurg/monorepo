import { fetchQuotes } from '../api/dummyjson.js';
import type { Quote } from '../model/types.js';

export interface ContentLoadResult {
  quotes: Quote[];
  total: number;
}

export async function loadContentData(): Promise<ContentLoadResult> {
  const response = await fetchQuotes();
  return {
    quotes: response.quotes,
    total: response.total,
  };
}
