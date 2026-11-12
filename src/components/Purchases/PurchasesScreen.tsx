import React, { useState } from 'react';
import { Truck, Plus, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatMoney } from '../../lib/money.ts';

export const PurchasesScreen: React.FC = () => {
  const { products, performStockPurchase, showToast } = useApp();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [supplier, setSupplier] = useState('রহমান ট্রেডার্স');
  const [invoiceNo, setInvoiceNo] = useState('PO-0087');
  const [qty, setQty] = useState<number | ''>(5);
  const [unitCost, setUnitCost] = useState<number | ''>(1450);
  const [autoStock, setAutoStock] = useState(true);

  const selectedProd = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProd || !qty || Number(qty) <= 0) {
      showToast('সঠিক পরিমাণ উল্লেখ করুন');
      return;
    }
    const cost = unitCost ? Number(unitCost) : selectedProd.costPrice;
    performStockPurchase(selectedProd.id, Number(qty), cost, invoiceNo);
    showToast(`ক্রয় সংরক্ষিত! ${selectedProd.name}-এর স্টক বাড়ানো হয়েছে।`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F2F1EC]">
            ক্রয় ও সরবরাহকারী
          </h1>
          <p className="text-sm text-[#9B9A94] mt-1">
            সরবরাহকারী থেকে পণ্য গ্রহণ করলে স্টক ও দেনা নিজে থেকে হালনাগাদ হবে।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Purchase Form */}
        <div className="lg:col-span-7 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E2E2E] mb-4">
            <h2 className="text-base font-semibold text-[#F2F1EC]">নতুন ক্রয় এন্ট্রি</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-[#5C8FBF] border border-[#5C8FBF]/40 bg-[#5C8FBF]/10">
              চালান
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#9B9A94]">সরবরাহকারী</label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] focus:border-[#E8A317] outline-none"
                >
                  <option>রহমান ট্রেডার্স (ঢাকা)</option>
                  <option>মেসার্স বাইক পার্টস ইম্পোর্ট</option>
                  <option>যমুনা অটো পার্টস</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#9B9A94]">চালান / ইনভয়েস নম্বর</label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] font-display focus:border-[#E8A317] outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-[#9B9A94]">পণ্য নির্বাচন করুন</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const p = products.find((x) => x.id === e.target.value);
                    if (p) setUnitCost(p.costPrice);
                  }}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] focus:border-[#E8A317] outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.applicableBike}) — বর্তমান স্টক: {p.stockQty} {p.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#9B9A94]">নতুন ক্রয় পরিমাণ</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={qty}
                  onChange={(e) => setQty(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-right font-display text-[#F2F1EC] focus:border-[#E8A317] outline-none num"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#9B9A94]">একক ক্রয় ব্যয় (৳)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-right font-display text-[#F2F1EC] focus:border-[#E8A317] outline-none num"
                />
              </div>
            </div>

            <div className="bg-[#111111] border border-[#2E2E2E] rounded-lg p-3 flex justify-between items-center text-xs">
              <span className="text-[#9B9A94]">সর্বমোট ক্রয়মূল্য:</span>
              <span className="font-display font-bold text-lg text-[#E8A317] num">
                {formatMoney((Number(qty) || 0) * (Number(unitCost) || 0))}
              </span>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="submit"
                className="h-10 px-5 rounded-lg bg-[#E8A317] text-[#111111] font-semibold text-sm hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#111111]" />
                ক্রয় সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>

        {/* Settings & Rules */}
        <div className="lg:col-span-5 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5 space-y-4">
          <h2 className="text-base font-semibold text-[#F2F1EC] pb-2 border-b border-[#2E2E2E]">
            স্বয়ংক্রিয় হিসাবের নিয়ম
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-[#2E2E2E] text-xs">
            <span className="text-[#F2F1EC]">স্টক স্বয়ংক্রিয় বাড়ুক (+qty)</span>
            <button
              type="button"
              onClick={() => setAutoStock(!autoStock)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                autoStock ? 'bg-[#E8A317]' : 'bg-[#2E2E2E]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                  autoStock ? 'translate-x-5 bg-[#111111]' : 'bg-[#F2F1EC]'
                }`}
              />
            </button>
          </div>

          <div className="text-xs text-[#9B9A94] space-y-2 leading-relaxed">
            <p>
              ● <b>গড় ক্রয়মূল্য (Weighted Average Cost):</b> নতুন ক্রয় মূল্যের ভিত্তিতে পণ্যের গড় ক্রয়ব্যয় সমন্বয় করা হয়।
            </p>
            <p>
              ● <b>স্টক মুভমেন্ট অডিট:</b> প্রতিটি ক্রয়ের বিপরীতে অডিট লগ ও চালান নম্বর সংরক্ষিত থাকে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
