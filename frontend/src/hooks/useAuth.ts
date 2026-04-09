import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth.api';
import { useAppDispatch } from './useAppDispatch';
import { setCurrentUser, clearCurrentUser } from '@/store/slices/authSlice';
import { tokenStorage } from '@/lib/axiosClient';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const userData = await authApi.getMe();
      dispatch(setCurrentUser(userData));
      return userData;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(clearCurrentUser());
      tokenStorage.remove();
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !isError && !!user,
    isError,
    logout,
    refetch,
  };
};
