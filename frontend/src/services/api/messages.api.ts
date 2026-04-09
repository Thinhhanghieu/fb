/**
 * Messages API Service
 */
import axiosClient from '@/lib/axiosClient';
import { Conversation, Message } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const messagesApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const { data } = await axiosClient.get<Conversation[]>(
      API_ENDPOINTS.MESSAGES.LIST
    );
    return data;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const { data } = await axiosClient.get<Message[]>(
      API_ENDPOINTS.MESSAGES.CONVERSATION(conversationId)
    );
    return data;
  },

  sendMessage: async (
    conversationId: string,
    content: string
  ): Promise<Message> => {
    const { data } = await axiosClient.post<Message>(
      `${API_ENDPOINTS.MESSAGES.CONVERSATION(conversationId)}/messages`,
      { content }
    );
    return data;
  },
};
