'use client';

import { MOCK_NOTIFICATIONS } from '@/constants/mockData';
import { Avatar } from '@/components/shared/Avatar';
import { PageHeader } from '@/components/shared/PageHeader';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Heart, MessageCircle, UserPlus, Share2, AtSign } from 'lucide-react';

const iconMap = {
  like: { Icon: Heart, color: '#e53e3e', bg: '#fed7d7' },
  comment: { Icon: MessageCircle, color: '#3182ce', bg: '#bee3f8' },
  friend_request: { Icon: UserPlus, color: '#38a169', bg: '#c6f6d5' },
  share: { Icon: Share2, color: '#805ad5', bg: '#e9d8fd' },
  mention: { Icon: AtSign, color: '#dd6b20', bg: '#feebc8' },
};

export default function NotificationsPage() {
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.isRead);
  const read = MOCK_NOTIFICATIONS.filter(n => n.isRead);

  function renderGroup(notifications: typeof MOCK_NOTIFICATIONS, title: string) {
    if (notifications.length === 0) return null;
    return (
      <section className="space-y-2">
        <h2 className="font-display text-base font-bold text-foreground px-1">{title}</h2>
        {notifications.map((n) => {
          const { Icon, color, bg } = iconMap[n.type];
          return (
            <div
              key={n.id}
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
      <PageHeader title="Thông báo" />
      {renderGroup(unread, 'Mới')}
      {renderGroup(read, 'Trước đây')}
    </div>
  );
}
