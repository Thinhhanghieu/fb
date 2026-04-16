import axiosClient from '@/lib/axiosClient';
import { User, PaginatedResponse } from '@/types';

export const friendsApi = {
  sendRequest: (userId: string) => 
    axiosClient.post(`/v1/friends/request/${userId}`),
  
  acceptRequest: (requestId: string) => 
    axiosClient.post(`/v1/friends/accept/${requestId}`),
  
  declineRequest: (requestId: string) => 
    axiosClient.post(`/v1/friends/decline/${requestId}`),
  
  removeFriend: (friendId: string) => 
    axiosClient.delete(`/v1/friends/remove/${friendId}`),
  
  getFriends: (page = 1, limit = 10) => 
    axiosClient.get<PaginatedResponse<User>>('/v1/friends', { params: { page, limit } }),
  
  getPendingRequests: (page = 1, limit = 10) => 
    axiosClient.get<PaginatedResponse<User>>('/v1/friends/requests', { params: { page, limit } }),
};
