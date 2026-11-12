/**
 * Stock calculation and validation rules for AJ MOTORS
 */

export interface StockOperationResult {
  success: boolean;
  previousStock: number;
  newStock: number;
  qtyChange: number;
  error?: string;
}

/**
 * ক্রয়ে স্টক বৃদ্ধি:
 * ক্রয় সম্পন্ন হলে প্রতিটি পণ্যের স্টক বাড়ে (+qty)
 */
export function increaseStockOnPurchase(
  currentStock: number,
  incomingQty: number
): StockOperationResult {
  if (incomingQty <= 0) {
    return {
      success: false,
      previousStock: currentStock,
      newStock: currentStock,
      qtyChange: 0,
      error: 'ক্রয়ের পরিমাণ অবশ্যই ০-এর বেশি হতে হবে।',
    };
  }

  const newStock = Number((currentStock + incomingQty).toFixed(2));
  return {
    success: true,
    previousStock: currentStock,
    newStock,
    qtyChange: incomingQty,
  };
}

/**
 * বিক্রিতে স্টক হ্রাস:
 * বিক্রি সম্পন্ন হলে পণ্য বা ভ্যারিয়েন্টের স্টক কমে (-qty)
 * স্টক নেগেটিভ হওয়ার ক্ষেত্রে সুরক্ষা দেওয়া হয়
 */
export function decreaseStockOnSale(
  currentStock: number,
  soldQty: number,
  allowNegative: boolean = false
): StockOperationResult {
  if (soldQty <= 0) {
    return {
      success: false,
      previousStock: currentStock,
      newStock: currentStock,
      qtyChange: 0,
      error: 'বিক্রির পরিমাণ অবশ্যই ০-এর বেশি হতে হবে।',
    };
  }

  if (!allowNegative && currentStock < soldQty) {
    return {
      success: false,
      previousStock: currentStock,
      newStock: currentStock,
      qtyChange: 0,
      error: `পর্যাপ্ত স্টক নেই! বর্তমান স্টক: ${currentStock}, বিক্রি করতে চাওয়া হচ্ছে: ${soldQty}।`,
    };
  }

  const newStock = Number((currentStock - soldQty).toFixed(2));
  return {
    success: true,
    previousStock: currentStock,
    newStock,
    qtyChange: -soldQty,
  };
}

/**
 * স্টক সমন্বয় (Adjustment):
 * গণনার পর ঘাটতি/বাড়তি ঠিক করা, কারণ লেখা বাধ্যতামূলক
 */
export function adjustStock(
  currentStock: number,
  physicalCount: number,
  reason: string
): StockOperationResult {
  if (!reason || reason.trim().length === 0) {
    return {
      success: false,
      previousStock: currentStock,
      newStock: currentStock,
      qtyChange: 0,
      error: 'স্টক সমন্বয়ের সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক।',
    };
  }

  if (physicalCount < 0) {
    return {
      success: false,
      previousStock: currentStock,
      newStock: currentStock,
      qtyChange: 0,
      error: 'গণনাকৃত স্টক ঋণাত্মক হতে পারে না।',
    };
  }

  const qtyChange = Number((physicalCount - currentStock).toFixed(2));
  return {
    success: true,
    previousStock: currentStock,
    newStock: physicalCount,
    qtyChange,
  };
}

/**
 * নষ্ট বা ড্যামেজ পণ্যের স্টক বাদ দেওয়া
 */
export function recordStockDamage(
  currentStock: number,
  damagedQty: number,
  reason: string
): StockOperationResult {
  if (damagedQty <= 0) {
    return {
      success: false,
      previousStock: currentStock,
      newStock: currentStock,
      qtyChange: 0,
      error: 'নষ্ট পণ্যের পরিমাণ ০-এর বেশি হতে হবে।',
    };
  }

  if (!reason || reason.trim().length === 0) {
    return {
      success: false,
      previousStock: currentStock,
      newStock: currentStock,
      qtyChange: 0,
      error: 'নষ্ট হওয়ার কারণ উল্লেখ করা বাধ্যতামূলক।',
    };
  }

  if (currentStock < damagedQty) {
    return {
      success: false,
      previousStock: currentStock,
      newStock: currentStock,
      qtyChange: 0,
      error: `বর্তমান স্টকের (${currentStock}) চেয়ে বেশি নষ্ট হিসেবে দেখানো যাবে না।`,
    };
  }

  const newStock = Number((currentStock - damagedQty).toFixed(2));
  return {
    success: true,
    previousStock: currentStock,
    newStock,
    qtyChange: -damagedQty,
  };
}

/**
 * কম স্টক যাচাই (Low stock alert)
 * stock_qty ≤ min_stock
 */
export function isLowStock(stockQty: number, minStock: number): boolean {
  return stockQty <= minStock;
}

/**
 * স্টক স্ট্যাটাস ব্যাজের ধরন নির্ধারণ
 */
export function getStockStatus(stockQty: number, minStock: number): {
  status: 'ok' | 'warn' | 'danger' | 'out_of_stock';
  label: string;
} {
  if (stockQty <= 0) {
    return { status: 'danger', label: 'স্টক শেষ' };
  }
  if (stockQty <= minStock) {
    return { status: 'danger', label: 'কম স্টক' };
  }
  if (stockQty <= minStock + 3) {
    return { status: 'warn', label: 'সীমার কাছাকাছি' };
  }
  return { status: 'ok', label: 'পর্যাপ্ত' };
}
