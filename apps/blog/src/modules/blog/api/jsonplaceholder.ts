import { httpGet } from '@repo/shared/api';
import type { Post, Comment } from '../model/types.js';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function fetchPosts(): Promise<Post[]> {
  return httpGet<Post[]>(`${BASE_URL}/posts`);
}

export async function fetchPost(id: number): Promise<Post> {
  return httpGet<Post>(`${BASE_URL}/posts/${id}`);
}

export async function fetchPostComments(postId: number): Promise<Comment[]> {
  return httpGet<Comment[]>(`${BASE_URL}/posts/${postId}/comments`);
}
