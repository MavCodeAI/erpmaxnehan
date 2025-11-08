// FIX: Define all necessary types for the application.
import { LucideIcon } from 'lucide-react';

// Navigation
export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  subItems?: NavItem[];
}

// Core Financial Types
export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  accountType: AccountType;
  openingBalance: number;
  status: 'Active' | 'Inactive';
  isPostingAccount: boolean;
  description?: string;
  parentCode?: string;
  parentName?: string;
  isWatchlisted?: boolean;
  isSystemAccount?: boolean;
}

export type AccountType = 
  | 'Bank' | 'Cash' | 'Accounts Receivable' | 'Inventory' | 'Fixed Asset' | 'Other Current Asset' | 'Other Asset'
  | 'Accounts Payable' | 'Credit Card' | 'Other Current Liability' | 'Long Term Liability'
  | 'Equity' | 'Retained Earnings'
  | 'Income' | 'Other Income'
  | 'Cost of Goods Sold' | 'Expense' | 'Other Expense';

export interface Transaction {
    id: string;
    description: string;
    type: 'Sale' | 'Purchase' | 'Expense' | 'Income';
    amount: number;
    status: 'Completed' | 'Pending' | 'Cancelled';
    date: string;
}

// Address
export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    fax?: string;
    phone?: string;
}

// Contact Person for Customers/Vendors
export interface ContactPerson {
    id: string;
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    workPhone: string;
    mobile: string;
    designation?: string;
    department?: string;
}

// Sales Module
export interface Customer {
    id: string;
    customerType: 'Business' | 'Individual';
    salutation: string;
    firstName: string;
    lastName: string;
    companyName: string;
    displayName: string;
    email: string;
    workPhone: string;
    mobilePhone: string;
    currency: string;
    openingBalance: number;
    paymentTerms: string;
    taxId?: string;
    notes?: string;
    language?: string;
    enablePortal?: boolean;
    billingAddress: Address;
    shippingAddress: Address;
    status?: 'Active' | 'Inactive';
}

export interface InvoiceItem {
    id: string;
    inventoryItemId?: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    total: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerId: string;
    customerName: string;
    orderNumber?: string;
    date: string;
    dueDate: string;
    salesperson?: string;
    subject?: string;
    items: InvoiceItem[];
    notes?: string;
    termsAndConditions?: string;
    shippingCharges: number;
    adjustment: number;
    total: number;
    status: 'Draft' | 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue';
}

export interface SalesReturnItem extends Omit<InvoiceItem, 'discount' | 'tax'> {}

export interface SalesReturn {
    id: string;
    returnNumber: string;
    customerId: string;
    customerName: string;
    date: string;
    items: SalesReturnItem[];
    total: number;
    status: 'Draft' | 'Completed';
}

// Purchases Module
export interface Vendor {
    id: string;
    salutation: string;
    firstName: string;
    lastName: string;
    companyName: string;
    displayName: string;
    email: string;
    workPhone: string;
    mobilePhone: string;
    currency: string;
    paymentTerms: string;
    taxId?: string;
    companyId?: string;
    website?: string;
    remarks?: string;
    status: 'Active' | 'Inactive';
    billingAddress: Address;
    shippingAddress: Address;
    contactPersons: ContactPerson[];
    openingBalance: number;
}

export interface PurchaseBillItem extends Omit<InvoiceItem, 'discount' | 'tax'> {}

export interface PurchaseBill {
    id: string;
    billNumber: string;
    vendorId: string;
    vendorName: string;
    orderNumber?: string;
    date: string;
    dueDate: string;
    items: PurchaseBillItem[];
    notes?: string;
    termsAndConditions?: string;
    shippingCharges: number;
    adjustment: number;
    total: number;
    status: 'Draft' | 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue';
}

export interface PurchaseReturnItem extends Omit<PurchaseBillItem, 'discount' | 'tax'> {}

export interface PurchaseReturn {
    id: string;
    returnNumber: string;
    vendorId: string;
    vendorName: string;
    date: string;
    items: PurchaseReturnItem[];
    total: number;
    status: 'Draft' | 'Completed';
}


// Inventory
export interface InventoryItem {
  id: string;
  itemType: 'Goods' | 'Service';
  name: string;
  sku: string;
  unit: string;
  isReturnable?: boolean;
  image?: string;

  // Sales Info
  trackSales: boolean;
  sellingPrice?: number;
  salesAccountId?: string;
  salesDescription?: string;

  // Purchase Info
  trackPurchases: boolean;
  costPrice?: number;
  purchaseAccountId?: string; // This will link to COGS or an expense account
  purchaseDescription?: string;
  preferredVendorId?: string;

