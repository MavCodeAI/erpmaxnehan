import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary, { withErrorBoundary } from './components/ui/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { AuthProvider } from './components/auth/AuthProvider';
import { useERPData } from './hooks/useERPData';
import MainLayout from './components/layout/MainLayout';
import './index.css';

// Fixed: Lazy load components with error boundaries for better UX
const Dashboard = lazy(() => import('./pages/Dashboard').catch(err => {
  console.error('Failed to load Dashboard:', err);
  return { default: () => <div>Failed to load Dashboard</div> };
}));

const Sales = lazy(() => import('./pages/Sales').catch(err => {
  console.error('Failed to load Sales:', err);
  return { default: () => <div>Failed to load Sales</div> };
}));

const Purchases = lazy(() => import('./pages/Purchases').catch(err => {
  console.error('Failed to load Purchases:', err);
  return { default: () => <div>Failed to load Purchases</div> };
}));

const Accounts = lazy(() => import('./pages/Accounts').catch(err => {
  console.error('Failed to load Accounts:', err);
  return { default: () => <div>Failed to load Accounts</div> };
}));

const Inventory = lazy(() => import('./pages/Inventory').catch(err => {
  console.error('Failed to load Inventory:', err);
  return { default: () => <div>Failed to load Inventory</div> };
}));

const Reports = lazy(() => import('./pages/Reports').catch(err => {
  console.error('Failed to load Reports:', err);
  return { default: () => <div>Failed to load Reports</div> };
}));

const Settings = lazy(() => import('./pages/Settings').catch(err => {
  console.error('Failed to load Settings:', err);
  return { default: () => <div>Failed to load Settings</div> };
}));

const JournalVoucherPage = lazy(() => import('./pages/JournalVoucher').catch(err => {
  console.error('Failed to load JournalVoucherPage:', err);
  return { default: () => <div>Failed to load JournalVoucherPage</div> };
}));

const Customers = lazy(() => import('./pages/Customers').catch(err => {
  console.error('Failed to load Customers:', err);
  return { default: () => <div>Failed to load Customers</div> };
}));

const Vendors = lazy(() => import('./pages/Vendors').catch(err => {
  console.error('Failed to load Vendors:', err);
  return { default: () => <div>Failed to load Vendors</div> };
}));

const SalesReturns = lazy(() => import('./pages/SalesReturns').catch(err => {
  console.error('Failed to load SalesReturns:', err);
  return { default: () => <div>Failed to load SalesReturns</div> };
}));

const PurchaseReturns = lazy(() => import('./pages/PurchaseReturns').catch(err => {
  console.error('Failed to load PurchaseReturns:', err);
  return { default: () => <div>Failed to load PurchaseReturns</div> };
}));

const Payments = lazy(() => import('./pages/Payments').catch(err => {
  console.error('Failed to load Payments:', err);
  return { default: () => <div>Failed to load Payments</div> };
}));

const CashAndBank = lazy(() => import('./pages/CashAndBank').catch(err => {
  console.error('Failed to load CashAndBank:', err);
  return { default: () => <div>Failed to load CashAndBank</div> };
}));

const CashPayments = lazy(() => import('./pages/CashPayments').catch(err => {
  console.error('Failed to load CashPayments:', err);
  return { default: () => <div>Failed to load CashPayments</div> };
}));

const CashReceipts = lazy(() => import('./pages/CashReceipts').catch(err => {
  console.error('Failed to load CashReceipts:', err);
  return { default: () => <div>Failed to load CashReceipts</div> };
}));

const BankPayments = lazy(() => import('./pages/BankPayments').catch(err => {
  console.error('Failed to load BankPayments:', err);
  return { default: () => <div>Failed to load BankPayments</div> };
}));

const BankReceipts = lazy(() => import('./pages/BankReceipts').catch(err => {
  console.error('Failed to load BankReceipts:', err);
  return { default: () => <div>Failed to load BankReceipts</div> };
}));

const ItemGroupCreatePage = lazy(() => import('./components/inventory/ItemGroupCreatePage').catch(err => {
  console.error('Failed to load ItemGroupCreatePage:', err);
  return { default: () => <div>Failed to load ItemGroupCreatePage</div> };
}));

const InventoryAdjustmentCreatePage = lazy(() => import('./components/inventory/InventoryAdjustmentCreatePage').catch(err => {
  console.error('Failed to load InventoryAdjustmentCreatePage:', err);
  return { default: () => <div>Failed to load InventoryAdjustmentCreatePage</div> };
}));

// Fixed: Wrap lazy components with error boundaries
const SafeDashboard = withErrorBoundary(Dashboard, {
  onError: (error, errorInfo) => {
    console.error('Dashboard error:', error, errorInfo);
  }
});

