'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Lock, Mail, User, Calendar } from 'lucide-react';
import { ROUTES, APP_NAME } from '@/constants';
import { useRouter } from 'next/navigation';
import { AppButton } from '@/components/shared/AppButton';
import { AppInput } from '@/components/shared/AppInput';
import { authApi } from '@/services/api/auth.api';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setCurrentUser } from '@/store/slices/authSlice';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    birthday: '',
    gender: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      dispatch(setCurrentUser(response.user));
      router.push(ROUTES.FEED);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Đăng ký thất bại. Vui lòng thử lại.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="rounded-3xl p-8 space-y-6"
        style={{ background: 'var(--surface-container-lowest)', boxShadow: '0 12px 40px rgba(0,88,188,0.1)' }}
      >
        <div className="text-center">
          <span className="font-display text-3xl font-bold" style={{ color: 'var(--primary)' }}>{APP_NAME}</span>
          <h2 className="font-display text-xl font-bold text-foreground mt-3">Tạo tài khoản mới</h2>
          <p className="text-muted-foreground text-sm mt-1">Nhanh chóng và dễ dàng.</p>
        </div>

        {error && (
          <div className="rounded-xl p-3 text-sm" style={{ background: 'var(--error-container)', color: 'var(--on-error-container)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AppInput
            id="register-fullname"
            label="Họ và tên"
            type="text"
            icon={<User size={16} />}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Nguyễn Văn A"
            required
          />

          <AppInput
            id="register-username"
            label="Tên đăng nhập"
            type="text"
            icon={<User size={16} />}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="nguyenvana"
            required
          />

          <AppInput
            id="register-email"
            label="Email"
            type="email"
            icon={<Mail size={16} />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            required
          />

          <AppInput
            id="register-password"
            label="Mật khẩu mới"
            icon={<Lock size={16} />}
            passwordToggle
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Ít nhất 8 ký tự"
            required
            minLength={8}
          />

          <AppInput
            id="register-birthday"
            label="Ngày sinh"
            type="date"
            icon={<Calendar size={16} />}
            value={form.birthday}
            onChange={(e) => setForm({ ...form, birthday: e.target.value })}
          />

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">Giới tính</label>
            <div className="grid grid-cols-3 gap-2">
              {['Nam', 'Nữ', 'Khác'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({ ...form, gender: g })}
                  className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: form.gender === g ? 'var(--primary)' : 'var(--input)',
                    color: form.gender === g ? 'white' : 'var(--foreground)',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Bằng cách nhấn Đăng ký, bạn đồng ý với{' '}
            <Link href="#" className="underline hover:text-foreground">Điều khoản</Link>,{' '}
            <Link href="#" className="underline hover:text-foreground">Chính sách quyền riêng tư</Link>.
          </p>

          <AppButton
            id="register-submit"
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Đăng ký
          </AppButton>
        </form>

        <div className="text-center pt-2">
          <Link href={ROUTES.LOGIN} className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}