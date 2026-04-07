'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
type AppButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles: Record<AppButtonVariant, { className: string; style?: React.CSSProperties }> = {
  primary: {
    className:
      'text-white hover:opacity-90 active:scale-[0.98] shadow-md disabled:opacity-60',
    style: {
      background: 'linear-gradient(135deg, var(--primary) 0%, #0070eb 100%)',
      boxShadow: '0 4px 20px rgba(0, 88, 188, 0.3)',
    },
  },
  secondary: {
    className:
      'text-foreground hover:bg-muted/80 active:scale-[0.98] disabled:opacity-60',
    style: { background: 'var(--muted)' },
  },
  ghost: {
    className:
      'text-muted-foreground hover:bg-muted hover:text-foreground active:scale-[0.98] disabled:opacity-60',
    style: {},
  },
  danger: {
    className:
      'bg-red-50 text-red-500 hover:bg-red-100 active:scale-[0.98] disabled:opacity-60',
    style: {},
  },
  icon: {
    className:
      'text-primary hover:bg-primary/10 active:scale-[0.95] aspect-square disabled:opacity-60',
    style: {},
  },
};

const sizeStyles: Record<AppButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-xl',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-2xl',
  lg: 'px-8 py-3 text-sm gap-2.5 rounded-2xl',
};

const iconSizeStyles: Record<AppButtonSize, string> = {
  sm: 'w-8 h-8 rounded-xl',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-2xl',
};

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const { className: variantClass, style: variantStyle } = variantStyles[variant];
    const isIcon = variant === 'icon';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200',
          isIcon ? iconSizeStyles[size] : sizeStyles[size],
          variantClass,
          fullWidth && 'w-full',
          className
        )}
        style={{ ...variantStyle, ...style }}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            {!isIcon && children}
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
            {isIcon && !icon && children}
          </>
        )}
      </button>
    );
  }
);

AppButton.displayName = 'AppButton';

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
