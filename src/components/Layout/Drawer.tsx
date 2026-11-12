import React, { useEffect } from 'react';
import {
  Home,
  ShoppingCart,
  Package,
  Truck,
  Users,
  Wallet,
  BarChart3,
  Sliders,
  X,
  ShieldCheck,
  Lock,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp, ScreenType } from '../../context/AppContext.tsx';
import { AJ_MOTORS_LOGO } from '../../constants/assets.ts';

interface NavItem {
  id: ScreenType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Drawer: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    isDrawerOpen,
    setIsDrawerOpen,
    products,
    currentUser,
    theme,
    toggleTheme,
  } = useApp();

  const lowStockCount = products.filter((p) => p.stockQty <= p.minStock).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setIsDrawerOpen]);

  const navItems: NavItem[] = [
    { id: 'dash', label: 'ড্যাশবোর্ড', icon: Home },
    { id: 'pos', label: 'বিক্রি (POS)', icon: ShoppingCart },
    { id: 'products', label: 'পণ্য ও স্টক', icon: Package, badge: lowStockCount },
    { id: 'purchase', label: 'ক্রয়', icon: Truck },
    { id: 'customers', label: 'গ্রাহক ও বাকি', icon: Users },
    { id: 'cash', label: 'ক্যাশবুক', icon: Wallet },
    { id: 'reports', label: 'রিপোর্ট', icon: BarChart3 },
    { id: 'login', label: 'লগইন পেজ', icon: Lock },
  ];

  const handleNavigate = (id: ScreenType) => {
    setCurrentScreen(id);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-200 no-print ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[280px] z-50 bg-[#1A1A1A] border-r border-[#2E2E2E] p-4 flex flex-col gap-1 transition-transform duration-220 ease-in-out no-print ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="মেনু"
      >
        {/* Brand header with Logo */}
        <div className="flex items-center justify-between px-2 pb-3 pt-1 border-b border-[#2E2E2E] mb-2">
          <div
            className="cursor-pointer"
            onClick={() => handleNavigate('dash')}
          >
            <img
              src={AJ_MOTORS_LOGO}
              alt="AJ MOTORS"
              className="h-10 w-auto max-w-[150px] object-contain mb-0.5"
            />
            <span className="text-[11px] text-[#9B9A94] block">দোকান ম্যানেজমেন্ট সিস্টেম</span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="মেনু বন্ধ করুন"
            className="w-8 h-8 rounded-md grid place-items-center text-[#9B9A94] hover:text-[#F2F1EC] hover:bg-[#232323] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current user badge */}
        <div className="mx-1 mb-2 px-3 py-2 bg-[#111111] border border-[#2E2E2E] rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E8A317]" />
            <span className="text-[#F2F1EC] font-medium">{currentUser.name}</span>
          </div>
          <span className="text-[11px] text-[#9B9A94] bg-[#232323] px-2 py-0.5 rounded">
            {currentUser.role === 'admin'
              ? 'অ্যাডমিন'
              : currentUser.role === 'manager'
              ? 'ম্যানেজার'
              : 'ক্যাশিয়ার'}
          </span>
        </div>

        {/* Theme mode switcher inside Drawer */}
        <div className="mx-1 mb-2 p-2 bg-[#111111] border border-[#2E2E2E] rounded-lg flex items-center justify-between text-xs">
          <span className="text-[#9B9A94] font-medium flex items-center gap-1.5">
            {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-[#E8A317]" /> : <Sun className="w-3.5 h-3.5 text-[#D98200]" />}
            {theme === 'dark' ? 'নাইট মোড' : 'লাইট মোড'}
          </span>
          <button
            onClick={toggleTheme}
            className="px-2.5 py-1 rounded bg-[#232323] text-[#F2F1EC] hover:text-[#E8A317] text-[11px] font-semibold transition cursor-pointer"
          >
            {theme === 'dark' ? 'লাইট মোড দিন' : 'নাইট মোড দিন'}
          </button>
        </div>

        {/* Main Nav Items */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left font-medium transition cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#E8A317] text-[#111111] font-semibold shadow-xs'
                    : 'text-[#9B9A94] hover:bg-[#232323] hover:text-[#F2F1EC]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-none stroke-[1.8] ${
                    isActive ? 'text-[#111111]' : 'text-current'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#111111] text-[#E8A317]'
                        : 'bg-[#E0583C]/20 text-[#E0583C] border border-[#E0583C]/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="h-px bg-[#2E2E2E] my-2 mx-1" />

          {/* Design system showcase link */}
          <button
            onClick={() => handleNavigate('ui')}
            aria-current={currentScreen === 'ui' ? 'page' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left font-medium transition cursor-pointer select-none ${
              currentScreen === 'ui'
                ? 'bg-[#E8A317] text-[#111111] font-semibold'
                : 'text-[#9B9A94] hover:bg-[#232323] hover:text-[#F2F1EC]'
            }`}
          >
            <Sliders className="w-5 h-5 flex-none stroke-[1.8]" />
            <span>ডিজাইন সিস্টেম</span>
          </button>
        </nav>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#2E2E2E] px-2 text-[12px] text-[#9B9A94] flex justify-between items-center">
          <span>AJ MOTORS v1.0</span>
          <span className="text-[#4FAE6E]">● অনলাইন</span>
        </div>
      </aside>
    </>
  );
};
