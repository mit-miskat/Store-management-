import React, { useState, useEffect } from 'react';
import { X, Barcode, Save, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product, Category } from '../../types/index.ts';

export const ProductModal: React.FC = () => {
  const {
    isProductModalOpen,
    setIsProductModalOpen,
    editingProduct,
    addProduct,
    updateProduct,
    showToast,
  } = useApp();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState<Category>('chain');
  const [applicableBike, setApplicableBike] = useState('');
  const [partType, setPartType] = useState<'OEM' | 'ফিটিং' | 'আফটারমার্কেট'>('OEM');
  const [unit, setUnit] = useState('পিস');
  const [costPrice, setCostPrice] = useState<number | ''>(0);
  const [sellPrice, setSellPrice] = useState<number | ''>(0);
  const [stockQty, setStockQty] = useState<number | ''>(0);
  const [minStock, setMinStock] = useState<number | ''>(5);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryRequired, setExpiryRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSku(editingProduct.sku);
      setBarcode(editingProduct.barcode);
      setCategory(editingProduct.category);
      setApplicableBike(editingProduct.applicableBike);
      setPartType(editingProduct.partType);
      setUnit(editingProduct.unit);
      setCostPrice(editingProduct.costPrice);
      setSellPrice(editingProduct.sellPrice);
      setStockQty(editingProduct.stockQty);
      setMinStock(editingProduct.minStock);
      setExpiryDate(editingProduct.expiryDate || '');
      setExpiryRequired(editingProduct.expiryRequired || false);
      setErrorMessage('');
    } else {
      // New product defaults
      setName('');
      setSku(`SKU-${Date.now().toString().slice(-4)}`);
      setBarcode(generateNewBarcode());
      setCategory('chain');
      setApplicableBike('');
      setPartType('OEM');
      setUnit('পিস');
      setCostPrice('');
      setSellPrice('');
      setStockQty(0);
      setMinStock(5);
      setExpiryDate('');
      setExpiryRequired(false);
      setErrorMessage('');
    }
  }, [editingProduct, isProductModalOpen]);

  if (!isProductModalOpen) return null;

  function generateNewBarcode(): string {
    return '8901' + Math.floor(1000 + Math.random() * 9000).toString();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('পণ্যের নাম দেওয়া আবশ্যক।');
      return;
    }
    if (!barcode.trim()) {
      setErrorMessage('বারকোড দেওয়া আবশ্যক।');
      return;
    }
    if (Number(sellPrice) < Number(costPrice)) {
      setErrorMessage('বিক্রয়মূল্য ক্রয়মূল্যের চেয়ে কম হতে পারে না!');
      return;
    }

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim(),
        category,
        applicableBike: applicableBike.trim() || 'সব বাইক',
        partType,
        unit,
        costPrice: Number(costPrice) || 0,
        sellPrice: Number(sellPrice) || 0,
        minStock: Number(minStock) || 0,
        expiryDate: expiryRequired ? expiryDate : undefined,
        expiryRequired,
      };
      const res = updateProduct(updated);
      if (!res.success) {
        setErrorMessage(res.error || 'হালনাগাদ ব্যর্থ হয়েছে।');
        return;
      }
    } else {
      const newProd: Omit<Product, 'id'> = {
        name: name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim(),
        category,
        applicableBike: applicableBike.trim() || 'সব বাইক',
        partType,
        unit,
        costPrice: Number(costPrice) || 0,
        sellPrice: Number(sellPrice) || 0,
        taxRate: 0,
        minStock: Number(minStock) || 0,
        stockQty: Number(stockQty) || 0,
        expiryDate: expiryRequired ? expiryDate : undefined,
        expiryRequired,
        active: true,
      };
      const res = addProduct(newProd);
      if (!res.success) {
        setErrorMessage(res.error || 'নতুন পণ্য যোগ করা সম্ভব হয়নি।');
        return;
      }
    }

    setIsProductModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-70 p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-5 sm:p-6 shadow-2xl relative my-8">
        <button
          onClick={() => setIsProductModalOpen(false)}
          className="absolute top-4 right-4 text-[#9B9A94] hover:text-[#F2F1EC] transition p-1"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#F2F1EC] mb-1">
          {editingProduct ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যোগ করুন'}
        </h2>
        <p className="text-xs text-[#9B9A94] mb-4">
          বারকোড, প্রযোজ্য বাইক মডেল ও স্টক সতর্কতার তথ্য প্রদান করুন।
        </p>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-lg bg-[#E0583C]/10 border border-[#E0583C] text-[#E0583C] text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-[#9B9A94]">পণ্যের নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: চেইন ও স্প্রকেট সেট"
                className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] focus:border-[#E8A317] outline-none"
              />
            </div>

            {/* Applicable Bike Model */}
            <div className="space-y-1">
              <label className="text-xs text-[#9B9A94]">প্রযোজ্য বাইকের মডেল *</label>
              <input
                type="text"
                required
                value={applicableBike}
                onChange={(e) => setApplicableBike(e.target.value)}
                placeholder="যেমন: Honda CB Shine, Pulsar 150"
                className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] focus:border-[#E8A317] outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs text-[#9B9A94]">ক্যাটাগরি</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] focus:border-[#E8A317] outline-none"
              >
                <option value="chain">চেইন ও স্প্রকেট</option>
                <option value="brake">ব্রেক সিস্টেম</option>
                <option value="oil">তেল ও ফিল্টার</option>
                <option value="engine">ইঞ্জিন পার্টস</option>
                <option value="tyre">টায়ার ও টিউব</option>
                <option value="electrical">ইলেকট্রিক্যাল</option>
                <option value="accessories">এক্সেসরিজ</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            {/* Barcode with Auto-Gen */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#9B9A94]">বারকোড *</label>
                <button
                  type="button"
                  onClick={() => setBarcode(generateNewBarcode())}
                  className="text-[11px] text-[#E8A317] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  নতুন জেনারেট
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="৮৯০১২০০১"
                  className="w-full h-10 pl-3 pr-8 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-[#F2F1EC] font-display focus:border-[#E8A317] outline-none num"
                />
                <Barcode className="w-4 h-4 text-[#9B9A94] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Part Type */}
            <div className="space-y-1">
              <label className="text-xs text-[#9B9A94]">পার্টসের ধরন</label>
              <div className="grid grid-cols-3 gap-2">
                {(['OEM', 'ফিটিং', 'আফটারমার্কেট'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPartType(type)}
                    className={`h-10 text-xs rounded-lg border font-medium transition cursor-pointer ${
                      partType === type
                        ? 'bg-[#F2F1EC] text-[#111111] border-[#F2F1EC]'
                        : 'bg-[#111111] text-[#9B9A94] border-[#2E2E2E] hover:border-[#9B9A94]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Price */}
            <div className="space-y-1">
              <label className="text-xs text-[#9B9A94]">ক্রয়মূল্য (৳)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="১৪৫০.০০"
                className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-right text-[#F2F1EC] font-display focus:border-[#E8A317] outline-none num"
              />
            </div>

            {/* Sell Price */}
            <div className="space-y-1">
              <label className="text-xs text-[#9B9A94]">বিক্রয়মূল্য (৳)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="১৮০০.০০"
                className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-right text-[#F2F1EC] font-display focus:border-[#E8A317] outline-none num"
              />
            </div>

            {/* Initial Stock (Only for new product) */}
            {!editingProduct && (
              <div className="space-y-1">
                <label className="text-xs text-[#9B9A94]">প্রারম্ভিক স্টক সংখ্যা</label>
                <input
                  type="number"
                  min="0"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="১০"
                  className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-right text-[#F2F1EC] font-display focus:border-[#E8A317] outline-none num"
                />
              </div>
            )}

            {/* Min Stock Alert Level */}
            <div className="space-y-1">
              <label className="text-xs text-[#9B9A94]">কম স্টক সতর্কতা সীমা</label>
              <input
                type="number"
                min="0"
                required
                value={minStock}
                onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="৫"
                className="w-full h-10 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-sm text-right text-[#F2F1EC] font-display focus:border-[#E8A317] outline-none num"
              />
            </div>

            {/* Expiry Settings */}
            <div className="sm:col-span-2 pt-2 border-t border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="expCheck"
                  checked={expiryRequired}
                  onChange={(e) => setExpiryRequired(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#E8A317] cursor-pointer"
                />
                <label htmlFor="expCheck" className="text-xs text-[#F2F1EC] cursor-pointer">
                  এই পণ্যের মেয়াদোত্তীর্ণের তারিখ রয়েছে (যেমন: ইঞ্জিন অয়েল, ব্যাটারি)
                </label>
              </div>

              {expiryRequired && (
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-9 px-3 bg-[#111111] border border-[#2E2E2E] rounded-lg text-xs text-[#F2F1EC] focus:border-[#E8A317] outline-none"
                />
              )}
            </div>
          </div>

          <div className="flex gap-2.5 pt-4">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="flex-1 h-10 rounded-lg border border-[#2E2E2E] text-sm text-[#F2F1EC] hover:bg-[#232323] transition font-medium"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-lg bg-[#E8A317] text-[#111111] text-sm font-semibold hover:brightness-105 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-[#111111]" />
              {editingProduct ? 'হালনাগাদ সংরক্ষণ' : 'পণ্য সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
