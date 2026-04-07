import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Tắt padding mặc định (dùng khi card có ảnh ở trên)  */
  noPadding?: boolean;
  /** Mức độ nổi của card */
  elevation?: 'sm' | 'md' | 'lg';
}

const elevationMap: Record<string, string> = {
  sm: '0 4px 12px rgba(0, 88, 188, 0.05)',
  md: '0 12px 32px rgba(0, 88, 188, 0.08)',  // = var(--shadow-premium)
  lg: '0 20px 60px rgba(0, 88, 188, 0.12)',
};

export const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(
  ({ noPadding = false, elevation = 'md', className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl overflow-hidden transition-all duration-200',
          !noPadding && 'p-5',
          className
        )}
        style={{
          background: 'var(--surface-container-lowest)',
          boxShadow: elevationMap[elevation],
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SectionCard.displayName = 'SectionCard';
