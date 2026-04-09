import React, { useState, useRef } from 'react';
import { useCreatePost } from '@/hooks/useCreatePost';

export const CreatePostEditor = () => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gọi Hook mình vừa viết
  const { mutateAsync: createPost, isPending } = useCreatePost();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedFile) return;

    try {
      await createPost({
        content,
        file: selectedFile,
      });

      // Reset form sau khi thanh cong
      setContent('');
      handleRemoveImage();
      alert('Đăng bài thành công!');
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      alert('Có lỗi xảy ra khi up bài, hãy thử lại!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 mb-4">
          {/* Chỗ này bạn có thể thay bằng component Avatar động sau */}
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img src="https://ui-avatars.com/api/?name=User" alt="Avatar" />
          </div>
          <textarea
            className="w-full bg-gray-100 rounded-2xl p-3 outline-none resize-none placeholder-gray-500"
            rows={selectedFile ? 2 : 3}
            placeholder="Bạn đang nghĩ gì thế?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
          />
        </div>

        {/* Khung Preview Ảnh */}
        {imagePreview && (
          <div className="relative mb-4 rounded-lg overflow-hidden border border-gray-200">
            <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
              disabled={isPending}
            >
              ✕
            </button>
          </div>
        )}

        {/* Thanh công cụ */}
        <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
          <span className="font-semibold text-gray-600 cursor-default">
            Thêm vào bài viết
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition flex items-center gap-1 text-green-500 font-medium"
              disabled={isPending}
            >
              {/* Fake Icon ảnh */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={(!content.trim() && !selectedFile) || isPending}
          className={`w-full mt-4 py-2 font-bold rounded-lg transition ${
            (!content.trim() && !selectedFile) || isPending
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isPending ? 'Đang đăng tải...' : 'Đăng'}
        </button>
      </form>
    </div>
  );
};
