/**
 * Messages API Service
 */
import httpClient from '@/lib/httpClient';
import { Conversation, Message } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const messagesApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const { data } = await httpClient.get<Conversation[]>(
      API_ENDPOINTS.MESSAGES.LIST
    );
    return data;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const { data } = await httpClient.get<Message[]>(
      API_ENDPOINTS.MESSAGES.CONVERSATION(conversationId)
    );
    return data;
  },

  sendMessage: async (
    conversationId: string,
    content: string
  ): Promise<Message> => {
    const { data } = await httpClient.post<Message>(
      `${API_ENDPOINTS.MESSAGES.CONVERSATION(conversationId)}/messages`,
      { content }
    );
    return data;
  },
};
