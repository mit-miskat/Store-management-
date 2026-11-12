import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, StockMovement, Sale, Customer, User } from '../types/index.ts';
import {
  storageService,
  INITIAL_USERS,
} from '../services/storage.ts';
import {
  increaseStockOnPurchase,
  decreaseStockOnSale,
  adjustStock,
  recordStockDamage,
} from '../lib/stock.ts';
import { calculateTotalProfit } from '../lib/calculations.ts';

export type ScreenType = 'login' | 'dash' | 'products' | 'pos' | 'purchase' | 'customers' | 'jobs' | 'cash' | 'reports' | 'ui';

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Data
  products: Product[];
  stockMovements: StockMovement[];
  sales: Sale[];
  customers: Customer[];
  
  // Product & Stock Actions
  addProduct: (product: Omit<Product, 'id'>) => { success: boolean; error?: string };
  updateProduct: (product: Product) => { success: boolean; error?: string };
  performStockAdjustment: (productId: string, physicalCount: number, reason: string) => { success: boolean; error?: string };
  performStockPurchase: (productId: string, qty: number, unitCost: number, supplierInvoice?: string) => { success: boolean; error?: string };
  performStockDamage: (productId: string, damagedQty: number, reason: string) => { success: boolean; error?: string };
  createSale: (saleData: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    items: {
      productId: string;
      productName: string;
      barcode: string;
      qty: number;
      unitPrice: number;
      costAtSale: number;
      lineTotal: number;
    }[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paidAmount: number;
    dueAmount: number;
    paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank' | 'split' | 'due';
  }) => { success: boolean; sale?: Sale; error?: string };
  
  // Theme (Night & Light Mode)
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  
  // UI & Feedback
  toastMessage: string | null;
  showToast: (message: string) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  openProductModal: (product?: Product) => void;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  editingProduct: Product | null;
  openAdjustModal: (product: Product) => void;
  isAdjustModalOpen: boolean;
  setIsAdjustModalOpen: (open: boolean) => void;
  adjustingProduct: Product | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [currentUser, setCurrentUser] = useState<User>(() => storageService.getCurrentUser());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => storageService.getMovements());
  const [sales, setSales] = useState<Sale[]>(() => storageService.getSales());
  const [customers, setCustomers] = useState<Customer[]>(() => storageService.getCustomers());
  
  // Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  // Theme (Night & Light Mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('aj_motors_theme');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('aj_motors_theme', theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync to storage
  useEffect(() => {
    storageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    storageService.saveMovements(stockMovements);
  }, [stockMovements]);

  useEffect(() => {
    storageService.saveSales(sales);
  }, [sales]);

  useEffect(() => {
    storageService.saveCurrentUser(currentUser);
  }, [currentUser]);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 2800);
  };

  const openProductModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsProductModalOpen(true);
  };

  const openAdjustModal = (product: Product) => {
    setAdjustingProduct(product);
    setIsAdjustModalOpen(true);
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    // Check barcode uniqueness
    if (products.some((p) => p.barcode === newProdData.barcode)) {
      return { success: false, error: 'এই বারকোডের পণ্য ইতিমধ্যে বিদ্যমান আছে।' };
    }

    const newProduct: Product = {
      ...newProdData,
      id: `p-${Date.now()}`,
    };

    const updated = [newProduct, ...products];
    setProducts(updated);

    // Initial stock movement if opening stock > 0
    if (newProduct.stockQty > 0) {
      const initialMovement: StockMovement = {
        id: `m-${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        qtyChange: newProduct.stockQty,
        stockAfter: newProduct.stockQty,
        type: 'purchase',
        reason: 'প্রারম্ভিক স্টক এন্ট্রি',
        createdBy: currentUser.name,
        createdAt: new Date().toLocaleString('bn-BD'),
      };
      setStockMovements((prev) => [initialMovement, ...prev]);
    }

    showToast(`"${newProduct.name}" সফলভাবে যুক্ত হয়েছে।`);
    return { success: true };
  };

  const updateProduct = (updatedProd: Product) => {
    if (products.some((p) => p.id !== updatedProd.id && p.barcode === updatedProd.barcode)) {
      return { success: false, error: 'এই বারকোডটি অন্য একটি পণ্যে ব্যবহৃত হচ্ছে।' };
    }

    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    showToast(`"${updatedProd.name}" তথ্য হালনাগাদ করা হয়েছে।`);
    return { success: true };
  };

  const performStockAdjustment = (productId: string, physicalCount: number, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return { success: false, error: 'পণ্য খুঁজে পাওয়া যায়নি।' };

    const result = adjustStock(prod.stockQty, physicalCount, reason);
    if (!result.success) return { success: false, error: result.error };

    const updatedProd: Product = {
      ...prod,
      stockQty: result.newStock,
    };

    setProducts((prev) => prev.map((p) => (p.id === productId ? updatedProd : p)));

    const movement: StockMovement = {
      id: `m-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      qtyChange: result.qtyChange,
      stockAfter: result.newStock,
      type: 'adjust',
      reason,
      createdBy: currentUser.name,
      createdAt: new Date().toLocaleString('bn-BD'),
    };
    setStockMovements((prev) => [movement, ...prev]);

    showToast(`স্টক সমন্বয় সম্পন্ন: নতুন স্টক ${result.newStock}`);
    return { success: true };
  };

  const performStockPurchase = (productId: string, qty: number, unitCost: number, supplierInvoice?: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return { success: false, error: 'পণ্য পাওয়া যায়নি।' };

    const result = increaseStockOnPurchase(prod.stockQty, qty);
    if (!result.success) return { success: false, error: result.error };

    // New weighted average cost calculation
    const totalCurrentValue = prod.stockQty * prod.costPrice;
    const incomingValue = qty * unitCost;
    const newAverageCost = Number(((totalCurrentValue + incomingValue) / result.newStock).toFixed(2));

    const updatedProd: Product = {
      ...prod,
      stockQty: result.newStock,
      costPrice: newAverageCost,
    };

    setProducts((prev) => prev.map((p) => (p.id === productId ? updatedProd : p)));

    const movement: StockMovement = {
      id: `m-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      qtyChange: qty,
      stockAfter: result.newStock,
      type: 'purchase',
      refId: supplierInvoice || 'PO-NEW',
      reason: `নতুন ক্রয় @ ৳ ${unitCost}`,
      createdBy: currentUser.name,
      createdAt: new Date().toLocaleString('bn-BD'),
    };
    setStockMovements((prev) => [movement, ...prev]);

    showToast(`ক্রয় সম্পন্ন: স্টক +${qty} বৃদ্ধি পেয়েছে।`);
    return { success: true };
  };

  const performStockDamage = (productId: string, damagedQty: number, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return { success: false, error: 'পণ্য পাওয়া যায়নি।' };

    const result = recordStockDamage(prod.stockQty, damagedQty, reason);
    if (!result.success) return { success: false, error: result.error };

    const updatedProd: Product = {
      ...prod,
      stockQty: result.newStock,
    };

    setProducts((prev) => prev.map((p) => (p.id === productId ? updatedProd : p)));

    const movement: StockMovement = {
      id: `m-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      qtyChange: result.qtyChange,
      stockAfter: result.newStock,
      type: 'damage',
      reason,
      createdBy: currentUser.name,
      createdAt: new Date().toLocaleString('bn-BD'),
    };
    setStockMovements((prev) => [movement, ...prev]);

    showToast(`নষ্ট পণ্য রেকর্ড করা হয়েছে: স্টক -${damagedQty} কমানো হয়েছে।`);
    return { success: true };
  };

  const createSale = (saleData: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    items: {
      productId: string;
      productName: string;
      barcode: string;
      qty: number;
      unitPrice: number;
      costAtSale: number;
      lineTotal: number;
    }[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paidAmount: number;
    dueAmount: number;
    paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank' | 'split' | 'due';
  }) => {
    // 1. Validate stocks
    for (const item of saleData.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && prod.stockQty < item.qty) {
        return {
          success: false,
          error: `"${item.productName}"-এর পর্যাপ্ত স্টক নেই! (বর্তমান স্টক: ${prod.stockQty})`,
        };
      }
    }

    // 2. Generate sequential invoice number
    const nextInvoiceNumber = `INV-${Date.now().toString().slice(-4)}`;

    // 3. Deduct stock and record movements
    const newMovements: StockMovement[] = [];
    const updatedProducts = products.map((prod) => {
      const item = saleData.items.find((i) => i.productId === prod.id);
      if (item) {
        const result = decreaseStockOnSale(prod.stockQty, item.qty);
        newMovements.push({
          id: `m-${Date.now()}-${prod.id}`,
          productId: prod.id,
          productName: prod.name,
          qtyChange: result.qtyChange,
          stockAfter: result.newStock,
          type: 'sale',
          refId: nextInvoiceNumber,
          createdBy: currentUser.name,
          createdAt: new Date().toLocaleString('bn-BD'),
        });
        return { ...prod, stockQty: result.newStock };
      }
      return prod;
    });

    setProducts(updatedProducts);
    setStockMovements((prev) => [...newMovements, ...prev]);

    // 4. Calculate profit
    const profit = calculateTotalProfit(
      saleData.items.map((i) => ({
        qty: i.qty,
        unitPrice: i.unitPrice,
        costAtSale: i.costAtSale,
      })),
      saleData.discount
    );

    // 5. Build new sale record
    const newSale: Sale = {
      id: `s-${Date.now()}`,
      invoiceNo: nextInvoiceNumber,
      customerId: saleData.customerId,
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      items: saleData.items,
      subtotal: saleData.subtotal,
      discount: saleData.discount,
      tax: saleData.tax,
      total: saleData.total,
      paidAmount: saleData.paidAmount,
      dueAmount: saleData.dueAmount,
      paymentMethod: saleData.paymentMethod,
      profit,
      date: new Date().toLocaleString('bn-BD'),
      status: 'active',
    };

    setSales((prev) => [newSale, ...prev]);

    // 6. Update customer due if applicable
    if (saleData.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === saleData.customerId
            ? {
                ...c,
                totalPurchased: c.totalPurchased + saleData.total,
                dueBalance: c.dueBalance + saleData.dueAmount,
                lastPaymentDate: new Date().toISOString().split('T')[0],
              }
            : c
        )
      );
    }

    showToast(`বিল সম্পন্ন হয়েছে! ইনভয়েস: ${newSale.invoiceNo}`);
    return { success: true, sale: newSale };
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        currentUser,
        setCurrentUser,
        users: INITIAL_USERS,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        searchQuery,
        setSearchQuery,
        products,
        stockMovements,
        sales,
        customers,
        addProduct,
        updateProduct,
        performStockAdjustment,
        performStockPurchase,
        performStockDamage,
        createSale,
        toastMessage,
        showToast,
        isLoginModalOpen,
        setIsLoginModalOpen,
        openProductModal,
        isProductModalOpen,
        setIsProductModalOpen,
        editingProduct,
        openAdjustModal,
        isAdjustModalOpen,
        setIsAdjustModalOpen,
        adjustingProduct,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
