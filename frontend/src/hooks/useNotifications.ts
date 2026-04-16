import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/services/api/notifications.api';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const useGetNotifications = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ['notifications', page, limit],
      queryFn: () => notificationsApi.getNotifications(page, limit).then(res => res.data),
    });
  };

  const useGetUnreadCount = () => {
    return useQuery({
      queryKey: ['notifications', 'unread-count'],
      queryFn: () => notificationsApi.getUnreadCount().then(res => res.data),
      // refetchInterval: 30000, // Removed: Using WebSocket now
    });
  };

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    useGetNotifications,
    useGetUnreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending || markAllAsReadMutation.isPending,
  };
};
