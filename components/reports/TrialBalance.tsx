import React, { useMemo } from 'react';
import { Account, DrilldownState, AllTransactions } from '../../types';

interface TrialBalanceProps extends AllTransactions {
    accounts: Account[];
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

interface TrialBalanceData {
    id: string;
    code: string;
    name: string;
    openingDr: number;
    openingCr: number;
    periodDr: number;
    periodCr: number;
    closingDr: number;
    closingCr: number;
}

const TrialBalance: React.FC<TrialBalanceProps> = ({ accounts, startDate, endDate, onDrilldown, ...transactions }) => {
    
    const trialBalanceData = useMemo(() => {
        const postableAccounts = accounts.filter(a => a.isPostingAccount);

        const data = postableAccounts.map(acc => {
            const isDebitNature = ['Asset', 'Expense'].includes(acc.type);
            let openingBalance = acc.openingBalance; // Simplified: considering this as balance before startDate
            
            let periodDr = 0;
            let periodCr = 0;

            // Journal Vouchers
            transactions.journalVouchers.forEach(jv => {
                if (jv.date >= startDate && jv.date <= endDate) {
                    jv.entries.forEach(entry => {
                        if (entry.accountId === acc.id) {
                            periodDr += entry.debit;
                            periodCr += entry.credit;
                        }
                    });
                }
            });
            
            // Sales & AR
            if (acc.accountType === 'Accounts Receivable') {
                 transactions.invoices.forEach(inv => {
                    if (inv.date >= startDate && inv.date <= endDate) periodDr += inv.total;
                });
                transactions.customerPayments.forEach(p => {
                    if (p.date >= startDate && p.date <= endDate) periodCr += p.amount;
                });
            }
             if (acc.accountType === 'Income' || acc.accountType === 'Other Income') {
                 transactions.invoices.forEach(inv => {
                    if (inv.date >= startDate && inv.date <= endDate) periodCr += inv.total;
                });
            }

            // Purchases & AP
            if (acc.accountType === 'Accounts Payable') {
                transactions.bills.forEach(bill => {
                    if(bill.date >= startDate && bill.date <= endDate) periodCr += bill.total;
                });
                transactions.vendorPayments.forEach(p => {
                    if (p.date >= startDate && p.date <= endDate) periodDr += p.amount;
                });
            }
            if(acc.accountType === 'Cost of Goods Sold' || acc.accountType === 'Expense') {
                transactions.bills.forEach(bill => {
                    if(bill.date >= startDate && bill.date <= endDate) periodDr += bill.total;
                });
            }
            
            // Cash & Bank transactions would also be processed here...

            let closingBalance = openingBalance;
            if (isDebitNature) {
                closingBalance += periodDr - periodCr;
            } else {
                closingBalance += periodCr - periodDr;
            }

            return {
                id: acc.id,
                code: acc.code,
                name: acc.name,
                openingDr: isDebitNature && openingBalance > 0 ? openingBalance : 0,
                openingCr: !isDebitNature && openingBalance > 0 ? openingBalance : 0,
                periodDr,
                periodCr,
                closingDr: isDebitNature && closingBalance > 0 ? closingBalance : 0,
                closingCr: !isDebitNature && closingBalance > 0 ? closingBalance : 0,
            };
        });
        
        return data.filter(d => d.openingDr || d.openingCr || d.periodDr || d.periodCr).sort((a,b) => a.code.localeCompare(b.code));

    }, [accounts, startDate, endDate, transactions]);

    const totals = useMemo(() => {
        return trialBalanceData.reduce((acc, item) => {
            acc.openingDr += item.openingDr;
            acc.openingCr += item.openingCr;
            acc.periodDr += item.periodDr;
            acc.periodCr += item.periodCr;
            acc.closingDr += item.closingDr;
            acc.closingCr += item.closingCr;
            return acc;
        }, { openingDr: 0, openingCr: 0, periodDr: 0, periodCr: 0, closingDr: 0, closingCr: 0 });
    }, [trialBalanceData]);
    
    const formatNumber = (num: number) => num === 0 ? '-' : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2 text-center">Trial Balance</h3>
            <p className="text-center text-sm text-gray-500 mb-6">For the period from {startDate} to {endDate}</p>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th rowSpan={2} className="py-3 px-4 text-left border-b border-r dark:border-gray-600">Account</th>
                            <th colSpan={2} className="py-3 px-4 text-center border-b border-r dark:border-gray-600">Opening Balance</th>
                            <th colSpan={2} className="py-3 px-4 text-center border-b border-r dark:border-gray-600">Period Transactions</th>
                            <th colSpan={2} className="py-3 px-4 text-center border-b dark:border-gray-600">Closing Balance</th>
                        </tr>
                        <tr>
                            <th className="py-3 px-4 text-right border-r dark:border-gray-600">Debit</th>
                            <th className="py-3 px-4 text-right border-r dark:border-gray-600">Credit</th>
                            <th className="py-3 px-4 text-right border-r dark:border-gray-600">Debit</th>
                            <th className="py-3 px-4 text-right border-r dark:border-gray-600">Credit</th>
                            <th className="py-3 px-4 text-right">Debit</th>
                            <th className="py-3 px-4 text-right">Credit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {trialBalanceData.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="py-2 px-4 whitespace-nowrap">
                                    <button onClick={() => onDrilldown({type: 'ledger', accountId: item.id})} className="hover:underline text-left w-full">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="block text-xs text-gray-500">{item.code}</span>
                                    </button>
                                </td>
                                <td className="py-2 px-4 text-right font-mono">{formatNumber(item.openingDr)}</td>
                                <td className="py-2 px-4 text-right font-mono border-r dark:border-gray-600">{formatNumber(item.openingCr)}</td>
                                <td className="py-2 px-4 text-right font-mono">{formatNumber(item.periodDr)}</td>
                                <td className="py-2 px-4 text-right font-mono border-r dark:border-gray-600">{formatNumber(item.periodCr)}</td>
                                <td className="py-2 px-4 text-right font-mono">{formatNumber(item.closingDr)}</td>
                                <td className="py-2 px-4 text-right font-mono">{formatNumber(item.closingCr)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="font-bold bg-gray-100 dark:bg-gray-800 border-t-2 dark:border-gray-500">
                        <tr>
                            <td className="py-3 px-4">Totals</td>
                            <td className="py-3 px-4 text-right font-mono">{formatNumber(totals.openingDr)}</td>
                            <td className="py-3 px-4 text-right font-mono border-r dark:border-gray-600">{formatNumber(totals.openingCr)}</td>
                            <td className="py-3 px-4 text-right font-mono">{formatNumber(totals.periodDr)}</td>
                            <td className="py-3 px-4 text-right font-mono border-r dark:border-gray-600">{formatNumber(totals.periodCr)}</td>
                            <td className="py-3 px-4 text-right font-mono">{formatNumber(totals.closingDr)}</td>
                            <td className="py-3 px-4 text-right font-mono">{formatNumber(totals.closingCr)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default TrialBalance;