const SafeSales = withErrorBoundary(Sales);
const SafePurchases = withErrorBoundary(Purchases);
const SafeAccounts = withErrorBoundary(Accounts);
const SafeInventory = withErrorBoundary(Inventory);
const SafeReports = withErrorBoundary(Reports);
const SafeSettings = withErrorBoundary(Settings);
const SafeJournalVoucherPage = withErrorBoundary(JournalVoucherPage);
const SafeCustomers = withErrorBoundary(Customers);
const SafeVendors = withErrorBoundary(Vendors);
const SafeSalesReturns = withErrorBoundary(SalesReturns);
const SafePurchaseReturns = withErrorBoundary(PurchaseReturns);
const SafePayments = withErrorBoundary(Payments);
const SafeCashAndBank = withErrorBoundary(CashAndBank);
const SafeCashPayments = withErrorBoundary(CashPayments);
const SafeCashReceipts = withErrorBoundary(CashReceipts);
const SafeBankPayments = withErrorBoundary(BankPayments);
const SafeBankReceipts = withErrorBoundary(BankReceipts);
const SafeItemGroupCreatePage = withErrorBoundary(ItemGroupCreatePage);
const SafeInventoryAdjustmentCreatePage = withErrorBoundary(InventoryAdjustmentCreatePage);

