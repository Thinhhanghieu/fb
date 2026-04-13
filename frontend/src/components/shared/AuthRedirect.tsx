'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { ROUTES } from '@/constants';
import { tokenStorage } from '@/lib/axiosClient';

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && (tokenStorage.get() || isAuthenticated)) {
      router.replace(ROUTES.FEED);
    }
  }, [isClient, isAuthenticated, router]);

  // Nếu đang ở server hoặc đang trong quá trình hydrate -> render rỗng để tránh nháy
  // Hoặc nếu đã xác định là có token -> cũng render rỗng vì sẽ redirect
  if (!isClient || tokenStorage.get() || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
