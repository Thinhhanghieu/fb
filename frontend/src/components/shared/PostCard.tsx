'use client';

import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { Post } from '@/types';
import { Avatar } from './Avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

function formatTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
  } catch {
    return dateStr;
  }
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    onLike?.(post.id);
  };

  return (
    <article
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: 'var(--surface-container-lowest)', boxShadow: 'var(--shadow-premium)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.author.avatar}
            alt={post.author.name}
            size="md"
            isOnline={post.author.isOnline}
          />
          <div>
            <p className="font-semibold text-sm text-foreground leading-tight">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={cn(
          'grid gap-0.5',
          post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        )}>
          {post.images.slice(0, 4).map((img, i) => (
            <div key={i} className="relative overflow-hidden aspect-video">
              <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              {i === 3 && post.images!.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">+{post.images!.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {(likesCount > 0 || post.commentsCount > 0) && (
        <div className="flex items-center justify-between px-4 py-2 mt-1" style={{ background: 'var(--surface-container-low)' }}>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ThumbsUp size={12} className="text-primary" />
            {likesCount}
          </span>
          <span className="text-xs text-muted-foreground">
            {post.commentsCount} bình luận · {post.sharesCount} chia sẻ
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-2 py-1" style={{ background: 'var(--surface-container-low)' }}>
        <button
          onClick={handleLike}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            liked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'
          )}
        >
          <ThumbsUp size={18} className={liked ? 'fill-primary' : ''} />
          Thích
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-all duration-200">
          <MessageCircle size={18} />
          Bình luận
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-all duration-200">
          <Share2 size={18} />
          Chia sẻ
        </button>
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <article className="rounded-2xl p-4 space-y-3 animate-pulse" style={{ background: 'var(--surface-container-lowest)' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-2.5 w-16 rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-4/5 rounded bg-muted" />
      </div>
      <div className="h-48 rounded-xl bg-muted" />
    </article>
  );
}
