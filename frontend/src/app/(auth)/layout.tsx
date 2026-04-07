import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập | Pulse',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--background)' }}>
      {children}
    </main>
  );
}
