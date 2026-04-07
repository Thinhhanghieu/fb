'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  iconSize?: number;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ iconSize = 16, className, ...props }, ref) => {
    return (
      <div className={cn('relative', className)}>
        <Search
          size={iconSize}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          ref={ref}
          type="search"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          style={{ background: 'var(--surface-container-low)' }}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
