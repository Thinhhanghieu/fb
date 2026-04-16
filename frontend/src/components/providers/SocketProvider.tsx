'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { Notification } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';

interface SocketContextType {
  isConnected: boolean;
  subscribe: (destination: string, callback: (message: IMessage) => void) => () => void;
  publish: (destination: string, body: any) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Chỉ kết nối khi đã có user đăng nhập
    if (!currentUser) {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '/ws') || 'http://localhost:8080/ws';
    const token = localStorage.getItem('fb_clone_token'); 
    console.log('[WebSocket] Attempting connection with token:', token ? 'Exists' : 'Missing');
    
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        'Authorization': token ? `Bearer ${token}` : '',
        'token': token || '', // Dự phòng thêm header 'token'
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        setIsConnected(true);
        console.log('[WebSocket] Connected as:', currentUser.email);
        console.log('[WebSocket] Session ID:', frame.headers['user-name'] || 'Assigned by server');

        // Subscribe thông báo
        client.subscribe('/user/topic/notifications', (message) => {
          console.log('[WebSocket] Notification received');
          const newNotification: Notification = JSON.parse(message.body);
          
          queryClient.setQueryData([QUERY_KEYS.NOTIFICATIONS, 1, 50], (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: [newNotification, ...oldData.data],
              total: (oldData.total || 0) + 1
            };
          });

          queryClient.setQueryData(['notifications', 'unread-count'], (oldCount: number = 0) => oldCount + 1);
        });

        // Subscribe tin nhắn chat
        client.subscribe('/user/queue/messages', (message) => {
          console.log('[WebSocket] New chat message received:', message.body);
          const newMessage: any = JSON.parse(message.body);
          
          // Cập nhật cache tin nhắn
          // Đảm bảo conversationId được so sánh chính xác (String)
          queryClient.setQueryData(['messages', newMessage.conversationId], (oldMessages: any[] = []) => {
            console.log('[WebSocket] Updating cache for conversation:', newMessage.conversationId);
            const exists = oldMessages.some(m => m.id === newMessage.id);
            if (exists) return oldMessages;
            return [...oldMessages, newMessage];
          });

          // Cập nhật danh sách hội thoại
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log('[WebSocket] Disconnected');
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP Error:', frame.headers['message']);
        console.error('[WebSocket] Details:', frame.body);
      }
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      console.log('[WebSocket] Deactivating connection...');
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [currentUser, queryClient]);

  const subscribe = (destination: string, callback: (message: IMessage) => void) => {
    if (!stompClientRef.current || !isConnected) return () => {};
    const subscription = stompClientRef.current.subscribe(destination, callback);
    return () => subscription.unsubscribe();
  };

  const publish = (destination: string, body: any) => {
    if (!stompClientRef.current || !isConnected) {
      console.warn('[WebSocket] Cannot publish: Not connected');
      return;
    }
    stompClientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    });
  };

  return (
    <SocketContext.Provider value={{ isConnected, subscribe, publish }}>
      {children}
    </SocketContext.Provider>
  );
};
