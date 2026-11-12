import React from 'react';
import { Wallet, Plus, Minus, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatMoney } from '../../lib/money.ts';

export const CashbookScreen: React.FC = () => {
  const { showToast } = useApp();

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F1EC]">
            ক্যাশবুক ও দৈনিক হিসাব
          </h1>
          <p className="text-sm text-[#9B9A94] mt-1">আজকের নগদ ও অনলাইন পেমেন্ট প্রবাহ</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast('খরচ যোগ ডায়ালগ')}
            className="h-10 px-4 rounded-lg border border-[#2E2E2E] text-sm text-[#F2F1EC] hover:bg-[#1A1A1A] font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Minus className="w-4 h-4 text-[#E0583C]" />
            খরচ যোগ
          </button>
          <button
            onClick={() => showToast('আজকের ক্যাশ সেশন বন্ধ করা হয়েছে')}
            className="h-10 px-4 rounded-lg bg-[#E8A317] text-[#111111] text-sm font-semibold hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-[#111111]" />
            ক্যাশ বন্ধ করুন
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <div className="text-[#9B9A94] text-xs font-medium">শুরুর ক্যাশ (Opening)</div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-[#F2F1EC] my-1 num">
            {formatMoney(5000)}
          </div>
          <div className="text-xs text-[#9B9A94]">সকাল ৯:০০ টায় রক্ষিত</div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <div className="text-[#9B9A94] text-xs font-medium">নগদ আয় (Cash In)</div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-[#4FAE6E] my-1 num">
            {formatMoney(9200)}
          </div>
          <div className="text-xs text-[#4FAE6E]">বিক্রি ও বাকি আদায়</div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <div className="text-[#9B9A94] text-xs font-medium">বিকাশ / নগদ / ব্যাংক</div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-[#5C8FBF] my-1 num">
            {formatMoney(6500)}
          </div>
          <div className="text-xs text-[#5C8FBF]">ডিজিটাল পেমেন্ট</div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <div className="text-[#9B9A94] text-xs font-medium">দৈনিক খরচ (Expense)</div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-[#E0583C] my-1 num">
            {formatMoney(1800)}
          </div>
          <div className="text-xs text-[#E0583C]">দোকান খরচ ও পরিবহন</div>
        </div>
      </div>
    </div>
  );
};
