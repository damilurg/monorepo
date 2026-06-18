export type {
  DummyJsonQuotesRaw,
  QuoteDTO,
  QuotesListDTO,
} from '../api/dummyjson.js';

// Legacy aliases kept for backward compatibility
export type Quote = {
  id: number;
  quote: string;
  author: string;
};

export type QuotesResponse = import('../api/dummyjson.js').DummyJsonQuotesRaw;
