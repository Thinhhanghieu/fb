'use client';

import { Avatar } from '@/components/shared/Avatar';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppButton } from '@/components/shared/AppButton';
import { Plus, MoreHorizontal, Settings } from 'lucide-react';
import { Conversation, User } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  currentUser: User;
  onSelect: (conversation: Conversation) => void;
  isLoading?: boolean;
}

export function ConversationList({ 
  conversations, 
  activeId, 
  currentUser, 
  onSelect,
  isLoading 
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <header className="p-4 space-y-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Tin nhắn</h2>
          <div className="flex items-center gap-1">
            <AppButton variant="icon" size="sm" icon={<Settings size={18} />} className="bg-muted/50" />
            <AppButton variant="icon" size="sm" icon={<Plus size={18} />} className="bg-muted/50" />
          </div>
        </div>
        <SearchInput placeholder="Tìm kiếm trên Messenger" className="bg-muted/50 border-none" />
      </header>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-2 w-full bg-muted rounded" />
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
            <p>Không có cuộc hội thoại nào.</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const otherParticipant = conv.participants[0];
            const isActive = activeId === conv.id;
            const isUnread = conv.unreadCount > 0;
            const lastMsg = conv.lastMessage;

            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelect(conv);
                  }
                }}
                className={cn(
                  'flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 text-left group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                  isActive ? 'bg-primary/10' : 'hover:bg-muted'
                )}
              >
                <div className="relative flex-shrink-0 pointer-events-none">
                  <Avatar 
                    src={otherParticipant.avatar} 
                    alt={otherParticipant.name} 
                    size="lg" 
                    isOnline={otherParticipant.isOnline} 
                  />
                </div>
                
                <div className="flex-1 min-w-0 pointer-events-none">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      'text-[15px] truncate',
                      isUnread ? 'font-bold text-foreground' : 'font-medium text-foreground'
                    )}>
                      {otherParticipant.name}
                    </p>
                    {lastMsg && (
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNowStrict(new Date(conv.updatedAt), { locale: vi })}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    {lastMsg ? (
                      <p className={cn(
                        'text-sm truncate flex-1',
                        isUnread ? 'font-bold text-foreground' : 'text-muted-foreground'
                      )}>
                        {lastMsg.sender.id === currentUser.id ? 'Bạn: ' : ''}
                        {lastMsg.content}
                      </p>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">Bắt đầu trò chuyện</p>
                    )}
                    
                    {isUnread && (
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
                
                {/* Hover action - Sử dụng div thay vì button để tránh lồng nhau */}
                <div 
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted-foreground/10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Hành động thêm ở đây
                  }}
                >
                  <MoreHorizontal size={16} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
