import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  // Generate breadcrumbs from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Map of route segments to readable names
    const routeNames: Record<string, string> = {
      dashboard: 'Dashboard',
      sales: 'Sales',
      purchases: 'Purchases',
      inventory: 'Inventory',
      accounting: 'Accounting',
      'cash-and-bank': 'Cash & Bank',
      reports: 'Reports',
      settings: 'Settings',
      invoices: 'Invoices',
      customers: 'Customers',
      vendors: 'Vendors',
      bills: 'Bills',
      returns: 'Returns',
      items: 'Items',
      groups: 'Item Groups',
      adjustments: 'Adjustments',
      accounts: 'Chart of Accounts',
      jv: 'Journal Vouchers',
      payments: 'Payments',
      'cash-payments': 'Cash Payments',
      'cash-receipts': 'Cash Receipts',
      'bank-payments': 'Bank Payments',
      'bank-receipts': 'Bank Receipts',
      organization: 'Organization',
      profile: 'Profile',
      branding: 'Branding',
      'users-roles': 'Users & Roles',
      roles: 'Roles',
      customization: 'Customization',
      'transaction-numbers': 'Transaction Numbers',
      'email-notifications': 'Email Notifications',
      setup: 'Setup',
      'opening-balances': 'Opening Balances',
      new: 'New',
    };

    let currentPath = '';
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip IDs (numeric segments)
      if (!isNaN(Number(segment))) {
        return;
      }

      breadcrumbs.push({
        label: routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home/dashboard
  if (breadcrumbs.length === 0 || location.pathname === '/' || location.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={crumb.path}>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            {isLast ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
