/**
 * Supabase Client — Dùng cho direct upload từ FE qua presigned URL.
 */
import { storageApi } from '@/services/api/storage.api';

export const supabaseStorage = {
  /**
   * Upload file lên Supabase qua presigned URL.
   * Luồng: BE tạo presigned URL → FE upload trực tiếp lên Supabase → FE gửi public URL cho BE
   */
  upload: async (file: File): Promise<string> => {
    // 1. Xin presigned URL từ backend
    const { uploadUrl, publicUrl } = await storageApi.getPresignedUrl(
      file.name,
      file.type
    );

    // 2. Upload trực tiếp lên Supabase
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    // 3. Trả về public URL
    return publicUrl;
  },
};
