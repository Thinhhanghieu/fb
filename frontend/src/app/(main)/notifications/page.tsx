'use client';

import { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Avatar } from '@/components/shared/Avatar';
import { PageHeader } from '@/components/shared/PageHeader';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Heart, MessageCircle, UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { Notification } from '@/types';
import { useRouter } from 'next/navigation';

const iconMap: Record<string, { Icon: any, color: string, bg: string }> = {
  LIKE_POST: { Icon: Heart, color: '#e53e3e', bg: '#fed7d7' },
  COMMENT_POST: { Icon: MessageCircle, color: '#3182ce', bg: '#bee3f8' },
  FRIEND_REQUEST: { Icon: UserPlus, color: '#38a169', bg: '#c6f6d5' },
  FRIEND_ACCEPT: { Icon: UserCheck, color: '#805ad5', bg: '#e9d8fd' },
};

export default function NotificationsPage() {
  const router = useRouter();
  const { useGetNotifications, markAsRead, markAllAsRead } = useNotifications();
  const { data, isLoading } = useGetNotifications(1, 50);

  const notifications = data?.data || [];
  const unread = notifications.filter(n => !n.isRead);
  const read = notifications.filter(n => n.isRead);

  useEffect(() => {
    // Optionally mark all as read when visiting this page
    // if (unread.length > 0) markAllAsRead();
  }, [unread.length, markAllAsRead]);

  const handleNotificationClick = (n: Notification) => {
    if (!n.isRead) markAsRead(n.id);
    
    // Logic chuyển hướng dựa trên type
    if (n.type === 'LIKE_POST' || n.type === 'COMMENT_POST') {
      router.push(`/posts/${n.targetId}`);
    } else if (n.type === 'FRIEND_REQUEST' || n.type === 'FRIEND_ACCEPT') {
      router.push(`/profile/${n.actor.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  function renderGroup(groupItems: Notification[], title: string) {
    if (groupItems.length === 0) return null;
    return (
      <section className="space-y-2">
        <h2 className="font-display text-base font-bold text-foreground px-1">{title}</h2>
        {groupItems.map((n) => {
          const config = iconMap[n.type] || iconMap.LIKE_POST;
          const { Icon, color, bg } = config;
          return (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: n.isRead ? 'var(--surface-container-lowest)' : 'rgba(0,88,188,0.06)' }}
            >
              <div className="relative flex-shrink-0">
                <Avatar src={n.actor.avatar} alt={n.actor.name} size="md" />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  style={{ background: bg }}
                >
                  <Icon size={11} style={{ color }} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  <span className="font-semibold">{n.actor.name}</span>{' '}{n.message}
                </p>
                <p className="text-xs mt-0.5" style={{ color: n.isRead ? 'var(--muted-foreground)' : 'var(--primary)' }}>
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                </p>
              </div>
              {!n.isRead && (
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--primary)' }} />
              )}
            </div>
          );
        })}
      </section>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Thông báo" />
        {unread.length > 0 && (
          <button 
            onClick={() => markAllAsRead()}
            className="text-sm font-medium text-primary hover:underline"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Bạn chưa có thông báo nào.
        </div>
      ) : (
        <>
          {renderGroup(unread, 'Mới')}
          {renderGroup(read, 'Trước đây')}
        </>
      )}
    </div>
  );
}
