// FIX: Define all necessary constants and mock data for the application.
import { Home, BarChart2, DollarSign, ShoppingCart, BookUser, Users, Settings, Package, Repeat, ArrowRightLeft, Banknote, FileText, Boxes, ClipboardList } from 'lucide-react';
// FIX: Import Vendor type.
import { NavItem, Transaction, Account, ReportCategoryInfo, SettingsCategory, AccountType, Customer, Vendor, SettingsNavCategory } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { 
    label: 'Sales', 
    path: '/sales', 
    icon: DollarSign,
    subItems: [
      { label: 'Customers', path: '/sales/customers', icon: Users },
      { label: 'Invoices', path: '/sales/invoices', icon: FileText },
      { label: 'Sales Returns', path: '/sales/returns', icon: Repeat },
      { label: 'Customer Payments', path: '/payments', icon: Banknote },
    ]
  },
  { 
    label: 'Purchases', 
    path: '/purchases', 
    icon: ShoppingCart,
    subItems: [
      { label: 'Vendors', path: '/purchases/vendors', icon: Users },
      { label: 'Bills', path: '/purchases/bills', icon: FileText },
      { label: 'Purchase Returns', path: '/purchases/returns', icon: Repeat },
       { label: 'Vendor Payments', path: '/payments', icon: Banknote }, // This might be tricky if payments page handles both
    ]
  },
  { 
    label: 'Inventory', 
    path: '/inventory', 
    icon: Package,
    subItems: [
      { label: 'Items', path: '/inventory/items', icon: Package },
      { label: 'Item Groups', path: '/inventory/groups', icon: Boxes },
      { label: 'Inventory Adjustments', path: '/inventory/adjustments', icon: ClipboardList },
    ]
  },
  { 
    label: 'Accounting', 
    path: '/accounting', 
    icon: BookUser,
    subItems: [
        { label: 'Chart of Accounts', path: '/accounting/accounts', icon: BookUser },
        { label: 'Journal Vouchers', path: '/accounting/jv', icon: FileText },
    ]
  },
  {
    label: 'Cash & Bank',
    path: '/cash-and-bank',
    icon: Banknote,
    subItems: [
        { label: 'Cash Payments', path: '/cash-and-bank/cash-payments', icon: ArrowRightLeft },
        { label: 'Cash Receipts', path: '/cash-and-bank/cash-receipts', icon: ArrowRightLeft },
        { label: 'Bank Payments', path: '/cash-and-bank/bank-payments', icon: ArrowRightLeft },
        { label: 'Bank Receipts', path: '/cash-and-bank/bank-receipts', icon: ArrowRightLeft },
    ]
  },
  { label: 'Reports', path: '/reports', icon: BarChart2 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const MOCK_CHART_DATA = [
    { name: 'Jan', Sales: 4000, Purchases: 2400, Income: 2400, Expenses: 1000 },
    { name: 'Feb', Sales: 3000, Purchases: 1398, Income: 2210, Expenses: 900 },
    { name: 'Mar', Sales: 2000, Purchases: 9800, Income: 2290, Expenses: 1200 },
    { name: 'Apr', Sales: 2780, Purchases: 3908, Income: 2000, Expenses: 850 },
    { name: 'May', Sales: 1890, Purchases: 4800, Income: 2181, Expenses: 1100 },
    { name: 'Jun', Sales: 2390, Purchases: 3800, Income: 2500, Expenses: 950 },
    { name: 'Jul', Sales: 3490, Purchases: 4300, Income: 2100, Expenses: 1300 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', description: 'Sale - Invoice #INV-001', type: 'Sale', amount: 1500, status: 'Completed', date: '2023-10-25' },
    { id: '2', description: 'Purchase - Bill #BILL-001', type: 'Purchase', amount: 800, status: 'Completed', date: '2023-10-24' },
    { id: '3', description: 'Office Supplies', type: 'Expense', amount: 150, status: 'Completed', date: '2023-10-23' },
    { id: '4', description: 'Sale - Invoice #INV-002', type: 'Sale', amount: 2200, status: 'Pending', date: '2023-10-22' },
    { id: '5', description: 'Consulting Fee', type: 'Income', amount: 3000, status: 'Completed', date: '2023-10-21' },
    { id: '6', description: 'Sale - Invoice #INV-003', type: 'Sale', amount: 500, status: 'Cancelled', date: '2023-10-20' },
];

export const MOCK_CUSTOMERS: Customer[] = [
    { id: '1', customerType: 'Business', salutation: 'Mr.', firstName: 'Akber', lastName: 'Ali', companyName: 'AKBER ALI LHR', displayName: 'AKBER ALI LHR', email: 'akber.ali@example.com', workPhone: '923001234567', mobilePhone: '', currency: 'PKR', openingBalance: 2500, paymentTerms: 'Due on Receipt', billingAddress: { street: '123 Main St', city: 'Lahore', state: 'Punjab', zipCode: '54000', country: 'Pakistan' }, shippingAddress: { street: '123 Main St', city: 'Lahore', state: 'Punjab', zipCode: '54000', country: 'Pakistan' } },
    { id: '2', customerType: 'Individual', salutation: 'Mr.', firstName: 'Ali', lastName: 'Haider', companyName: '', displayName: 'ALI HAIDER DJK', email: 'ali.haider@example.com', workPhone: '923019876543', mobilePhone: '', currency: 'PKR', openingBalance: 11334, paymentTerms: 'Net 30', billingAddress: { street: '456 Gulberg', city: 'Daska', state: 'Punjab', zipCode: '51010', country: 'Pakistan' }, shippingAddress: { street: '456 Gulberg', city: 'Daska', state: 'Punjab', zipCode: '51010', country: 'Pakistan' } },
    { id: '3', customerType: 'Business', salutation: '', firstName: '', lastName: '', companyName: 'GENERAL DEBITORS', displayName: 'GENERAL DEBITORS', email: 'accounts@gendeb.com', workPhone: '92423555666', mobilePhone: '', currency: 'PKR', openingBalance: 38494, paymentTerms: 'Net 15', billingAddress: { street: '789 Industrial Area', city: 'Karachi', state: 'Sindh', zipCode: '74000', country: 'Pakistan' }, shippingAddress: { street: '789 Industrial Area', city: 'Karachi', state: 'Sindh', zipCode: '74000', country: 'Pakistan' } },
];

// FIX: Add mock vendors to be used in the application state.
export const MOCK_VENDORS: Vendor[] = [
    { 
        id: '1', salutation: 'Mr.', firstName: 'Zahid', lastName: 'Khan', companyName: 'Global Tech Supplies', displayName: 'Global Tech Supplies', email: 'sales@globaltech.com', workPhone: '922134567890', mobilePhone: '923001112222', currency: 'PKR', paymentTerms: 'Net 30', status: 'Active', openingBalance: 15000,
        billingAddress: { street: '101 Tech Park', city: 'Karachi', state: 'Sindh', zipCode: '74000', country: 'Pakistan', phone: '922134567890' },
        shippingAddress: { street: '101 Tech Park', city: 'Karachi', state: 'Sindh', zipCode: '74000', country: 'Pakistan', phone: '922134567890' },
        contactPersons: [{ id: 'cp1', salutation: 'Mr.', firstName: 'Zahid', lastName: 'Khan', email: 'zahid.khan@globaltech.com', workPhone: '922134567891', mobile: '923001112223', designation: 'Sales Manager', department: 'Sales' }]
    },
    { 
        id: '2', salutation: 'Ms.', firstName: 'Fatima', lastName: 'Bibi', companyName: 'Punjab Paper Mart', displayName: 'Punjab Paper Mart', email: 'info@punjabpaper.com', workPhone: '924238765432', mobilePhone: '', currency: 'PKR', paymentTerms: 'Due on Receipt', status: 'Active', openingBalance: 5250,
        billingAddress: { street: '22-B Paper Market, Shah Alam', city: 'Lahore', state: 'Punjab', zipCode: '54000', country: 'Pakistan' },
        shippingAddress: { street: 'Warehouse 7, Industrial Estate', city: 'Lahore', state: 'Punjab', zipCode: '54760', country: 'Pakistan' },
        contactPersons: []
    },
    { 
        id: '3', salutation: 'Mr.', firstName: 'Ahmed', lastName: 'Jamal', companyName: 'Creative Solutions Inc.', displayName: 'Creative Solutions Inc.', email: 'support@creativesol.com', workPhone: '925131234567', mobilePhone: '923339876543', currency: 'USD', paymentTerms: 'Net 60', status: 'Active', openingBalance: 0,
        billingAddress: { street: 'Suite 5, Blue Area', city: 'Islamabad', state: 'ICT', zipCode: '44000', country: 'Pakistan' },
        shippingAddress: { street: 'Suite 5, Blue Area', city: 'Islamabad', state: 'ICT', zipCode: '44000', country: 'Pakistan' },
        contactPersons: [
            { id: 'cp2', salutation: 'Mr.', firstName: 'Ahmed', lastName: 'Jamal', email: 'ahmed.j@creativesol.com', workPhone: '925131234567', mobile: '923339876543', designation: 'CEO', department: 'Management' },
            { id: 'cp3', salutation: 'Ms.', firstName: 'Aisha', lastName: 'Riaz', email: 'aisha.r@creativesol.com', workPhone: '925131234568', mobile: '923451234567', designation: 'Project Manager', department: 'Operations' }
        ]
    }
];

export const MOCK_ACCOUNTS: Account[] = [
    { id: '1', code: '1000', name: 'Assets', type: 'Asset', accountType: 'Other Asset', openingBalance: 150000, status: 'Active', isPostingAccount: false, isSystemAccount: true },
    { id: '2', code: '1010', name: 'Cash and Bank', type: 'Asset', accountType: 'Other Current Asset', openingBalance: 50000, status: 'Active', isPostingAccount: false, parentCode: '1000' },
    { id: '3', code: '1011', name: 'JAZZ CASH', type: 'Asset', accountType: 'Cash', openingBalance: 28466.00, status: 'Active', isPostingAccount: true, parentCode: '1010', isWatchlisted: false },
    { id: '4', code: '1012', name: 'MBL 9922', type: 'Asset', accountType: 'Bank', openingBalance: 45128.00, status: 'Active', isPostingAccount: true, parentCode: '1010', isWatchlisted: false },
    { id: '5', code: '1020', name: 'Accounts Receivable', type: 'Asset', accountType: 'Accounts Receivable', openingBalance: 144679.00, status: 'Active', isPostingAccount: true, parentCode: '1000', isSystemAccount: true, isWatchlisted: true },
    // FIX: Changed accountType from 'Other Liability' to a valid 'Other Current Liability'
    { id: '6', code: '2000', name: 'Liabilities', type: 'Liability', accountType: 'Other Current Liability', openingBalance: 40000, status: 'Active', isPostingAccount: false, isSystemAccount: true },
    { id: '7', code: '2010', name: 'Accounts Payable', type: 'Liability', accountType: 'Accounts Payable', openingBalance: 15000, status: 'Active', isPostingAccount: true, parentCode: '2000', isSystemAccount: true, isWatchlisted: true },
    { id: '8', code: '3000', name: 'Equity', type: 'Equity', accountType: 'Equity', openingBalance: 110000, status: 'Active', isPostingAccount: true, isSystemAccount: true },
    { id: '9', code: '4000', name: 'Revenue', type: 'Revenue', accountType: 'Income', openingBalance: 0, status: 'Active', isPostingAccount: false, isSystemAccount: true },
    { id: '10', code: '4010', name: 'Sales', type: 'Revenue', accountType: 'Income', openingBalance: 0, status: 'Active', isPostingAccount: true, parentCode: '4000' },
    { id: '11', code: '5000', name: 'Expenses', type: 'Expense', accountType: 'Expense', openingBalance: 0, status: 'Active', isPostingAccount: false, isSystemAccount: true },
    { id: '12', code: '5010', name: 'Cost of Goods Sold', type: 'Expense', accountType: 'Cost of Goods Sold', openingBalance: 0, status: 'Active', isPostingAccount: true, parentCode: '5000' },
    { id: '13', code: '5020', name: 'Office Supplies', type: 'Expense', accountType: 'Expense', openingBalance: 0, status: 'Active', isPostingAccount: true, parentCode: '5000' },
    { id: '14', code: '5030', name: 'Rent Expense', type: 'Expense', accountType: 'Expense', openingBalance: 0, status: 'Active', isPostingAccount: true, parentCode: '5000' },
];

export const ACCOUNT_TYPE_HIERARCHY: { main: Account['type']; subTypes: AccountType[] }[] = [
    { main: 'Asset', subTypes: ['Bank', 'Cash', 'Accounts Receivable', 'Inventory', 'Fixed Asset', 'Other Current Asset', 'Other Asset'] },
    { main: 'Liability', subTypes: ['Accounts Payable', 'Credit Card', 'Other Current Liability', 'Long Term Liability'] },
    { main: 'Equity', subTypes: ['Equity', 'Retained Earnings'] },
    { main: 'Revenue', subTypes: ['Income', 'Other Income'] },
    { main: 'Expense', subTypes: ['Cost of Goods Sold', 'Expense', 'Other Expense'] },
];

export const ACCOUNT_TYPE_DESCRIPTIONS: Record<AccountType, string> = {
    'Bank': 'Accounts for managing transactions with financial institutions.',
    'Cash': 'Represents physical cash on hand.',
    'Accounts Receivable': 'Money owed to your business by customers.',
    'Inventory': 'Tracks the value of goods available for sale.',
    'Fixed Asset': 'Long-term assets like buildings, machinery.',
    'Other Current Asset': 'Short-term assets not fitting other categories.',
    'Other Asset': 'Non-current assets not fitting other categories.',
    'Accounts Payable': 'Money your business owes to suppliers.',
    'Credit Card': 'Tracks balances on company credit cards.',
    'Other Current Liability': 'Short-term obligations due within a year.',
    'Long Term Liability': 'Obligations due after more than one year.',
    'Equity': 'Represents the owners\' stake in the company.',
    'Retained Earnings': 'Cumulative net earnings retained in the business.',
    'Income': 'Revenue from primary business activities.',
    'Other Income': 'Revenue from non-primary activities.',
    'Cost of Goods Sold': 'Direct costs of producing goods sold.',
    'Expense': 'Operating costs incurred to generate revenue.',
    'Other Expense': 'Expenses not related to primary operations.',
};

export const ALL_REPORTS_STRUCTURE: ReportCategoryInfo[] = [
    { name: 'Financial Statements', reports: [
        { id: 'pnl', name: 'Profit and Loss', description: 'Summarizes revenues, costs, and expenses during a specific period.', isFavorite: true },
        { id: 'balance-sheet', name: 'Balance Sheet', description: 'Shows the company\'s financial position at a specific point in time.', isFavorite: true },
        { id: 'cash-flow', name: 'Cash Flow Statement', description: 'Tracks the movement of cash from operating, investing, and financing activities.' },
    ]},
    { name: 'General Ledger', reports: [
        { id: 'trial-balance', name: 'Trial Balance', description: 'Lists all accounts and their balances to verify mathematical equality of debits and credits.' },
        { id: 'gl-summary', name: 'General Ledger Summary', description: 'Provides a summary of transactions for each account.' },
        { id: 'detailed-gl', name: 'Detailed General Ledger', description: 'Shows a detailed list of all transactions posted to each account.' },
    ]},
    { name: 'Sales & Receivables', reports: [
        { id: 'sales-by-customer', name: 'Sales by Customer', description: 'Summarizes sales revenue generated from each customer.', isFavorite: true },
        { id: 'sales-by-item', name: 'Sales by Item', description: 'Details the quantity and value of each item sold.' },
        { id: 'apar-summary', name: 'A/R & A/P Summary', description: 'Summarizes outstanding receivables and payables.' },
    ]},
    { name: 'Purchases & Payables', reports: [
        { id: 'sales-purchases', name: 'Sales & Purchases by Partner', description: 'Compare sales and purchases for each business partner.' },
        { id: 'placeholder', name: 'Purchases by Vendor', description: 'Detailed report of all purchases from each vendor.' },
    ]},
    { name: 'Inventory', reports: [
        { id: 'inventory-ledger', name: 'Inventory Ledger', description: 'Tracks the movement of stock for a selected item.' },
        { id: 'placeholder', name: 'Inventory Valuation Summary', description: 'Summarizes the value of your current stock on hand.' },
    ]}
];

export const SETTINGS_CATEGORIES: SettingsCategory[] = [
    { id: 'company-profile', title: 'Company Profile', icon: Home },
    { id: 'accounting-preferences', title: 'Accounting', icon: BookUser },
    { id: 'tax-settings', title: 'Taxes & Localization', icon: DollarSign },
    { id: 'banking-settings', title: 'Banking', icon: Banknote },
    { id: 'sales-settings', title: 'Sales & Invoicing', icon: DollarSign },
    { id: 'purchase-settings', title: 'Purchases & Expenses', icon: ShoppingCart },
    { id: 'automation-settings', title: 'Automation', icon: Repeat },
    { id: 'user-security', title: 'Users & Security', icon: Users },
    { id: 'reports-dashboard', title: 'Reports & Dashboard', icon: BarChart2 },
    { id: 'integrations-backup', title: 'Integrations & Backup', icon: Repeat },
    { id: 'notifications-communication', title: 'Notifications', icon: Settings },
    { id: 'interface-language', title: 'Interface & Language', icon: Settings },
];

export const SETTINGS_NAV_STRUCTURE: SettingsNavCategory[] = [
    {
        id: 'organization', label: 'Organization Settings',
        items: [
            { id: 'profile', label: 'Profile', path: '/settings/organization/profile' },
            { id: 'branding', label: 'Branding', path: '/settings/organization/branding' },
            // { id: 'subscription', label: 'Manage Subscription', path: '/settings/organization/subscription' },
        ],
    },
    {
        id: 'users-roles', label: 'Users & Roles',
        items: [
            // { id: 'users', label: 'Users', path: '/settings/users-roles/users' },
            { id: 'roles', label: 'Roles', path: '/settings/users-roles/roles' },
        ],
    },
    {
        id: 'taxes-compliance', label: 'Taxes & Compliance',
        items: [
            // { id: 'taxes', label: 'Taxes', path: '/settings/taxes-compliance/taxes' },
        ],
    },
    {
        id: 'setup-configs', label: 'Setup & Configurations',
        items: [
            // { id: 'general', label: 'General', path: '/settings/setup/general' },
            // { id: 'currencies', label: 'Currencies', path: '/settings/setup/currencies' },
            { id: 'opening-balances', label: 'Opening Balances', path: '/settings/setup/opening-balances' },
            // { id: 'reminders', label: 'Reminders', path: '/settings/setup/reminders' },
        ],
    },
    {
        id: 'customization', label: 'Customization',
        items: [
            { id: 'transaction-numbers', label: 'Transaction Number Series', path: '/settings/customization/transaction-numbers' },
            // { id: 'pdf-templates', label: 'PDF Templates', path: '/settings/customization/pdf-templates' },
            { id: 'email-notifications', label: 'Email Notifications', path: '/settings/customization/email-notifications' },
        ],
    },
];