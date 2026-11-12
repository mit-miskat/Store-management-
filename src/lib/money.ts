/**
 * Money and Number formatting utilities for AJ MOTORS (দশমিক ২ ঘর ও বাংলা সংখ্যা)
 */

export const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts any number or numeric string to Bengali digits
 */
export function toBengaliDigits(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return '০';
  return String(input).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

/**
 * Formats a monetary amount to 2 decimal places with comma separation
 * e.g., 1450.5 -> "৳ ১,৪৫০.৫০"
 */
export function formatMoney(
  amount: number | null | undefined,
  options: {
    showCurrency?: boolean;
    bengali?: boolean;
    decimals?: number;
  } = {}
): string {
  const { showCurrency = true, bengali = true, decimals = 2 } = options;
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  
  // Format with fixed decimals
  const fixed = num.toFixed(decimals);
  const parts = fixed.split('.');
  
  // Add thousands comma formatting (standard international/Indian)
  let integerPart = parts[0];
  const decimalPart = parts[1] || '00';
  
  // Format commas: regex for thousands
  const isNegative = integerPart.startsWith('-');
  if (isNegative) integerPart = integerPart.slice(1);
  
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (isNegative) integerPart = '-' + integerPart;

  const formattedStr = decimals > 0 ? `${integerPart}.${decimalPart}` : integerPart;

  const result = bengali ? toBengaliDigits(formattedStr) : formattedStr;
  return showCurrency ? `৳ ${result}` : result;
}

/**
 * Formats integer or fractional quantity (with optional unit and Bengali conversion)
 */
export function formatQuantity(
  qty: number | null | undefined,
  unit: string = '',
  bengali: boolean = true
): string {
  const count = typeof qty === 'number' && !isNaN(qty) ? qty : 0;
  const formatted = count % 1 === 0 ? count.toString() : count.toFixed(2);
  const digitStr = bengali ? toBengaliDigits(formatted) : formatted;
  return unit ? `${digitStr} ${unit}` : digitStr;
}

/**
 * Calculates line total = (qty * unitPrice) - discount
 * Ensures result is rounded to 2 decimal places
 */
export function calculateLineTotal(qty: number, unitPrice: number, discount: number = 0): number {
  if (qty < 0 || unitPrice < 0) return 0;
  const sub = qty * unitPrice;
  const total = Math.max(0, sub - Math.max(0, discount));
  return Number(total.toFixed(2));
}

/**
 * Calculates grand total = subtotal - discount + tax
 */
export function calculateBillTotal(subtotal: number, discount: number = 0, tax: number = 0): number {
  const afterDiscount = Math.max(0, subtotal - Math.max(0, discount));
  const total = afterDiscount + Math.max(0, tax);
  return Number(total.toFixed(2));
}

/**
 * Converts amount into Bengali words for cash memo
 */
export function amountInWordsBengali(amount: number): string {
  const num = Math.round(Math.abs(amount));
  if (num === 0) return 'শূন্য টাকা মাত্র';

  const units = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ',
    'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ', 'বিশ'];

  const tens = ['', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'];

  function convertSmall(n: number): string {
    if (n === 0) return '';
    if (n <= 20) return units[n];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const rem = n % 10;
      if (rem === 0) return tens[t];
      // common compound lookup or generic
      return `${tens[t]} ${units[rem]}`.trim();
    }
    if (n < 1000) {
      const h = Math.floor(n / 100);
      const rem = n % 100;
      const hStr = h === 1 ? 'এক শত' : `${units[h]} শত`;
      return rem > 0 ? `${hStr} ${convertSmall(rem)}` : hStr;
    }
    return '';
  }

  function toWords(n: number): string {
    if (n === 0) return '';
    let res = '';
    // কোটি (10,000,000)
    if (n >= 10000000) {
      const koti = Math.floor(n / 10000000);
      res += `${toWords(koti)} কোটি `;
      n %= 10000000;
    }
    // লক্ষ (100,000)
    if (n >= 100000) {
      const lakh = Math.floor(n / 100000);
      res += `${convertSmall(lakh)} লক্ষ `;
      n %= 100000;
    }
    // হাজার (1,000)
    if (n >= 1000) {
      const hazar = Math.floor(n / 1000);
      res += `${convertSmall(hazar)} হাজার `;
      n %= 1000;
    }
    // শত
    if (n > 0) {
      res += convertSmall(n);
    }
    return res.trim();
  }

  return `${toWords(num)} টাকা মাত্র`;
}
