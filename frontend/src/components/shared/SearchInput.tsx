'use client';

import { InputHTMLAttributes, forwardRef, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { SearchDropdown } from './SearchDropdown';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  iconSize?: number;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ iconSize = 16, className, onKeyDown, ...props }, ref) => {
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { 
      searchValue, 
      setSearchValue, 
      debouncedValue,
      isOpen, 
      setIsOpen, 
      results, 
      isLoading, 
      clearSearch 
    } = useSearch();

    // Đóng dropdown khi nhấn ra ngoài
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    const navigateToSearch = () => {
      if (!searchValue.trim()) return;
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') navigateToSearch();
      onKeyDown?.(e);
    };

    return (
      <div className={cn('relative w-full max-w-md group', className)} ref={dropdownRef}>
        {/* Input Area */}
        <div className="relative flex items-center">
          <Search
            size={iconSize}
            className="absolute left-3.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors"
          />
          <input
            ref={ref}
            type="text"
            value={searchValue}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm bạn bè..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full text-sm outline-none transition-all duration-300 bg-surface-container-low focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/10"
            {...props}
          />
          
          <div className="absolute right-3 flex items-center gap-1">
            {isLoading && debouncedValue && (
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            )}
            {searchValue && (
              <button 
                onClick={clearSearch}
                className="p-1 hover:bg-muted rounded-full transition-colors"
                type="button"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Area */}
        {isOpen && searchValue.length > 0 && (
          <SearchDropdown 
            results={results}
            isLoading={isLoading}
            searchValue={searchValue}
            onClose={() => setIsOpen(false)}
            onViewAll={navigateToSearch}
          />
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
