import Link from 'next/link';
import { MOCK_USER } from '@/constants/mockData';
import { Avatar } from '@/components/shared/Avatar';
import { SectionCard } from '@/components/shared/SectionCard';
import { AppButton } from '@/components/shared/AppButton';
import { ROUTES } from '@/constants';
import {
  User, Bell, Lock, Globe, Moon, HelpCircle, LogOut,
  ChevronRight, Shield, Palette
} from 'lucide-react';

const settingsSections = [
  {
    title: 'Tài khoản',
    items: [
      { icon: User, label: 'Thông tin cá nhân', desc: 'Tên, email, mật khẩu', href: '#' },
      { icon: Lock, label: 'Bảo mật & đăng nhập', desc: 'Xác thực hai bước, thiết bị', href: '#' },
      { icon: Shield, label: 'Quyền riêng tư', desc: 'Ai thấy hồ sơ của bạn', href: '#' },
    ],
  },
  {
    title: 'Tuỳ chọn',
    items: [
      { icon: Bell, label: 'Thông báo', desc: 'Kiểm soát thông báo', href: '#' },
      { icon: Globe, label: 'Ngôn ngữ', desc: 'Tiếng Việt', href: '#' },
      { icon: Moon, label: 'Giao diện', desc: 'Sáng / Tối', href: '#' },
      { icon: Palette, label: 'Chủ đề màu sắc', desc: 'Tuỳ chỉnh giao diện', href: '#' },
    ],
  },
  {
    title: 'Hỗ trợ',
    items: [
      { icon: HelpCircle, label: 'Trung tâm trợ giúp', desc: 'Câu hỏi thường gặp', href: '#' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Cài đặt</h1>

      {/* User Info Card */}
      <SectionCard className="flex items-center gap-4">
        <Avatar src={MOCK_USER.avatar} alt={MOCK_USER.name} size="lg" isOnline />
        <div>
          <p className="font-display font-bold text-foreground">{MOCK_USER.name}</p>
          <p className="text-sm text-muted-foreground">@{MOCK_USER.username}</p>
          <Link href={ROUTES.PROFILE}
            className="text-xs font-medium hover:underline" style={{ color: 'var(--primary)' }}>
            Xem trang cá nhân
          </Link>
        </div>
      </SectionCard>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <section key={section.title} className="space-y-2">
          <h2 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wide px-1">
            {section.title}
          </h2>
          <SectionCard noPadding>
            {section.items.map(({ icon: Icon, label, desc, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-4 p-4 hover:bg-muted transition-all duration-200 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--surface-container-low)', color: 'var(--primary)' }}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </SectionCard>
        </section>
      ))}

      {/* Logout */}
      <SectionCard noPadding>
        <AppButton
          variant="danger"
          className="w-full px-4 py-4 rounded-none justify-start gap-4 font-semibold"
          icon={
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100">
              <LogOut size={18} className="text-red-500" />
            </div>
          }
        >
          Đăng xuất
        </AppButton>
      </SectionCard>

      <p className="text-center text-xs text-muted-foreground pb-8">
        Pulse · Phiên bản 1.0.0 · © 2025
      </p>
    </div>
  );
}
