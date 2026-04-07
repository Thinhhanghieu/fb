/**
 * Notifications API Service
 */
import httpClient from '@/lib/httpClient';
import { Notification } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await httpClient.get<Notification[]>(
      API_ENDPOINTS.NOTIFICATIONS
    );
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await httpClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await httpClient.patch('/notifications/read-all');
  },
};
