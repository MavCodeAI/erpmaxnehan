import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Accounts from './pages/Accounts';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import JournalVoucherPage from './pages/JournalVoucher';
import { MOCK_ACCOUNTS, MOCK_CUSTOMERS, MOCK_VENDORS } from './constants';
import { Account, AllTransactions, Customer, CustomerPayment, InventoryItem, Invoice, PurchaseBill, SalesReturn, Vendor, VendorPayment, JournalVoucher, PurchaseReturn, CashPaymentVoucher, CashReceiptVoucher, BankPaymentVoucher, BankReceiptVoucher, InventoryAdjustment } from './types';
import Customers from './pages/Customers';
import Vendors from './pages/Vendors';
import SalesReturns from './pages/SalesReturns';
import PurchaseReturns from './pages/PurchaseReturns';
import Payments from './pages/Payments';
import CashAndBank from './pages/CashAndBank';
import CashPayments from './pages/CashPayments';
import CashReceipts from './pages/CashReceipts';
import BankPayments from './pages/BankPayments';
import BankReceipts from './pages/BankReceipts';
import ItemGroupCreatePage from './components/inventory/ItemGroupCreatePage';
import InventoryAdjustmentCreatePage from './components/inventory/InventoryAdjustmentCreatePage';

const App: React.FC = () => {
    // Mock State Management
    const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [bills, setBills] = useState<PurchaseBill[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
    const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
    const [journalVouchers, setJournalVouchers] = useState<JournalVoucher[]>([]);
    const [salesReturns, setSalesReturns] = useState<SalesReturn[]>([]);
    const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>([]);
    const [customerPayments, setCustomerPayments] = useState<CustomerPayment[]>([]);
    const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>([]);
    const [cashPayments, setCashPayments] = useState<CashPaymentVoucher[]>([]);
    const [cashReceipts, setCashReceipts] = useState<CashReceiptVoucher[]>([]);
    const [bankPayments, setBankPayments] = useState<BankPaymentVoucher[]>([]);
    const [bankReceipts, setBankReceipts] = useState<BankReceiptVoucher[]>([]);
    const [inventoryAdjustments, setInventoryAdjustments] = useState<InventoryAdjustment[]>([]);


    const allTransactions: AllTransactions = {
        invoices, bills, journalVouchers, customerPayments, vendorPayments, salesReturns, purchaseReturns,
        cashPayments, cashReceipts, bankPayments, bankReceipts
    };

    // Generic save handler
    const handleSave = <T extends {id: string}>(items: T[], setItems: React.Dispatch<React.SetStateAction<T[]>>) => (itemToSave: T) => {
        setItems(prevItems => {
            const index = prevItems.findIndex(i => i.id === itemToSave.id);
            if (index > -1) {
                const newItems = [...prevItems];
                newItems[index] = itemToSave;
                return newItems;
            }
            return [itemToSave, ...prevItems];
        });
    };
    
    // Generic delete handler
    const handleDelete = <T extends {id: string}>(setItems: React.Dispatch<React.SetStateAction<T[]>>) => (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleUpdateAccounts = (updatedAccounts: Account[]) => {
        setAccounts(updatedAccounts);
    }

    const handleSaveItems = (itemsToSave: InventoryItem[]) => {
        setInventoryItems(prevItems => {
            const newItemsMap = new Map(prevItems.map(i => [i.id, i]));
            itemsToSave.forEach(itemToSave => {
                newItemsMap.set(itemToSave.id, itemToSave);
            });
            // Newest items first
            // FIX: Explicitly type sort parameters to resolve TS inference error.
            const sorted = Array.from(newItemsMap.values()).sort((a: InventoryItem, b: InventoryItem) => (
                itemsToSave.find(i => i.id === b.id) ? 1 : -1
            ));
            return sorted;
        });
    };

    const handleSaveAdjustment = (adjustment: InventoryAdjustment) => {
        handleSave(inventoryAdjustments, setInventoryAdjustments)(adjustment);
        
        if (adjustment.status === 'Adjusted') {
            setInventoryItems(prevItems => {
                const newItems = [...prevItems];
                adjustment.items.forEach(adjItem => {
                    if (!adjItem.inventoryItemId) return;
                    const itemIndex = newItems.findIndex(invItem => invItem.id === adjItem.inventoryItemId);
                    if (itemIndex > -1) {
                        const currentItem = newItems[itemIndex];
                        newItems[itemIndex] = {
                            ...currentItem,
                            openingStock: adjItem.newQuantityOnHand,
                        };
                    }
                });
                return newItems;
            });
        }
    };


    return (
        <ErrorBoundary>
            <Toaster position="top-right" />
            <MainLayout>
                <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard invoices={invoices} bills={bills} accounts={accounts} />} />
                <Route path="/sales/invoices/*" element={<Sales invoices={invoices} onSaveInvoice={handleSave(invoices, setInvoices)} onDeleteInvoice={handleDelete(setInvoices)} inventoryItems={inventoryItems} customers={customers} />} />
                <Route path="/sales/customers/*" element={<Customers customers={customers} onSave={handleSave(customers, setCustomers)} onDelete={handleDelete(customers)} invoices={invoices} customerPayments={customerPayments} />} />
                <Route path="/sales/returns" element={<SalesReturns salesReturns={salesReturns} onSave={handleSave(salesReturns, setSalesReturns)} inventoryItems={inventoryItems} customers={customers} />} />
                
                <Route path="/purchases/bills/*" element={<Purchases bills={bills} onSaveBill={handleSave(bills, setBills)} onDeleteBill={handleDelete(setBills)} inventoryItems={inventoryItems} vendors={vendors} />} />
                <Route path="/purchases/vendors/*" element={<Vendors vendors={vendors} onSave={handleSave(vendors, setVendors)} onDelete={handleDelete(vendors)} />} />
                <Route path="/purchases/returns" element={<PurchaseReturns purchaseReturns={purchaseReturns} onSave={handleSave(purchaseReturns, setPurchaseReturns)} inventoryItems={inventoryItems} vendors={vendors} />} />

                <Route path="/payments" element={<Payments 
                    customers={customers} vendors={vendors} invoices={invoices} bills={bills}
                    customerPayments={customerPayments} vendorPayments={vendorPayments}
                    onSaveCustomerPayment={handleSave(customerPayments, setCustomerPayments)}
                    onSaveVendorPayment={handleSave(vendorPayments, setVendorPayments)}
                />} />
                
                <Route path="/inventory" element={<Navigate to="/inventory/items" replace />} />
                <Route path="/inventory/items/*" element={<Inventory items={inventoryItems} onSaveItem={handleSave(inventoryItems, setInventoryItems)} vendors={vendors} accounts={accounts} />} />
                <Route path="/inventory/groups" element={<ItemGroupCreatePage onSaveItems={handleSaveItems} inventoryItems={inventoryItems} vendors={vendors} accounts={accounts} />} />
                <Route path="/inventory/adjustments" element={<InventoryAdjustmentCreatePage inventoryItems={inventoryItems} accounts={accounts} inventoryAdjustments={inventoryAdjustments} onSave={handleSaveAdjustment} />} />
                
                <Route path="/accounting/accounts" element={<Accounts />} />
                <Route path="/accounting/jv" element={<JournalVoucherPage journalVouchers={journalVouchers} onSave={handleSave(journalVouchers, setJournalVouchers)} onDelete={handleDelete(setJournalVouchers)} accounts={accounts} />} />
                
                <Route path="/cash-and-bank" element={<CashAndBank />} />
                <Route path="/cash-and-bank/cash-payments" element={<CashPayments vouchers={cashPayments} onSave={handleSave(cashPayments, setCashPayments)} onDelete={handleDelete(setCashPayments)} accounts={accounts} allTransactions={allTransactions} />} />
                <Route path="/cash-and-bank/cash-receipts" element={<CashReceipts vouchers={cashReceipts} onSave={handleSave(cashReceipts, setCashReceipts)} onDelete={handleDelete(setCashReceipts)} accounts={accounts} allTransactions={allTransactions} />} />
                <Route path="/cash-and-bank/bank-payments" element={<BankPayments vouchers={bankPayments} onSave={handleSave(bankPayments, setBankPayments)} onDelete={handleDelete(setBankPayments)} accounts={accounts} allTransactions={allTransactions} />} />
                <Route path="/cash-and-bank/bank-receipts" element={<BankReceipts vouchers={bankReceipts} onSave={handleSave(bankReceipts, setBankReceipts)} onDelete={handleDelete(setBankReceipts)} accounts={accounts} allTransactions={allTransactions} />} />

                <Route path="/reports" element={<Reports accounts={accounts} inventoryItems={inventoryItems} {...allTransactions} />} />
                <Route path="/settings/*" element={<Settings accounts={accounts} onUpdateAccounts={handleUpdateAccounts} />} />

                </Routes>
            </MainLayout>
        </ErrorBoundary>
    );
};

export default App;