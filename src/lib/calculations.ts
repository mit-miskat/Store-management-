/**
 * Business and accounting calculations for AJ MOTORS:
 * - লাভ (Profit)
 * - বাকি ও দেনা-পাওনা (Due & Ledger)
 * - গড় ক্রয়মূল্য (Weighted average cost)
 */

export interface ProfitCalculationInput {
  qty: number;
  unitPrice: number;
  costAtSale: number;
  discount?: number;
}

/**
 * আইটেম-স্তরে লাভ হিসাব:
 * লাভ = line_total - (cost_at_sale * qty)
 */
export function calculateItemProfit(
  qty: number,
  unitPrice: number,
  costAtSale: number,
  discount: number = 0
): number {
  if (qty <= 0) return 0;
  const lineTotal = Math.max(0, qty * unitPrice - Math.max(0, discount));
  const totalCost = qty * costAtSale;
  const profit = lineTotal - totalCost;
  return Number(profit.toFixed(2));
}

/**
 * পুরো বিলের লাভ হিসাব:
 * প্রতিটি আইটেমের লাভ যোগফল - অতিরিক্ত বিল ডিসকাউন্ট
 */
export function calculateTotalProfit(
  items: ProfitCalculationInput[],
  overallBillDiscount: number = 0
): number {
  let totalProfit = 0;
  for (const item of items) {
    totalProfit += calculateItemProfit(item.qty, item.unitPrice, item.costAtSale, item.discount || 0);
  }
  // সার্বিক বিল ডিসকাউন্ট সরাসরি লাভ কমায়
  const finalProfit = totalProfit - Math.max(0, overallBillDiscount);
  return Number(finalProfit.toFixed(2));
}

/**
 * বাকি ও অতিরিক্ত টাকা ফেরত হিসাব:
 * বাকি = Total - Paid (যদি Paid < Total)
 * বাকানো টাকা (Change) = Paid - Total (যদি Paid > Total)
 */
export function calculateDue(
  totalAmount: number,
  paidAmount: number
): {
  dueAmount: number;
  changeAmount: number;
  isFullyPaid: boolean;
  isDue: boolean;
} {
  const total = Number(Math.max(0, totalAmount).toFixed(2));
  const paid = Number(Math.max(0, paidAmount).toFixed(2));

  if (paid >= total) {
    const change = Number((paid - total).toFixed(2));
    return {
      dueAmount: 0,
      changeAmount: change,
      isFullyPaid: true,
      isDue: false,
    };
  }

  const due = Number((total - paid).toFixed(2));
  return {
    dueAmount: due,
    changeAmount: 0,
    isFullyPaid: false,
    isDue: true,
  };
}

/**
 * নতুন গড় ক্রয়মূল্য নির্ধারণ (Weighted Average Cost):
 * নতুন গড় = (বর্তমান স্টক * বর্তমান গড় ব্যয় + নতুন ক্রয় পরিমাণ * নতুন ক্রয় ব্যয়) / (বর্তমান স্টক + নতুন ক্রয় পরিমাণ)
 */
export function calculateWeightedAverageCost(
  currentStock: number,
  currentCost: number,
  incomingQty: number,
  incomingCost: number
): number {
  const safeStock = Math.max(0, currentStock);
  const safeCurrentCost = Math.max(0, currentCost);
  const safeIncomingQty = Math.max(0, incomingQty);
  const safeIncomingCost = Math.max(0, incomingCost);

  const totalQty = safeStock + safeIncomingQty;
  if (totalQty === 0) return 0;

  const totalCostValue = (safeStock * safeCurrentCost) + (safeIncomingQty * safeIncomingCost);
  const average = totalCostValue / totalQty;
  return Number(average.toFixed(2));
}

/**
 * গ্রাহকের ক্রেডিট লিমিট যাচাই
 */
export function checkCreditLimitExceeded(
  currentDue: number,
  newDue: number,
  creditLimit: number
): {
  exceeded: boolean;
  projectedDue: number;
  limit: number;
  availableCredit: number;
} {
  const projectedDue = Number((currentDue + newDue).toFixed(2));
  const exceeded = creditLimit > 0 && projectedDue > creditLimit;
  const availableCredit = Number(Math.max(0, creditLimit - projectedDue).toFixed(2));

  return {
    exceeded,
    projectedDue,
    limit: creditLimit,
    availableCredit,
  };
}