  // Inventory Info
  trackInventory: boolean;
  inventoryAccountId?: string;
  openingStock?: number;
  openingStockRate?: number;
  inventoryValuationMethod?: 'FIFO';
  reorderPoint?: number;
  
  // More Fields
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: 'cm' | 'm' | 'in';
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb';
  manufacturer?: string;
  brand?: string;
  upc?: string;
  mpn?: string;
  ean?: string;
  isbn?: string;

  // For Item Groups
  itemGroupId?: string;
  itemGroupName?: string;
}

// Inventory Adjustment
export interface InventoryAdjustmentItem {
  id: string;
  inventoryItemId?: string;
  description: string;
  quantityAvailable: number;
  newQuantityOnHand: number;
  quantityAdjusted: number;
}

export interface InventoryAdjustment {
  id: string;
  mode: 'Quantity Adjustment' | 'Value Adjustment';
  referenceNumber: string;
  date: string;
  accountId: string;
  accountName: string;
  reason: string;
  description?: string;
  items: InventoryAdjustmentItem[];
  status: 'Draft' | 'Adjusted';
}


// Vouchers
export interface JournalVoucherEntry {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalVoucher {
  id: string;
  voucherNumber: string;
  date: string;
  narration: string;
  totalDebit: number;
  totalCredit: number;
  status: 'Draft' | 'Posted';
  entries: JournalVoucherEntry[];
}

export interface VoucherEntry {
    accountId: string;
    accountName: string;
    narration: string;
    amount: number;
}

export interface CashPaymentVoucher {
    id: string;
    voucherNumber: string;
    date: string;
    totalAmount: number;
    entries: VoucherEntry[];
}
export interface CashReceiptVoucher {
    id: string;
    voucherNumber: string;
    date: string;
    totalAmount: number;
    entries: VoucherEntry[];
}
export interface BankPaymentVoucher {
    id: string;
    voucherNumber: string;
    date: string;
    bankAccountId: string;
    bankAccountName: string;
    totalAmount: number;
    entries: VoucherEntry[];
}
export interface BankReceiptVoucher {
    id: string;
    voucherNumber: string;
    date: string;
    bankAccountId: string;
    bankAccountName: string;
    totalAmount: number;
    entries: VoucherEntry[];
}

// Payments
export interface CustomerPayment {
    id: string;
    paymentNumber: string;
    date: string;
    customerId: string;
    customerName: string;
    amount: number;
    paymentMethod: 'Cash' | 'Bank Transfer' | 'Credit Card';
    appliedInvoices: { invoiceId: string; amount: number }[];
}

export interface VendorPayment {
    id: string;
    paymentNumber: string;
    date: string;
    vendorId: string;
    vendorName: string;
    amount: number;
    paymentMethod: 'Cash' | 'Bank Transfer' | 'Credit Card';
    appliedBills: { billId: string; amount: number }[];
}


// Reports
export type ReportType = 
    | 'pnl' | 'balance-sheet' | 'trial-balance' | 'cash-flow'
    | 'sales-by-customer' | 'sales-by-item' | 'apar-summary'
    | 'gl-summary' | 'detailed-gl' | 'sales-purchases'
    | 'inventory-ledger' | 'placeholder';

export interface ReportInfo {
  id: ReportType;
  name: string;
  description: string;
  isFavorite?: boolean;
  lastVisited?: string;
}

export interface ReportCategoryInfo {
  name: string;
  reports: ReportInfo[];
}

export type SourceDocumentType = 
  | 'invoice' | 'bill' | 'customer_payment' | 'vendor_payment'
  | 'sales_return' | 'purchase_return' | 'journal_voucher'
  | 'cash_payment' | 'cash_receipt' | 'bank_payment' | 'bank_receipt';

export type DrilldownState = 
  | { type: 'summary', tab: ReportType }
  | { type: 'ledger', accountId: string }
  | { type: 'source', sourceType: SourceDocumentType, sourceId: string };

// Utility
export interface AllTransactions {
    invoices: Invoice[];
    bills: PurchaseBill[];
    journalVouchers: JournalVoucher[];
    customerPayments: CustomerPayment[];
    vendorPayments: VendorPayment[];
    salesReturns: SalesReturn[];
    purchaseReturns: PurchaseReturn[];
    cashPayments: CashPaymentVoucher[];
    cashReceipts: CashReceiptVoucher[];
    bankPayments: BankPaymentVoucher[];
    bankReceipts: BankReceiptVoucher[];
}

// Settings
export interface SettingsCategory {
    id: string;
    title: string;
    icon: LucideIcon;
}

export interface SettingsNavItem {
    id: string;
    label: string;
    path: string;
}

export interface SettingsNavCategory {
    id: string;
    label: string;
    items: SettingsNavItem[];
}