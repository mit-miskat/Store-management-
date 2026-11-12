import React, { useState, useEffect } from 'react';
import {
  Barcode,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product } from '../../types/index.ts';
import { formatMoney, toBengaliDigits } from '../../lib/money.ts';
import { PaymentModal } from './PaymentModal.tsx';
import { ReceiptModal } from './ReceiptModal.tsx';
import { ThermalReceipt, ReceiptData } from './ThermalReceipt.tsx';

interface CartItem {
  product: Product;
  qty: number;
}

export const PosScreen: React.FC = () => {
  const { products, currentUser, showToast } = useApp();

  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0] || ({} as Product), qty: 1 },
    { product: products[3] || ({} as Product), qty: 2 },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posSearch, setPosSearch] = useState('');
  const [discount, setDiscount] = useState<number>(50);

  // Modals for payment and thermal receipt
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);

  const categories = [
    { id: 'all', label: 'সব পার্টস' },
    { id: 'chain', label: 'চেইন ও স্প্রকেট' },
    { id: 'brake', label: 'ব্রেক সিস্টেম' },
    { id: 'oil', label: 'তেল ও ফিল্টার' },
    { id: 'electrical', label: 'ইলেকট্রিক্যাল' },
  ];

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.sellPrice * item.qty, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const grandTotal = Math.max(0, subtotal - discount);

  // Keyboard shortcut: F9 opens payment modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0) {
          setIsPaymentModalOpen(true);
        } else {
          showToast('কার্টে কোনো পণ্য নেই!');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, showToast]);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (posSearch.trim()) {
      const q = posSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.applicableBike.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const addToCart = (product: Product) => {
    if (product.stockQty <= 0) {
      showToast(`"${product.name}" এর স্টক শেষ!`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stockQty) {
          showToast(`পর্যাপ্ত স্টক নেই (সর্বোচ্চ স্টক: ${product.stockQty})`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    showToast(`"${product.name}" কার্টে যোগ হয়েছে।`);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            if (newQty > item.product.stockQty) {
              showToast(`পর্যাপ্ত স্টক নেই (বর্তমান স্টক: ${item.product.stockQty})`);
              return item;
            }
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    showToast('কার্ট খালি করা হয়েছে।');
  };

  // Preview current active cart as receipt
  const handlePreviewCurrentReceipt = () => {
    if (cart.length === 0) {
      showToast('কার্ট খালি! প্রথমে পণ্য যোগ করুন।');
      return;
    }

    const previewData: ReceiptData = {
      invoiceNo: `PREVIEW-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleString('bn-BD'),
      cashierName: currentUser.name,
      customerName: 'সাধারণ ক্রেতা',
      items: cart.map((i) => ({
        productName: i.product.name,
        barcode: i.product.barcode,
        qty: i.qty,
        unitPrice: i.product.sellPrice,
        lineTotal: i.product.sellPrice * i.qty,
      })),
      subtotal,
      discount,
      grandTotal,
      paidAmount: grandTotal,
      changeAmount: 0,
      dueAmount: 0,
      paymentMethod: 'নগদ',
    };

    setActiveReceipt(previewData);
    setIsReceiptModalOpen(true);
  };

  const handleSaleComplete = (receiptData: ReceiptData) => {
    // Clear cart upon successful sale
    setCart([]);
    setActiveReceipt(receiptData);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Printable Receipt DOM element for pure @media print execution */}
      {activeReceipt && (
        <div className="print-only">
          <ThermalReceipt data={activeReceipt} isPrintOnly={true} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2E2E2E] no-print">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F2F1EC]">
            বিক্রি (POS কাউন্টার)
          </h1>
          <p className="text-xs text-[#9B9A94]">
            ক্যাশিয়ার: <span className="text-[#F2F1EC] font-medium">{currentUser.name}</span> · দ্রুত কিবোর্ড: <span className="text-[#E8A317] font-mono">F9</span> পেমেন্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviewCurrentReceipt}
            disabled={cart.length === 0}
            className="h-9 px-3 rounded-lg border border-[#2E2E2E] hover:border-[#E8A317] text-xs font-semibold text-[#F2F1EC] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="বর্তমান কার্টের রসিদ প্রিন্ট প্রিভিউ দেখুন"
          >
            <Printer className="w-3.5 h-3.5 text-[#E8A317]" />
            <span>ক্যাশমেমো প্রিভিউ</span>
          </button>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#5C8FBF] border border-[#5C8FBF]/40 bg-[#5C8FBF]/10">
            কাউন্টার লাইভ
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start no-print">
        {/* Left: Product Grid & Barcode Scanner */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          {/* Barcode / Search Input */}
          <div className="relative">
            <Barcode className="w-5 h-5 text-[#9B9A94] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={posSearch}
              onChange={(e) => setPosSearch(e.target.value)}
              placeholder="বারকোড স্ক্যান করুন বা পণ্যের নাম / বাইক মডেল লিখুন..."
              className="w-full h-11 pl-10 pr-3 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] placeholder-[#9B9A94] focus:border-[#E8A317] outline-none"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={selectedCategory === cat.id}
                className={`h-8 px-3.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#F2F1EC] text-[#111111]'
                    : 'border border-[#2E2E2E] text-[#9B9A94] hover:text-[#F2F1EC]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Tiles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredProducts.map((p) => {
              const letter = p.name.charAt(0);
              const isOutOfStock = p.stockQty <= 0;
              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  disabled={isOutOfStock}
                  className={`bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-3 text-left flex flex-col justify-between gap-2 min-h-[128px] transition cursor-pointer hover:border-[#9B9A94] ${
                    isOutOfStock ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="h-12 w-full rounded bg-[#232323] grid place-items-center font-display text-2xl font-bold text-[#9B9A94]">
                    {letter}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#F2F1EC] line-clamp-2 leading-tight">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#9B9A94] mt-0.5 truncate">
                      {p.applicableBike}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#2E2E2E]/60 text-xs">
                    <span className="font-display font-bold text-sm text-[#E8A317] num">
                      {formatMoney(p.sellPrice)}
                    </span>
                    <span
                      className={`text-[10px] ${
                        p.stockQty <= p.minStock ? 'text-[#E0583C] font-semibold' : 'text-[#9B9A94]'
                      }`}
                    >
                      স্টক: {toBengaliDigits(p.stockQty)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Cart and Total */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E2E2E]">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#E8A317]" />
              <h2 className="text-base font-bold text-[#F2F1EC]">বিল কার্ট</h2>
            </div>
            <span className="text-xs text-[#9B9A94] font-medium num">
              {toBengaliDigits(totalItemCount)}টি আইটেম
            </span>
          </div>

          {/* Cart Item Rows */}
          <div className="divide-y divide-[#2E2E2E] my-2 max-h-[320px] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-[#9B9A94] text-xs">
                কার্ট খালি। বাম দিক থেকে পণ্য ক্লিক করে যোগ করুন।
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex flex-col gap-1.5">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-2">
                      <p className="text-sm font-semibold text-[#F2F1EC] leading-tight">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#9B9A94] num">
                        {formatMoney(item.product.sellPrice)} × {toBengaliDigits(item.qty)}
                      </p>
                    </div>
                    <span className="font-display font-bold text-base text-[#F2F1EC] num">
                      {formatMoney(item.product.sellPrice * item.qty)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="inline-flex items-center border border-[#2E2E2E] rounded-lg h-7 bg-[#111111]">
                      <button
                        onClick={() => updateQty(item.product.id, -1)}
                        className="w-7 h-full grid place-items-center text-[#9B9A94] hover:text-[#F2F1EC] cursor-pointer"
                        aria-label="কমান"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="min-w-7 text-center font-display font-medium text-xs text-[#F2F1EC] num">
                        {toBengaliDigits(item.qty)}
                      </span>
                      <button
                        onClick={() => updateQty(item.product.id, 1)}
                        className="w-7 h-full grid place-items-center text-[#9B9A94] hover:text-[#F2F1EC] cursor-pointer"
                        aria-label="বাড়ান"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="w-7 h-7 rounded border border-[#2E2E2E] grid place-items-center text-[#9B9A94] hover:text-[#E0583C] hover:border-[#E0583C] transition cursor-pointer"
                      aria-label="আইটেম মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals & Discount Editor */}
          <div className="space-y-2 pt-3 border-t border-[#2E2E2E] text-xs">
            <div className="flex justify-between text-[#9B9A94]">
              <span>সাবটোটাল</span>
              <span className="font-display font-medium text-sm text-[#F2F1EC] num">
                {formatMoney(subtotal)}
              </span>
            </div>

            <div className="flex justify-between items-center text-[#9B9A94]">
              <span>ছাড় (৳)</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-20 h-7 px-2 text-right bg-[#111111] border border-[#2E2E2E] rounded text-xs text-[#E0583C] font-display font-bold num outline-none focus:border-[#E8A317]"
                />
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-[#2E2E2E]">
              <span className="text-base font-bold text-[#F2F1EC]">সর্বমোট বিল</span>
              <span className="font-display font-bold text-3xl text-[#E8A317] num">
                {formatMoney(grandTotal)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5 mt-4">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={cart.length === 0}
              className="w-full h-12 rounded-lg bg-[#E8A317] text-[#111111] font-semibold text-base hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 shadow-sm"
            >
              <CreditCard className="w-5 h-5 text-[#111111]" />
              <span>পেমেন্ট নিন (F9)</span>
            </button>

            <button
              onClick={clearCart}
              disabled={cart.length === 0}
              className="w-full h-9 rounded-lg border border-[#2E2E2E] text-xs text-[#9B9A94] hover:text-[#E0583C] hover:border-[#E0583C] transition flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              কার্ট খালি করুন
            </button>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cart={cart}
        subtotal={subtotal}
        discount={discount}
        grandTotal={grandTotal}
        onSaleComplete={handleSaleComplete}
      />

      {/* Thermal Receipt Print Preview Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptData={activeReceipt}
      />
    </div>
  );
};
