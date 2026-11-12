import React from 'react';
import { Menu, Search, Bell, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { AJ_MOTORS_LOGO } from '../../constants/assets.ts';

export const Topbar: React.FC = () => {
  const {
    toggleDrawer,
    currentUser,
    setIsLoginModalOpen,
    searchQuery,
    setSearchQuery,
    products,
    setCurrentScreen,
    theme,
    toggleTheme,
  } = useApp();

  const lowStockCount = products.filter((p) => p.stockQty <= p.minStock).length;

  return (
    <header className="sticky top-0 z-20 flex items-center gap-2.5 sm:gap-3 h-[60px] px-3 sm:px-4 bg-[#111111] border-b border-[#2E2E2E] no-print select-none">
      {/* ☰ Hamburger Drawer Toggle */}
      <button
        onClick={toggleDrawer}
        aria-label="মেনু খুলুন"
        className="inline-grid place-items-center w-10 h-10 flex-none bg-transparent border border-[#2E2E2E] rounded-lg cursor-pointer hover:bg-[#1A1A1A] transition text-[#F2F1EC]"
      >
        <Menu className="w-5 h-5 stroke-[1.8]" />
      </button>

      {/* Brand & Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer transition hover:opacity-90 flex-none"
        onClick={() => setCurrentScreen('dash')}
        title="AJ MOTORS হোম / ড্যাশবোর্ড"
      >
        <img
          src={AJ_MOTORS_LOGO}
          alt="AJ MOTORS"
          className="h-9 w-auto max-w-[130px] sm:max-w-[150px] object-contain flex-none"
        />
        <div className="hidden xl:flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-wide text-[#F2F1EC]">
            AJ MOTORS
          </span>
          <span className="text-[10px] text-[#9B9A94]">মূল দোকান · মিরপুর</span>
        </div>
      </div>

      <div className="flex-1 min-w-0" />

      {/* Global Search Bar (Tablet & Desktop) */}
      <div className="relative hidden md:flex items-center gap-2 h-10 w-[min(300px,32vw)] bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg px-3 focus-within:border-[#E8A317] transition">
        <Search className="w-4 h-4 text-[#9B9A94] flex-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="পণ্য, বারকোড বা বাইক মডেল..."
          aria-label="পণ্য খুঁজুন"
          className="bg-transparent border-0 outline-none text-xs sm:text-sm text-[#F2F1EC] placeholder-[#9B9A94] w-full min-w-0"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-[#9B9A94] hover:text-[#F2F1EC] cursor-pointer"
          >
            মুছুন
          </button>
        )}
      </div>

      {/* Night / Light Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'লাইট মোড চালু করুন (Day Mode)' : 'নাইট মোড চালু করুন (Night Mode)'}
        aria-label="থিম পরিবর্তন"
        className="inline-grid place-items-center w-10 h-10 flex-none bg-transparent border border-[#2E2E2E] rounded-lg cursor-pointer hover:bg-[#1A1A1A] transition text-[#F2F1EC]"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#E8A317] transition transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#58696F] transition transform hover:-rotate-12" />
        )}
      </button>

      {/* Low stock notifications button */}
      <button
        onClick={() => setCurrentScreen('products')}
        title={`${lowStockCount}টি পণ্যে কম স্টক সতর্কতা`}
        aria-label="নোটিফিকেশন"
        className="relative inline-grid place-items-center w-10 h-10 flex-none bg-transparent border border-[#2E2E2E] rounded-lg cursor-pointer hover:bg-[#1A1A1A] transition text-[#F2F1EC]"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
        {lowStockCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#E0583C] text-[#F2F1EC] text-[10px] sm:text-[11px] font-bold grid place-items-center">
            {lowStockCount}
          </span>
        )}
      </button>

      {/* Admin Login Quick Link */}
      <button
        onClick={() => setCurrentScreen('login')}
        title="লগইন পেজে যান"
        className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-[#2E2E2E] bg-transparent hover:bg-[#1A1A1A] hover:border-[#E8A317] text-xs font-semibold text-[#F2F1EC] transition cursor-pointer flex-none"
      >
        <UserIcon className="w-4 h-4 text-[#E8A317]" />
        <span>লগইন পেজ</span>
      </button>

      {/* User profile / login switch button */}
      <button
        onClick={() => setIsLoginModalOpen(true)}
        className="flex items-center gap-2 pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-lg border border-[#2E2E2E] bg-[#1A1A1A] hover:border-[#9B9A94] transition cursor-pointer flex-none"
        title="ব্যবহারকারী পরিবর্তন বা অ্যাকাউন্ট তথ্য"
      >
        <div className="w-7 h-7 rounded-full bg-[#232323] border border-[#2E2E2E] grid place-items-center text-xs font-bold text-[#E8A317]">
          {currentUser.avatarText || 'মি'}
        </div>
        <div className="hidden lg:flex flex-col text-left">
          <span className="text-xs font-medium text-[#F2F1EC] leading-tight truncate max-w-[90px]">
            {currentUser.name.split(' ')[0]}
          </span>
          <span className="text-[10px] text-[#9B9A94] capitalize">
            {currentUser.role === 'admin'
              ? 'মালিক'
              : currentUser.role === 'manager'
              ? 'ম্যানেজার'
              : 'ক্যাশিয়ার'}
          </span>
        </div>
      </button>
    </header>
  );
};
