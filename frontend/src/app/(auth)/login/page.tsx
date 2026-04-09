'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { ROUTES, APP_NAME, APP_DESCRIPTION } from '@/constants';
import { useRouter } from 'next/navigation';
import { AppButton } from '@/components/shared/AppButton';
import { AppInput } from '@/components/shared/AppInput';
import { authApi } from '@/services/api/auth.api';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setCurrentUser } from '@/store/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(form);
      dispatch(setCurrentUser(response.user));
      router.push(ROUTES.FEED);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      {/* Left: Branding */}
      <div className="hidden md:flex flex-col gap-6">
        <h1 className="font-display text-5xl font-bold leading-tight" style={{ color: 'var(--primary)' }}>
          {APP_NAME}
        </h1>
        <p className="text-2xl text-foreground leading-relaxed">{APP_DESCRIPTION}</p>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Trải nghiệm mạng xã hội thế hệ mới với giao diện tinh tế, bảo mật và cộng đồng văn minh.
        </p>
      </div>

      {/* Right: Login Form */}
      <div
        className="w-full rounded-3xl p-8 space-y-6"
        style={{ background: 'var(--surface-container-lowest)', boxShadow: '0 12px 40px rgba(0,88,188,0.1)' }}
      >
        {/* Mobile Logo */}
        <div className="md:hidden text-center">
          <span className="font-display text-3xl font-bold" style={{ color: 'var(--primary)' }}>{APP_NAME}</span>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">32Chào mừng trở lại</h2>
          <p className="text-muted-foreground text-sm mt-1">Vui lòng nhập thông tin đăng nhập của bạn.</p>
        </div>

        {error && (
          <div className="rounded-xl p-3 text-sm" style={{ background: 'var(--error-container)', color: 'var(--on-error-container)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AppInput
            id="login-email"
            label="Email"
            type="email"
            icon={<Mail size={16} />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            required
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Mật khẩu</label>
              <Link href="#" className="text-xs font-medium hover:underline" style={{ color: 'var(--primary)' }}>
                Quên mật khẩu?
              </Link>
            </div>
            <AppInput
              id="login-password"
              type="password"
              icon={<Lock size={16} />}
              passwordToggle
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <AppButton
            id="login-submit"
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Đăng nhập
          </AppButton>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link href={ROUTES.REGISTER} className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="#" className="hover:underline">Quyền riêng tư</Link>
            <Link href="#" className="hover:underline">Điều khoản</Link>
            <Link href="#" className="hover:underline">Hỗ trợ</Link>
            <span>© 2025 Pulse</span>
          </div>
        </div>
      </div>
    </div>
  );
}