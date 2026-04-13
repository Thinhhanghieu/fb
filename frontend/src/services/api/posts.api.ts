/**
 * Posts API Service
 * Xử lý toàn bộ các request liên quan đến bài viết.
 */
import axiosClient from '@/lib/axiosClient';
import { Post, PostComment } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export interface CreatePostPayload {
  content: string;
  images?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export const postsApi = {
  /**
   * Lấy danh sách bài viết (feed) với phân trang
   */
  getFeed: async (page = 1, limit = 10): Promise<PaginatedResponse<Post>> => {
    const { data } = await axiosClient.get<PaginatedResponse<Post>>(
      API_ENDPOINTS.POSTS.LIST,
      { params: { page, limit } }
    );
    return data;
  },

  /**
   * Lấy chi tiết một bài viết
   */
  getById: async (id: string): Promise<Post> => {
    const { data } = await axiosClient.get<Post>(API_ENDPOINTS.POSTS.DETAIL(id));
    return data;
  },

  /**
   * Tạo bài viết mới
   */
  create: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await axiosClient.post<Post>(
      API_ENDPOINTS.POSTS.CREATE,
      payload
    );
    return data;
  },

  /**
   * Like / Unlike bài viết
   */
  toggleLike: async (id: string): Promise<Post> => {
    const { data } = await axiosClient.post<Post>(API_ENDPOINTS.POSTS.LIKE(id));
    return data;
  },

  /**
   * Thêm bình luận mới
   */
  addComment: async (id: string, content: string): Promise<Post> => {
    const { data } = await axiosClient.post<Post>(API_ENDPOINTS.POSTS.COMMENTS(id), { content });
    return data;
  },

  /**
   * Lấy comments của bài viết
   */
  getComments: async (id: string, page = 1, limit = 10): Promise<PaginatedResponse<PostComment>> => {
    const { data } = await axiosClient.get<PaginatedResponse<PostComment>>(
      API_ENDPOINTS.POSTS.COMMENTS(id),
      { params: { page, limit } }
    );
    return data;
  },

  /**
   * Xóa bài viết
   */
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.POSTS.DETAIL(id));
  },
};
