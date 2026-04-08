/**
 * Auth API Service
 * Xử lý toàn bộ các request liên quan đến xác thực người dùng.
 */
import httpClient, { tokenStorage } from '@/lib/httpClient';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const authApi = {
  /**
   * Đăng nhập → trả về user + token
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    // Lưu token ngay sau khi đăng nhập thành công
    tokenStorage.set(data.token);
    return data;
  },

  /**
   * Đăng ký tài khoản mới
   */
  register: async (payload: RegisterData): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload
    );
    tokenStorage.set(data.token);
    return data;
  },

  /**
   * Lấy thông tin user hiện tại từ token
   */
  getMe: async (): Promise<User> => {
    const { data } = await httpClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return data;
  },

  /**K
   * Đăng xuất → xóa token
   */
  logout: async (): Promise<void> => {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      tokenStorage.remove();
    }
  },
};
