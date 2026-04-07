/**
 * Users API Service
 */
import httpClient from '@/lib/httpClient';
import { User } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const usersApi = {
  getProfile: async (id: string): Promise<User> => {
    const { data } = await httpClient.get<User>(API_ENDPOINTS.USERS.PROFILE(id));
    return data;
  },

  getFriends: async (id: string): Promise<User[]> => {
    const { data } = await httpClient.get<User[]>(API_ENDPOINTS.USERS.FRIENDS(id));
    return data;
  },

  updateProfile: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await httpClient.patch<User>(
      API_ENDPOINTS.USERS.PROFILE(id),
      payload
    );
    return data;
  },

  sendFriendRequest: async (id: string): Promise<void> => {
    await httpClient.post(`/users/${id}/friend-request`);
  },
};
