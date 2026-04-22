'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Bell, MessageCircle, Menu, X, LogOut, Settings, UserCircle } from 'lucide-react';
import { ROUTES } from '@/constants';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/shared/SearchInput';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';

const navItems = [
  { href: ROUTES.FEED, icon: Home, label: 'Feed' },
  { href: ROUTES.PROFILE, icon: User, label: 'Trang cá nhân' },
  { href: ROUTES.NOTIFICATIONS, icon: Bell, label: 'Thông báo', badge: true },
  { href: ROUTES.MESSAGES, icon: MessageCircle, label: 'Tin nhắn' },
];

function UserAvatarDropdown() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsOpen(false);
    // Điều hướng trước khi logout để các component khác unmount
    router.push(ROUTES.LOGIN);
    await logout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 transition-all duration-200 hover:border-primary/50 hover:scale-105"
      >
        {currentUser?.avatar ? (
          <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm"
            style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl overflow-hidden"
            style={{ background: 'var(--surface-container-high)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid var(--outline-variant)' }}>
            {/* User Info Header */}
            <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-bold"
                    style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground truncate">@{currentUser?.username}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href={ROUTES.PROFILE}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <UserCircle size={18} className="text-muted-foreground" />
                <span>Xem trang cá nhân</span>
              </Link>
              <Link
                href={ROUTES.SETTINGS}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} className="text-muted-foreground" />
                <span>Cài đặt</span>
              </Link>
              <div style={{ borderTop: '1px solid var(--outline-variant)', margin: '4px 0' }} />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left hover:bg-surface-container-low transition-colors"
                style={{ color: 'var(--error)' }}
              >
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { useGetUnreadCount } = useNotifications();
  const { data: unreadCount } = useGetUnreadCount();

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden md:flex sticky top-0 z-50 h-16 items-center justify-between px-6 backdrop-blur-2xl transition-all duration-300"
        style={{ background: 'rgba(247,249,252,0.7)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)' }}>
        <Link href={ROUTES.FEED} className="flex items-center gap-2">
          <span className="text-xl font-display font-bold" style={{ color: 'var(--primary)' }}>
            Pulse
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xs mx-8">
          <SearchInput placeholder="Tìm kiếm..." />
        </div>

        {/* Desktop Nav Links */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, icon: Icon, label, badge }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl text-xs font-medium transition-all duration-200 relative',
                pathname === href
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon size={20} />
                {badge && unreadCount !== undefined && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold border-2 border-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block">{label}</span>
            </Link>
          ))}
        </nav>

        {/* User Avatar with Dropdown */}
        <div className="flex items-center gap-3 ml-4">
          <UserAvatarDropdown />
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
        style={{ background: 'rgba(247,249,252,0.85)', backdropFilter: 'blur(24px)', boxShadow: '0 -4px 30px rgba(0,0,0,0.03)' }}>
        {navItems.map(({ href, icon: Icon, label, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200',
              pathname === href
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <div className="relative">
              <Icon size={22} />
              {badge && unreadCount !== undefined && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
        <div className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-xs font-medium">
          <UserAvatarDropdown />
        </div>
      </nav>
    </>
  );
}