export type {
  JsonPlaceholderPost,
  JsonPlaceholderComment,
  PostDTO,
  CommentDTO,
} from '../api/jsonplaceholder.js';

// Legacy aliases kept for backward compatibility
export type Post = import('../api/jsonplaceholder.js').JsonPlaceholderPost;
export type Comment = import('../api/jsonplaceholder.js').JsonPlaceholderComment;
