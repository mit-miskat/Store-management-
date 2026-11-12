import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { toBengaliDigits } from '../../lib/money.ts';

export const StockAdjustModal: React.FC = () => {
  const {
    isAdjustModalOpen,
    setIsAdjustModalOpen,
    adjustingProduct,
    performStockAdjustment,
  } = useApp();

  const [physicalCount, setPhysicalCount] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (adjustingProduct) {
      setPhysicalCount(adjustingProduct.stockQty);
      setReason('');
      setErrorMsg('');
    }
  }, [adjustingProduct, isAdjustModalOpen]);

  if (!isAdjustModalOpen || !adjustingProduct) return null;

  const currentStock = adjustingProduct.stockQty;
  const countNum = physicalCount === '' ? currentStock : Number(physicalCount);
  const diff = countNum - currentStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (physicalCount === '' || Number(physicalCount) < 0) {
      setErrorMsg('সঠিক গণনাকৃত স্টক সংখ্যা লিখুন (০ বা তার বেশি)।');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('স্টক সমন্বয়ের সুনির্দিষ্ট কারণ লেখা বাধ্যতামূলক।');
      return;
    }

    const res = performStockAdjustment(
      adjustingProduct.id,
      Number(physicalCount),
      reason.trim()
    );

    if (!res.success) {
      setErrorMsg(res.error || 'সমন্বয় ব্যর্থ হয়েছে।');
      return;
    }

    setIsAdjustModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-70 p-4">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5 sm:p-6 shadow-2xl relative">
        <button
          onClick={() => setIsAdjustModalOpen(false)}
          className="absolute top-4 right-4 text-[#9B9A94] hover:text-[#F2F1EC] transition p-1"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#F2F1EC] mb-1">স্টক সমন্বয় (Adjustment)</h2>
        <p className="text-xs text-[#9B9A94] mb-4">
          দোকানের শারীরিক গণনার সাথে ডেটাবেসের স্টক মিলান।
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-[#E0583C]/10 border border-[#E0583C] text-[#E0583C] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-none" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-[#111111] border border-[#2E2E2E] rounded-lg p-3 mb-4 text-xs">
          <p className="text-[#F2F1EC] font-semibold text-sm mb-1">{adjustingProduct.name}</p>
          <p className="text-[#9B9A94]">বাইক: {adjustingProduct.applicableBike}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2E2E2E]">
            <span className="text-[#9B9A94]">বর্তমান রেকর্ডকৃত স্টক:</span>
            <span className="font-display font-bold text-base text-[#F2F1EC] num">
              {toBengaliDigits(currentStock)} {adjustingProduct.unit}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-[#9B9A94]">শারীরিক গণনাকৃত নতুন স্টক *</label>
            <input
              type="number"
              min="0"
              required
              value={physicalCount}
              onChange={(e) => setPhysicalCount(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full h-11 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-lg text-right font-display font-bold text-[#F2F1EC] focus:border-[#E8A317] outline-none num"
            />
            {diff !== 0 && (
              <p
                className={`text-xs font-semibold text-right mt-1 ${
                  diff > 0 ? 'text-[#4FAE6E]' : 'text-[#E0583C]'
                }`}
              >
                পার্থক্য: {diff > 0 ? `+${toBengaliDigits(diff)}` : toBengaliDigits(diff)} {adjustingProduct.unit}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#9B9A94]">সমন্বয়ের সুনির্দিষ্ট কারণ * (বাধ্যতামূলক)</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="যেমন: মাসিক গণনায় ২টি ঘাটতি পাওয়া গেছে / ড্যামেজ ছিল / বাড়তি পাওয়া গেছে"
              className="w-full p-2.5 bg-[#111111] border border-[#2E2E2E] rounded-lg text-xs text-[#F2F1EC] placeholder-[#9B9A94] focus:border-[#E8A317] outline-none resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsAdjustModalOpen(false)}
              className="flex-1 h-10 rounded-lg border border-[#2E2E2E] text-sm text-[#F2F1EC] hover:bg-[#232323] transition font-medium"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-lg bg-[#E8A317] text-[#111111] text-sm font-semibold hover:brightness-105 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 text-[#111111]" />
              সমন্বয় নিশ্চিত করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
