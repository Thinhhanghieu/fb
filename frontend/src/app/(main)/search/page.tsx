'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api/users.api';
import { Avatar } from '@/components/shared/Avatar';
import { AppButton } from '@/components/shared/AppButton';
import { PageHeader } from '@/components/shared/PageHeader';
import { User } from '@/types';
import Link from 'next/link';
import { Search, UserPlus, UserCheck, MessageCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => usersApi.searchUsers(query, 1, 50),
    enabled: !!query,
  });

  const users = data?.data || [];

  // Mutation gửi lời mời kết bạn
  const friendRequestMutation = useMutation({
    mutationFn: (userId: string) => usersApi.sendFriendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search', query] });
    },
  });

  const handleFriendAction = (user: User) => {
    if (user.friendshipStatus === 'NONE') {
      friendRequestMutation.mutate(user.id);
    } else if (user.friendshipStatus === 'ACCEPTED') {
      router.push(`/messages?u=${user.id}`);
    }
  };

  function renderFriendButton(user: User) {
    switch (user.friendshipStatus) {
      case 'ACCEPTED':
        return (
          <AppButton 
            variant="secondary" 
            size="sm" 
            icon={<UserCheck size={16} />}
            onClick={() => handleFriendAction(user)}
          >
            Bạn bè
          </AppButton>
        );
      case 'PENDING':
        return (
          <AppButton 
            variant="ghost" 
            size="sm" 
            disabled 
            icon={<Clock size={16} />}
            className="bg-muted/30"
          >
            Đã gửi lời mời
          </AppButton>
        );
      default:
        return (
          <AppButton 
            variant="primary" 
            size="sm" 
            icon={<UserPlus size={16} />}
            isLoading={friendRequestMutation.isPending && friendRequestMutation.variables === user.id}
            onClick={() => handleFriendAction(user)}
          >
            Kết bạn
          </AppButton>
        );
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <PageHeader title={query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm'} />

      {!query ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Search size={32} />
          </div>
          <p>Nhập tên hoặc tên người dùng để tìm kiếm bạn bè.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
              <div className="h-10 w-24 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Không tìm thấy người dùng nào phù hợp với "{query}".
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-muted-foreground px-1">Mọi người</h3>
          {users.map((user: User) => (
            <div
              key={user.id}
              className="group flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <Link href={`/profile/${user.id}`}>
                  <Avatar src={user.avatar} alt={user.name} size="lg" className="hover:scale-105 transition-transform" />
                </Link>
                <div className="min-w-0">
                  <Link href={`/profile/${user.id}`}>
                    <h4 className="font-bold text-foreground hover:underline truncate">{user.name}</h4>
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                  {user.bio && <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{user.bio}</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {renderFriendButton(user)}
                <AppButton 
                  variant="icon" 
                  size="sm" 
                  icon={<MessageCircle size={18} />} 
                  className="bg-muted/50" 
                  onClick={() => router.push(`/messages?u=${user.id}`)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
