'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar } from '@/components/shared/Avatar';
import { AppButton } from '@/components/shared/AppButton';
import { Send, Phone, Video, Info, Image as ImageIcon, Smile, ThumbsUp, ChevronLeft, Loader2, X } from 'lucide-react';
import { Conversation, Message, User } from '@/types';
import { cn } from '@/lib/utils';
import { useSocket } from '@/components/providers/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';
import { storageApi } from '@/services/api/storage.api';
import { Lightbox } from './Lightbox';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, type?: string, attachmentUrl?: string) => void;
  onBack?: () => void;
}

export function ChatWindow({ conversation, messages, currentUser, onSendMessage, onBack }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; index: number }>({ isOpen: false, index: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { subscribe, publish } = useSocket();
  const queryClient = useQueryClient();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const otherParticipant = conversation.participants[0];

  // Extract all images from conversation for Lightbox
  const allChatImages = messages
    .filter(msg => msg.type === 'IMAGE' && msg.attachmentUrl)
    .map(msg => msg.attachmentUrl as string);

  const openLightbox = (imageUrl: string) => {
    const index = allChatImages.indexOf(imageUrl);
    if (index !== -1) {
      setLightboxState({ isOpen: true, index });
    }
  };

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 1. WebSocket Subscriptions
  useEffect(() => {
    if (!conversation.id) return;

    const unsubMessages = subscribe(`/topic/messages/${conversation.id}`, (message) => {
      const newMessage = JSON.parse(message.body);
      queryClient.setQueryData(['messages', conversation.id], (old: Message[] = []) => {
        if (old.some(m => m.id === newMessage.id)) return old;
        return [...old, newMessage];
      });
      setIsOtherTyping(false);
    });

    const unsubTyping = subscribe(`/topic/typing/${conversation.id}`, (message) => {
      console.log(`[ChatWindow] Typing event received:`, message.body);
      const data = JSON.parse(message.body);
      if (data.email !== currentUser.email) {
        setIsOtherTyping(data.isTyping);
      }
    });

    return () => {
      unsubMessages();
      unsubTyping();
    };
  }, [conversation.id, subscribe, queryClient, currentUser.email]);

  // 2. Logic Gửi Ảnh & File
  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 3. Logic Copy-Paste Ảnh
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleImageSelect(file);
          e.preventDefault(); // Ngăn chặn dán ảnh trực tiếp vào input nếu là ảnh
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Khi bắt đầu gõ, gửi isTyping: true
    if (!typingTimeoutRef.current) {
      console.log('[ChatWindow] Starting typing...');
      publish('/app/chat.typing', { conversationId: conversation.id, isTyping: true });
    }

    // Xóa timeout cũ và tạo mới để gửi isTyping: false sau 3s không gõ
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      console.log('[ChatWindow] Stopped typing.');
      publish('/app/chat.typing', { conversationId: conversation.id, isTyping: false });
      typingTimeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherTyping]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() && !selectedImage) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      publish('/app/chat.typing', { conversationId: conversation.id, isTyping: false });
    }

    let attachmentUrl = undefined;
    let messageType = 'TEXT';
    const content = inputValue.trim() || (selectedImage ? 'Đã gửi một ảnh' : '');

    if (selectedImage) {
      setIsUploading(true);
      try {
        const uploadRes = await storageApi.uploadFile(selectedImage);
        attachmentUrl = uploadRes.publicUrl;
        messageType = 'IMAGE';
      } catch (error) {
        console.error('Upload failed:', error);
        setIsUploading(false);
        return; // Dừng nếu upload lỗi
      } finally {
        setIsUploading(false);
      }
    }

    onSendMessage(content, messageType, attachmentUrl);

    setInputValue('');
    removeSelectedImage();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-background relative">
      {/* Header */}
      <header className="flex items-center justify-between p-3 md:p-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {onBack && (
            <AppButton variant="icon" size="sm" icon={<ChevronLeft size={20} />} onClick={onBack} className="md:hidden" />
          )}
          <Avatar src={otherParticipant.avatar} alt={otherParticipant.name} size="md" isOnline={otherParticipant.isOnline} />
          <div className="min-w-0">
            <h3 className="font-bold text-sm md:text-base text-foreground truncate leading-tight">{otherParticipant.name}</h3>
            <p className="text-[10px] md:text-xs text-green-500 font-medium">
              {otherParticipant.isOnline ? 'Đang hoạt động' : 'Hoạt động'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <AppButton variant="icon" size="sm" icon={<Phone size={18} className="text-primary" />} />
          <AppButton variant="icon" size="sm" icon={<Video size={18} className="text-primary" />} />
          <AppButton variant="icon" size="sm" icon={<Info size={18} className="text-primary" />} />
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div className="flex flex-col items-center py-8 space-y-2 text-center">
          <Avatar
            src={otherParticipant.avatar}
            alt={otherParticipant.name}
            size="lg"
          />          <h4 className="font-bold text-lg">{otherParticipant.name}</h4>
          <p className="text-xs text-muted-foreground max-w-[200px]">Các bạn là bạn bè trên Facebook.</p>
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.sender.id === currentUser.id;
          const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.sender.id !== msg.sender.id);
          const isImage = msg.type === 'IMAGE';
          const hasContent = msg.content && msg.content !== 'Đã gửi một ảnh';

          return (
            <div key={msg.id} className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
              <div className={cn('flex items-end gap-2 max-w-[85%] md:max-w-[70%]', isMe ? 'flex-row-reverse' : 'flex-row')}>
                {!isMe && (
                  <div className="w-7 h-7 flex-shrink-0">
                    {showAvatar ? <Avatar src={msg.sender.avatar} alt={msg.sender.name} size="sm" /> : null}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  {isImage && (
                    <div className="rounded-2xl overflow-hidden border border-border shadow-sm bg-muted max-w-sm">
                      <img
                        src={msg.attachmentUrl}
                        alt="Chat image"
                        className="w-full h-auto max-h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => msg.attachmentUrl && openLightbox(msg.attachmentUrl)}
                      />
                    </div>
                  )}
                  {(!isImage || hasContent) && (
                    <div className={cn(
                      'px-3 py-2 md:px-4 md:py-2.5 rounded-2xl text-sm shadow-sm',
                      isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm',
                      isImage && isMe && 'rounded-tr-sm',
                      isImage && !isMe && 'rounded-tl-sm'
                    )}>
                      {msg.content}
                    </div>
                  )}
                </div>
              </div>
              {index === messages.length - 1 && isMe && msg.isRead && (
                <span className="text-[10px] text-muted-foreground mt-1 mr-1">Đã xem</span>
              )}
            </div>
          );
        })}

        {isOtherTyping && (
          <div className="flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 flex-shrink-0 transition-transform hover:scale-110">
              <Avatar src={otherParticipant.avatar} alt={otherParticipant.name} size="sm" />
            </div>
            <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center shadow-sm">
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-duration:0.8s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="p-3 md:p-4 border-t border-border/50 bg-background relative">
        {/* Preview Image */}
        {previewUrl && (
          <div className="absolute left-4 -top-24 bg-background border border-border p-1 rounded-xl shadow-lg animate-in slide-in-from-bottom-4">
            <div className="relative group">
              <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-border" />
              <button
                onClick={removeSelectedImage}
                className="absolute -top-2 -right-2 bg-muted-foreground/80 text-white rounded-full p-0.5 hover:bg-destructive transition-colors shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-x-0 -top-10 flex justify-center">
            <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs flex items-center gap-2 shadow-lg">
              <Loader2 size={12} className="animate-spin" /> Đang tải ảnh lên...
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-1 md:gap-2">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileSelect} />

          <div className="hidden sm:flex items-center gap-0.5">
            <AppButton
              type="button"
              variant="icon"
              size="sm"
              icon={<ImageIcon size={18} className="text-primary" />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            />
            <AppButton type="button" variant="icon" size="sm" icon={<Smile size={18} className="text-primary" />} />
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Aa"
              value={inputValue}
              onChange={handleInputChange}
              onPaste={handlePaste}
              disabled={isUploading}
              className="w-full bg-muted border-none rounded-full py-2 px-4 pr-10 text-sm focus:ring-1 focus:ring-primary/30 outline-none disabled:opacity-50"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
              <Smile size={18} />
            </button>
          </div>

          {(inputValue.trim() || selectedImage) ? (
            <AppButton
              type="submit"
              variant="icon"
              size="sm"
              icon={<Send size={20} className="text-primary" />}
              disabled={isUploading}
            />
          ) : (
            <AppButton type="button" variant="icon" size="sm" icon={<ThumbsUp size={20} className="text-primary fill-primary/10" />} />
          )}
        </form>
      </footer>

      {allChatImages.length > 0 && (
        <Lightbox
          isOpen={lightboxState.isOpen}
          initialIndex={lightboxState.index}
          images={allChatImages}
          onClose={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
        />
      )}
    </div>
  );
}
