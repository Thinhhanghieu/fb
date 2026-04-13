'use client';

import { MessageCircle, Share2, MoreHorizontal, ThumbsUp, Send } from 'lucide-react';
import { Post, PostComment } from '@/types';
import { Avatar } from './Avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { postsApi, PaginatedResponse } from '@/services/api/posts.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { AppInput } from './AppInput';

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
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  
  const queryClient = useQueryClient();

  // Mutation cho Like
  const likeMutation = useMutation({
    mutationFn: () => postsApi.toggleLike(post.id),
    onSuccess: (updatedPost) => {
      setLiked(updatedPost.isLiked);
      setLikesCount(updatedPost.likesCount);
      onLike?.(post.id);
      // Update cache if needed
      queryClient.setQueryData([QUERY_KEYS.POSTS], (oldData: PaginatedResponse<Post> | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((p: Post) => p.id === post.id ? updatedPost : p)
        };
      });
    },
  });

  // Query lấy comments
  const { data: commentsData, isLoading: isLoadingComments } = useQuery({
    queryKey: [QUERY_KEYS.POSTS, post.id, 'comments'],
    queryFn: () => postsApi.getComments(post.id),
    enabled: showComments,
  });

  // Mutation thêm comment
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => postsApi.addComment(post.id, content),
    onSuccess: (updatedPost) => {
      setCommentContent('');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS, post.id, 'comments'] });
      // Update post stats in cache
      queryClient.setQueryData([QUERY_KEYS.POSTS], (oldData: PaginatedResponse<Post> | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((p: Post) => p.id === post.id ? updatedPost : p)
        };
      });
    },
  });

  const handleLike = () => {
    // Optimistic UI
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    likeMutation.mutate();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || addCommentMutation.isPending) return;
    addCommentMutation.mutate(commentContent);
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
        <button 
          onClick={() => setShowComments(!showComments)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-all duration-200',
            showComments && 'text-primary bg-primary/10'
          )}
        >
          <MessageCircle size={18} />
          Bình luận
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-all duration-200">
          <Share2 size={18} />
          Chia sẻ
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 pt-0 space-y-4" style={{ background: 'var(--surface-container-low)' }}>
          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Avatar size="sm" alt="My Avatar" />
            <div className="flex-1 relative">
              <AppInput
                placeholder="Viết bình luận..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="pr-10"
              />
              <button 
                type="submit"
                disabled={!commentContent.trim() || addCommentMutation.isPending}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:text-muted-foreground"
              >
                <Send size={18} />
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {isLoadingComments ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : commentsData?.data.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-4">Chưa có bình luận nào.</p>
            ) : (
              commentsData?.data.map((comment: PostComment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar src={comment.author.avatar} alt={comment.author.name} size="sm" />
                  <div className="flex-1">
                    <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none inline-block max-w-full">
                      <p className="text-xs font-bold text-foreground">{comment.author.name}</p>
                      <p className="text-sm text-foreground leading-normal">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-1">
                      <p className="text-[10px] text-muted-foreground">{formatTime(comment.createdAt)}</p>
                      <button className="text-[10px] font-bold text-muted-foreground hover:underline">Thích</button>
                      <button className="text-[10px] font-bold text-muted-foreground hover:underline">Phản hồi</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
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
