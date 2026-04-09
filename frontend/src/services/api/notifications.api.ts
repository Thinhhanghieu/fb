/**
 * Notifications API Service
 */
import axiosClient from '@/lib/axiosClient';
import { Notification } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await axiosClient.get<Notification[]>(
      API_ENDPOINTS.NOTIFICATIONS
    );
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosClient.patch('/notifications/read-all');
  },
};