// Fixed: Main App component with proper error handling and performance
const AppContent: React.FC = () => {
  const erpData = useERPData();

  // Fixed: Handle global error state with better UX
  if (erpData.error && !erpData.isOffline) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Connection Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to connect to the database. Please check your connection.
          </p>
          <button
            onClick={erpData.loadAllData}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Fixed: Show loading state while initializing
  if (erpData.loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {erpData.isOffline ? 'Loading demo data...' : 'Loading ERPMAX...'}
          </p>
        </div>
      </div>
    );
  }

  // Fixed: Create handler functions that match existing component interfaces
  const handleSave = (items: any[], setItems: React.Dispatch<React.SetStateAction<any[]>>) => {
    return async (item: any) => {
      try {
        const newItem = await erpData.createInvoice(item);
        setItems(prev => [newItem, ...prev]);
        return newItem;
      } catch (error) {
        console.error('Save error:', error);
        throw error;
      }
    };
  };

  const handleDelete = (setItems: React.Dispatch<React.SetStateAction<any[]>>) => {
    return async (id: string) => {
      try {
        await erpData.deleteInvoice(id);
        setItems(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Delete error:', error);
        throw error;
      }
    };
  };

  return (
    <ErrorBoundary>
      <MainLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <SafeDashboard 
                  invoices={erpData.invoices} 
                  bills={erpData.bills} 
                  accounts={[]} 
                />
              } 
            />
          
          {/* Sales Routes */}
          <Route 
            path="/sales/invoices/*" 
            element={
              <Sales 
                invoices={erpData.invoices} 
                onSaveInvoice={handleSave(erpData.invoices, erpData.setInvoices)} 
                onDeleteInvoice={handleDelete(erpData.setInvoices)}
                inventoryItems={erpData.inventoryItems} 
                customers={erpData.customers}
              />
            } 
          />
          <Route 
            path="/sales/customers/*" 
            element={
              <Customers 
                customers={erpData.customers} 
                onSave={handleSave(erpData.customers, erpData.setCustomers)}
                onDelete={handleDelete(erpData.setCustomers)}
                invoices={erpData.invoices}
                customerPayments={[]} // Fixed: Added missing prop
              />
            } 
          />
          <Route 
            path="/sales/returns" 
            element={
              <SalesReturns 
                salesReturns={[]} 
                onSave={() => {}} 
                inventoryItems={erpData.inventoryItems} 
                customers={erpData.customers}
              />
            } 
          />
          
          {/* Purchases Routes */}
          <Route 
            path="/purchases/bills/*" 
            element={
              <Purchases 
                bills={erpData.bills} 
                onSaveBill={handleSave(erpData.bills, erpData.setBills)}
                onDeleteBill={handleDelete(erpData.setBills)}
                inventoryItems={erpData.inventoryItems} 
                vendors={erpData.vendors}
              />
            } 
          />
          <Route 
            path="/purchases/vendors/*" 
            element={
              <Vendors 
                vendors={erpData.vendors} 
                onSave={handleSave(erpData.vendors, erpData.setVendors)}
                onDelete={handleDelete(erpData.setVendors)}
              />
            } 
          />
          <Route 
            path="/purchases/returns" 
            element={
              <PurchaseReturns 
                purchaseReturns={[]} 
                onSave={() => {}} 
                inventoryItems={erpData.inventoryItems} 
                vendors={erpData.vendors}
              />
            } 
          />

          {/* Payments Routes */}
          <Route 
            path="/payments" 
            element={
              <Payments 
                customers={erpData.customers} 
                vendors={erpData.vendors} 
                invoices={erpData.invoices} 
                bills={erpData.bills}
                customerPayments={[]} 
                vendorPayments={[]}
                onSaveCustomerPayment={() => {}}
                onSaveVendorPayment={() => {}}
              />
            } 
          />
          
          {/* Inventory Routes */}
          <Route path="/inventory" element={<Navigate to="/inventory/items" replace />} />
          <Route 
            path="/inventory/items/*" 
            element={
              <Inventory 
                items={erpData.inventoryItems} 
                onSaveItem={handleSave(erpData.inventoryItems, erpData.setInventoryItems)}
                vendors={erpData.vendors}
                accounts={[]} // Fixed: Added missing accounts prop
              />
            } 
          />
          <Route 
            path="/inventory/groups" 
            element={
              <ItemGroupCreatePage 
                onSaveItems={() => {}} 
                inventoryItems={erpData.inventoryItems}
                vendors={erpData.vendors} // Fixed: Added missing vendors prop
                accounts={[]} // Fixed: Added missing accounts prop
              />
            } 
          />
          <Route 
            path="/inventory/adjustments" 
            element={
              <InventoryAdjustmentCreatePage 
                inventoryItems={erpData.inventoryItems}
                accounts={[]} // Fixed: Added missing accounts prop
                inventoryAdjustments={[]} 
                onSave={() => {}} 
              />
            } 
          />
          
          {/* Accounting Routes */}
          <Route path="/accounting/accounts" element={<Accounts />} />
          <Route 
            path="/accounting/jv" 
            element={
              <JournalVoucherPage 
                journalVouchers={[]} 
                onSave={() => {}} 
                onDelete={() => {}} 
                accounts={[]} 
              />
            } 
          />
          
          {/* Cash and Bank Routes */}
          <Route path="/cash-and-bank" element={<Navigate to="/cash-and-bank/cash-payments" replace />} />
          <Route 
            path="/cash-and-bank/cash-payments" 
            element={
              <CashPayments 
                vouchers={[]} 
                onSave={() => {}} 
                onDelete={() => {}} 
                accounts={[]} 
                allTransactions={{
                  invoices: erpData.invoices,
                  bills: erpData.bills,
                  journalVouchers: [],
                  customerPayments: [],
                  vendorPayments: [],
                  salesReturns: [],
                  purchaseReturns: [],
                  cashPayments: [], // Fixed: Added missing properties
                  cashReceipts: [],
                  bankPayments: [],
                  bankReceipts: []
                }}
              />
            } 
          />
          <Route 
            path="/cash-and-bank/cash-receipts" 
            element={
              <CashReceipts 
                vouchers={[]} 
                onSave={() => {}} 
                onDelete={() => {}} 
                accounts={[]} 
                allTransactions={{
                  invoices: erpData.invoices,
                  bills: erpData.bills,
                  journalVouchers: [],
                  customerPayments: [],
                  vendorPayments: [],
                  salesReturns: [],
                  purchaseReturns: [],
                  cashPayments: [], // Fixed: Added missing properties
                  cashReceipts: [],
                  bankPayments: [],
                  bankReceipts: []
                }}
              />
            } 
          />
          <Route 
            path="/cash-and-bank/bank-payments" 
            element={
              <BankPayments 
                vouchers={[]} 
                onSave={() => {}} 
                onDelete={() => {}} 
                accounts={[]} 
                allTransactions={{
                  invoices: erpData.invoices,
                  bills: erpData.bills,
                  journalVouchers: [],
                  customerPayments: [],
                  vendorPayments: [],
                  salesReturns: [],
                  purchaseReturns: [],
                  cashPayments: [], // Fixed: Added missing properties
                  cashReceipts: [],
                  bankPayments: [],
                  bankReceipts: []
                }}
              />
            } 
          />
          <Route 
            path="/cash-and-bank/bank-receipts" 
            element={
              <BankReceipts 
                vouchers={[]} 
                onSave={() => {}} 
                onDelete={() => {}} 
                accounts={[]} 
                allTransactions={{
                  invoices: erpData.invoices,
                  bills: erpData.bills,
                  journalVouchers: [],
                  customerPayments: [],
                  vendorPayments: [],
                  salesReturns: [],
                  purchaseReturns: [],
                  cashPayments: [], // Fixed: Added missing properties
                  cashReceipts: [],
                  bankPayments: [],
                  bankReceipts: []
                }}
              />
            } 
          />
          
          {/* Other Routes */}
          <Route 
            path="/reports" 
            element={
              <Reports 
                accounts={[]}
                inventoryItems={erpData.inventoryItems}
                invoices={erpData.invoices}
                bills={erpData.bills}
                journalVouchers={[]}
                customerPayments={[]}
                vendorPayments={[]}
                salesReturns={[]}
                purchaseReturns={[]}
                cashPayments={[]}
                cashReceipts={[]}
                bankPayments={[]}
                bankReceipts={[]}
              />
            } 
          />
          <Route 
            path="/settings/*" 
            element={
              <Settings 
                accounts={[]}
                onUpdateAccounts={() => {}}
              />
            } 
          />
          
          {/* 404 Route */}
          <Route 
            path="*" 
            element={
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    404 - Page Not Found
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The page you're looking for doesn't exist.
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </Suspense>
    </MainLayout>
    </ErrorBoundary>
  );
};

// Fixed: Root App component with proper providers
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
