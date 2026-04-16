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
    // Gradient fill, pill roundedness, on_primary text. Hover scales 1.02x
    className:
      'text-primary-foreground shadow-[0_12px_32px_rgba(0,88,188,0.08)] hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(0,88,188,0.12)] active:scale-95 disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-[0_12px_32px_rgba(0,88,188,0.08)]',
    style: {
      background: 'var(--gradient-primary)',
    },
  },
  secondary: {
    // secondary_container background with on_secondary_container text. No border.
    className:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100',
    style: {},
  },
  ghost: {
    // Ghost style. Only on_surface_variant text. High-contrast hover state using surface-container-high (mapped to muted).
    className:
      'text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100',
    style: {},
  },
  danger: {
    className:
      'bg-red-50 text-red-500 hover:bg-red-100 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100',
    style: {},
  },
  icon: {
    className:
      'text-primary bg-transparent hover:bg-primary/10 active:scale-95 aspect-square disabled:opacity-60',
    style: {},
  },
};

const sizeStyles: Record<AppButtonSize, string> = {
  sm: 'px-4 py-1.5 text-xs gap-1.5 rounded-full',
  md: 'px-6 py-2.5 text-sm gap-2 rounded-full',
  lg: 'px-8 py-3 text-sm gap-2.5 rounded-full',
};

const iconSizeStyles: Record<AppButtonSize, string> = {
  sm: 'w-8 h-8 rounded-full',
  md: 'w-10 h-10 rounded-full',
  lg: 'w-12 h-12 rounded-full',
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
          'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
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
