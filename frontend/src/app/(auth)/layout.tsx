import type { Metadata } from 'next';
import { AuthRedirect } from '@/components/shared/AuthRedirect';

export const metadata: Metadata = {
  title: 'Đăng nhập | Pulse',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthRedirect>
      <main className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'var(--background)' }}>
        {children}
      </main>
    </AuthRedirect>
  );
}
