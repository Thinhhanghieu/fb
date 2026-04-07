'use client';

import { InputHTMLAttributes, forwardRef, ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  /** Hiển thị nút ẩn/hiện mật khẩu */
  passwordToggle?: boolean;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, icon, error, hint, passwordToggle, type, className, id, ...props }, ref) => {
    const [showPass, setShowPass] = useState(false);

    const resolvedType = passwordToggle
      ? showPass ? 'text' : 'password'
      : type;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left icon */}
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex-shrink-0">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={resolvedType}
            className={cn(
              'w-full py-3 text-sm text-foreground rounded-xl outline-none transition-all duration-200',
              'focus:ring-2 focus:ring-primary/30',
              icon ? 'pl-10' : 'pl-4',
              passwordToggle ? 'pr-12' : 'pr-4',
              error
                ? 'ring-2 ring-red-400/60'
                : '',
              className
            )}
            style={{ background: 'var(--input)' }}
            {...props}
          />

          {/* Password toggle */}
          {passwordToggle && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {/* Error / Hint */}
        {error && (
          <p className="text-xs text-red-500 font-medium px-1">{error}</p>
        )}
        {!error && hint && (
          <p className="text-xs text-muted-foreground px-1">{hint}</p>
        )}
      </div>
    );
  }
);

AppInput.displayName = 'AppInput';
