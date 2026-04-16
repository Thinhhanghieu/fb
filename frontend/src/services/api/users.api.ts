/**
 * Users API Service
 */
import axiosClient from '@/lib/axiosClient';
import { User, PaginatedResponse } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const usersApi = {
  searchUsers: async (query: string, page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
    const { data } = await axiosClient.get<PaginatedResponse<User>>(
      API_ENDPOINTS.USERS.SEARCH,
      { params: { q: query, page, limit } }
    );
    return data;
  },

  getProfile: async (id: string): Promise<User> => {
    const { data } = await axiosClient.get<User>(API_ENDPOINTS.USERS.PROFILE(id));
    return data;
  },

  getFriends: async (id: string): Promise<User[]> => {
    const { data } = await axiosClient.get<User[]>(API_ENDPOINTS.USERS.FRIENDS(id));
    return data;
  },

  updateProfile: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await axiosClient.patch<User>(
      API_ENDPOINTS.USERS.PROFILE(id),
      payload
    );
    return data;
  },

  sendFriendRequest: async (id: string): Promise<void> => {
    await axiosClient.post(`/users/${id}/friend-request`);
  },
};
