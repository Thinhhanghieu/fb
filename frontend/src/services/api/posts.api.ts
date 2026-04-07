/**
 * Posts API Service
 * Xử lý toàn bộ các request liên quan đến bài viết.
 */
import httpClient from '@/lib/httpClient';
import { Post } from '@/types';
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
    const { data } = await httpClient.get<PaginatedResponse<Post>>(
      API_ENDPOINTS.POSTS.LIST,
      { params: { page, limit } }
    );
    return data;
  },

  /**
   * Lấy chi tiết một bài viết
   */
  getById: async (id: string): Promise<Post> => {
    const { data } = await httpClient.get<Post>(API_ENDPOINTS.POSTS.DETAIL(id));
    return data;
  },

  /**
   * Tạo bài viết mới
   */
  create: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await httpClient.post<Post>(
      API_ENDPOINTS.POSTS.CREATE,
      payload
    );
    return data;
  },

  /**
   * Like / Unlike bài viết
   */
  toggleLike: async (id: string): Promise<{ liked: boolean; likesCount: number }> => {
    const { data } = await httpClient.post(API_ENDPOINTS.POSTS.LIKE(id));
    return data;
  },

  /**
   * Lấy comments của bài viết
   */
  getComments: async (id: string) => {
    const { data } = await httpClient.get(API_ENDPOINTS.POSTS.COMMENTS(id));
    return data;
  },

  /**
   * Xóa bài viết
   */
  delete: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.POSTS.DETAIL(id));
  },
};
