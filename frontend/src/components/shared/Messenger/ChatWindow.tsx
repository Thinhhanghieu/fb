'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar } from '@/components/shared/Avatar';
import { AppButton } from '@/components/shared/AppButton';
import { SearchInput } from '@/components/shared/SearchInput';
import { Send, Phone, Video, Info, Image as ImageIcon, Smile, ThumbsUp, ChevronLeft } from 'lucide-react';
import { Conversation, Message, User } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { useSocket } from '@/components/providers/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
}

export function ChatWindow({ conversation, messages, currentUser, onSendMessage, onBack }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { subscribe, publish } = useSocket();
  const queryClient = useQueryClient();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const otherParticipant = conversation.participants[0];

  // 1. Lắng nghe tin nhắn VÀ tín hiệu typing
  useEffect(() => {
    if (!conversation.id) return;

    // Subscribe tin nhắn
    const unsubMessages = subscribe(`/topic/messages.${conversation.id}`, (message) => {
      const newMessage = JSON.parse(message.body);
      queryClient.setQueryData(['messages', conversation.id], (old: Message[] = []) => {
        if (old.some(m => m.id === newMessage.id)) return old;
        return [...old, newMessage];
      });
      // Nếu có tin nhắn mới, tự động tắt trạng thái typing của người kia
      setIsOtherTyping(false);
    });

    // Subscribe tín hiệu typing
    const unsubTyping = subscribe(`/topic/typing.${conversation.id}`, (message) => {
      const data = JSON.parse(message.body);
      // Nếu không phải mình thì mới hiển thị
      if (data.email !== currentUser.email) {
        setIsOtherTyping(data.isTyping);
      }
    });

    return () => {
      unsubMessages();
      unsubTyping();
    };
  }, [conversation.id, subscribe, queryClient, currentUser.email]);

  // 2. Gửi tín hiệu typing khi gõ phím
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Gửi tín hiệu 'đang gõ' nếu chưa gửi
    if (!typingTimeoutRef.current) {
      publish('/app/chat.typing', { conversationId: conversation.id, isTyping: true });
    }

    // Xóa timeout cũ và tạo mới để detect khi nào dừng gõ
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      publish('/app/chat.typing', { conversationId: conversation.id, isTyping: false });
      typingTimeoutRef.current = null;
    }, 3000); // Sau 3s không gõ thì coi như dừng
  };

  // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc đang typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherTyping]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    // Khi gửi tin, xóa trạng thái typing ngay lập tức
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      publish('/app/chat.typing', { conversationId: conversation.id, isTyping: false });
    }

    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-background relative">
      {/* Header (Giữ nguyên) */}
      <header className="flex items-center justify-between p-3 md:p-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {onBack && (
            <AppButton 
              variant="icon" 
              size="sm" 
              icon={<ChevronLeft size={20} />} 
              onClick={onBack}
              className="md:hidden"
            />
          )}
          <Avatar 
            src={otherParticipant.avatar} 
            alt={otherParticipant.name} 
            size="md" 
            isOnline={otherParticipant.isOnline} 
          />
          <div className="min-w-0">
            <h3 className="font-bold text-sm md:text-base text-foreground truncate leading-tight">
              {otherParticipant.name}
            </h3>
            <p className="text-[10px] md:text-xs text-green-500 font-medium">
              {otherParticipant.isOnline ? 'Đang hoạt động' : 'Hoạt động 5 phút trước'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-0.5 md:gap-1">
          <AppButton variant="icon" size="sm" icon={<Phone size={18} className="text-primary" />} />
          <AppButton variant="icon" size="sm" icon={<Video size={18} className="text-primary" />} />
          <AppButton variant="icon" size="sm" icon={<Info size={18} className="text-primary" />} />
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div className="flex flex-col items-center py-8 space-y-2 text-center">
          <Avatar src={otherParticipant.avatar} size="lg" />
          <h4 className="font-bold text-lg">{otherParticipant.name}</h4>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Các bạn là bạn bè trên Facebook. Sống tại Hà Nội.
          </p>
          <AppButton variant="secondary" size="sm" className="rounded-full text-xs mt-2">Xem trang cá nhân</AppButton>
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.sender.id === currentUser.id;
          const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.sender.id !== msg.sender.id);
          
          return (
            <div key={msg.id} className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
              <div className={cn('flex items-end gap-2 max-w-[85%] md:max-w-[70%]', isMe ? 'flex-row-reverse' : 'flex-row')}>
                {!isMe && (
                  <div className="w-7 h-7 flex-shrink-0">
                    {showAvatar ? (
                      <Avatar src={msg.sender.avatar} size="xs" />
                    ) : null}
                  </div>
                )}
                
                <div className="flex flex-col">
                  <div
                    className={cn(
                      'px-3 py-2 md:px-4 md:py-2.5 rounded-2xl text-sm shadow-sm',
                      isMe 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-muted text-foreground rounded-bl-sm'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
              {index === messages.length - 1 && isMe && msg.isRead && (
                <span className="text-[10px] text-muted-foreground mt-1 mr-1">Đã xem</span>
              )}
            </div>
          );
        })}

        {/* Typing Indicator UI */}
        {isOtherTyping && (
          <div className="flex items-end gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="w-7 h-7 flex-shrink-0">
              <Avatar src={otherParticipant.avatar} size="xs" />
            </div>
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="p-3 md:p-4 border-t border-border/50 bg-background">
        <form onSubmit={handleSubmit} className="flex items-center gap-1 md:gap-2">
          <div className="hidden sm:flex items-center gap-0.5">
            <AppButton type="button" variant="icon" size="sm" icon={<ImageIcon size={18} className="text-primary" />} />
            <AppButton type="button" variant="icon" size="sm" icon={<Smile size={18} className="text-primary" />} />
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Aa"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full bg-muted border-none rounded-full py-2 px-4 pr-10 text-sm focus:ring-1 focus:ring-primary/30 outline-none"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
              <Smile size={18} />
            </button>
          </div>

          {inputValue.trim() ? (
            <AppButton
              type="submit"
              variant="icon"
              size="sm"
              icon={<Send size={20} className="text-primary" />}
            />
          ) : (
            <AppButton
              type="button"
              variant="icon"
              size="sm"
              icon={<ThumbsUp size={20} className="text-primary fill-primary/10" />}
            />
          )}
        </form>
      </footer>
    </div>
  );
}
