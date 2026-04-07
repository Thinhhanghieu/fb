import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Các action button nằm bên phải (CTA, search, v.v) */
  actions?: ReactNode;
  className?: string;
}

/**
 * PageHeader
 * Pattern chung cho heading của các trang trong (main).
 * Gồm: tiêu đề + phụ đề + khu vực actions bên phải.
 */
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8',
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
}
