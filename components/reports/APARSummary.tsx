
import React, { useMemo } from 'react';
import { Account, DrilldownState, AllTransactions } from '../../types';
import { getAccountBalance } from '../../utils/calculations';

interface APARSummaryProps extends AllTransactions {
    accounts: Account[];
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

// Fix: Remove the ...transactions spread from props destructuring to avoid type inference issues.
const APARSummary: React.FC<APARSummaryProps> = (props) => {
    const { accounts, startDate, endDate, onDrilldown } = props;

    const { receivableAccounts, payableAccounts } = useMemo(() => {
        const arAccounts = accounts
            .filter(a => a.accountType === 'Accounts Receivable')
            // Fix: Pass the entire props object, which conforms to AllTransactions.
            .map(acc => ({...acc, balance: getAccountBalance(acc.id, accounts, props, endDate)}));
            
        const apAccounts = accounts
            .filter(a => a.accountType === 'Accounts Payable')
            // Fix: Pass the entire props object, which conforms to AllTransactions.
            .map(acc => ({...acc, balance: getAccountBalance(acc.id, accounts, props, endDate)}));
        
        return { receivableAccounts: arAccounts, payableAccounts: apAccounts };
    }, [accounts, props, endDate]);
    
    const totalReceivables = receivableAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalPayables = payableAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
         <div>
            <h3 className="text-xl font-semibold mb-2 text-center">Accounts Receivable & Payable Summary</h3>
            <p className="text-center text-sm text-gray-500 mb-6">As of {endDate}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-semibold mb-3">Accounts Receivable</h4>
                    <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                        <table className="w-full text-sm">
                             <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="py-2 px-4 text-left font-semibold">Account</th>
                                    <th className="py-2 px-4 text-right font-semibold">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-600">
                                {receivableAccounts.map(acc => (
                                    <tr key={acc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-2 px-4">
                                             <button onClick={() => onDrilldown({type: 'ledger', accountId: acc.id})} className="hover:underline">
                                                {acc.name}
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(acc.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                             <tfoot className="bg-gray-100 dark:bg-gray-800 font-bold border-t-2 dark:border-gray-600">
                                <tr>
                                    <td className="py-2 px-4">Total Receivables</td>
                                    <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalReceivables)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                 <div>
                    <h4 className="text-lg font-semibold mb-3">Accounts Payable</h4>
                    <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                         <table className="w-full text-sm">
                             <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="py-2 px-4 text-left font-semibold">Account</th>
                                    <th className="py-2 px-4 text-right font-semibold">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-600">
                                {payableAccounts.map(acc => (
                                    <tr key={acc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-2 px-4">
                                            <button onClick={() => onDrilldown({type: 'ledger', accountId: acc.id})} className="hover:underline">
                                                {acc.name}
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(acc.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-100 dark:bg-gray-800 font-bold border-t-2 dark:border-gray-600">
                                <tr>
                                    <td className="py-2 px-4">Total Payables</td>
                                    <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalPayables)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APARSummary;
