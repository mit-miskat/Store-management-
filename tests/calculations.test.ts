import assert from 'node:assert/strict';
import {
  increaseStockOnPurchase,
  decreaseStockOnSale,
  adjustStock,
  recordStockDamage,
  isLowStock,
} from '../src/lib/stock.ts';
import {
  calculateItemProfit,
  calculateTotalProfit,
  calculateDue,
  calculateWeightedAverageCost,
  checkCreditLimitExceeded,
} from '../src/lib/calculations.ts';
import {
  formatMoney,
  toBengaliDigits,
  calculateLineTotal,
  calculateBillTotal,
  amountInWordsBengali,
} from '../src/lib/money.ts';

console.log('--- শুরু হচ্ছে AJ MOTORS হিসাব ও স্টক লজিক টেস্ট ---');

// ১. ক্রয়ে স্টক বাড়ার টেস্ট
{
  console.log('টেস্ট ১: ক্রয়ে স্টক বৃদ্ধি');
  const initialStock = 5;
  const purchaseQty = 10;
  const result = increaseStockOnPurchase(initialStock, purchaseQty);

  assert.equal(result.success, true);
  assert.equal(result.newStock, 15);
  assert.equal(result.qtyChange, 10);

  // ০ বা ঋণাত্মক ক্রয়ে এরর হ্যান্ডলিং
  const invalidResult = increaseStockOnPurchase(initialStock, 0);
  assert.equal(invalidResult.success, false);
  assert.equal(invalidResult.newStock, 5);
  console.log('✓ ক্রয়ে স্টক বৃদ্ধির টেস্ট সফল');
}

// ২. বিক্রিতে স্টক কমার টেস্ট
{
  console.log('টেস্ট ২: বিক্রিতে স্টক হ্রাস');
  const initialStock = 12;
  const soldQty = 3;
  const result = decreaseStockOnSale(initialStock, soldQty);

  assert.equal(result.success, true);
  assert.equal(result.newStock, 9);
  assert.equal(result.qtyChange, -3);

  // স্টকের চেয়ে বেশি বিক্রি আটকাতে হবে
  const overflowResult = decreaseStockOnSale(5, 8, false);
  assert.equal(overflowResult.success, false);
  assert.equal(overflowResult.newStock, 5);
  console.log('✓ বিক্রিতে স্টক হ্রাসের টেস্ট সফল');
}

// ৩. স্টক সমন্বয় (Adjustment) টেস্ট
{
  console.log('টেস্ট ৩: স্টক সমন্বয় (কারণ বাধ্যতামূলক)');
  const currentStock = 10;
  const physicalCount = 8;
  const reason = 'গণনায় ২টি ঘাটতি পাওয়া গেছে';

  const adjustResult = adjustStock(currentStock, physicalCount, reason);
  assert.equal(adjustResult.success, true);
  assert.equal(adjustResult.newStock, 8);
  assert.equal(adjustResult.qtyChange, -2);

  // কারণ ছাড়া সমন্বয় ব্যর্থ হবে
  const noReason = adjustStock(currentStock, physicalCount, '');
  assert.equal(noReason.success, false);
  console.log('✓ স্টক সমন্বয় টেস্ট সফল');
}

// ৪. লাভ হিসাব (Profit) টেস্ট
{
  console.log('টেস্ট ৪: লাভ হিসাব (Line total - Cost * Qty)');
  // বিক্রি: চেইন সেট ২টি, প্রতি পিস ১৮০০ টাকা (ক্রয়মূল্য ১৪৫০ টাকা)
  // মোট বিক্রয় = ৩৬০০, মোট ক্রয় = ২৯০০, লাভ = ৭০০ টাকা
  const itemProfit = calculateItemProfit(2, 1800, 1450, 0);
  assert.equal(itemProfit, 700.00);

  // ডিসকাউন্টসহ লাভ হিসাব: ৫০ টাকা ছাড় দিলে লাভ হবে ৬৫০ টাকা
  const itemProfitWithDisc = calculateItemProfit(2, 1800, 1450, 50);
  assert.equal(itemProfitWithDisc, 650.00);

  // একাধিক আইটেমের বিলের লাভ
  const items = [
    { qty: 2, unitPrice: 1800, costAtSale: 1450, discount: 0 }, // লাভ ৭০০
    { qty: 1, unitPrice: 550, costAtSale: 430, discount: 0 },   // লাভ ১২০
  ];
  const billDiscount = 20; // বিল-স্তরে ২০ টাকা ছাড়
  const totalProfit = calculateTotalProfit(items, billDiscount);
  assert.equal(totalProfit, 800.00); // (৭০০ + ১২০) - ২০ = ৮০০
  console.log('✓ লাভ হিসাবের টেস্ট সফল');
}

