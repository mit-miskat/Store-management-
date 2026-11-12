import React from 'react';
import { BarChart3, Download, TrendingUp, Package, Wallet } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatMoney, toBengaliDigits } from '../../lib/money.ts';

export const ReportsScreen: React.FC = () => {
  const { products, sales, customers, showToast } = useApp();

  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
  const totalDue = customers.reduce((acc, c) => acc + c.dueBalance, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F1EC]">
            রিপোর্ট ও লাভ-ক্ষতি
          </h1>
          <p className="text-sm text-[#9B9A94] mt-1">দোকানের আর্থিক বিবরণী ও বিশ্লেষণ</p>
        </div>

        <button
          onClick={() => showToast('Excel ফাইল প্রস্তুত (ডেমো)')}
          className="h-10 px-4 rounded-lg border border-[#2E2E2E] text-sm text-[#F2F1EC] hover:bg-[#1A1A1A] font-semibold transition flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#9B9A94]" />
          Excel ডাউনলোড
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <div className="flex items-center gap-2 text-xs text-[#9B9A94] font-medium">
            <TrendingUp className="w-4 h-4 text-[#E8A317]" /> মোট বিক্রয় আয়
          </div>
          <div className="font-display font-bold text-3xl text-[#F2F1EC] my-1 num">
            {formatMoney(totalSales)}
          </div>
          <p className="text-xs text-[#9B9A94]">সর্বশেষ {toBengaliDigits(sales.length)}টি লেনদেন</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <div className="flex items-center gap-2 text-xs text-[#9B9A94] font-medium">
            <TrendingUp className="w-4 h-4 text-[#4FAE6E]" /> মোট নিট লাভ
          </div>
          <div className="font-display font-bold text-3xl text-[#4FAE6E] my-1 num">
            {formatMoney(totalProfit)}
          </div>
          <p className="text-xs text-[#4FAE6E]">লাইন টোটাল − বিক্রির সময় ক্রয়মূল্য</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <div className="flex items-center gap-2 text-xs text-[#9B9A94] font-medium">
            <Wallet className="w-4 h-4 text-[#E0583C]" /> মোট অপরিশোধিত বাকি
          </div>
          <div className="font-display font-bold text-3xl text-[#E0583C] my-1 num">
            {formatMoney(totalDue)}
          </div>
          <p className="text-xs text-[#E0583C]">{toBengaliDigits(customers.length)} জন গ্রাহক</p>
        </div>
      </div>
    </div>
  );
};
