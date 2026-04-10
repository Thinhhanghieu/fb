'use client';

import React from 'react';
import { useFeed } from '@/hooks/useFeed';
import { PostCard, PostCardSkeleton } from '@/components/shared/PostCard';

export function FeedList() {
  const { data, isLoading, isError } = useFeed();

  if (isLoading) {
    return (
      <section className="space-y-4">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-xl">
        Có lỗi xảy ra khi tải bài viết.
      </div>
    );
  }

  const posts = data?.data || [];

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
        Chưa có bài viết nào. Hãy tạo bài viết đầu tiên của bạn!
      </div>
    );
  }

  return (
    <section className="space-y-4 flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
}
