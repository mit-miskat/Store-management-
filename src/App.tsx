/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Topbar } from './components/Layout/Topbar.tsx';
import { Drawer } from './components/Layout/Drawer.tsx';
import { BottomNav } from './components/Layout/BottomNav.tsx';
import { Toast } from './components/Layout/Toast.tsx';
import { LoginModal } from './components/Login/LoginModal.tsx';
import { ProductModal } from './components/Products/ProductModal.tsx';
import { StockAdjustModal } from './components/Products/StockAdjustModal.tsx';
import { DashboardScreen } from './components/Dashboard/DashboardScreen.tsx';
import { ProductList } from './components/Products/ProductList.tsx';
import { PosScreen } from './components/Pos/PosScreen.tsx';
import { PurchasesScreen } from './components/Purchases/PurchasesScreen.tsx';
import { CustomersScreen } from './components/Customers/CustomersScreen.tsx';
import { CashbookScreen } from './components/Cashbook/CashbookScreen.tsx';
import { ReportsScreen } from './components/Reports/ReportsScreen.tsx';
import { DesignSystemScreen } from './components/DesignSystem/DesignSystemScreen.tsx';
import { AdminLoginPage } from './components/Login/AdminLoginPage.tsx';

const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

  return (
    <div className="min-h-[100dvh] w-full bg-[#111111] text-[#F2F1EC] flex flex-col font-sans transition-colors duration-200">
      {/* Top sticky navigation bar */}
      <Topbar />

      {/* Navigation Drawer */}
      <Drawer />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12">
        {currentScreen === 'login' && <AdminLoginPage />}
        {currentScreen === 'dash' && <DashboardScreen />}
        {currentScreen === 'products' && <ProductList />}
        {currentScreen === 'pos' && <PosScreen />}
        {currentScreen === 'purchase' && <PurchasesScreen />}
        {currentScreen === 'customers' && <CustomersScreen />}
        {currentScreen === 'cash' && <CashbookScreen />}
        {currentScreen === 'reports' && <ReportsScreen />}
        {currentScreen === 'ui' && <DesignSystemScreen />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Notifications */}
      <LoginModal />
      <ProductModal />
      <StockAdjustModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
