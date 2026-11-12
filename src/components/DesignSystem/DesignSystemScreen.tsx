import React, { useState } from 'react';
import {
  Home,
  ShoppingCart,
  Package,
  Truck,
  Users,
  Wrench,
  Wallet,
  BarChart3,
  Receipt,
  Barcode,
  AlertTriangle,
  Settings,
  Check,
  Printer,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const DesignSystemScreen: React.FC = () => {
  const { showToast } = useApp();
  const [toggleState, setToggleState] = useState(true);
  const [demoMoney, setDemoMoney] = useState('১,৫০০.০০');

  const swatches = [
    { name: 'Base', hex: '#111111' },
    { name: 'Surface', hex: '#1A1A1A' },
    { name: 'Accent', hex: '#E8A317' },
    { name: 'Text', hex: '#F2F1EC' },
    { name: 'সফল', hex: '#4FAE6E' },
    { name: 'সতর্ক', hex: '#E8A317' },
    { name: 'বিপদ', hex: '#E0583C' },
    { name: 'তথ্য', hex: '#5C8FBF' },
  ];

  const icons = [
    { name: 'ড্যাশবোর্ড', icon: Home },
    { name: 'বিক্রি', icon: ShoppingCart },
    { name: 'পণ্য', icon: Package },
    { name: 'ক্রয়', icon: Truck },
    { name: 'গ্রাহক', icon: Users },
    { name: 'সার্ভিস', icon: Wrench },
    { name: 'ক্যাশ', icon: Wallet },
    { name: 'রিপোর্ট', icon: BarChart3 },
    { name: 'ক্যাশমেমো', icon: Receipt },
    { name: 'বারকোড', icon: Barcode },
    { name: 'সতর্কতা', icon: AlertTriangle },
    { name: 'সেটিংস', icon: Settings },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F1EC]">
          ডিজাইন সিস্টেম
        </h1>
        <p className="text-sm text-[#9B9A94] mt-1">
          AJ MOTORS-এর রং, ফন্ট, বাটন, ইনপুট বক্স ও ব্যাজের নির্দেশিকা
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colors */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <h2 className="text-base font-semibold text-[#F2F1EC] mb-3">রং (Palette)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {swatches.map((s) => (
              <div key={s.name} className="border border-[#2E2E2E] rounded-lg overflow-hidden bg-[#111111]">
                <div style={{ backgroundColor: s.hex }} className="h-12 w-full" />
                <div className="p-2 text-xs">
                  <span className="font-medium text-[#F2F1EC] block">{s.name}</span>
                  <span className="text-[#9B9A94] font-mono text-[11px]">{s.hex}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#9B9A94] mt-3">
            অ্যাকসেন্ট (#E8A317) শুধু প্রধান বোতাম, সক্রিয় মেনু ও গুরুত্বপূর্ণ সংখ্যায় ব্যবহার্য।
          </p>
        </div>

        {/* Typography */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <h2 className="text-base font-semibold text-[#F2F1EC] mb-3">টাইপোগ্রাফি</h2>
          <div className="space-y-3 divide-y divide-[#2E2E2E] text-xs">
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-display text-2xl font-bold text-[#F2F1EC]">আজকের সারাংশ</span>
              <span className="text-[#9B9A94]">শিরোনাম 36</span>
            </div>
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-lg font-semibold text-[#F2F1EC]">বিক্রির তালিকা</span>
              <span className="text-[#9B9A94]">কার্ড শিরোনাম 20</span>
            </div>
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm text-[#F2F1EC]">এই পণ্যের স্টক কম। জরুরি অর্ডার দিন।</span>
              <span className="text-[#9B9A94]">মূল লেখা 15</span>
            </div>
            <div className="flex justify-between items-baseline pt-2">
              <span className="font-display text-2xl font-bold text-[#E8A317] num">৳ ৪৮,৭২০.০০</span>
              <span className="text-[#9B9A94]">টাকা (Tabular Nums)</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <h2 className="text-base font-semibold text-[#F2F1EC] mb-3">বাটন</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button className="h-10 px-4 rounded-lg bg-[#E8A317] text-[#111111] font-semibold text-sm hover:brightness-105">
              প্রধান বাটন
            </button>
            <button className="h-10 px-4 rounded-lg bg-[#232323] text-[#F2F1EC] font-semibold text-sm border border-transparent hover:border-[#9B9A94]">
              দ্বিতীয়
            </button>
            <button className="h-10 px-4 rounded-lg border border-[#2E2E2E] text-[#F2F1EC] font-semibold text-sm hover:bg-[#232323]">
              আউটলাইন
            </button>
            <button className="h-10 px-4 rounded-lg border border-[#E0583C] text-[#E0583C] font-semibold text-sm hover:bg-[#E0583C]/10">
              মুছুন
            </button>
            <button disabled className="h-10 px-4 rounded-lg bg-[#232323] text-[#9B9A94] font-semibold text-sm opacity-40 cursor-not-allowed">
              নিষ্ক্রিয়
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#2E2E2E]">
            <button className="h-8 px-3 rounded-lg bg-[#E8A317] text-[#111111] font-semibold text-xs">
              ছোট বাটন
            </button>
            <button className="h-8 px-3 rounded-lg border border-[#2E2E2E] text-[#F2F1EC] font-semibold text-xs flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5" /> প্রিন্ট
            </button>
            <button
              onClick={() => showToast('টোস্ট টেস্ট সফল!')}
              className="h-8 px-3 rounded-lg border border-[#2E2E2E] text-[#E8A317] font-semibold text-xs"
            >
              টোস্ট দেখান
            </button>
          </div>
        </div>

        {/* Badges & Form */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <h2 className="text-base font-semibold text-[#F2F1EC] mb-3">ব্যাজ ও ফর্ম</h2>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#4FAE6E] border border-[#4FAE6E]/40 bg-[#4FAE6E]/10 flex items-center gap-1">
              <Check className="w-3 h-3" /> পরিশোধিত
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#E8A317] border border-[#E8A317]/40 bg-[#E8A317]/10 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> কম স্টক
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#E0583C] border border-[#E0583C]/40 bg-[#E0583C]/10">
              বাকি
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#5C8FBF] border border-[#5C8FBF]/40 bg-[#5C8FBF]/10">
              চলছে
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#9B9A94] border border-[#2E2E2E] bg-[#111111]">
              খসড়া
            </span>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#2E2E2E]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#F2F1EC]">স্বয়ংক্রিয় স্টক বৃদ্ধি ও হিসাব</span>
              <button
                type="button"
                onClick={() => setToggleState(!toggleState)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  toggleState ? 'bg-[#E8A317]' : 'bg-[#2E2E2E]'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                    toggleState ? 'translate-x-5 bg-[#111111]' : 'bg-[#F2F1EC]'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Icons */}
        <div className="md:col-span-2 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#F2F1EC]">আইকন সংকলন</h2>
            <span className="text-xs text-[#9B9A94]">লাইন স্টাইল, ১.৮ স্ট্রোক</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {icons.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-[#2E2E2E] bg-[#111111] text-center"
                >
                  <Icon className="w-5 h-5 text-[#E8A317] stroke-[1.8]" />
                  <span className="text-xs text-[#9B9A94]">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
