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
    
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        console.log('Connected to WebSocket');

        // Tự động subscribe thông báo cho user này
        client.subscribe(`/user/${currentUser.email}/topic/notifications`, (message) => {
          const newNotification: Notification = JSON.parse(message.body);
          
          // Khi có thông báo mới:
          // 1. Cập nhật danh sách thông báo trong cache
          queryClient.setQueryData([QUERY_KEYS.NOTIFICATIONS, 1, 50], (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: [newNotification, ...oldData.data],
              total: oldData.total + 1
            };
          });

          // 2. Cập nhật số lượng tin chưa đọc (Unread Count)
          queryClient.setQueryData(['notifications', 'unread-count'], (oldCount: number = 0) => oldCount + 1);
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log('Disconnected from WebSocket');
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [currentUser, queryClient]);

  const subscribe = (destination: string, callback: (message: IMessage) => void) => {
    if (!stompClientRef.current || !isConnected) return () => {};
    const subscription = stompClientRef.current.subscribe(destination, callback);
    return () => subscription.unsubscribe();
  };

  return (
    <SocketContext.Provider value={{ isConnected, subscribe }}>
      {children}
    </SocketContext.Provider>
  );
};
