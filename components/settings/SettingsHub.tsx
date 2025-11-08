import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, SlidersHorizontal, Palette, Settings2, FileCog, Bell, FileKey, CreditCard, ShoppingCart, FileText, Package } from 'lucide-react';

const settingsMap = {
    'Organization': [
        { name: 'Profile', path: '/settings/organization/profile', icon: Building },
        { name: 'Branding', path: '/settings/organization/branding', icon: Palette },
        { name: 'Users & Roles', path: '/settings/users-roles/roles', icon: Users },
    ],
    'Setup & Configurations': [
        { name: 'Opening Balances', path: '/settings/setup/opening-balances', icon: SlidersHorizontal },
    ],
    'Customization': [
        { name: 'Transaction Numbers', path: '/settings/customization/transaction-numbers', icon: FileCog },
        { name: 'Email Notifications', path: '/settings/customization/email-notifications', icon: Bell },
    ],
    'Module Settings': [
        { name: 'General', path: '#', icon: Settings2 },
        { name: 'Customers and Vendors', path: '#', icon: Users },
        { name: 'Items', path: '/inventory', icon: Package },
        { name: 'Accountant', path: '/accounting/accounts', icon: FileKey },
        { name: 'Online Payments', path: '#', icon: CreditCard },
        { name: 'Sales', path: '#', icon: FileText },
        { name: 'Purchases', path: '#', icon: ShoppingCart },
    ]
};

const SettingsCard: React.FC<{ title: string; items: { name: string; path: string; icon: React.ElementType }[] }> = ({ title, items }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(({ name, path, icon: Icon }) => (
                <Link key={name} to={path} className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Icon className="w-5 h-5 mr-3 text-primary-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
                </Link>
            ))}
        </div>
    </div>
);


const SettingsHub: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">All Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your ERPMAX settings and preferences.</p>

            <div className="space-y-8">
                <SettingsCard title="Organization Settings" items={settingsMap['Organization']} />
                <SettingsCard title="Setup & Configurations" items={settingsMap['Setup & Configurations']} />
                <SettingsCard title="Customization" items={settingsMap['Customization']} />
                <SettingsCard title="Module Settings" items={settingsMap['Module Settings']} />
            </div>
        </div>
    );
};

export default SettingsHub;
