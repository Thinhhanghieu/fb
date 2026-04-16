'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/services/api/users.api';
import { useFriends } from '@/hooks/useFriends';
import { useAuth } from '@/hooks/useAuth';
import { PostCard } from '@/components/shared/PostCard';
import { Avatar } from '@/components/shared/Avatar';
import { SectionCard } from '@/components/shared/SectionCard';
import { AppButton } from '@/components/shared/AppButton';
import { Camera, MapPin, Users, UserPlus, UserMinus, UserCheck, Loader2, X } from 'lucide-react';
import { MOCK_POSTS, MOCK_FRIENDS } from '@/constants/mockData';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: currentUser } = useAuth();
  const { sendRequest, acceptRequest, declineRequest, removeFriend, isLoading: isFriendActionLoading } = useFriends();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => usersApi.getProfile(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <SectionCard className="p-8 text-center text-muted-foreground">
        Người dùng không tồn tại.
      </SectionCard>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  // In a real app, you would fetch posts from backend using user.id
  const userPosts = MOCK_POSTS.filter(p => p.author.id === user.id);

  const renderFriendshipButtons = () => {
    if (isOwnProfile) return null;

    switch (user.friendshipStatus) {
      case 'ACCEPTED':
        return (
          <AppButton 
            variant="secondary" 
            size="sm" 
            icon={<UserMinus size={15} />}
            onClick={() => removeFriend(user.id)}
            disabled={isFriendActionLoading}
          >
            Hủy kết bạn
          </AppButton>
        );
      case 'PENDING':
        if (user.requestId) {
          // This means the current user received a request from this user
          return (
            <div className="flex gap-2">
              <AppButton 
                variant="primary" 
                size="sm" 
                icon={<UserCheck size={15} />}
                onClick={() => acceptRequest(user.requestId!)}
                disabled={isFriendActionLoading}
              >
                Chấp nhận
              </AppButton>
              <AppButton 
                variant="secondary" 
                size="sm" 
                icon={<X size={15} />}
                onClick={() => declineRequest(user.requestId!)}
                disabled={isFriendActionLoading}
              >
                Từ chối
              </AppButton>
            </div>
          );
        } else {
          // Current user sent a request
          return (
            <AppButton 
              variant="secondary" 
              size="sm" 
              icon={<Loader2 className="animate-spin" size={15} />}
              disabled
            >
              Đã gửi lời mời
            </AppButton>
          );
        }
      case 'NONE':
      default:
        return (
          <AppButton 
            variant="primary" 
            size="sm" 
            icon={<UserPlus size={15} />}
            onClick={() => sendRequest(user.id)}
            disabled={isFriendActionLoading}
          >
            Thêm bạn bè
          </AppButton>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-56 md:h-72 rounded-b-3xl overflow-hidden relative">
          <img src={user.coverPhoto || 'https://picsum.photos/1280/400?random=1'} alt="Cover" className="w-full h-full object-cover" />
        </div>

        {/* Avatar and basic info */}
        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <Avatar src={user.avatar} alt={user.name} size="xl"
                className="border-4 border-white shadow-md !w-24 !h-24 md:!w-32 md:!h-32" />
            </div>
            <div className="flex gap-2 mb-2">
              {renderFriendshipButtons()}
              <AppButton variant="secondary" size="sm">Nhắn tin</AppButton>
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
