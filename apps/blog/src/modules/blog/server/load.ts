import { fetchPosts, fetchPost, fetchPostComments } from '../api/jsonplaceholder.js';
import type { Post, Comment } from '../model/types.js';

export interface BlogListLoadResult {
  posts: Post[];
}

export interface BlogDetailLoadResult {
  post: Post;
  comments: Comment[];
}

export async function loadBlogList(): Promise<BlogListLoadResult> {
  const posts = await fetchPosts();
  return { posts };
}

export async function loadBlogDetail(id: number): Promise<BlogDetailLoadResult> {
  const [post, comments] = await Promise.all([
    fetchPost(id),
    fetchPostComments(id),
  ]);
  return { post, comments };
}
