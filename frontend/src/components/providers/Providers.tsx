'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { tokenStorage } from '@/lib/axiosClient';
import { setCurrentUser } from '@/store/slices/authSlice';
import { authApi } from '@/services/api/auth.api';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { SocketProvider } from './SocketProvider';

function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) return;

    authApi.getMe()
      .then((user) => {
        dispatch(setCurrentUser(user));
      })
      .catch(() => {
        tokenStorage.remove();
      });
  }, [dispatch]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <AuthInitializer />
          {children}
        </SocketProvider>
      </QueryClientProvider>
    </Provider>
  );
}
