'use client';

import { MOCK_PRODUCTS } from '@/constants/mockData';
import { MapPin, Grid, List as ListIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppButton } from '@/components/shared/AppButton';
import { SectionCard } from '@/components/shared/SectionCard';

const categories = ['Tất cả', 'Điện tử', 'Thời trang', 'Gia dụng', 'Xe cộ', 'Bất động sản', 'Sở thích'];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8">
      <PageHeader
        title="Marketplace"
        subtitle="Mua bán trong khu vực của bạn"
        actions={
          <>
            <SearchInput placeholder="Tìm kiếm sản phẩm..." className="w-72 hidden md:block" />
            <AppButton variant="primary" size="md" icon={<Plus size={18} />}>
              <span className="hidden sm:inline">Đăng tin</span>
            </AppButton>
          </>
        }
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          {/* Mobile search */}
          <SearchInput placeholder="Tìm kiếm sản phẩm..." className="lg:hidden" />

          <div>
            <h3 className="font-display font-semibold text-foreground mb-3 px-1">Hạng mục</h3>
            <div className="flex flex-wrap lg:flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                    selectedCategory === cat ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-3 px-1">Bộ lọc</h3>
            <div className="space-y-4 px-1">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vị trí</label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl text-sm" style={{ background: 'var(--surface-container-low)' }}>
                  <MapPin size={16} className="text-primary" />
                  <span>Hà Nội · Trong vòng 20km</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Giá</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Tối thiểu" className="w-1/2 p-2 rounded-xl text-xs outline-none" style={{ background: 'var(--surface-container-low)' }} />
                  <input type="text" placeholder="Tối đa" className="w-1/2 p-2 rounded-xl text-xs outline-none" style={{ background: 'var(--surface-container-low)' }} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-foreground">Sản phẩm cho bạn</h2>
            <div className="flex gap-2">
              <AppButton variant="ghost" size="sm" className="bg-primary/10 text-primary p-2" icon={<Grid size={18} />} />
              <AppButton variant="ghost" size="sm" className="p-2" icon={<ListIcon size={18} />} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_PRODUCTS.map((product) => (
              <SectionCard
                key={product.id}
                noPadding
                className="group hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 backdrop-blur-sm text-primary shadow-sm">
                    {product.category}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-lg font-bold text-primary mb-1">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-2">{product.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    <span>{product.location}</span>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
