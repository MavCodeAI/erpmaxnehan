import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Account, AccountType } from '../../types';
import { ACCOUNT_TYPE_HIERARCHY, ACCOUNT_TYPE_DESCRIPTIONS } from '../../constants';
import { HelpCircle } from 'lucide-react';

interface AddEditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => void;
  account: Account | null;
  accounts: Account[];
}

const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
const requiredLabelClasses = "block text-sm font-medium text-red-600 dark:text-red-400";
const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
const disabledInputClasses = `${inputClasses} bg-gray-200 dark:bg-gray-800 cursor-not-allowed`;


const generateNextAccountCode = (parentCode: string | null, accountType: AccountType, allAccounts: Account[]): string => {
    if (parentCode) {
        const siblings = allAccounts.filter(a => a.parentCode === parentCode);
        if (siblings.length === 0) {
            return `${parentCode}-1`; // Simple child code
        }
        const maxSiblingSuffix = Math.max(...siblings.map(s => {
            const parts = s.code.split('-');
            return parseInt(parts[parts.length - 1], 10) || 0;
        }));
        return `${parentCode}-${maxSiblingSuffix + 1}`;
    }

    const relevantAccounts = allAccounts.filter(a => a.accountType === accountType && !a.parentCode);
    if (relevantAccounts.length === 0) {
        // Fix: Corrected the type of baseCodeMap to use Account['type'] as the key and updated 'Income' to 'Revenue' to match the type definition.
        const baseCodeMap: Partial<Record<Account['type'], number>> = { 'Equity': 3000, 'Revenue': 4000, 'Expense': 5000, 'Asset': 1000, 'Liability': 2000 };
        const mainType = ACCOUNT_TYPE_HIERARCHY.find(g => g.subTypes.includes(accountType))?.main;
        const base = mainType ? (baseCodeMap[mainType] || 9000) : 9000;
        return (base).toString();
    }
    const maxCode = Math.max(...relevantAccounts.map(a => parseInt(a.code, 10)));
    return (maxCode + 10).toString();
};

