'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { tokenStorage } from '@/lib/axiosClient';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Chỉ redirect nếu đã mount xong, không có token TRONG LOCALSTORAGE và chưa login
    if (isClient && !isAuthenticated && !tokenStorage.get()) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isClient, isAuthenticated, router]);

  // Server render và Client mount đầu tiên: render loading trung lập
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Đã login -> render nội dung luôn
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Nếu có token nhưng chưa isAuthenticated (đang load profile) -> Chờ load
  if (tokenStorage.get()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  // Không có token -> Sẽ bị useEffect ở trên redirect sang Login
  // Render loading ở đây để tránh lộ children khi chưa kịp redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}
