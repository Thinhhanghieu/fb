'use client';

import Link from 'next/link';
import { MOCK_FRIENDS } from '@/constants/mockData';
import { Avatar } from './Avatar';
import { ROUTES } from '@/constants';

export function StoryBar() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {/* Add Story */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--primary), #0070eb)' }}
        >
          +
        </div>
        <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">Thêm tin</span>
      </div>

      {/* Friends' Stories */}
      {MOCK_FRIENDS.map((friend) => (
        <button key={friend.id} className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 0 0 2.5px var(--primary), 0 0 0 4px var(--background)' }}
            >
              <img
                src={`https://picsum.photos/64/64?random=${friend.id}`}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1">
              <Avatar src={friend.avatar} alt={friend.name} size="sm" isOnline={friend.isOnline}
                className="!w-5 !h-5 border-2 border-white" />
            </div>
          </div>
          <span className="text-[10px] text-foreground font-medium whitespace-nowrap max-w-[64px] truncate">
            {friend.name.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  );
}
