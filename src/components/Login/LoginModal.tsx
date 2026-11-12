import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, AlertCircle, User } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    setCurrentUser,
    users,
    showToast,
  } = useApp();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputClean = usernameInput.trim().toLowerCase();
    const passClean = passwordInput.trim();

    if (!inputClean || !passClean) {
      setErrorMsg('ইউজারনেম এবং পাসওয়ার্ড উভয়ই প্রদান করুন।');
      return;
    }

    setIsLoading(true);

    const targetUser = users.find(
      (u) =>
        u.username.toLowerCase() === inputClean ||
        u.email.toLowerCase() === inputClean
    );

    if (!targetUser) {
      setIsLoading(false);
      setErrorMsg('ভুল ইউজারনেম বা ইমেইল!');
      return;
    }

    if (targetUser.password !== passClean) {
      setIsLoading(false);
      setErrorMsg('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।');
      return;
    }

    setIsLoading(false);
    setCurrentUser(targetUser);
    setIsLoginModalOpen(false);
    showToast(
      `লগইন সফল: ${targetUser.name} (${
        targetUser.role === 'admin'
          ? 'অ্যাডমিন'
          : targetUser.role === 'manager'
          ? 'ম্যানেজার'
          : 'ক্যাশিয়ার'
      })`
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-70 p-4">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={() => {
            setIsLoginModalOpen(false);
            setErrorMsg('');
            setUsernameInput('');
            setPasswordInput('');
          }}
          className="absolute top-4 right-4 text-[#9B9A94] hover:text-[#F2F1EC] transition p-1 cursor-pointer"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <ShieldCheck className="w-6 h-6 text-[#E8A317]" />
          <h2 className="text-xl font-bold text-[#F2F1EC]">ব্যবহারকারী পরিবর্তন / লগইন</h2>
        </div>
        <p className="text-xs text-[#9B9A94] mb-5">
          আপনার অনুমোদিত ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-[#E0583C]/10 border border-[#E0583C] text-[#E0583C] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-none" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-[#9B9A94] font-medium">ইউজারনেম বা ইমেইল</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#9B9A94] absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                placeholder="ইউজারনেম লিখুন"
                className="w-full h-10 pl-9 pr-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] focus:border-[#E8A317] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#9B9A94] font-medium">পাসওয়ার্ড</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#9B9A94] absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full h-10 pl-9 pr-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] focus:border-[#E8A317] outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsLoginModalOpen(false);
                setErrorMsg('');
                setUsernameInput('');
                setPasswordInput('');
              }}
              className="flex-1 h-10 rounded-lg border border-[#2E2E2E] text-sm text-[#F2F1EC] hover:bg-[#232323] transition font-medium cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 rounded-lg bg-[#E8A317] text-[#111111] text-sm font-semibold hover:brightness-105 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'যাচাই হচ্ছে...' : 'লগইন করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
