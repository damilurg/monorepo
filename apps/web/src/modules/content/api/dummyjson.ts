import { httpGet } from '@repo/shared/api';

const BASE_URL = 'https://dummyjson.com';

// ============================================================
// 1. RAW API TYPES — exact shape returned by the external API
// ============================================================

export interface DummyJsonQuotesRaw {
  quotes: Array<{
    id: number;
    quote: string;
    author: string;
  }>;
  total: number;
  skip: number;
  limit: number;
}

// ============================================================
// 2. INTERNAL DTOs — simplified, client-safe shapes
// ============================================================

export interface QuoteDTO {
  id: number;
  text: string;
  author: string;
  wordCount: number;
  tags: string[];
}

export interface QuotesListDTO {
  quotes: QuoteDTO[];
  total: number;
  page: number;
  hasMore: boolean;
}

// ============================================================
// 3. HELPERS — topic-word tag derivation
// ============================================================

const TAG_KEYWORDS: Record<string, string[]> = {
  life: ['life', 'live', 'living', 'alive'],
  love: ['love', 'loving', 'loved', 'heart'],
  success: ['success', 'succeed', 'achievement', 'accomplish', 'win', 'victory'],
  failure: ['failure', 'fail', 'mistake', 'error', 'wrong'],
  wisdom: ['wisdom', 'wise', 'knowledge', 'learn', 'understand', 'truth'],
  courage: ['courage', 'brave', 'fear', 'bold', 'strength', 'strong'],
  happiness: ['happy', 'happiness', 'joy', 'joyful', 'smile', 'glad'],
  time: ['time', 'moment', 'day', 'year', 'future', 'past', 'today'],
  hope: ['hope', 'dream', 'wish', 'aspire', 'believe', 'faith'],
  change: ['change', 'transform', 'grow', 'progress', 'evolve'],
};

function deriveTags(text: string): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.push(tag);
    }
  }
  return matched;
}

// ============================================================
// 4. TRANSFORMS — pure functions, easy to unit test
// ============================================================

export function transformQuote(raw: { id: number; quote: string; author: string }): QuoteDTO {
  const wordCount = raw.quote.trim().split(/\s+/).length;
  return {
    id: raw.id,
    text: raw.quote,
    author: raw.author,
    wordCount,
    tags: deriveTags(raw.quote),
  };
}

export function transformQuotesList(raw: DummyJsonQuotesRaw, page = 1): QuotesListDTO {
  const quotes = raw.quotes.map(transformQuote);
  const hasMore = raw.skip + raw.limit < raw.total;

  return {
    quotes,
    total: raw.total,
    page,
    hasMore,
  };
}

// ============================================================
// 5. FETCH FUNCTIONS
// ============================================================

export async function fetchQuotesRaw(limit = 150): Promise<DummyJsonQuotesRaw> {
  return httpGet<DummyJsonQuotesRaw>(`${BASE_URL}/quotes?limit=${limit}`);
}

/** @deprecated Use fetchQuotesRaw + transformQuotesList instead */
export async function fetchQuotes(limit = 150): Promise<DummyJsonQuotesRaw> {
  return fetchQuotesRaw(limit);
}
