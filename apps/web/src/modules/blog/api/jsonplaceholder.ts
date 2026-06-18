import { httpGet } from '@repo/shared/api';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// ============================================================
// 1. RAW API TYPES — exact shape returned by the external API
// ============================================================

export interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface JsonPlaceholderComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// ============================================================
// 2. INTERNAL DTOs — simplified, client-safe shapes
// ============================================================

export interface PostDTO {
  id: number;
  title: string;
  excerpt: string;
  body: string;
  readingTimeMin: number;
  authorId: number;
}

export interface CommentDTO {
  id: number;
  postId: number;
  author: string;
  avatarInitials: string;
  body: string;
}

// ============================================================
// 3. TRANSFORMS — pure functions, easy to unit test
// ============================================================

export function transformPost(raw: JsonPlaceholderPost): PostDTO {
  const wordCount = raw.body.trim().split(/\s+/).length;
  const readingTimeMin = Math.ceil(wordCount / 200);
  const excerpt = raw.body.length > 120 ? raw.body.slice(0, 120).trimEnd() + '…' : raw.body;

  return {
    id: raw.id,
    title: raw.title,
    excerpt,
    body: raw.body,
    readingTimeMin,
    authorId: raw.userId,
  };
}

export function transformPosts(raw: JsonPlaceholderPost[]): PostDTO[] {
  return raw.map(transformPost);
}

export function transformComment(raw: JsonPlaceholderComment): CommentDTO {
  const trimmedName = raw.name.length > 40 ? raw.name.slice(0, 40).trimEnd() + '…' : raw.name;
  const words = raw.name.trim().split(/\s+/);
  const avatarInitials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : raw.name.slice(0, 2).toUpperCase();

  return {
    id: raw.id,
    postId: raw.postId,
    author: trimmedName,
    avatarInitials,
    body: raw.body,
  };
}

export function transformComments(raw: JsonPlaceholderComment[]): CommentDTO[] {
  return raw.map(transformComment);
}

// ============================================================
// 4. FETCH FUNCTIONS
// ============================================================

export async function fetchPostsRaw(): Promise<JsonPlaceholderPost[]> {
  return httpGet<JsonPlaceholderPost[]>(`${BASE_URL}/posts`);
}

export async function fetchPostRaw(id: number): Promise<JsonPlaceholderPost> {
  return httpGet<JsonPlaceholderPost>(`${BASE_URL}/posts/${id}`);
}

export async function fetchPostCommentsRaw(postId: number): Promise<JsonPlaceholderComment[]> {
  return httpGet<JsonPlaceholderComment[]>(`${BASE_URL}/posts/${postId}/comments`);
}

/** @deprecated Use fetchPostsRaw + transformPosts instead */
export async function fetchPosts(): Promise<JsonPlaceholderPost[]> {
  return fetchPostsRaw();
}

/** @deprecated Use fetchPostRaw + transformPost instead */
export async function fetchPost(id: number): Promise<JsonPlaceholderPost> {
  return fetchPostRaw(id);
}

/** @deprecated Use fetchPostCommentsRaw + transformComments instead */
export async function fetchPostComments(postId: number): Promise<JsonPlaceholderComment[]> {
  return fetchPostCommentsRaw(postId);
}
