'use client';

import { MOCK_GROUPS } from '@/constants/mockData';
import { Plus, Settings, Compass, Users as UsersIcon, Grid } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/shared/Avatar';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppButton } from '@/components/shared/AppButton';
import { SectionCard } from '@/components/shared/SectionCard';

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState('Dành cho bạn');

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8">
      <PageHeader
        title="Nhóm"
        subtitle="Khám phá và tham gia các cộng đồng"
        actions={
          <>
            <SearchInput placeholder="Tìm nhóm..." className="w-64 hidden md:block" />
            <AppButton variant="primary" size="md" icon={<Plus size={18} />}>
              Tạo nhóm
            </AppButton>
          </>
        }
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="space-y-1">
            {[
              { label: 'Bảng tin nhóm', icon: Grid },
              { label: 'Khám phá', icon: Compass },
              { label: 'Nhóm của bạn', icon: UsersIcon },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 hover:bg-muted text-left"
              >
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <item.icon size={20} />
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground px-4 mb-3 flex items-center justify-between">
              <span>Nhóm bạn đã tham gia</span>
              <Settings size={16} className="text-muted-foreground cursor-pointer" />
            </h3>
            <div className="space-y-1">
              {MOCK_GROUPS.map((group) => (
                <button
                  key={group.id}
                  className="flex items-center gap-3 w-full px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 hover:bg-muted text-left group"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                    <img src={group.cover} alt={group.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{group.name}</p>
                    <p className="text-xs text-muted-foreground">Lần cuối 2 giờ trước</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Groups Content */}
        <div className="flex-1 space-y-8">
          {/* Tabs */}
          <div className="flex items-center gap-4 pb-1 overflow-x-auto">
            {['Dành cho bạn', 'Khám phá', 'Danh mục'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-semibold transition-all duration-200 relative whitespace-nowrap ${
                  activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_GROUPS.map((group) => (
              <SectionCard
                key={group.id}
                noPadding
                className="group hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {group.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{group.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{group.members} thành viên</p>
                  <AppButton
                    variant="ghost"
                    size="md"
                    fullWidth
                    className="bg-primary/10 text-primary hover:bg-primary/20 font-bold"
                  >
                    Tham gia nhóm
                  </AppButton>
                </div>
              </SectionCard>
            ))}
          </div>

          <SectionCard className="text-center" style={{ background: 'var(--surface-container-low)' }}>
            <Compass size={40} className="mx-auto text-primary/30 mb-4" />
            <h3 className="font-display font-bold text-foreground text-xl mb-2">Khám phá cộng đồng mới</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Tham gia các nhóm theo sở thích của bạn để kết nối với những người cùng đam mê.
            </p>
            <AppButton variant="primary" size="lg">Bắt đầu khám phá</AppButton>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
