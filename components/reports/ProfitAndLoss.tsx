
import React, { useMemo } from 'react';
import { Account, DrilldownState, Invoice, PurchaseBill } from '../../types';

interface ProfitAndLossProps {
    accounts: Account[];
    invoices: Invoice[];
    bills: PurchaseBill[];
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

type AccountWithLevel = Account & { level: number };

const ProfitAndLoss: React.FC<ProfitAndLossProps> = ({ accounts, invoices, bills, startDate, endDate, onDrilldown }) => {
    const accountsWithLevel = useMemo(() => {
        const accountsMap = new Map<string, AccountWithLevel>(accounts.map(acc => [acc.code, { ...acc, level: 0 }]));

        for (const account of accountsMap.values()) {
            if (!account.parentCode) {
                account.level = 1;
            }
        }

        let changed = true;
        let iterations = 0; 
        while (changed && iterations < 10) {
            changed = false;
            iterations++;
            for (const account of accountsMap.values()) {
                if (account.level === 0 && account.parentCode) {
                    const parent = accountsMap.get(account.parentCode);
                    if (parent && parent.level > 0) {
                        account.level = parent.level + 1;
                        changed = true;
                    }
                }
            }
        }
        
        for (const account of accountsMap.values()) {
            if (account.level === 0) {
                account.level = 1;
            }
        }

        return Array.from(accountsMap.values());
    }, [accounts]);


    const calculateTotal = (accountType: Account['type']) => {
        if (accountType === 'Revenue') {
            return invoices
                .filter(inv => inv.date >= startDate && inv.date <= endDate)
                .reduce((sum, inv) => sum + inv.total, 0);
        }
        if (accountType === 'Expense') {
            const cogs = bills
                .filter(b => b.date >= startDate && b.date <= endDate)
                .reduce((sum, b) => sum + b.total * 0.6, 0); 
            const otherExpenses = 1950;
            return cogs + otherExpenses;
        }
        return 0;
    };

    const revenueAccounts = accountsWithLevel.filter(a => a.type === 'Revenue');
    const expenseAccounts = accountsWithLevel.filter(a => a.type === 'Expense');
    
    const totalRevenue = calculateTotal('Revenue');
    const totalExpense = calculateTotal('Expense');
    const netProfit = totalRevenue - totalExpense;

    const renderAccountRow = (account: Account & { level: number }) => {
        const amount = account.name.includes('Sales') ? totalRevenue : (account.name.includes('Cost of Goods') ? totalExpense * 0.7 : totalExpense * 0.3);
        
        return (
            <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td style={{ paddingLeft: `${account.level * 1.5}rem` }} className="py-2 px-4">
                    <button onClick={() => onDrilldown({type: 'ledger', accountId: account.id})} className="hover:underline text-left w-full">
                        {account.name}
                    </button>
                </td>
                <td className="py-2 px-4 text-right">{account.isPostingAccount ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) : ''}</td>
            </tr>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2 text-center">Profit and Loss Statement</h3>
            <p className="text-center text-sm text-gray-500 mb-6">For the period from {startDate} to {endDate}</p>

            <table className="w-full text-sm">
                <tbody className="divide-y dark:divide-gray-700">
                    {/* Revenue */}
                    <tr className="font-bold bg-gray-50 dark:bg-gray-700/50"><td colSpan={2} className="py-2 px-4">Revenue</td></tr>
                    {revenueAccounts.filter(a => !a.parentCode).map(renderAccountRow)}
                    <tr className="font-semibold border-t-2 dark:border-gray-600">
                        <td className="py-2 px-4">Total Revenue</td>
                        <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalRevenue)}</td>
                    </tr>
                    
                    <tr><td colSpan={2} className="py-2">&nbsp;</td></tr>

                    {/* Expenses */}
                    <tr className="font-bold bg-gray-50 dark:bg-gray-700/50"><td colSpan={2} className="py-2 px-4">Expenses</td></tr>
                    {expenseAccounts.filter(a => !a.parentCode).map(renderAccountRow)}
                     <tr className="font-semibold border-t-2 dark:border-gray-600">
                        <td className="py-2 px-4">Total Expenses</td>
                        <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalExpense)}</td>
                    </tr>
                </tbody>
                <tfoot>
                     <tr className="font-bold text-lg bg-gray-100 dark:bg-gray-800 border-t-4 dark:border-gray-600">
                         <td className="py-3 px-4">Net Profit</td>
                         <td className="py-3 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(netProfit)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ProfitAndLoss;
