export type UserRole = 'admin' | 'manager' | 'cashier' | 'seller';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarText?: string;
}

export type Category = 'chain' | 'brake' | 'oil' | 'engine' | 'tyre' | 'electrical' | 'accessories' | 'other';

export interface ProductVariant {
  id: string;
  label: string;
  sku: string;
  barcode: string;
  stockQty: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: Category;
  applicableBike: string; // e.g. 'Honda CB Shine', 'FZ-S V3', 'সব বাইক'
  partType: 'OEM' | 'ফিটিং' | 'আফটারমার্কেট';
  unit: string; // 'পিস', 'লিটার', 'সেট', 'বক্স'
  costPrice: number; // ক্রয়মূল্য (গড়)
  sellPrice: number; // বিক্রয়মূল্য
  taxRate: number; // ভ্যাট %
  minStock: number; // কম স্টক সীমা
  stockQty: number; // মোট স্টক
  expiryDate?: string;
  expiryRequired?: boolean;
  active: boolean;
  variants?: ProductVariant[];
}

export type StockMovementType = 'purchase' | 'sale' | 'return' | 'adjust' | 'damage';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  qtyChange: number; // positive for addition, negative for deduction
  stockAfter: number;
  type: StockMovementType;
  reason?: string;
  refId?: string; // invoice number or purchase order
  createdBy: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  barcode: string;
  qty: number;
  unitPrice: number;
  costAtSale: number;
  lineTotal: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  cashierId: string;
  cashierName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank' | 'split' | 'due';
  profit: number; // মোট লাভ
  date: string;
  status: 'active' | 'cancelled';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  type: 'regular' | 'wholesale' | 'general';
  creditLimit: number;
  totalPurchased: number;
  dueBalance: number;
  lastPaymentDate?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address?: string;
  balanceDue: number;
}
