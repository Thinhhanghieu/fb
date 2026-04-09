'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { ROUTES } from '@/constants';
import { tokenStorage } from '@/lib/axiosClient';

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (tokenStorage.get() || isAuthenticated) {
      router.replace(ROUTES.FEED);
    }
  }, [isAuthenticated, router]);

  if (tokenStorage.get() || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
