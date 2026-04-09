import { Navbar } from '@/components/shared/Navbar';
import { AuthGuard } from '@/components/shared/AuthGuard';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
        <Navbar />
        <main className="flex-1 pb-20 md:pb-6 pt-4">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
