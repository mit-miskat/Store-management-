import React from 'react';
import { Users, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatMoney } from '../../lib/money.ts';

export const CustomersScreen: React.FC = () => {
  const { customers, showToast } = useApp();
  const totalDue = customers.reduce((sum, c) => sum + c.dueBalance, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F1EC]">
            গ্রাহক ও বাকি খাতা
          </h1>
          <p className="text-sm text-[#9B9A94] mt-1">
            মোট বাকি: <span className="text-[#E0583C] font-semibold">{formatMoney(totalDue)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast('বাকি রিমাইন্ডার পাঠানোর প্রক্রিয়া চালু করা হয়েছে')}
            className="h-10 px-4 rounded-lg border border-[#2E2E2E] text-sm text-[#F2F1EC] hover:bg-[#1A1A1A] font-semibold transition cursor-pointer"
          >
            বাকি রিমাইন্ডার
          </button>
          <button
            onClick={() => showToast('নতুন গ্রাহক যোগ ফর্ম (পরবর্তী ধাপে সংযুক্ত হবে)')}
            className="h-10 px-4 rounded-lg bg-[#E8A317] text-[#111111] text-sm font-semibold hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#111111]" />
            নতুন গ্রাহক
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2E2E2E] text-[#9B9A94] text-xs font-medium bg-[#111111]/60">
                <th className="py-3 px-4">গ্রাহকের নাম</th>
                <th className="py-3 px-3">ফোন নম্বর</th>
                <th className="py-3 px-3">ধরন</th>
                <th className="py-3 px-3 text-right">ক্রেডিট লিমিট</th>
                <th className="py-3 px-3 text-right">মোট কেনা</th>
                <th className="py-3 px-3 text-right">বর্তমান বাকি</th>
                <th className="py-3 px-4">পরিশোধের অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E]">
              {customers.map((c) => {
                const isOverLimit = c.creditLimit > 0 && c.dueBalance > c.creditLimit;
                return (
                  <tr key={c.id} className="hover:bg-[#232323] transition">
                    <td className="py-3 px-4 font-semibold text-[#F2F1EC]">
                      {c.name}
                      {c.address && (
                        <span className="block text-xs text-[#9B9A94] font-normal">
                          {c.address}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-display text-xs text-[#F2F1EC] num">
                      {c.phone}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-xs border border-[#2E2E2E] text-[#9B9A94] bg-[#111111]">
                        {c.type === 'regular'
                          ? 'নিয়মিত'
                          : c.type === 'wholesale'
                          ? 'পাইকারি'
                          : 'সাধারণ'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-display text-sm text-[#9B9A94] num">
                      {formatMoney(c.creditLimit)}
                    </td>
                    <td className="py-3 px-3 text-right font-display text-sm text-[#F2F1EC] num">
                      {formatMoney(c.totalPurchased)}
                    </td>
                    <td className="py-3 px-3 text-right font-display font-bold text-base text-[#E0583C] num">
                      {formatMoney(c.dueBalance)}
                    </td>
                    <td className="py-3 px-4">
                      {isOverLimit ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#E0583C] border border-[#E0583C]/40 bg-[#E0583C]/10">
                          <AlertCircle className="w-3 h-3" /> সীমা ছাড়িয়েছে
                        </span>
                      ) : c.dueBalance === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#4FAE6E] border border-[#4FAE6E]/40 bg-[#4FAE6E]/10">
                          <CheckCircle2 className="w-3 h-3" /> পরিশোধিত
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#E8A317] border border-[#E8A317]/40 bg-[#E8A317]/10">
                          বাকি চলমান
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
