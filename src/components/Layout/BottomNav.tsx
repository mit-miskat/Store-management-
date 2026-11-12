import React from 'react';
import { Home, ShoppingCart, Package, Users, BarChart3 } from 'lucide-react';
import { useApp, ScreenType } from '../../context/AppContext.tsx';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, products } = useApp();
  const lowStockCount = products.filter((p) => p.stockQty <= p.minStock).length;

  const items: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dash', label: 'ড্যাশ', icon: Home },
    { id: 'pos', label: 'বিক্রি', icon: ShoppingCart },
    { id: 'products', label: 'পণ্য', icon: Package, badge: lowStockCount },
    { id: 'customers', label: 'গ্রাহক', icon: Users },
    { id: 'reports', label: 'রিপোর্ট', icon: BarChart3 },
  ];

  return (
    <nav
      className="md:hidden fixed left-0 right-0 bottom-0 z-30 bg-[#1A1A1A] border-t border-[#2E2E2E] flex justify-around items-center px-1 py-1.5 pb-[calc(6px+env(safe-area-inset-bottom,0px))] no-print"
      aria-label="দ্রুত মেনু"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setCurrentScreen(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition cursor-pointer ${
              isActive ? 'text-[#E8A317]' : 'text-[#9B9A94] hover:text-[#F2F1EC]'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 stroke-[1.8]" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-[#E0583C] text-[#F2F1EC] text-[9px] font-bold grid place-items-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
