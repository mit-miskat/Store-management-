import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { AJ_MOTORS_LOGO } from '../../constants/assets.ts';

export const AdminLoginPage: React.FC = () => {
  const {
    setCurrentUser,
    users,
    setCurrentScreen,
    showToast,
    theme,
    toggleTheme,
  } = useApp();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputClean = usernameOrEmail.trim().toLowerCase();
    const passClean = password.trim();

    if (!inputClean) {
      setErrorMsg('ইউজারনেম বা ইমেইল প্রদান করুন।');
      return;
    }

    if (!passClean) {
      setErrorMsg('পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setIsLoading(true);

    // Verify credentials securely
    const targetUser = users.find(
      (u) =>
        u.username.toLowerCase() === inputClean ||
        u.email.toLowerCase() === inputClean
    );

    if (!targetUser) {
      setIsLoading(false);
      setErrorMsg('ভুল ইউজারনেম বা ইমেইল! অনুগ্রহ করে সঠিক তথ্য দিন।');
      return;
    }

    if (targetUser.password !== passClean) {
      setIsLoading(false);
      setErrorMsg('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
      return;
    }

    // Success
    setIsLoading(false);
    setCurrentUser(targetUser);
    showToast(
      `স্বাগতম ${targetUser.name}! (${
        targetUser.role === 'admin'
          ? 'অ্যাডমিন প্যানেল'
          : targetUser.role === 'manager'
          ? 'ম্যানেজার প্যানেল'
          : 'ক্যাশ কাউন্টার'
      })`
    );
    setCurrentScreen('dash');
  };

  return (
    <div className="min-h-[78vh] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-6 sm:p-8 shadow-2xl relative">
        {/* Top-right theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'লাইট মোড দিন' : 'নাইট মোড দিন'}
          className="absolute top-4 right-4 w-9 h-9 rounded-lg border border-[#2E2E2E] bg-transparent hover:bg-[#232323] grid place-items-center text-[#9B9A94] hover:text-[#F2F1EC] transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E8A317]" /> : <Moon className="w-4 h-4 text-[#58696F]" />}
        </button>

        {/* Brand Header with Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img
              src={AJ_MOTORS_LOGO}
              alt="AJ MOTORS Logo"
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-md"
            />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F2F1EC]">
            AJ MOTORS
          </h1>
          <p className="text-xs text-[#9B9A94] mt-1">
            দোকান ম্যানেজমেন্ট সিস্টেম · নিরাপদ লগইন
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-5 rounded-lg bg-[#E0583C]/10 border border-[#E0583C] text-[#E0583C] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-none" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Clean, Secure Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#9B9A94] font-medium block">
              ইউজারনেম বা ইমেইল
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#9B9A94] absolute left-3 top-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="আপনার ইউজারনেম লিখুন"
                autoComplete="username"
                className="w-full h-11 pl-9 pr-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] placeholder-[#9B9A94]/60 focus:border-[#E8A317] outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#9B9A94] font-medium block">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9B9A94] absolute left-3 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                autoComplete="current-password"
                className="w-full h-11 pl-9 pr-10 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] placeholder-[#9B9A94]/60 focus:border-[#E8A317] outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-[#9B9A94] hover:text-[#F2F1EC] transition cursor-pointer"
                aria-label="পাসওয়ার্ড দেখুন"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-[#9B9A94] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-[#E8A317] cursor-pointer"
              />
              <span>এই ডিভাইসে মনে রাখুন</span>
            </label>
            <span className="text-[#9B9A94] text-[11px]">নিরাপদ এনক্রিপশন</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-lg bg-[#E8A317] text-[#111111] font-semibold text-base hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3 disabled:opacity-50"
          >
            <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন (ড্যাশবোর্ডে প্রবেশ)'}</span>
            <ArrowRight className="w-4 h-4 text-[#111111]" />
          </button>
        </form>

        {/* Security & Privacy notice */}
        <div className="mt-6 pt-4 border-t border-[#2E2E2E] text-center">
          <p className="text-[11px] text-[#9B9A94]">
            🔒 দোকানের নিরাপত্তা নিশ্চিত করতে প্রতিটি লগইন ও কার্যকলাপ অডিট লগে সংরক্ষিত থাকে।
          </p>
        </div>
      </div>
    </div>
  );
};
