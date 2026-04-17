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
  const subscriptionQueueRef = useRef<{ destination: string; callback: (message: IMessage) => void; id: string }[]>([]);
  const activeSubscriptionsRef = useRef<Record<string, any>>({});
  const queryClient = useQueryClient();

  // Hàm thực hiện subscribe thực tế
  const doSubscribe = (destination: string, callback: (message: IMessage) => void, id: string) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) return;
    
    console.log(`[WebSocket] Actually subscribing to ${destination}`);
    const subscription = stompClientRef.current.subscribe(destination, (msg) => {
      console.log(`[WebSocket] Message received from ${destination}`);
      callback(msg);
    });
    activeSubscriptionsRef.current[id] = subscription;
  };

  useEffect(() => {
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
    
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        'Authorization': token ? `Bearer ${token}` : '',
        'token': token || '',
      },
      reconnectDelay: 5000,
      onConnect: (frame) => {
        setIsConnected(true);
        console.log('[WebSocket] Connected as:', currentUser.email);
        
        // Thực hiện các subscription đang chờ trong hàng đợi
        const queue = subscriptionQueueRef.current;
        console.log(`[WebSocket] Processing queue of ${queue.length} subscriptions`);
        queue.forEach(item => {
          doSubscribe(item.destination, item.callback, item.id);
        });
        subscriptionQueueRef.current = [];

        // Các subscription mặc định
        client.subscribe('/user/topic/notifications', (message) => {
          const newNotification: Notification = JSON.parse(message.body);
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        });

        client.subscribe('/user/queue/messages', (message) => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        activeSubscriptionsRef.current = {};
      }
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [currentUser, queryClient]);

  const subscribe = React.useCallback((destination: string, callback: (message: IMessage) => void) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    if (stompClientRef.current?.connected) {
      doSubscribe(destination, callback, id);
    } else {
      console.log(`[WebSocket] Queueing subscription for ${destination}`);
      subscriptionQueueRef.current.push({ destination, callback, id });
    }

    return () => {
      if (activeSubscriptionsRef.current[id]) {
        console.log(`[WebSocket] Unsubscribing from ${destination}`);
        activeSubscriptionsRef.current[id].unsubscribe();
        delete activeSubscriptionsRef.current[id];
      } else {
        // Xóa khỏi queue nếu chưa kịp subscribe
        subscriptionQueueRef.current = subscriptionQueueRef.current.filter(item => item.id !== id);
      }
    };
  }, []); // Không phụ thuộc isConnected để tránh re-render liên tục

  const publish = React.useCallback((destination: string, body: any) => {
    if (!stompClientRef.current?.connected) {
      console.warn(`[WebSocket] Skip Publish - Not connected to ${destination}`);
      return;
    }
    console.log(`[WebSocket] ---> Sending to ${destination}:`, body);
    stompClientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    });
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, subscribe, publish }}>
      {children}
    </SocketContext.Provider>
  );
};
