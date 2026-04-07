'use client';

import { MOCK_VIDEOS, MOCK_USER } from '@/constants/mockData';
import { Play, Share2, ThumbsUp as Like, MessageCircle as Message, MoreHorizontal, Search, Settings, Home, Compass, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/shared/Avatar';

export default function VideoPage() {
  const [activeTab, setActiveTab] = useState('Trực tiếp');

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Video (Watch)</h1>
          <p className="text-sm text-muted-foreground">Khám phá video dành riêng cho bạn</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Tìm kiếm video..."
              className="pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none transition-all duration-200 w-full md:w-64 shadow-sm"
              style={{ background: 'var(--surface-container-low)' }}
            />
          </div>
          <button className="p-2.5 rounded-2xl text-muted-foreground hover:bg-muted transition-all duration-200"
            style={{ background: 'var(--surface-container-low)' }}>
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="space-y-1">
            {[
              { label: 'Trang chủ', icon: Home },
              { label: 'Trực tiếp', icon: RadioIcon },
              { label: 'Khám phá', icon: Compass },
              { label: 'Video đã lưu', icon: Bookmark },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 hover:bg-muted text-left group"
              >
                <div className="p-2 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <item.icon size={20} />
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="p-5 rounded-3xl" style={{ background: 'var(--surface-container-low)' }}>
             <h4 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-4">Theo dõi của bạn</h4>
             <div className="flex -space-x-3 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Avatar key={i} src={`https://i.pravatar.cc/150?img=${10+i}`} alt="" size="sm" className="border-2 border-surface-container-low" />
                ))}
             </div>
             <p className="text-xs text-muted-foreground">Có 12 video mới từ những người bạn theo dõi.</p>
          </div>
        </aside>

        {/* Video Feed */}
        <div className="flex-1 space-y-8">
          {MOCK_VIDEOS.map((video) => (
            <article
              key={video.id}
              className="rounded-3xl overflow-hidden transition-all duration-300"
              style={{ background: 'var(--surface-container-lowest)', boxShadow: 'var(--shadow-premium)' }}
            >
              {/* Video Player Mockup */}
              <div className="relative aspect-video group cursor-pointer overflow-hidden bg-black">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:opacity-80 transition-all duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 border border-white/30">
                      <Play size={32} className="text-white fill-white ml-1" />
                   </div>
                </div>
                <div className="absolute bottom-4 right-4 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] text-white font-bold">
                   12:45
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <Avatar src={video.author.avatar} alt={video.author.name} size="md" isOnline={video.author.isOnline} />
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground mb-1 leading-tight">{video.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">{video.author.name}</span>
                        <span>•</span>
                        <span>{video.views} lượt xem</span>
                        <span>•</span>
                        <span>{video.time}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-muted transition-all duration-200 text-muted-foreground">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-border/5">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 bg-muted hover:bg-primary/10 hover:text-primary">
                    <Like size={18} />
                    <span>Thích</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 bg-muted hover:bg-primary/10 hover:text-primary">
                    <Message size={18} />
                    <span>Bình luận</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 bg-muted hover:bg-primary/10 hover:text-primary">
                    <Share2 size={18} />
                    <span>Chia sẻ</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function RadioIcon({ size }: { size: number }) {
  return (
    <div className="relative">
      <Compass size={size} />
      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse border-2 border-white" />
    </div>
  );
}
