'use client';

import Link from 'next/link';
import { Search, User as UserIcon } from 'lucide-react';
import { Avatar } from '@/components/shared/Avatar';
import { User } from '@/types';

interface SearchDropdownProps {
  results: User[];
  isLoading: boolean;
  searchValue: string;
  onClose: () => void;
  onViewAll: () => void;
}

export function SearchDropdown({ results, isLoading, searchValue, onClose, onViewAll }: SearchDropdownProps) {
  return (
    <div 
      className="absolute top-full mt-2 w-full bg-surface-container-lowest rounded-2xl shadow-premium border border-border/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-2">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-muted" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Kết quả tìm kiếm</span>
              <div 
                role="button"
                onClick={onViewAll}
                className="text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                Xem tất cả
              </div>
            </div>
            <div className="space-y-1">
              {results.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 hover:bg-muted/80 rounded-xl transition-all duration-200"
                >
                  <Avatar src={user.avatar} size="sm" alt={user.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">@{user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <UserIcon size={24} className="text-muted-foreground/60" />
            </div>
            <p className="text-sm text-muted-foreground">Không tìm thấy người dùng "{searchValue}"</p>
          </div>
        )}
      </div>
      
      <div 
        role="button"
        onClick={onViewAll}
        className="w-full p-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors border-t border-border/30 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Search size={14} />
        Xem kết quả cho "{searchValue}"
      </div>
    </div>
  );
}
