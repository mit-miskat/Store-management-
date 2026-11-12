import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Wallet, Phone, Printer, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product } from '../../types/index.ts';
import { formatMoney, toBengaliDigits } from '../../lib/money.ts';
import { calculateDue } from '../../lib/calculations.ts';
import { ReceiptData } from './ThermalReceipt.tsx';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { product: Product; qty: number }[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  onSaleComplete: (receiptData: ReceiptData) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cart,
  subtotal,
  discount,
  grandTotal,
  onSaleComplete,
}) => {
  const { customers, currentUser, createSale, showToast } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState('সাধারণ ক্রেতা');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'nagad' | 'bank' | 'split' | 'due'>('cash');
  const [paidAmount, setPaidAmount] = useState<number | ''>(grandTotal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentPaid = paidAmount === '' ? 0 : Number(paidAmount);
  const dueCalculated = calculateDue(grandTotal, currentPaid);

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);
    if (!customerId) {
      setCustomerName('সাধারণ ক্রেতা');
      setCustomerPhone('');
      return;
    }
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      setCustomerName(cust.name);
      setCustomerPhone(cust.phone);
    }
  };

  const setExactAmount = () => setPaidAmount(grandTotal);

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('কার্টে কোনো পণ্য নেই!');
      return;
    }

    setIsSubmitting(true);

    const saleItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      barcode: item.product.barcode,
      qty: item.qty,
      unitPrice: item.product.sellPrice,
      costAtSale: item.product.costPrice,
      lineTotal: item.product.sellPrice * item.qty,
    }));

    const result = createSale({
      customerId: selectedCustomerId || undefined,
      customerName: customerName.trim() || 'সাধারণ ক্রেতা',
      customerPhone: customerPhone.trim() || undefined,
      items: saleItems,
      subtotal,
      discount,
      tax: 0,
      total: grandTotal,
      paidAmount: currentPaid,
      dueAmount: dueCalculated.dueAmount,
      paymentMethod,
    });

    setIsSubmitting(false);

    if (!result.success || !result.sale) {
      setErrorMsg(result.error || 'বিক্রি সম্পন্ন করা সম্ভব হয়নি।');
      return;
    }

    // Build ReceiptData for thermal print
    const receiptData: ReceiptData = {
      invoiceNo: result.sale.invoiceNo,
      date: result.sale.date,
      cashierName: currentUser.name,
      customerName: result.sale.customerName,
      customerPhone: result.sale.customerPhone,
      items: saleItems,
      subtotal,
      discount,
      grandTotal,
      paidAmount: currentPaid,
      changeAmount: dueCalculated.changeAmount,
      dueAmount: dueCalculated.dueAmount,
      paymentMethod:
        paymentMethod === 'cash'
          ? 'নগদ'
          : paymentMethod === 'bkash'
          ? 'বিকাশ'
          : paymentMethod === 'nagad'
          ? 'নগদ পে'
          : paymentMethod === 'bank'
          ? 'ব্যাংক'
          : 'বাকি',
    };

    onClose();
    onSaleComplete(receiptData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-70 p-4 no-print overflow-y-auto">
      <div className="w-full max-w-lg bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-5 sm:p-6 shadow-2xl relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9B9A94] hover:text-[#F2F1EC] transition p-1 cursor-pointer"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-6 h-6 text-[#E8A317]" />
          <h2 className="text-xl font-bold text-[#F2F1EC]">পেমেন্ট ও বিল সম্পন্ন</h2>
        </div>
        <p className="text-xs text-[#9B9A94] mb-4">
          টাকা গ্রহণ, মাধ্যম নির্বাচন ও স্বয়ংক্রিয় ক্যাশমেমো প্রিন্ট
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-[#E0583C]/10 border border-[#E0583C] text-[#E0583C] text-xs">
            {errorMsg}
          </div>
        )}

        {/* Bill Summary Banner */}
        <div className="bg-[#111111] border border-[#2E2E2E] rounded-lg p-3.5 mb-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9B9A94] block">সর্বমোট বিল</span>
            <span className="text-xs text-[#9B9A94]">
              (সাবটোটাল {formatMoney(subtotal)} − ছাড় {formatMoney(discount)})
            </span>
          </div>
          <span className="font-display font-bold text-3xl text-[#E8A317] num">
            {formatMoney(grandTotal)}
          </span>
        </div>

        <form onSubmit={handleCompletePayment} className="space-y-4">
          {/* Customer Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-[#9B9A94] font-medium">গ্রাহক নির্বাচন</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-xs text-[#F2F1EC] focus:border-[#E8A317] outline-none"
              >
                <option value="">সাধারণ ওয়াক-ইন ক্রেতা</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9B9A94] font-medium">গ্রাহকের নাম</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-xs text-[#F2F1EC] focus:border-[#E8A317] outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#9B9A94] font-medium">পরিশোধের মাধ্যম</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'cash', label: 'নগদ ক্যাশ' },
                { id: 'bkash', label: 'বিকাশ' },
                { id: 'nagad', label: 'নগদ পে' },
                { id: 'bank', label: 'কার্ড/ব্যাংক' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`h-9 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                    paymentMethod === m.id
                      ? 'border-[#E8A317] bg-[#E8A317] text-[#111111]'
                      : 'border-[#2E2E2E] bg-[#111111] text-[#9B9A94] hover:text-[#F2F1EC]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Paid Amount Input & Quick Buttons */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-[#9B9A94] font-medium">গ্রাহকের দেওয়া টাকা (৳)</label>
              <button
                type="button"
                onClick={setExactAmount}
                className="text-[11px] text-[#E8A317] hover:underline cursor-pointer"
              >
                হুবহু বিল বসান
              </button>
            </div>

            <input
              type="number"
              min="0"
              step="1"
              required
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full h-12 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-xl font-display font-bold text-right text-[#F2F1EC] focus:border-[#E8A317] outline-none num"
            />

            {/* Quick cash shortcut chips */}
            <div className="flex gap-1.5 flex-wrap pt-1">
              {[100, 500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPaidAmount(amt)}
                  className="px-2.5 py-1 rounded bg-[#111111] border border-[#2E2E2E] text-xs text-[#9B9A94] hover:text-[#F2F1EC] hover:border-[#9B9A94] transition cursor-pointer font-display num"
                >
                  +{toBengaliDigits(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Change or Due Calculation Alert */}
          <div className="bg-[#111111] border border-[#2E2E2E] rounded-lg p-3 text-xs space-y-1">
            {dueCalculated.changeAmount > 0 && (
              <div className="flex justify-between items-center text-[#4FAE6E] font-medium">
                <span>গ্রাহককে ফেরত দিন (Change):</span>
                <span className="font-display font-bold text-lg num">
                  {formatMoney(dueCalculated.changeAmount)}
                </span>
              </div>
            )}
            {dueCalculated.dueAmount > 0 && (
              <div className="flex justify-between items-center text-[#E0583C] font-medium">
                <span>গ্রাহকের বাকি থাকবে (Due):</span>
                <span className="font-display font-bold text-lg num">
                  {formatMoney(dueCalculated.dueAmount)}
                </span>
              </div>
            )}
            {dueCalculated.changeAmount === 0 && dueCalculated.dueAmount === 0 && (
              <div className="text-center text-[#4FAE6E] font-medium py-1">
                ✓ সম্পূর্ণ বিল পরিশোধিত
              </div>
            )}
          </div>

          {/* Submit & Print */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-lg border border-[#2E2E2E] text-sm text-[#F2F1EC] hover:bg-[#232323] transition font-medium cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-lg bg-[#E8A317] text-[#111111] text-sm font-semibold hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Printer className="w-5 h-5 text-[#111111]" />
              <span>বিল সম্পন্ন ও প্রিন্ট</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
