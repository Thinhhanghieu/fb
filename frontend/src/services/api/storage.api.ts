/**
 * Storage API Service
 * Xử lý upload file lên Supabase Storage.
 */
import axiosClient from '@/lib/axiosClient';
import { API_ENDPOINTS } from '@/constants';

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

export interface UploadResponse {
  url: string;
  publicUrl: string;
  bucket: string;
  fileName: string;
  mimeType: string;
}

export const storageApi = {
  /**
   * Lấy presigned URL để upload trực tiếp lên Supabase.
   * FE sẽ dùng presigned URL này PUT file lên.
   */
  getPresignedUrl: async (
    fileName: string,
    contentType: string
  ): Promise<PresignedUrlResponse> => {
    const { data } = await axiosClient.get<PresignedUrlResponse>(
      `${API_ENDPOINTS.STORAGE}/presign`,
      { params: { fileName, contentType } }
    );
    return data;
  },

  /**
   * Upload file qua backend (dùng cho avatar, cover photo nhỏ).
   */
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosClient.post<UploadResponse>(
      `${API_ENDPOINTS.STORAGE}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  /**
   * Xóa file khỏi Supabase.
   */
  deleteFile: async (fileName: string): Promise<void> => {
    await axiosClient.delete(`${API_ENDPOINTS.STORAGE}/delete`, {
      params: { fileName },
    });
  },
};
