import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { friendsApi } from '@/services/api/friends.api';

export const useFriends = () => {
  const queryClient = useQueryClient();

  const sendRequestMutation = useMutation({
    mutationFn: (userId: string) => friendsApi.sendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: (requestId: string) => friendsApi.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    },
  });

  const declineRequestMutation = useMutation({
    mutationFn: (requestId: string) => friendsApi.declineRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: (friendId: string) => friendsApi.removeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const useGetFriends = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ['friends', page, limit],
      queryFn: () => friendsApi.getFriends(page, limit).then(res => res.data),
    });
  };

  const useGetPendingRequests = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ['friend-requests', page, limit],
      queryFn: () => friendsApi.getPendingRequests(page, limit).then(res => res.data),
    });
  };

  return {
    sendRequest: sendRequestMutation.mutate,
    acceptRequest: acceptRequestMutation.mutate,
    declineRequest: declineRequestMutation.mutate,
    removeFriend: removeFriendMutation.mutate,
    isLoading:
      sendRequestMutation.isPending ||
      acceptRequestMutation.isPending ||
      declineRequestMutation.isPending ||
      removeFriendMutation.isPending,
    useGetFriends,
    useGetPendingRequests,
  };
};
