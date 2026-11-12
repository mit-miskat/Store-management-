import React, { useState } from 'react';
import {
  Plus,
  Download,
  Settings,
  SlidersHorizontal,
  History,
  Layers,
  Search,
  Truck,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product } from '../../types/index.ts';
import { formatMoney, toBengaliDigits } from '../../lib/money.ts';
import { getStockStatus } from '../../lib/stock.ts';
import { QuickPurchaseModal } from './QuickPurchaseModal.tsx';

export const ProductList: React.FC = () => {
  const {
    products,
    stockMovements,
    openProductModal,
    openAdjustModal,
    searchQuery,
    setSearchQuery,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'history'>('products');
  const [filterChip, setFilterChip] = useState<'all' | 'low_stock' | 'OEM' | 'ফিটিং'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [quickPurchaseProduct, setQuickPurchaseProduct] = useState<Product | null>(null);

  const lowStockCount = products.filter((p) => p.stockQty <= p.minStock).length;

  // Filter products based on search and chips
  const filteredProducts = products.filter((p) => {
    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.applicableBike.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Chip filter check
    if (filterChip === 'low_stock' && p.stockQty > p.minStock) return false;
    if (filterChip === 'OEM' && p.partType !== 'OEM') return false;
    if (filterChip === 'ফিটিং' && p.partType !== 'ফিটিং') return false;

    // Category filter check
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

    return true;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Name,Barcode,Bike,Type,Unit,Stock,CostPrice,SellPrice\n';
    const rows = products
      .map(
        (p) =>
          `"${p.id}","${p.name}","${p.barcode}","${p.applicableBike}","${p.partType}","${p.unit}",${p.stockQty},${p.costPrice},${p.sellPrice}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aj_motors_inventory_${Date.now()}.csv`;
    link.click();
    showToast('পণ্য তালিকা CSV আকারে এক্সপোর্ট করা হয়েছে।');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F1EC] leading-tight">
            পণ্য ও স্টক
          </h1>
          <p className="text-sm text-[#9B9A94] mt-1">
            {toBengaliDigits(products.length)}টি পণ্য তালিকাভুক্ত ·{' '}
            {lowStockCount > 0 ? (
              <span className="text-[#E0583C] font-medium">
                {toBengaliDigits(lowStockCount)}টির স্টক কম
              </span>
            ) : (
              <span className="text-[#4FAE6E]">সকল পণ্যের স্টক পর্যাপ্ত</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#2E2E2E] bg-transparent text-[#F2F1EC] hover:bg-[#1A1A1A] hover:border-[#9B9A94] text-sm font-semibold transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#9B9A94]" />
            এক্সপোর্ট
          </button>
          <button
            onClick={() => openProductModal()}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#E8A317] text-[#111111] hover:brightness-105 text-sm font-semibold transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#111111]" />
            নতুন পণ্য
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2E2E2E] pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#1A1A1A] text-[#E8A317] border border-[#2E2E2E]'
                : 'text-[#9B9A94] hover:text-[#F2F1EC]'
            }`}
          >
            <Layers className="w-4 h-4" />
            পণ্য তালিকা
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-[#1A1A1A] text-[#E8A317] border border-[#2E2E2E]'
                : 'text-[#9B9A94] hover:text-[#F2F1EC]'
            }`}
          >
            <History className="w-4 h-4" />
            স্টক ইতিহাস ({toBengaliDigits(stockMovements.length)})
          </button>
        </div>

        {/* Local Search input */}
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search className="w-4 h-4 text-[#9B9A94] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পণ্য বা বারকোড খুঁজুন..."
            className="w-full h-10 pl-9 pr-3 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg text-xs sm:text-sm text-[#F2F1EC] placeholder-[#9B9A94] focus:border-[#E8A317] outline-none"
          />
        </div>
      </div>

      {activeTab === 'products' ? (
        <>
          {/* Filter Chips Bar */}
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterChip('all')}
                aria-pressed={filterChip === 'all'}
                className={`h-8 px-3 rounded-full text-xs font-medium transition cursor-pointer ${
                  filterChip === 'all'
                    ? 'bg-[#F2F1EC] text-[#111111]'
                    : 'border border-[#2E2E2E] text-[#9B9A94] hover:text-[#F2F1EC]'
                }`}
              >
                সব পণ্য ({toBengaliDigits(products.length)})
              </button>
              <button
                onClick={() => setFilterChip('low_stock')}
                aria-pressed={filterChip === 'low_stock'}
                className={`h-8 px-3 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  filterChip === 'low_stock'
                    ? 'bg-[#E0583C] text-[#F2F1EC]'
                    : 'border border-[#E0583C]/40 text-[#E0583C] hover:bg-[#E0583C]/10'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                কম স্টক ({toBengaliDigits(lowStockCount)})
              </button>
              <button
                onClick={() => setFilterChip('OEM')}
                aria-pressed={filterChip === 'OEM'}
                className={`h-8 px-3 rounded-full text-xs font-medium transition cursor-pointer ${
                  filterChip === 'OEM'
                    ? 'bg-[#F2F1EC] text-[#111111]'
                    : 'border border-[#2E2E2E] text-[#9B9A94] hover:text-[#F2F1EC]'
                }`}
              >
                OEM
              </button>
              <button
                onClick={() => setFilterChip('ফিটিং')}
                aria-pressed={filterChip === 'ফিটিং'}
                className={`h-8 px-3 rounded-full text-xs font-medium transition cursor-pointer ${
                  filterChip === 'ফিটিং'
                    ? 'bg-[#F2F1EC] text-[#111111]'
                    : 'border border-[#2E2E2E] text-[#9B9A94] hover:text-[#F2F1EC]'
                }`}
              >
                ফিটিং
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9B9A94]">ক্যাটাগরি:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-8 px-2 bg-[#111111] border border-[#2E2E2E] rounded-md text-xs text-[#F2F1EC] focus:border-[#E8A317] outline-none"
              >
                <option value="all">সকল ক্যাটাগরি</option>
                <option value="chain">চেইন ও স্প্রকেট</option>
                <option value="brake">ব্রেক সিস্টেম</option>
                <option value="oil">তেল ও ফিল্টার</option>
                <option value="electrical">ইলেকট্রিক্যাল</option>
                <option value="tyre">টায়ার ও টিউব</option>
                <option value="accessories">অন্যান্য</option>
              </select>
            </div>
          </div>

          {/* Product Data Table */}
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2E2E2E] text-[#9B9A94] text-xs font-medium bg-[#111111]/60">
                    <th className="py-3 px-4">পণ্য</th>
                    <th className="py-3 px-3">বারকোড</th>
                    <th className="py-3 px-3">প্রযোজ্য বাইক</th>
                    <th className="py-3 px-3">ধরন</th>
                    <th className="py-3 px-3 text-right">স্টক</th>
                    <th className="py-3 px-3 text-right">ক্রয় (৳)</th>
                    <th className="py-3 px-3 text-right">বিক্রয় (৳)</th>
                    <th className="py-3 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#9B9A94]">
                        কোনো পণ্য খুঁজে পাওয়া যায়নি। নতুন পণ্য যোগ করুন বা ফিল্টার পরিবর্তন করুন।
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const stockInfo = getStockStatus(p.stockQty, p.minStock);
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-[#232323] transition group"
                        >
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#F2F1EC] leading-tight">
                              {p.name}
                            </div>
                            <div className="text-xs text-[#9B9A94] mt-0.5 font-mono">
                              {p.sku}
                            </div>
                          </td>

                          <td className="py-3 px-3 font-display font-medium text-sm text-[#F2F1EC] num">
                            {toBengaliDigits(p.barcode)}
                          </td>

                          <td className="py-3 px-3 text-[#9B9A94] text-xs">
                            {p.applicableBike}
                          </td>

                          <td className="py-3 px-3">
                            <span className="inline-block px-2 py-0.5 text-xs rounded-full border border-[#2E2E2E] text-[#9B9A94] bg-[#111111]">
                              {p.partType}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-display num border ${
                                stockInfo.status === 'danger'
                                  ? 'text-[#E0583C] border-[#E0583C]/40 bg-[#E0583C]/10'
                                  : stockInfo.status === 'warn'
                                  ? 'text-[#E8A317] border-[#E8A317]/40 bg-[#E8A317]/10'
                                  : 'text-[#4FAE6E] border-[#4FAE6E]/40 bg-[#4FAE6E]/10'
                              }`}
                              title={`কম স্টক সীমা: ${p.minStock}`}
                            >
                              {toBengaliDigits(p.stockQty)} {p.unit}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right font-display text-sm text-[#9B9A94] num">
                            {formatMoney(p.costPrice, { showCurrency: false })}
                          </td>

                          <td className="py-3 px-3 text-right font-display font-bold text-base text-[#F2F1EC] num">
                            {formatMoney(p.sellPrice, { showCurrency: false })}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Quick Purchase button */}
                              <button
                                onClick={() => setQuickPurchaseProduct(p)}
                                title="ক্রয় করে স্টক বাড়ান"
                                className="w-8 h-8 rounded-lg border border-[#2E2E2E] bg-transparent hover:bg-[#232323] hover:border-[#E8A317] grid place-items-center text-[#9B9A94] hover:text-[#E8A317] transition cursor-pointer"
                              >
                                <Truck className="w-4 h-4 stroke-[1.8]" />
                              </button>

                              {/* Adjust Stock button */}
                              <button
                                onClick={() => openAdjustModal(p)}
                                title="স্টক সমন্বয় করুন (ঘাটতি/বাড়তি)"
                                className="w-8 h-8 rounded-lg border border-[#2E2E2E] bg-transparent hover:bg-[#232323] hover:border-[#9B9A94] grid place-items-center text-[#9B9A94] hover:text-[#F2F1EC] transition cursor-pointer"
                              >
                                <SlidersHorizontal className="w-4 h-4 stroke-[1.8]" />
                              </button>

                              {/* Edit Product button */}
                              <button
                                onClick={() => openProductModal(p)}
                                title="পণ্য সম্পাদনা"
                                className="w-8 h-8 rounded-lg border border-[#2E2E2E] bg-transparent hover:bg-[#232323] hover:border-[#9B9A94] grid place-items-center text-[#9B9A94] hover:text-[#F2F1EC] transition cursor-pointer"
                              >
                                <Settings className="w-4 h-4 stroke-[1.8]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Stock Movement History Table */
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#2E2E2E] flex justify-between items-center">
            <h2 className="text-base font-semibold text-[#F2F1EC]">
              স্টক চলাচল ও অডিট লগ
            </h2>
            <span className="text-xs text-[#9B9A94]">
              ক্রয়, বিক্রি ও সমন্বয়ের হিসাব
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#2E2E2E] text-[#9B9A94] text-xs font-medium bg-[#111111]/60">
                  <th className="py-3 px-4">তারিখ ও সময়</th>
                  <th className="py-3 px-3">পণ্য</th>
                  <th className="py-3 px-3">লেনদেনের ধরন</th>
                  <th className="py-3 px-3 text-right">স্টক পরিবর্তন</th>
                  <th className="py-3 px-3 text-right">অবশিষ্ট স্টক</th>
                  <th className="py-3 px-3">রেফারেন্স / কারণ</th>
                  <th className="py-3 px-4">কর্তৃপক্ষ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E2E2E]">
                {stockMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-[#232323] transition">
                    <td className="py-3 px-4 text-xs text-[#9B9A94]">{m.createdAt}</td>
                    <td className="py-3 px-3 font-semibold text-[#F2F1EC]">{m.productName}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          m.type === 'purchase'
                            ? 'text-[#4FAE6E] border-[#4FAE6E]/40 bg-[#4FAE6E]/10'
                            : m.type === 'sale'
                            ? 'text-[#E8A317] border-[#E8A317]/40 bg-[#E8A317]/10'
                            : m.type === 'adjust'
                            ? 'text-[#5C8FBF] border-[#5C8FBF]/40 bg-[#5C8FBF]/10'
                            : 'text-[#E0583C] border-[#E0583C]/40 bg-[#E0583C]/10'
                        }`}
                      >
                        {m.type === 'purchase'
                          ? 'ক্রয় (+)'
                          : m.type === 'sale'
                          ? 'বিক্রি (−)'
                          : m.type === 'adjust'
                          ? 'সমন্বয়'
                          : 'নষ্ট/ড্যামেজ'}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-display font-bold text-base num ${
                        m.qtyChange > 0 ? 'text-[#4FAE6E]' : 'text-[#E0583C]'
                      }`}
                    >
                      {m.qtyChange > 0
                        ? `+${toBengaliDigits(m.qtyChange)}`
                        : toBengaliDigits(m.qtyChange)}
                    </td>
                    <td className="py-3 px-3 text-right font-display font-medium text-sm text-[#F2F1EC] num">
                      {toBengaliDigits(m.stockAfter)}
                    </td>
                    <td className="py-3 px-3 text-xs text-[#9B9A94]">
                      {m.refId && <span className="font-mono text-[#F2F1EC] mr-1.5">{m.refId}</span>}
                      {m.reason || '—'}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#9B9A94]">{m.createdBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Purchase Modal */}
      <QuickPurchaseModal
        isOpen={!!quickPurchaseProduct}
        product={quickPurchaseProduct}
        onClose={() => setQuickPurchaseProduct(null)}
      />
    </div>
  );
};
