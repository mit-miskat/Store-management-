import React, { useState } from 'react';
import {
  Receipt,
  TrendingUp,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  ShoppingCart,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatMoney, toBengaliDigits } from '../../lib/money.ts';

export const DashboardScreen: React.FC = () => {
  const {
    products,
    sales,
    customers,
    setCurrentScreen,
    showToast,
  } = useApp();

  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  // Compute live stats from data
  const lowStockProducts = products.filter((p) => p.stockQty <= p.minStock);
  const expiringProducts = products.filter((p) => p.expiryDate && p.expiryRequired);
  const overLimitCustomers = customers.filter(
    (c) => c.creditLimit > 0 && c.dueBalance > c.creditLimit
  );

  // Total due across customers
  const totalCustomerDue = customers.reduce((acc, c) => acc + c.dueBalance, 0);

  // Today's total sales and profit
  const totalSalesAmount = sales.reduce((acc, s) => acc + s.total, 0);
  const totalProfitAmount = sales.reduce((acc, s) => acc + s.profit, 0);

  // Date in Bengali
  const todayBengaliDate = 'শুক্রবার, ১৩ নভেম্বর ২০২৬';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F1EC] leading-tight">
            আজকের সারাংশ
          </h1>
          <p className="text-sm text-[#9B9A94] mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {todayBengaliDate}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentScreen('reports')}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#2E2E2E] bg-transparent text-[#F2F1EC] hover:bg-[#1A1A1A] hover:border-[#9B9A94] text-sm font-semibold transition cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#9B9A94]" />
            রিপোর্ট
          </button>
          <button
            onClick={() => setCurrentScreen('pos')}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#E8A317] text-[#111111] hover:brightness-105 text-sm font-semibold transition cursor-pointer shadow-sm"
          >
            <ShoppingCart className="w-4 h-4 text-[#111111]" />
            বিক্রি শুরু
          </button>
        </div>
      </div>

      {/* Stat Grid (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* আজকের বিক্রি */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#9B9A94] text-xs sm:text-sm font-medium">
            <Receipt className="w-4 h-4 text-[#E8A317]" />
            আজকের বিক্রি
          </div>
          <div className="font-display font-bold text-2xl sm:text-4xl text-[#F2F1EC] my-1 num">
            {formatMoney(48720.00)}
          </div>
          <div className="text-xs text-[#4FAE6E] flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            গতিকালের চেয়ে ১২% বৃদ্ধি
          </div>
        </div>

        {/* আজকের লাভ */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#9B9A94] text-xs sm:text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-[#4FAE6E]" />
            আজকের লাভ
          </div>
          <div className="font-display font-bold text-2xl sm:text-4xl text-[#4FAE6E] my-1 num">
            {formatMoney(9430.00)}
          </div>
          <div className="text-xs text-[#9B9A94]">
            গড় লাভের হার ১৯.৩৫%
          </div>
        </div>

        {/* মোট বাকি */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#9B9A94] text-xs sm:text-sm font-medium">
            <Wallet className="w-4 h-4 text-[#E0583C]" />
            মোট বাকি
          </div>
          <div className="font-display font-bold text-2xl sm:text-4xl text-[#E0583C] my-1 num">
            {formatMoney(62100.00)}
          </div>
          <div className="text-xs text-[#E0583C] font-medium">
            {toBengaliDigits(customers.length)} জন গ্রাহকের কাছে পাওনা
          </div>
        </div>

        {/* কম স্টক */}
        <div
          onClick={() => setCurrentScreen('products')}
          className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:border-[#E8A317] transition"
        >
          <div className="flex items-center gap-2 text-[#9B9A94] text-xs sm:text-sm font-medium">
            <AlertTriangle className="w-4 h-4 text-[#E8A317]" />
            কম স্টক
          </div>
          <div className="font-display font-bold text-2xl sm:text-4xl text-[#E8A317] my-1 num">
            {toBengaliDigits(lowStockProducts.length)}
          </div>
          <div className="text-xs text-[#E0583C] font-medium">
            জরুরি অর্ডার বা ক্রয় দরকার
          </div>
        </div>
      </div>

      {/* Middle Grid: Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 7 Days Sales & Profit Chart */}
        <div className="lg:col-span-8 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-semibold text-[#F2F1EC]">
              সাত দিনের বিক্রি ও লাভ
            </h2>
            <div className="flex gap-1.5 bg-[#111111] p-1 rounded-full border border-[#2E2E2E]">
              <button
                onClick={() => setTimeRange('week')}
                aria-pressed={timeRange === 'week'}
                className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  timeRange === 'week'
                    ? 'bg-[#F2F1EC] text-[#111111]'
                    : 'text-[#9B9A94] hover:text-[#F2F1EC]'
                }`}
              >
                সপ্তাহ
              </button>
              <button
                onClick={() => setTimeRange('month')}
                aria-pressed={timeRange === 'month'}
                className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  timeRange === 'month'
                    ? 'bg-[#F2F1EC] text-[#111111]'
                    : 'text-[#9B9A94] hover:text-[#F2F1EC]'
                }`}
              >
                মাস
              </button>
            </div>
          </div>

          {/* SVG Line Chart adhering precisely to the spec */}
          <div className="w-full overflow-hidden my-2">
            <svg
              viewBox="0 0 640 220"
              className="w-full h-auto max-h-[220px]"
              role="img"
              aria-label="সাত দিনের বিক্রি ও লাভের লাইন চার্ট"
            >
              <g stroke="#2E2E2E" strokeWidth="1">
                <line x1="0" x2="640" y1="30" y2="30" />
                <line x1="0" x2="640" y1="95" y2="95" />
                <line x1="0" x2="640" y1="160" y2="160" />
              </g>

              {/* Sales Line (Amber #E8A317) */}
              <polyline
                fill="none"
                stroke="#E8A317"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="20,150 110,120 200,132 290,80 380,96 470,50 560,70"
              />

              {/* Profit Line (Dashed White #F2F1EC) */}
              <polyline
                fill="none"
                stroke="#F2F1EC"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="20,176 110,168 200,172 290,150 380,156 470,132 560,140"
              />

              {/* Data points */}
              {[[20, 150], [110, 120], [200, 132], [290, 80], [380, 96], [470, 50], [560, 70]].map(
                ([x, y], idx) => (
                  <circle key={`sales-${idx}`} cx={x} cy={y} r="4" fill="#E8A317" stroke="#1A1A1A" strokeWidth="2" />
                )
              )}

              {/* Day labels in Bengali */}
              <g fill="#9B9A94" fontSize="13" fontFamily="Hind Siliguri">
                <text x="20" y="208">শনি</text>
                <text x="110" y="208">রবি</text>
                <text x="200" y="208">সোম</text>
                <text x="290" y="208">মঙ্গল</text>
                <text x="380" y="208">বুধ</text>
                <text x="470" y="208">বৃহ</text>
                <text x="560" y="208">শুক্র</text>
              </g>
            </svg>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#9B9A94] pt-2 border-t border-[#2E2E2E]">
            <span className="flex items-center gap-1.5 font-medium text-[#F2F1EC]">
              <span className="w-3.5 h-1 bg-[#E8A317] rounded-full inline-block" />
              বিক্রি (অ্যাম্বার)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#F2F1EC]">
              <span className="w-3.5 h-1 border-t-2 border-dashed border-[#F2F1EC] inline-block" />
              লাভ (সাদা ড্যাশ)
            </span>
          </div>
        </div>

        {/* Alerts Box */}
        <div className="lg:col-span-4 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-[#F2F1EC]">সতর্কতা</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-[#E0583C] border border-[#E0583C]/40 bg-[#E0583C]/10">
                {toBengaliDigits(lowStockProducts.length + expiringProducts.length + overLimitCustomers.length)}টি
              </span>
            </div>

            <div className="space-y-3">
              {/* Product Low Stock Alerts */}
              {lowStockProducts.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#111111] border border-[#2E2E2E]"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-[#F2F1EC] font-medium truncate">{p.name}</p>
                    <p className="text-xs text-[#9B9A94]">{p.applicableBike}</p>
                  </div>
                  <span className="flex-none px-2 py-0.5 rounded-full text-xs font-semibold text-[#E0583C] border border-[#E0583C]/40">
                    স্টক {toBengaliDigits(p.stockQty)}
                  </span>
                </div>
              ))}

              {/* Expiring Alert */}
              {expiringProducts.length > 0 && (
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#111111] border border-[#2E2E2E]">
                  <div className="min-w-0">
                    <p className="text-sm text-[#F2F1EC] font-medium truncate">
                      {expiringProducts[0].name}
                    </p>
                    <p className="text-xs text-[#9B9A94]">মেয়াদোত্তীর্ণের তারিখ কাছে</p>
                  </div>
                  <span className="flex-none px-2 py-0.5 rounded-full text-xs font-semibold text-[#E8A317] border border-[#E8A317]/40">
                    মেয়াদ ২০ দিন
                  </span>
                </div>
              )}

              {/* Overdue Customer */}
              {overLimitCustomers.length > 0 && (
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#111111] border border-[#2E2E2E]">
                  <div className="min-w-0">
                    <p className="text-sm text-[#F2F1EC] font-medium truncate">
                      {overLimitCustomers[0].name}
                    </p>
                    <p className="text-xs text-[#9B9A94]">
                      বাকি {formatMoney(overLimitCustomers[0].dueBalance)}
                    </p>
                  </div>
                  <span className="flex-none px-2 py-0.5 rounded-full text-xs font-semibold text-[#E0583C] border border-[#E0583C]/40">
                    সীমা ছাড়িয়েছে
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('products')}
            className="w-full mt-4 h-9 rounded-lg border border-[#2E2E2E] text-xs font-medium text-[#F2F1EC] hover:bg-[#232323] transition flex items-center justify-center gap-1.5"
          >
            সব স্টক ও সতর্কতা দেখুন
          </button>
        </div>
      </div>

      {/* Recent Sales Overview */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E8A317]" />
            <h2 className="text-base sm:text-lg font-semibold text-[#F2F1EC]">
              সাম্প্রতিক বিক্রি
            </h2>
          </div>
          <button
            onClick={() => setCurrentScreen('pos')}
            className="text-xs text-[#E8A317] hover:underline font-semibold"
          >
            + নতুন বিক্রি করুন
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2E2E2E] text-[#9B9A94] text-xs">
                <th className="py-2.5 px-3">ইনভয়েস</th>
                <th className="py-2.5 px-3">গ্রাহক</th>
                <th className="py-2.5 px-3">ক্যাশিয়ার</th>
                <th className="py-2.5 px-3 text-right">আইটেম</th>
                <th className="py-2.5 px-3 text-right">মোট বিল</th>
                <th className="py-2.5 px-3 text-right">লাভ</th>
                <th className="py-2.5 px-3 text-right">পদ্ধতি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E]">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-[#232323]/50 transition">
                  <td className="py-3 px-3 font-semibold text-[#F2F1EC]">{sale.invoiceNo}</td>
                  <td className="py-3 px-3 text-[#F2F1EC]">
                    {sale.customerName}
                    {sale.dueAmount > 0 && (
                      <span className="block text-[11px] text-[#E0583C]">
                        বাকি: {formatMoney(sale.dueAmount)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[#9B9A94] text-xs">{sale.cashierName}</td>
                  <td className="py-3 px-3 text-right num text-[#9B9A94]">
                    {toBengaliDigits(sale.items.length)}টি
                  </td>
                  <td className="py-3 px-3 text-right font-display font-bold text-base text-[#F2F1EC] num">
                    {formatMoney(sale.total)}
                  </td>
                  <td className="py-3 px-3 text-right font-display font-semibold text-sm text-[#4FAE6E] num">
                    {formatMoney(sale.profit)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full border ${
                        sale.paymentMethod === 'cash'
                          ? 'text-[#4FAE6E] border-[#4FAE6E]/40'
                          : sale.paymentMethod === 'split'
                          ? 'text-[#E8A317] border-[#E8A317]/40'
                          : 'text-[#5C8FBF] border-[#5C8FBF]/40'
                      }`}
                    >
                      {sale.paymentMethod === 'cash'
                        ? 'নগদ'
                        : sale.paymentMethod === 'split'
                        ? 'নগদ + বাকি'
                        : 'বিকাশ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
