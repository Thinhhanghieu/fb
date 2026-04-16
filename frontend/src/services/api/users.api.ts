/**
 * Users API Service
 */
import axiosClient from '@/lib/axiosClient';
import { User } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const usersApi = {
  getProfile: async (id: string): Promise<User> => {
    const { data } = await axiosClient.get<User>(`/v1/users/${id}`);
    return data;
  },

  getFriends: async (id: string): Promise<User[]> => {
    const { data } = await axiosClient.get<User[]>(`/v1/users/${id}/friends`);
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
