'use client';

import { useState } from 'react';
import { MOCK_CONVERSATIONS, MOCK_USER } from '@/constants/mockData';
import { Avatar } from '@/components/shared/Avatar';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppButton } from '@/components/shared/AppButton';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Send, Phone, Video, Info, Plus } from 'lucide-react';
import { Conversation } from '@/types';
import { cn } from '@/lib/utils';

const MOCK_MESSAGES = [
  { id: '1', senderId: '2', content: 'Dự án tuần này ra sao rồi? 😊', time: '09:25' },
  { id: '2', senderId: '1', content: 'Đang ổn! Mình vừa hoàn thành phần thiết kế rồi.', time: '09:26' },
  { id: '3', senderId: '2', content: 'Nghe hay đó! Cho mình xem với nhé?', time: '09:27' },
  { id: '4', senderId: '1', content: 'Ok mình sẽ gửi file cho sau nhé 😄', time: '09:28' },
  { id: '5', senderId: '2', content: 'Dự án tuần này ra sao rồi? 😊', time: '09:30' },
];

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div
        className="flex rounded-3xl overflow-hidden"
        style={{
          background: 'var(--surface-container-lowest)',
          boxShadow: 'var(--shadow-premium)',
          height: 'calc(100vh - 120px)',
        }}
      >
        {/* Conversation List */}
        <div
          className={cn(
            'flex flex-col',
            activeConversation ? 'hidden md:flex' : 'flex',
            'w-full md:w-80 flex-shrink-0'
          )}
          style={{ borderRight: '1px solid var(--surface-container-low)' }}
        >
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Tin nhắn</h2>
              <AppButton variant="icon" size="sm" icon={<Plus size={18} />} />
            </div>
            <SearchInput placeholder="Tìm kiếm trong Messenger" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {MOCK_CONVERSATIONS.map((conv) => {
              const other = conv.participants[0];
              const isActive = activeConversation?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={cn(
                    'flex items-center gap-3 w-full p-3 mx-1 rounded-2xl transition-all duration-200 text-left',
                    isActive ? 'bg-primary/10' : 'hover:bg-muted'
                  )}
                >
                  <Avatar src={other.avatar} alt={other.name} size="md" isOnline={other.isOnline} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={cn('text-sm font-semibold truncate', conv.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground')}>
                        {other.name}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">
                          {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { locale: vi })}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className={cn('text-xs truncate', conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                        {conv.lastMessage.sender.id === MOCK_USER.id ? 'Bạn: ' : ''}{conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: 'var(--primary)' }}>
                      {conv.unreadCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--surface-container-low)' }}>
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeConversation.participants[0].avatar}
                  alt={activeConversation.participants[0].name}
                  size="md"
                  isOnline={activeConversation.participants[0].isOnline}
                />
                <div>
                  <p className="font-semibold text-sm text-foreground">{activeConversation.participants[0].name}</p>
                  <p className="text-xs text-green-500">
                    {activeConversation.participants[0].isOnline ? 'Đang hoạt động' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[Phone, Video, Info].map((Icon, i) => (
                  <AppButton key={i} variant="icon" size="sm" icon={<Icon size={18} />} />
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_MESSAGES.map((msg) => {
                const isMe = msg.senderId === '1';
                return (
                  <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                    {!isMe && (
                      <Avatar src={activeConversation.participants[0].avatar} alt="" size="sm" className="mr-2 self-end mb-0.5" />
                    )}
                    <div
                      className={cn('px-4 py-2.5 rounded-2xl text-sm max-w-xs lg:max-w-md', isMe
                        ? 'rounded-br-sm text-white'
                        : 'rounded-bl-sm text-foreground'
                      )}
                      style={{
                        background: isMe ? 'linear-gradient(135deg, var(--primary), #0070eb)' : 'var(--surface-container-low)',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4" style={{ borderTop: '1px solid var(--surface-container-low)' }}>
              <div className="flex items-center gap-3">
                <SearchInput
                  placeholder="Aa"
                  className="flex-1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setMessage(''); }}
                />
                <AppButton
                  variant="primary"
                  size="md"
                  icon={<Send size={16} />}
                  className="rounded-2xl aspect-square p-0 w-11 h-11"
                  onClick={() => setMessage('')}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <p className="text-lg font-medium">Chọn cuộc hội thoại để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
}
