import { MOCK_FRIENDS, MOCK_USER } from '@/constants/mockData';
import { Avatar } from '@/components/shared/Avatar';
import { ROUTES } from '@/constants';
import Link from 'next/link';

export function LeftSidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-1 w-72 flex-shrink-0 sticky top-20 h-fit">
      {/* User info shortcut */}
      <Link href={ROUTES.PROFILE}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-all duration-200 group">
        <Avatar src={MOCK_USER.avatar} alt={MOCK_USER.name} size="md" />
        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
          {MOCK_USER.name}
        </span>
      </Link>

      {[
        { label: 'Bạn bè', icon: '👥', href: '#' },
        { label: 'Nhóm', icon: '🏠', href: ROUTES.GROUPS },
        { label: 'Marketplace', icon: '🛍️', href: ROUTES.MARKETPLACE },
        { label: 'Video', icon: '🎬', href: ROUTES.VIDEO },
        { label: 'Sự kiện', icon: '📅', href: '#' },
      ].map(({ label, icon, href }) => (
        <Link key={label} href={href}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-all duration-200 text-left w-full group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-200 group-hover:scale-110"
               style={{ background: 'var(--surface-container-low)' }}>
            {icon}
          </div>
          <span className="font-semibold text-sm text-foreground">{label}</span>
        </Link>
      ))}
    </aside>
  );
}

export function RightSidebar() {
  return (
    <aside className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0 sticky top-20 h-fit">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-3">Bạn bè đang online</h3>
        <div className="space-y-1">
          {MOCK_FRIENDS.filter(f => f.isOnline).map((friend) => (
            <button key={friend.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-all duration-200 w-full text-left">
              <Avatar src={friend.avatar} alt={friend.name} size="md" isOnline={friend.isOnline} />
              <span className="font-medium text-sm text-foreground">{friend.name}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
