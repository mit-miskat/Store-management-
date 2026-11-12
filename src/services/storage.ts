import { Product, StockMovement, Sale, Customer, User } from '../types/index.ts';

const STORAGE_KEYS = {
  PRODUCTS: 'aj_motors_products',
  MOVEMENTS: 'aj_motors_stock_movements',
  SALES: 'aj_motors_sales',
  CUSTOMERS: 'aj_motors_customers',
  CURRENT_USER: 'aj_motors_current_user',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'মিজানুর রহমান (মালিক)',
    username: 'mizanorrahman',
    password: 'mizan2211',
    email: 'mizanorrahman@ajmotors.com',
    role: 'admin',
    phone: '০১৭০০-১১২২৩৩',
    avatarText: 'মি',
  },
  {
    id: 'u-2',
    name: 'করিম উল্লাহ (ম্যানেজার)',
    username: 'manager12',
    password: 'manager1122',
    email: 'manager12@ajmotors.com',
    role: 'manager',
    phone: '০১৮০০-৪৪৫৫৬৬',
    avatarText: 'ম্যা',
  },
  {
    id: 'u-3',
    name: 'সুমন দাশ (ক্যাশিয়ার)',
    username: 'cashier12',
    password: 'cashier4433',
    email: 'cashier12@ajmotors.com',
    role: 'cashier',
    phone: '০১৯০০-৭৭৮৮৯৯',
    avatarText: 'ক্যা',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'চেইন ও স্প্রকেট সেট',
    sku: 'CHN-HND-01',
    barcode: '89012001',
    category: 'chain',
    applicableBike: 'Honda CB Shine',
    partType: 'OEM',
    unit: 'সেট',
    costPrice: 1450.00,
    sellPrice: 1800.00,
    taxRate: 0,
    minStock: 5,
    stockQty: 2,
    active: true,
  },
  {
    id: 'p-2',
    name: 'ব্রেক প্যাড সেট (সামনে)',
    sku: 'BRK-SHN-02',
    barcode: '89012002',
    category: 'brake',
    applicableBike: 'Shine, Splendor',
    partType: 'ফিটিং',
    unit: 'সেট',
    costPrice: 250.00,
    sellPrice: 400.00,
    taxRate: 0,
    minStock: 5,
    stockQty: 3,
    active: true,
  },
  {
    id: 'p-3',
    name: 'এয়ার ফিল্টার এলিমেন্ট',
    sku: 'FLT-FZS-03',
    barcode: '89012003',
    category: 'oil',
    applicableBike: 'FZ-S V3, Fazer',
    partType: 'OEM',
    unit: 'পিস',
    costPrice: 320.00,
    sellPrice: 450.00,
    taxRate: 0,
    minStock: 4,
    stockQty: 9,
    active: true,
  },
  {
    id: 'p-4',
    name: 'ইঞ্জিন অয়েল ১০W-৪০ (১ লিটার)',
    sku: 'OIL-10W40-04',
    barcode: '89012004',
    category: 'oil',
    applicableBike: 'সব বাইক',
    partType: 'ফিটিং',
    unit: 'লিটার',
    costPrice: 430.00,
    sellPrice: 550.00,
    taxRate: 0,
    minStock: 6,
    stockQty: 4,
    expiryDate: '2026-12-05',
    expiryRequired: true,
    active: true,
  },
  {
    id: 'p-5',
    name: 'ক্লাচ প্লেট সেট',
    sku: 'CLT-PLS-05',
    barcode: '89012005',
    category: 'chain',
    applicableBike: 'Pulsar 150 UG4',
    partType: 'OEM',
    unit: 'সেট',
    costPrice: 820.00,
    sellPrice: 1050.00,
    taxRate: 0,
    minStock: 3,
    stockQty: 6,
    active: true,
  },
  {
    id: 'p-6',
    name: 'ড্রাম ব্রেক লাইনার (পেছনে)',
    sku: 'BRK-LIN-06',
    barcode: '89012006',
    category: 'brake',
    applicableBike: 'Discover 125, Platina',
    partType: 'ফিটিং',
    unit: 'সেট',
    costPrice: 140.00,
    sellPrice: 220.00,
    taxRate: 0,
    minStock: 4,
    stockQty: 8,
    active: true,
  },
  {
    id: 'p-7',
    name: 'স্পার্ক প্লাগ NGK Laser Iridium',
    sku: 'SPK-NGK-07',
    barcode: '89012007',
    category: 'electrical',
    applicableBike: 'সব বাইক',
    partType: 'OEM',
    unit: 'পিস',
    costPrice: 120.00,
    sellPrice: 180.00,
    taxRate: 0,
    minStock: 5,
    stockQty: 14,
    active: true,
  },
  {
    id: 'p-8',
    name: 'টায়ার টিউবলেস ১০০/৯০-১৭ (MRF)',
    sku: 'TYR-MRF-08',
    barcode: '89012008',
    category: 'tyre',
    applicableBike: 'Gixxer, FZ, Apache',
    partType: 'OEM',
    unit: 'পিস',
    costPrice: 2800.00,
    sellPrice: 3400.00,
    taxRate: 0,
    minStock: 2,
    stockQty: 1, // কম স্টক
    active: true,
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    name: 'আরিফ হোসেন',
    phone: '০১৭১২-৩৪৫৬৭৮',
    address: 'মিরপুর-১০, ঢাকা',
    type: 'regular',
    creditLimit: 5000,
    totalPurchased: 28500.00,
    dueBalance: 1500.00,
    lastPaymentDate: '২০২৬-১১-১০',
  },
  {
    id: 'c-2',
    name: 'সাব্বির আহমেদ (মেসার্স বাইক কেয়ার)',
    phone: '০১৮১৯-০০৭৭৮৮',
    address: 'উত্তরা সেক্টর ৭, ঢাকা',
    type: 'wholesale',
    creditLimit: 10000,
    totalPurchased: 41000.00,
    dueBalance: 12500.00, // সীমা ছাড়িয়েছে
    lastPaymentDate: '২০২৬-১০-২৮',
  },
  {
    id: 'c-3',
    name: 'নুসরাত জাহান',
    phone: '০১৯১১-২২৩৩৪৪',
    address: 'ধানমন্ডি, ঢাকা',
    type: 'general',
    creditLimit: 2000,
    totalPurchased: 4200.00,
    dueBalance: 0.00,
    lastPaymentDate: '২০২৬-১১-১২',
  },
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'm-1',
    productId: 'p-1',
    productName: 'চেইন ও স্প্রকেট সেট',
    qtyChange: 5,
    stockAfter: 5,
    type: 'purchase',
    refId: 'PO-0082',
    createdBy: 'রফিক আহমেদ',
    createdAt: '2026-11-10 10:30',
  },
  {
    id: 'm-2',
    productId: 'p-1',
    productName: 'চেইন ও স্প্রকেট সেট',
    qtyChange: -3,
    stockAfter: 2,
    type: 'sale',
    refId: 'INV-118',
    createdBy: 'সুমন দাশ',
    createdAt: '2026-11-12 11:15',
  },
  {
    id: 'm-3',
    productId: 'p-2',
    productName: 'ব্রেক প্যাড সেট (সামনে)',
    qtyChange: -2,
    stockAfter: 3,
    type: 'sale',
    refId: 'INV-119',
    createdBy: 'সুমন দাশ',
    createdAt: '2026-11-12 14:20',
  },
  {
    id: 'm-4',
    productId: 'p-8',
    productName: 'টায়ার টিউবলেস ১০০/৯০-১৭ (MRF)',
    qtyChange: -1,
    stockAfter: 1,
    type: 'adjust',
    reason: 'ওয়ারহাউজ গণনায় ১টি কম পাওয়া গেছে',
    createdBy: 'করিম উল্লাহ',
    createdAt: '2026-11-12 16:00',
  },
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 's-118',
    invoiceNo: 'INV-118',
    customerId: 'c-1',
    customerName: 'আরিফ হোসেন',
    customerPhone: '০১৭১২-৩৪৫৬৭৮',
    cashierId: 'u-3',
    cashierName: 'সুমন দাশ',
    items: [
      {
        productId: 'p-1',
        productName: 'চেইন ও স্প্রকেট সেট',
        barcode: '89012001',
        qty: 1,
        unitPrice: 1800.00,
        costAtSale: 1450.00,
        lineTotal: 1800.00,
      },
      {
        productId: 'p-4',
        productName: 'ইঞ্জিন অয়েল ১০W-৪০ (১ লিটার)',
        barcode: '89012004',
        qty: 1,
        unitPrice: 550.00,
        costAtSale: 430.00,
        lineTotal: 550.00,
      },
    ],
    subtotal: 2350.00,
    discount: 50.00,
    tax: 0,
    total: 2300.00,
    paidAmount: 2300.00,
    dueAmount: 0.00,
    paymentMethod: 'cash',
    profit: 420.00,
    date: '2026-11-12 11:15',
    status: 'active',
  },
  {
    id: 's-119',
    invoiceNo: 'INV-119',
    customerId: 'c-2',
    customerName: 'সাব্বির আহমেদ',
    customerPhone: '০১৮১৯-০০৭৭৮৮',
    cashierId: 'u-3',
    cashierName: 'সুমন দাশ',
    items: [
      {
        productId: 'p-2',
        productName: 'ব্রেক প্যাড সেট (সামনে)',
        barcode: '89012002',
        qty: 2,
        unitPrice: 400.00,
        costAtSale: 250.00,
        lineTotal: 800.00,
      },
      {
        productId: 'p-3',
        productName: 'এয়ার ফিল্টার এলিমেন্ট',
        barcode: '89012003',
        qty: 2,
        unitPrice: 450.00,
        costAtSale: 320.00,
        lineTotal: 900.00,
      },
    ],
    subtotal: 1700.00,
    discount: 0,
    tax: 0,
    total: 1700.00,
    paidAmount: 500.00,
    dueAmount: 1200.00,
    paymentMethod: 'split',
    profit: 560.00,
    date: '2026-11-12 14:20',
    status: 'active',
  },
];

// Helper methods for localStorage
export const storageService = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  },

  getMovements(): StockMovement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      return data ? JSON.parse(data) : INITIAL_MOVEMENTS;
    } catch {
      return INITIAL_MOVEMENTS;
    }
  },

  saveMovements(movements: StockMovement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
    } catch (e) {
      console.error('Failed to save movements', e);
    }
  },

  getSales(): Sale[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALES);
      return data ? JSON.parse(data) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  },

  saveSales(sales: Sale[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch (e) {
      console.error('Failed to save sales', e);
    }
  },

  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  },

  saveCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers', e);
    }
  },

  getCurrentUser(): User {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) {
        const parsed = JSON.parse(data);
        const matched = INITIAL_USERS.find((u) => u.username === parsed.username || u.role === parsed.role);
        if (matched) return matched;
      }
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  },

  saveCurrentUser(user: User): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  },
};
