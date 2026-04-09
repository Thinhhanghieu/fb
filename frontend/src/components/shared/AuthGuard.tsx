'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { tokenStorage } from '@/lib/axiosClient';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { isLoading } = useAuth();

  // Nếu đã xác thực thì render children luôn
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Nếu có token → đang validate (isLoading) → hiện loading
  if (tokenStorage.get()) {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      );
    }
    // Token hết hạn → httpClient đã redirect sang /login
    return null;
  }

  // Không có token → redirect sang /login
  router.replace(ROUTES.LOGIN);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
