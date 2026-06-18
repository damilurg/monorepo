import {
  fetchPostsRaw,
  fetchPostRaw,
  fetchPostCommentsRaw,
  transformPost,
  transformPosts,
  transformComments,
} from '../api/jsonplaceholder.js';
import type { PostDTO, CommentDTO } from '../model/types.js';

export interface BlogListLoadResult {
  posts: PostDTO[];
}

export interface BlogDetailLoadResult {
  post: PostDTO;
  comments: CommentDTO[];
}

export async function loadBlogList(): Promise<BlogListLoadResult> {
  const raw = await fetchPostsRaw();
  const posts = transformPosts(raw);
  return { posts };
}

export async function loadBlogDetail(id: number): Promise<BlogDetailLoadResult> {
  const [rawPost, rawComments] = await Promise.all([
    fetchPostRaw(id),
    fetchPostCommentsRaw(id),
  ]);
  return {
    post: transformPost(rawPost),
    comments: transformComments(rawComments),
  };
}
