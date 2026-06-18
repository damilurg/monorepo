import { describe, it, expect } from 'vitest';
import {
  transformQuote,
  transformQuotesList,
  type DummyJsonQuotesRaw,
  type QuoteDTO,
} from '../api/dummyjson.js';

describe('transformQuote', () => {
  it('maps quote text and author from raw', () => {
    const raw = { id: 1, quote: 'Life is beautiful', author: 'Someone' };
    const dto = transformQuote(raw);
    expect(dto.text).toBe('Life is beautiful');
    expect(dto.author).toBe('Someone');
    expect(dto.id).toBe(1);
  });

  it('counts words correctly', () => {
    const raw = { id: 1, quote: 'One two three', author: 'A' };
    const dto = transformQuote(raw);
    expect(dto.wordCount).toBe(3);
  });

  it('counts multiple spaces as single word boundary', () => {
    const raw = { id: 1, quote: '  hello   world  ', author: 'A' };
    const dto = transformQuote(raw);
    expect(dto.wordCount).toBe(2);
  });

  it('generates tags array', () => {
    const raw = { id: 1, quote: 'Life love happiness', author: 'A' };
    const dto = transformQuote(raw);
    expect(Array.isArray(dto.tags)).toBe(true);
  });

  it('derives relevant tags from quote text', () => {
    const raw = { id: 1, quote: 'Courage is not the absence of fear', author: 'B' };
    const dto = transformQuote(raw);
    expect(dto.tags).toContain('courage');
  });

  it('returns empty tags array for generic text', () => {
    const raw = { id: 1, quote: 'The cat sat on the mat.', author: 'A' };
    const dto = transformQuote(raw);
    expect(Array.isArray(dto.tags)).toBe(true);
  });

  it('handles quote with single word', () => {
    const raw = { id: 1, quote: 'Persevere', author: 'A' };
    const dto = transformQuote(raw);
    expect(dto.wordCount).toBe(1);
  });
});

describe('transformQuotesList', () => {
  const baseRaw: DummyJsonQuotesRaw = {
    quotes: [
      { id: 1, quote: 'First quote', author: 'Author A' },
      { id: 2, quote: 'Second quote about life', author: 'Author B' },
    ],
    total: 100,
    skip: 0,
    limit: 20,
  };

  it('computes hasMore correctly when more pages exist', () => {
    const dto = transformQuotesList(baseRaw, 1);
    expect(dto.hasMore).toBe(true); // skip(0) + limit(20) < total(100)
  });

  it('detects last page correctly', () => {
    const raw: DummyJsonQuotesRaw = { quotes: [], total: 20, skip: 0, limit: 20 };
    const dto = transformQuotesList(raw, 1);
    expect(dto.hasMore).toBe(false); // 0 + 20 is not < 20
  });

  it('detects page beyond total', () => {
    const raw: DummyJsonQuotesRaw = { quotes: [], total: 10, skip: 10, limit: 20 };
    const dto = transformQuotesList(raw, 2);
    expect(dto.hasMore).toBe(false);
  });

  it('transforms each quote in the list', () => {
    const dto = transformQuotesList(baseRaw, 1);
    expect(dto.quotes).toHaveLength(2);
    expect(dto.quotes[0].text).toBe('First quote');
    expect(dto.quotes[1].author).toBe('Author B');
  });

  it('preserves total', () => {
    const dto = transformQuotesList(baseRaw, 1);
    expect(dto.total).toBe(100);
  });

  it('sets page from parameter', () => {
    const dto = transformQuotesList(baseRaw, 3);
    expect(dto.page).toBe(3);
  });

  it('defaults page to 1 when not provided', () => {
    const dto = transformQuotesList(baseRaw);
    expect(dto.page).toBe(1);
  });
});