// ৫. বাকি ও দেনা হিসাব (Due & Change) টেস্ট
{
  console.log('টেস্ট ৫: বাকি ও দেনা হিসাব');
  // মোট বিল ২৫০০, পরিশোধ ১৫০০ -> বাকি ১০০০
  const dueResult = calculateDue(2500, 1500);
  assert.equal(dueResult.isDue, true);
  assert.equal(dueResult.dueAmount, 1000.00);
  assert.equal(dueResult.changeAmount, 0.00);

  // মোট বিল ৫০০, দেওয়া হলো ১০০০ -> বাকি ০, ফেরত ৫০০
  const changeResult = calculateDue(500, 1000);
  assert.equal(changeResult.isFullyPaid, true);
  assert.equal(changeResult.dueAmount, 0.00);
  assert.equal(changeResult.changeAmount, 500.00);
  console.log('✓ বাকি ও ফেরত হিসাবের টেস্ট সফল');
}

// ৬. নতুন গড় ক্রয়মূল্য (Weighted Average Cost) টেস্ট
{
  console.log('টেস্ট ৬: নতুন গড় ক্রয়মূল্য (Weighted Average Cost)');
  // আগে ছিল: ১০ পিস @ ৪০০ টাকা = ৪০০০ টাকা
  // নতুন ক্রয়: ১০ পিস @ ৫০০ টাকা = ৫০০০ টাকা
  // মোট ২০ পিস @ ৯০০০ টাকা -> নতুন গড় ব্যয় = ৪৫০ টাকা
  const avgCost = calculateWeightedAverageCost(10, 400, 10, 500);
  assert.equal(avgCost, 450.00);

  // দশমিক ২ ঘরে নির্ভুলতা
  // আগে ৫ পিস @ ৩২০ = ১৬০০
  // নতুন ৩ পিস @ ৩৫০ = ১০৫০
  // মোট ৮ পিস @ ২৬৫০ / ৮ = ৩৩১.২৫
  const avgCostDec = calculateWeightedAverageCost(5, 320, 3, 350);
  assert.equal(avgCostDec, 331.25);
  console.log('✓ গড় ক্রয়মূল্যের টেস্ট সফল');
}

// ৭. টাকার অঙ্ক দশমিক ২ ঘরে ও বাংলা সংখ্যায় রূপান্তর টেস্ট
{
  console.log('টেস্ট ৭: টাকার অঙ্ক দশমিক ২ ঘরে ও বাংলা সংখ্যা রূপান্তর');
  const formatted = formatMoney(1450.5);
  // Should have 2 decimal places: ১,৪৫০.৫০
  assert.equal(formatted, '৳ ১,৪৫০.৫০');

  const zeroFormatted = formatMoney(0);
  assert.equal(zeroFormatted, '৳ ০.০০');

  const digits = toBengaliDigits('89012001');
  assert.equal(digits, '৮৯০১২০০১');

  const inWords = amountInWordsBengali(1450);
  assert.match(inWords, /এক হাজার চার শত পঞ্চাশ টাকা মাত্র/);
  console.log('✓ বাংলা রূপান্তর ও দশমিক ২ ঘরের টেস্ট সফল');
}

// ৮. কম স্টক সতর্কতা টেস্ট
{
  console.log('টেস্ট ৮: কম স্টক সতর্কতা');
  assert.equal(isLowStock(2, 5), true);
  assert.equal(isLowStock(5, 5), true);
  assert.equal(isLowStock(6, 5), false);
  console.log('✓ কম স্টক সতর্কতা টেস্ট সফল');
}

console.log('--- সবকটি হিসাব ও স্টক লজিক টেস্ট সফলভাবে সম্পন্ন হয়েছে! ---');
