'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { tokenStorage } from '@/lib/axiosClient';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) {
      router.replace(ROUTES.FEED);
    } else {
      router.replace(ROUTES.LOGIN);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}
