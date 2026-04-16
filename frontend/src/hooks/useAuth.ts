import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth.api';
import { useAppDispatch } from './useAppDispatch';
import { setCurrentUser, clearCurrentUser } from '@/store/slices/authSlice';
import { tokenStorage } from '@/lib/axiosClient';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

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
      // 1. Xóa Redux State
      dispatch(clearCurrentUser());
      // 2. Xóa Token khỏi localStorage
      tokenStorage.remove();
      // 3. Xóa sạch Cache của TanStack Query (Xóa hết dữ liệu nhạy cảm)
      queryClient.clear();
      // 4. Reload hoặc điều hướng về trang Login (Tùy component gọi)
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
