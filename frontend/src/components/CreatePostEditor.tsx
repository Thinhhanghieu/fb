import React, { useState, useRef } from 'react';
import { useCreatePost } from '@/hooks/useCreatePost';
import { Avatar } from './shared/Avatar';
import { MOCK_USER } from '@/constants/mockData';
import { X, Image as ImageIcon, Smile, MapPin } from 'lucide-react';

export const CreatePostEditor = ({ onClose }: { onClose: () => void }) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Đóng modal sau khi đang thành công
      onClose();
      // Tuỳ chọn: bạn có thể trigger 1 Global Toast báo thành công ở đây
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      alert('Có lỗi xảy ra khi tải bài viết lên. Bạn thử lại nhé!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{ background: 'var(--surface)' }}
      >
        {/* Header Modal */}
        <div className="relative border-b py-4 text-center">
          <h2 className="text-xl font-bold">Tạo bài viết</h2>
          <button 
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-600"
            disabled={isPending}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[75vh]">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar src={MOCK_USER.avatar} alt={MOCK_USER.name} size="md" />
            <div>
              <p className="font-semibold text-[15px]">{MOCK_USER.name}</p>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded-md font-medium text-gray-600 mt-1 inline-block">
                Công khai
              </span>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            className="w-full text-lg outline-none resize-none placeholder-gray-500 bg-transparent mb-2"
            rows={selectedFile || imagePreview ? 2 : 4}
            placeholder={`Bạn đang nghĩ gì thế, ${MOCK_USER.name.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
            autoFocus
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mb-4 border border-gray-300 p-2 rounded-lg bg-gray-50 group">
              <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded-md" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-md border hover:bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition"
                disabled={isPending}
              >
                <X size={16} className="text-gray-700" />
              </button>
            </div>
          )}

          {/* Attachment Bar */}
          <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between mb-4 shadow-sm">
            <span className="font-semibold text-sm cursor-default">
              Thêm vào bài viết
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-full transition text-green-500"
                disabled={isPending}
              >
                <ImageIcon size={24} />
              </button>
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition text-yellow-500" disabled={isPending}>
                <Smile size={24} />
              </button>
              <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition text-red-500" disabled={isPending}>
                <MapPin size={24} />
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={(!content.trim() && !selectedFile) || isPending}
            className={`w-full py-2.5 font-bold rounded-lg transition ${
              (!content.trim() && !selectedFile) || isPending
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`}
          >
            {isPending ? 'Đang tải lên...' : 'Đăng'}
          </button>
        </form>
      </div>
    </div>
  );
};
