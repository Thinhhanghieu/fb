import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { storageApi } from '@/services/api/storage.api';
import { postsApi, CreatePostPayload } from '@/services/api/posts.api';

export interface CreatePostData {
  content: string;
  file?: File | null;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      let imageUrl: string | undefined = undefined;

      // BƯỚC 1 & 2: Upload ảnh trực tiếp lên Supabase Storage (nếu có)
      if (data.file) {
        // Xin backend cái Presigned URL
        const presignRes = await storageApi.getPresignedUrl(
          data.file.name,
          data.file.type
        );

        // Dùng axios thuần (không qua axiosClient) để đẩy file thẳng lên Supabase
        await axios.put(presignRes.uploadUrl, data.file, {
          headers: {
            'Content-Type': data.file.type,
          },
        });

        // Giữ lại URL hiển thị
        imageUrl = presignRes.publicUrl;
      }

      // BƯỚC 3: Tạo bài post với DB (gửi link thay vì gửi file)
      const payload: CreatePostPayload = {
        content: data.content,
      };

      if (imageUrl) {
        payload.images = [imageUrl];
      }

      return await postsApi.create(payload);
    },
    onSuccess: () => {
      // Báo cho React Query biết để gọi API lấy Feed mới nhất về
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
