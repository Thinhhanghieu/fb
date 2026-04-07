import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

export function Avatar({ src, alt, size = 'md', isOnline, className }: AvatarProps) {
  return (
    <div className={cn('relative flex-shrink-0', sizeMap[size], className)}>
      <div className={cn('w-full h-full rounded-full overflow-hidden bg-muted border-2 border-white shadow-sm')}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary font-bold font-display" style={{ background: 'var(--secondary)' }}>
            {alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
}

export function AvatarSkeleton({ size = 'md' }: { size?: AvatarProps['size'] }) {
  return <Skeleton className={cn('rounded-full', sizeMap[size])} />;
}
