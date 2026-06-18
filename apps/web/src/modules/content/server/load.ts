import { fetchQuotesRaw, transformQuotesList } from '../api/dummyjson.js';
import type { QuoteDTO, QuotesListDTO } from '../model/types.js';

export interface ContentLoadResult {
  quotes: QuoteDTO[];
  total: number;
}

export async function loadContentData(): Promise<ContentLoadResult> {
  const raw = await fetchQuotesRaw();
  const dto: QuotesListDTO = transformQuotesList(raw);
  return {
    quotes: dto.quotes,
    total: dto.total,
  };
}
