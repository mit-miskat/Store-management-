import React, { useState } from 'react';
import { X, Truck, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product } from '../../types/index.ts';
import { formatMoney, toBengaliDigits } from '../../lib/money.ts';

interface QuickPurchaseModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickPurchaseModal: React.FC<QuickPurchaseModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { performStockPurchase } = useApp();

  const [qty, setQty] = useState<number | ''>(10);
  const [unitCost, setUnitCost] = useState<number | ''>(product?.costPrice || 0);
  const [invoiceNo, setInvoiceNo] = useState(`PO-${Date.now().toString().slice(-4)}`);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !product) return null;

  const currentUnitCost = unitCost === '' ? product.costPrice : Number(unitCost);
  const purchaseQty = qty === '' ? 0 : Number(qty);
  const totalCost = purchaseQty * currentUnitCost;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (purchaseQty <= 0) {
      setErrorMsg('ক্রয়ের পরিমাণ ০-এর বেশি হতে হবে।');
      return;
    }

    const res = performStockPurchase(product.id, purchaseQty, currentUnitCost, invoiceNo);
    if (!res.success) {
      setErrorMsg(res.error || 'ক্রয় ব্যর্থ হয়েছে।');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-70 p-4">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5 sm:p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9B9A94] hover:text-[#F2F1EC] transition p-1"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Truck className="w-5 h-5 text-[#E8A317]" />
          <h2 className="text-xl font-bold text-[#F2F1EC]">ক্রয় ও স্টক বৃদ্ধি</h2>
        </div>
        <p className="text-xs text-[#9B9A94] mb-4">
          পণ্য গ্রহণ করলে স্বয়ংক্রিয়ভাবে স্টক বাড়বে ও নতুন গড় ক্রয়মূল্য হিসাব হবে।
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-[#E0583C]/10 border border-[#E0583C] text-[#E0583C] text-xs">
            {errorMsg}
          </div>
        )}

        <div className="bg-[#111111] border border-[#2E2E2E] rounded-lg p-3 mb-4 text-xs space-y-1">
          <p className="text-[#F2F1EC] font-semibold text-sm">{product.name}</p>
          <p className="text-[#9B9A94]">বাইক: {product.applicableBike} · বারকোড: {toBengaliDigits(product.barcode)}</p>
          <div className="flex justify-between pt-2 border-t border-[#2E2E2E] text-xs">
            <span className="text-[#9B9A94]">বর্তমান স্টক:</span>
            <span className="font-display font-bold text-[#F2F1EC] num">{toBengaliDigits(product.stockQty)} {product.unit}</span>
          </div>
        </div>

        <form onSubmit={handlePurchase} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-[#9B9A94]">নতুন ক্রয় পরিমাণ ({product.unit}) *</label>
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
              <label className="text-xs text-[#9B9A94]">দর / একক ব্যয় (৳) *</label>
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

          <div className="space-y-1">
            <label className="text-xs text-[#9B9A94]">চালান বা ইনভয়েস নম্বর</label>
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] font-display focus:border-[#E8A317] outline-none"
            />
          </div>

          <div className="bg-[#111111] border border-[#2E2E2E] rounded-lg p-3 text-xs flex justify-between items-center">
            <span className="text-[#9B9A94]">মোট ক্রয় বিল:</span>
            <span className="font-display font-bold text-lg text-[#E8A317] num">
              {formatMoney(totalCost)}
            </span>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-[#2E2E2E] text-sm text-[#F2F1EC] hover:bg-[#232323] transition font-medium"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-lg bg-[#E8A317] text-[#111111] text-sm font-semibold hover:brightness-105 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 text-[#111111]" />
              ক্রয় সম্পন্ন করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
