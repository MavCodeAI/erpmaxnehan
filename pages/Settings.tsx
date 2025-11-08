import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Account } from '../types';
import SettingsLayout from '../components/settings/SettingsLayout';
import SettingsHub from '../components/settings/SettingsHub';
import ProfilePage from '../components/settings/organization/ProfilePage';
import BrandingPage from '../components/settings/organization/BrandingPage';
import RolesPage from '../components/settings/users/RolesPage';
import TransactionNumbersPage from '../components/settings/customization/TransactionNumbersPage';
import EmailNotificationsPage from '../components/settings/customization/EmailNotificationsPage';
import OpeningBalancesPage from '../components/settings/setup/OpeningBalancesPage';

interface SettingsProps {
  accounts: Account[];
  onUpdateAccounts: (accounts: Account[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ accounts, onUpdateAccounts }) => {
  return (
    <Routes>
        <Route element={<SettingsLayout />}>
            <Route index element={<SettingsHub />} />
            <Route path="organization/profile" element={<ProfilePage />} />
            <Route path="organization/branding" element={<BrandingPage />} />
            <Route path="users-roles/roles" element={<RolesPage />} />
            <Route path="customization/transaction-numbers" element={<TransactionNumbersPage />} />
            <Route path="customization/email-notifications" element={<EmailNotificationsPage />} />
            <Route path="setup/opening-balances" element={<OpeningBalancesPage accounts={accounts} onSave={onUpdateAccounts} />} />
            <Route path="*" element={<Navigate to="/settings" replace />} />
        </Route>
    </Routes>
  );
};

export default Settings;