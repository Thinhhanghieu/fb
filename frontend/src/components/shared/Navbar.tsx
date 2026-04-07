'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Bell, MessageCircle, Menu, X } from 'lucide-react';
import { ROUTES } from '@/constants';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/shared/SearchInput';

const navItems = [
  { href: ROUTES.FEED, icon: Home, label: 'Feed' },
  { href: ROUTES.PROFILE, icon: User, label: 'Trang cá nhân' },
  { href: ROUTES.NOTIFICATIONS, icon: Bell, label: 'Thông báo' },
  { href: ROUTES.MESSAGES, icon: MessageCircle, label: 'Tin nhắn' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                pathname === href
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon size={20} />
              <span className="hidden lg:block">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Avatar */}
        <div className="flex items-center gap-3 ml-4">
          <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20">
            <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
        style={{ background: 'rgba(247,249,252,0.85)', backdropFilter: 'blur(24px)', boxShadow: '0 -4px 30px rgba(0,0,0,0.03)' }}>
        {navItems.map(({ href, icon: Icon, label }) => (
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
            <Icon size={22} />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200',
            isMenuOpen ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>
    </>
  );
}
