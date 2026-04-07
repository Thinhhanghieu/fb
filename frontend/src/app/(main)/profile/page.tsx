'use client';

import { MOCK_USER, MOCK_POSTS, MOCK_FRIENDS } from '@/constants/mockData';
import { PostCard } from '@/components/shared/PostCard';
import { Avatar } from '@/components/shared/Avatar';
import { SectionCard } from '@/components/shared/SectionCard';
import { AppButton } from '@/components/shared/AppButton';
import { Camera, MapPin, Users, Edit3, UserPlus } from 'lucide-react';

export default function ProfilePage() {
  const user = MOCK_USER;
  const userPosts = MOCK_POSTS.filter(p => p.author.id === user.id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-56 md:h-72 rounded-b-3xl overflow-hidden relative">
          <img src={user.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          <AppButton
            variant="secondary"
            size="sm"
            icon={<Camera size={15} />}
            className="absolute bottom-3 right-3 backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.85)' }}
          >
            <span className="hidden sm:block">Chỉnh ảnh bìa</span>
          </AppButton>
        </div>

        {/* Avatar and basic info */}
        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <Avatar src={user.avatar} alt={user.name} size="xl"
                className="border-4 border-white shadow-md !w-24 !h-24 md:!w-32 md:!h-32" />
              <button
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
              >
                <Camera size={14} />
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <AppButton variant="primary" size="sm" icon={<UserPlus size={15} />}>
                Thêm bạn bè
              </AppButton>
              <AppButton variant="secondary" size="sm" icon={<Edit3 size={15} />}>
                Chỉnh sửa
              </AppButton>
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
            {user.bio && <p className="text-foreground text-sm mt-2 leading-relaxed">{user.bio}</p>}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
              {user.location && (
                <span className="flex items-center gap-1.5"><MapPin size={14} />{user.location}</span>
              )}
              <span className="flex items-center gap-1.5"><Users size={14} />{user.friendsCount} bạn bè</span>
            </div>
          </div>
        </div>
      </div>

      {/* Friends preview */}
      <div className="px-4 pb-4 space-y-4">
        <SectionCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-foreground">Bạn bè</h2>
            <button className="text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MOCK_FRIENDS.slice(0, 6).map((friend) => (
              <div key={friend.id} className="flex flex-col items-center gap-1 text-center">
                <div className="w-full aspect-square rounded-xl overflow-hidden">
                  <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-foreground truncate w-full">
                  {friend.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Posts */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-foreground">Bài viết</h2>
          {userPosts.length === 0 ? (
            <SectionCard className="p-8 text-center text-muted-foreground">
              Chưa có bài viết nào.
            </SectionCard>
          ) : (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
