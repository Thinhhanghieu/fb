'use client';

import { Image, Video, Smile } from 'lucide-react';
import { Avatar } from './Avatar';
import { MOCK_USER } from '@/constants/mockData';

export function CreatePost() {
  return (
    <div
      className="rounded-3xl p-5 space-y-4 transition-all duration-300"
      style={{ background: 'var(--surface-container-lowest)', boxShadow: 'var(--shadow-premium)' }}
    >
      <div className="flex items-center gap-4">
        <Avatar src={MOCK_USER.avatar} alt={MOCK_USER.name} size="md" isOnline={MOCK_USER.isOnline} />
        <button
          className="flex-1 text-left px-5 py-3 rounded-2xl text-sm text-muted-foreground transition-all duration-300 hover:opacity-80"
          style={{ background: 'var(--surface-container-low)' }}
        >
          Bạn đang nghĩ gì vậy, {MOCK_USER.name.split(' ')[0]}?
        </button>
      </div>
      <div className="flex items-center gap-2 pt-1">
        {[
          { label: 'Video trực tiếp', icon: Video, color: 'text-red-500' },
          { label: 'Ảnh/Video', icon: Image, color: 'text-green-500' },
          { label: 'Cảm xúc', icon: Smile, color: 'text-yellow-500' },
        ].map((item) => (
          <button key={item.label} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold text-muted-foreground hover:bg-muted transition-all duration-200 group">
            <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
