import React, { useState, useMemo } from 'react';
import Button from '../components/ui/Button';
import { Account } from '../types';
import { showToast } from '../utils/toast';
import { PlusCircle, MoreHorizontal, ChevronDown, Lock, Settings, Trash2, Edit, FileDown, EyeOff, Eye, DollarSign, TrendingUp, Layers } from 'lucide-react';
import Card from '../components/ui/Card';
import AddEditAccountModal from '../components/accounts/AddEditAccountModal';
import Dropdown from '../components/ui/Dropdown';
import { MOCK_ACCOUNTS } from '../constants';

type AccountNode = Account & { children: AccountNode[]; level: number };

const AccountRow: React.FC<{ 
    account: AccountNode, 
    onEdit: (acc: Account) => void, 
    onDelete: (id: string) => void,
    onToggleStatus: (acc: Account) => void 
}> = ({ account, onEdit, onDelete, onToggleStatus }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <>
            <div className={`flex items-center border-t dark:border-gray-700 py-3 px-4 group ${account.status === 'Inactive' ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                <div className="w-2/5 flex items-center" style={{ paddingLeft: `${account.level * 20}px` }}>
                    {account.children.length > 0 ? (
                        <ChevronDown className={`w-4 h-4 mr-2 cursor-pointer transition-transform ${isExpanded ? 'rotate-180' : ''}`} onClick={() => setIsExpanded(!isExpanded)} />
                    ) : <div className="w-4 h-4 mr-2"></div>}
                    {account.isSystemAccount && <Lock className="w-3 h-3 text-gray-500 mr-2 flex-shrink-0" />}
                    <span className="font-medium text-gray-800 dark:text-gray-200">{account.name}</span>
                </div>
                <div className="w-1/6 text-gray-600 dark:text-gray-400">{account.code}</div>
                <div className="w-1/4 text-gray-600 dark:text-gray-400">{account.accountType}</div>
                <div className="w-1/6 text-right pr-4 text-gray-600 dark:text-gray-400">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(account.openingBalance)}</div>
                <div className="w-[5%] text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    {!account.isSystemAccount && (
                        <Dropdown
                            button={<Button size="sm" variant="secondary"><Settings className="w-4 h-4" /></Button>}
                            items={[
                                { label: 'Edit', icon: Edit, onClick: () => onEdit(account) },
                                { label: account.status === 'Active' ? 'Mark as Inactive' : 'Mark as Active', icon: account.status === 'Active' ? EyeOff : Eye, onClick: () => onToggleStatus(account) },
                                { label: 'Delete', icon: Trash2, onClick: () => onDelete(account.id) },
                            ]}
                        />
                    )}
                </div>
            </div>
            {isExpanded && account.children.map(child => (
                <AccountRow key={child.id} account={child} onEdit={onEdit} onDelete={onDelete} onToggleStatus={onToggleStatus} />
            ))}
        </>
    );
};

const Accounts: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSaveAccount = (account: Account) => {
        setAccounts(prev => {
            let newAccounts = [...prev];
            const index = newAccounts.findIndex(a => a.id === account.id);
            if (index > -1) {
                newAccounts[index] = account;
            } else {
                newAccounts.push(account);
            }
            
            // If this is a sub-account, ensure its parent is marked as a non-posting account
            if (account.parentCode) {
                const parentIndex = newAccounts.findIndex(a => a.code === account.parentCode);
                if (parentIndex > -1 && newAccounts[parentIndex].isPostingAccount) {
                    newAccounts[parentIndex] = { ...newAccounts[parentIndex], isPostingAccount: false };
                }
            }

            return newAccounts;
        });
    };

    const handleDeleteAccount = (accountId: string) => {
        // Basic check: Don't delete if it's a parent
        if (accounts.some(a => a.parentCode === accounts.find(acc => acc.id === accountId)?.code)) {
            showToast.error("Cannot delete an account that has sub-accounts.");
            return;
        }
        setAccounts(prev => prev.filter(a => a.id !== accountId));
    };

    const handleToggleStatus = (account: Account) => {
        const newStatus = account.status === 'Active' ? 'Inactive' : 'Active';
        handleSaveAccount({ ...account, status: newStatus });
    };

    const openModalForNew = () => {
        setEditingAccount(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (account: Account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const stats = useMemo(() => {
        const totalAccounts = accounts.length;
        const activeAccounts = accounts.filter(a => a.status === 'Active').length;
        const totalAssets = accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.openingBalance, 0);
        const totalLiabilities = accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.openingBalance, 0);
        return { totalAccounts, activeAccounts, totalAssets, totalLiabilities };
    }, [accounts]);

    const accountTree = useMemo(() => {
        let filteredAccounts = accounts;
        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            const matchedAccountIds = new Set<string>();
            const accountsMap = new Map(accounts.map(acc => [acc.id, acc]));

            accounts.forEach(account => {
                if (account.name.toLowerCase().includes(lowercasedFilter) || account.code.includes(lowercasedFilter)) {
                    matchedAccountIds.add(account.id);
                    // Add all ancestors
                    let current = account;
                    while (current.parentCode) {
                        const parent = accounts.find(a => a.code === current.parentCode);
                        if (parent) {
                            matchedAccountIds.add(parent.id);
                            current = parent;
                        } else {
                            break;
                        }
                    }
                }
            });
            filteredAccounts = accounts.filter(acc => matchedAccountIds.has(acc.id));
        }

        const buildTree = (items: Account[], parentCode: string | null = null, level = 0): AccountNode[] => {
            return items
                .filter(item => (item.parentCode || null) === parentCode)
                .map(item => ({
                    ...item,
                    level,
                    children: buildTree(items, item.code, level + 1)
                }));
        };
        
        const tree = buildTree(filteredAccounts, null, 0);
        
        // This is a simplified top-level grouping. A more robust solution would use parent accounts for grouping.
        const mainGroups: { [key in Account['type']]: AccountNode[] } = {
            Asset: [],
            Liability: [],
            Equity: [],
            Revenue: [],
            Expense: [],
        };

        tree.forEach(node => {
            if (mainGroups[node.type]) {
                mainGroups[node.type].push(node);
            }
        });
        
        return mainGroups;
    }, [accounts, searchTerm]);

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                        <Layers className="w-8 h-8 mr-3 text-blue-500" />
                        Chart of Accounts
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your accounting structure and track balances</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="secondary" icon={FileDown}>Export</Button>
                    <Button variant="primary" icon={PlusCircle} onClick={openModalForNew}>New Account</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Accounts</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalAccounts}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Layers className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Accounts</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.activeAccounts}</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Assets</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(stats.totalAssets)}</p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Liabilities</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(stats.totalLiabilities)}</p>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <DollarSign className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mb-4">
                <input type="text" placeholder="Search by name or code..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            
            <Card className="p-0">
                <div className="flex items-center border-b dark:border-gray-700 py-3 px-4 bg-gray-50 dark:bg-gray-900/50 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    <div className="w-2/5">ACCOUNT NAME</div>
                    <div className="w-1/6">ACCOUNT CODE</div>
                    <div className="w-1/4">ACCOUNT TYPE</div>
                    <div className="w-1/6 text-right pr-4">BALANCE</div>
                    <div className="w-[5%]"></div>
                </div>
                <div className="w-full">
                    {/* FIX: Use Object.keys() to iterate over accountTree to avoid type inference issues with Object.entries(). */}
                    {Object.keys(accountTree).map((groupName) => {
                        const nodes = accountTree[groupName as keyof typeof accountTree];
                        return (nodes.length > 0 || searchTerm) && (
                            <div key={groupName}>
                                <div className="py-2 px-4 bg-gray-100 dark:bg-gray-800 font-bold text-base">{groupName}</div>
                                {nodes.map(node => (
                                    <AccountRow key={node.id} account={node} onEdit={openModalForEdit} onDelete={handleDeleteAccount} onToggleStatus={handleToggleStatus} />
                                ))}
                            </div>
                        )
                    })}
                </div>
            </Card>
            
            {isModalOpen && (
                <AddEditAccountModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAccount}
                    account={editingAccount}
                    accounts={accounts}
                />
            )}
        </>
    );
};

export default Accounts;