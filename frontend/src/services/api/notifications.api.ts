import axiosClient from '@/lib/axiosClient';
import { Notification, PaginatedResponse } from '@/types';

export const notificationsApi = {
  getNotifications: (page = 1, limit = 10) => 
    axiosClient.get<PaginatedResponse<Notification>>('/v1/notifications', { params: { page, limit } }),
  
  getUnreadCount: () => 
    axiosClient.get<number>('/v1/notifications/unread-count'),
  
  markAsRead: (id: string) => 
    axiosClient.patch(`/v1/notifications/${id}/read`),
  
  markAllAsRead: () => 
    axiosClient.patch('/v1/notifications/read-all'),
};
