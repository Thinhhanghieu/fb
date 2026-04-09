/**
 * Auth API Service
 * Xử lý toàn bộ các request liên quan đến xác thực người dùng.
 */
import axiosClient, { tokenStorage } from '@/lib/axiosClient';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const authApi = {
  /**
   * Đăng nhập → trả về user + token
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axiosClient.post<AuthResponse>(
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
    const { data } = await axiosClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        fullName: payload.fullName,
        username: payload.username,
        email: payload.email,
        password: payload.password,
      }
    );
    tokenStorage.set(data.token);
    return data;
  },

  /**
   * Lấy thông tin user hiện tại từ token
   */
  getMe: async (): Promise<User> => {
    const { data } = await axiosClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return data;
  },

  /**
   * Đăng xuất → xóa token
   */
  logout: async (): Promise<void> => {
    try {
      await axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      tokenStorage.remove();
    }
  },
};
