import { describe, it, expect } from 'vitest';
import {
  transformPost,
  transformComment,
  transformPosts,
  transformComments,
  type JsonPlaceholderPost,
  type JsonPlaceholderComment,
} from './jsonplaceholder.js';

describe('transformPost', () => {
  it('preserves id, title, and body', () => {
    const raw: JsonPlaceholderPost = { id: 42, userId: 1, title: 'Hello', body: 'Content' };
    const dto = transformPost(raw);
    expect(dto.id).toBe(42);
    expect(dto.title).toBe('Hello');
    expect(dto.body).toBe('Content');
  });

  it('maps authorId from userId', () => {
    const raw: JsonPlaceholderPost = { id: 1, userId: 7, title: 'T', body: 'B' };
    const dto = transformPost(raw);
    expect(dto.authorId).toBe(7);
  });

  it('keeps short body as-is for excerpt', () => {
    const raw: JsonPlaceholderPost = { id: 1, userId: 1, title: 'T', body: 'Short body' };
    const dto = transformPost(raw);
    expect(dto.excerpt).toBe('Short body');
  });

  it('truncates body longer than 120 chars to excerpt with ellipsis', () => {
    const raw: JsonPlaceholderPost = { id: 1, userId: 1, title: 'Test', body: 'A'.repeat(200) };
    const dto = transformPost(raw);
    expect(dto.excerpt.length).toBeLessThanOrEqual(124); // 120 chars + '…' (1 char)
    expect(dto.excerpt).toContain('…');
  });

  it('calculates reading time at ~200 wpm', () => {
    const body = Array(400).fill('word').join(' '); // 400 words
    const raw: JsonPlaceholderPost = { id: 1, userId: 1, title: 'Test', body };
    const dto = transformPost(raw);
    expect(dto.readingTimeMin).toBe(2); // 400/200 = 2
  });

  it('rounds reading time up (ceil)', () => {
    const body = Array(201).fill('word').join(' '); // 201 words → 1.005 → ceil = 2
    const raw: JsonPlaceholderPost = { id: 1, userId: 1, title: 'Test', body };
    const dto = transformPost(raw);
    expect(dto.readingTimeMin).toBe(2);
  });

  it('gives minimum reading time of 1 for very short body', () => {
    const raw: JsonPlaceholderPost = { id: 1, userId: 1, title: 'T', body: 'hello' };
    const dto = transformPost(raw);
    expect(dto.readingTimeMin).toBe(1);
  });
});

describe('transformPosts', () => {
  it('maps array of raw posts to DTOs', () => {
    const raws: JsonPlaceholderPost[] = [
      { id: 1, userId: 1, title: 'A', body: 'Body 1' },
      { id: 2, userId: 2, title: 'B', body: 'Body 2' },
    ];
    const dtos = transformPosts(raws);
    expect(dtos).toHaveLength(2);
    expect(dtos[0].id).toBe(1);
    expect(dtos[1].id).toBe(2);
  });

  it('returns empty array for empty input', () => {
    expect(transformPosts([])).toEqual([]);
  });
});

describe('transformComment', () => {
  it('extracts avatar initials from two-word name (first letters, uppercase)', () => {
    const raw: JsonPlaceholderComment = { id: 1, postId: 1, name: 'John Doe', email: 'j@d.com', body: 'Hi' };
    const dto = transformComment(raw);
    expect(dto.avatarInitials).toBe('JO');
  });

  it('uses first two chars for single-word name', () => {
    const raw: JsonPlaceholderComment = { id: 1, postId: 1, name: 'Alice', email: 'a@b.com', body: 'Hi' };
    const dto = transformComment(raw);
    expect(dto.avatarInitials).toBe('AL');
  });

  it('preserves id and postId', () => {
    const raw: JsonPlaceholderComment = { id: 5, postId: 10, name: 'A B', email: 'a@b.com', body: 'text' };
    const dto = transformComment(raw);
    expect(dto.id).toBe(5);
    expect(dto.postId).toBe(10);
  });

  it('truncates long names in author field', () => {
    const longName = 'A'.repeat(50);
    const raw: JsonPlaceholderComment = { id: 1, postId: 1, name: longName, email: 'a@b.com', body: 'text' };
    const dto = transformComment(raw);
    expect(dto.author.length).toBeLessThanOrEqual(44); // 40 + '…' (4 bytes max)
  });
});

describe('transformComments', () => {
  it('maps array of raw comments to DTOs', () => {
    const raws: JsonPlaceholderComment[] = [
      { id: 1, postId: 1, name: 'A B', email: 'a@b.com', body: 'text1' },
      { id: 2, postId: 1, name: 'C D', email: 'c@d.com', body: 'text2' },
    ];
    const dtos = transformComments(raws);
    expect(dtos).toHaveLength(2);
    expect(dtos[0].id).toBe(1);
    expect(dtos[1].id).toBe(2);
  });
});