const AddEditAccountModal: React.FC<AddEditAccountModalProps> = ({ isOpen, onClose, onSave, account, accounts }) => {
    
    const [accountType, setAccountType] = useState<AccountType | ''>('');
    const [accountName, setAccountName] = useState('');
    const [accountCode, setAccountCode] = useState('');
    const [description, setDescription] = useState('');
    const [isSubAccount, setIsSubAccount] = useState(false);
    const [parentCode, setParentCode] = useState('');
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
    
    const isEditMode = !!account;
    
    const currentAccountTypeDescription = accountType ? ACCOUNT_TYPE_DESCRIPTIONS[accountType] : null;

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && account) {
                setAccountType(account.accountType);
                setAccountName(account.name);
                setAccountCode(account.code);
                setDescription(account.description || '');
                setIsSubAccount(!!account.parentCode);
                setParentCode(account.parentCode || '');
                setIsWatchlisted(account.isWatchlisted || false);
                setStatus(account.status);
            } else {
                // Reset for new account
                setAccountType('');
                setAccountName('');
                setAccountCode('');
                setDescription('');
                setIsSubAccount(false);
                setParentCode('');
                setIsWatchlisted(false);
                setStatus('Active');
            }
        }
    }, [account, isEditMode, isOpen]);

    useEffect(() => {
        if (!isSubAccount) {
            setParentCode('');
        }
    }, [isSubAccount]);
    
    useEffect(() => {
        if (!isEditMode && accountType) {
            const newCode = generateNextAccountCode(isSubAccount ? parentCode : null, accountType, accounts);
            setAccountCode(newCode);
        }
    }, [accountType, isSubAccount, parentCode, isEditMode, accounts]);

    const potentialParents = useMemo(() => {
        if (!accountType) return [];
        const mainType = ACCOUNT_TYPE_HIERARCHY.find(g => g.subTypes.includes(accountType))?.main;
        return accounts.filter(acc => 
            acc.type === mainType && 
            acc.status === 'Active' && 
            !acc.isSystemAccount &&
            acc.id !== account?.id // Cannot be its own parent
        );
    }, [accountType, accounts, account]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountType || !accountName || (isSubAccount && !parentCode)) return;

        const mainType = ACCOUNT_TYPE_HIERARCHY.find(g => g.subTypes.includes(accountType))?.main;
        if (!mainType) return;

        const parent = isSubAccount ? accounts.find(a => a.code === parentCode) : undefined;

        const finalAccountCode = isEditMode ? accountCode : generateNextAccountCode(isSubAccount ? parentCode : null, accountType, accounts);

        const accountToSave: Account = {
            id: account?.id || new Date().getTime().toString(),
            code: finalAccountCode,
            name: accountName,
            type: mainType,
            accountType: accountType,
            openingBalance: isEditMode ? account.openingBalance : 0,
            status: status,
            isPostingAccount: !isEditMode ? true : account.isPostingAccount, // New accounts are posting accounts by default
            description: description,
            parentCode: isSubAccount ? parentCode : undefined,
            parentName: isSubAccount ? parent?.name : undefined,
            isWatchlisted: isWatchlisted,
        };
        
        onSave(accountToSave);
        onClose();
    };
    
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Account' : 'Create Account'} size="2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <label htmlFor="accountType" className={requiredLabelClasses}>Account Type*</label>
                <select id="accountType" value={accountType} onChange={e => setAccountType(e.target.value as AccountType)} required className={inputClasses} disabled={isEditMode}>
                    <option value="" disabled>Select an account type</option>
                    {ACCOUNT_TYPE_HIERARCHY.map(group => (
                        <optgroup label={group.main} key={group.main}>
                            {group.subTypes.map(subType => <option key={subType} value={subType}>{subType}</option>)}
                        </optgroup>
                    ))}
                </select>
                {currentAccountTypeDescription && (
                    <div className="absolute left-full top-8 ml-4 w-64 p-3 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-100 transition-opacity z-10">
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-800"></div>
                        <p className="font-bold">{accountType}</p>
                        <p>{currentAccountTypeDescription}</p>
                    </div>
                )}
            </div>
          
            <div>
                <label htmlFor="accountName" className={requiredLabelClasses}>Account Name*</label>
                <input id="accountName" type="text" value={accountName} onChange={e => setAccountName(e.target.value)} required className={inputClasses}/>
            </div>

            <div className="flex items-center space-x-2 group relative">
                <input id="isSubAccount" type="checkbox" checked={isSubAccount} onChange={(e) => setIsSubAccount(e.target.checked)} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                <label htmlFor="isSubAccount" className={labelClasses}>Make this a sub-account</label>
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <div className="absolute left-48 -top-8 w-64 p-2 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    A sub-account helps you group and organize similar accounts under a single parent account for reporting.
                </div>
            </div>

            {isSubAccount && (
                 <div>
                    <label htmlFor="parentCode" className={requiredLabelClasses}>Parent Account*</label>
                    <select id="parentCode" value={parentCode} onChange={e => setParentCode(e.target.value)} required={isSubAccount} className={inputClasses}>
                        <option value="">Select an account</option>
                        {potentialParents.map(p => (
                            <option key={p.id} value={p.code}>{p.name}</option>
                        ))}
                    </select>
                </div>
            )}
          
            <div>
              <label htmlFor="accountCode" className={labelClasses}>Account Code</label>
              <input id="accountCode" type="text" value={accountCode} readOnly className={disabledInputClasses}/>
            </div>
          
           <div>
              <label htmlFor="description" className={labelClasses}>Description</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} maxLength={500} placeholder="Max. 500 characters" className={inputClasses}></textarea>
          </div>

          <div className="flex items-center space-x-2">
            <input id="isWatchlisted" type="checkbox" checked={isWatchlisted} onChange={(e) => setIsWatchlisted(e.target.checked)} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label htmlFor="isWatchlisted" className={labelClasses}>Add to the watchlist on my dashboard</label>
          </div>

        <div className="flex justify-end pt-5 space-x-3 border-t dark:border-gray-700 mt-5">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditAccountModal;