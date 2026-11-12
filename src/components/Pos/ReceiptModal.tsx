import React from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';
import { ThermalReceipt, ReceiptData } from './ThermalReceipt.tsx';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptData,
}) => {
  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-70 p-4 overflow-y-auto no-print">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-5 shadow-2xl relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9B9A94] hover:text-[#F2F1EC] transition p-1"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-[#4FAE6E]" />
          <h2 className="text-lg font-bold text-[#F2F1EC]">ক্যাশমেমো প্রিন্ট প্রিভিউ</h2>
        </div>
        <p className="text-xs text-[#9B9A94] mb-4">
          ৮০মিমি থার্মাল রসিদ ফরম্যাট। "প্রিন্ট করুন" বোতামে চাপ দিলে প্রিন্ট ডায়ালগ খুলবে।
        </p>

        {/* Paper Container Preview */}
        <div className="bg-[#232323] border border-[#2E2E2E] rounded-lg p-3 max-h-[60vh] overflow-y-auto flex justify-center">
          <ThermalReceipt data={receiptData} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-lg border border-[#2E2E2E] text-sm text-[#F2F1EC] hover:bg-[#232323] transition font-medium cursor-pointer"
          >
            বন্ধ করুন
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 h-11 rounded-lg bg-[#E8A317] text-[#111111] text-sm font-semibold hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#111111]" />
            প্রিন্ট করুন (Print)
          </button>
        </div>
      </div>
    </div>
  );
};
