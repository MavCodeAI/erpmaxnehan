
import React from 'react';
import { Account, DrilldownState } from '../../types';

interface BalanceSheetProps {
    accounts: Account[];
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({ accounts, startDate, endDate, onDrilldown }) => {

    const renderAccountRows = (accountType: Account['type']) => {
        // Fix: Update the return type of buildHierarchy to include the 'level' property.
        const buildHierarchy = (parentId: string | null = null, level = 1): (Account & { level: number })[] => {
            return accounts
                .filter(a => a.type === accountType && (parentId === null ? !a.parentCode : a.parentCode === parentId))
                .sort((a,b) => a.code.localeCompare(b.code))
                .flatMap(account => [
                    {...account, level},
                    ...buildHierarchy(account.code, level + 1)
                ]);
        };

        const hierarchicalAccounts = buildHierarchy();

        return hierarchicalAccounts.map(account => (
             <tr key={account.id} className={`${!account.isPostingAccount ? 'font-semibold' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
                <td style={{ paddingLeft: `${account.level * 1.2}rem` }} className="py-2 px-4">
                    <button onClick={() => onDrilldown({type: 'ledger', accountId: account.id})} className="hover:underline text-left w-full">
                        {account.name}
                    </button>
                </td>
                <td className="py-2 px-4 text-right">
                    {account.isPostingAccount 
                        ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(account.openingBalance)
                        : ''
                    }
                </td>
            </tr>
        ));
    };
    
    const totalAssets = accounts.filter(a => a.type === 'Asset' && a.isPostingAccount).reduce((sum, acc) => sum + acc.openingBalance, 0);
    const totalLiabilities = accounts.filter(a => a.type === 'Liability' && a.isPostingAccount).reduce((sum, acc) => sum + acc.openingBalance, 0);
    const totalEquity = accounts.filter(a => a.type === 'Equity' && a.isPostingAccount).reduce((sum, acc) => sum + acc.openingBalance, 0);
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2 text-center">Balance Sheet</h3>
            <p className="text-center text-sm text-gray-500 mb-6">As of {endDate}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-semibold mb-2 border-b-2 pb-1 dark:border-gray-600">Assets</h4>
                    <table className="w-full text-sm">
                        <tbody>
                            {renderAccountRows('Asset')}
                        </tbody>
                        <tfoot>
                             <tr className="font-bold text-base bg-gray-100 dark:bg-gray-800 border-t-2 dark:border-gray-600">
                                <td className="py-3 px-4">Total Assets</td>
                                <td className="py-3 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalAssets)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-2 border-b-2 pb-1 dark:border-gray-600">Liabilities</h4>
                     <table className="w-full text-sm">
                        <tbody>
                            {renderAccountRows('Liability')}
                        </tbody>
                         <tfoot>
                             <tr className="font-semibold bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-600">
                                <td className="py-2 px-4">Total Liabilities</td>
                                <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalLiabilities)}</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <h4 className="text-lg font-semibold mt-6 mb-2 border-b-2 pb-1 dark:border-gray-600">Equity</h4>
                     <table className="w-full text-sm">
                        <tbody>
                            {renderAccountRows('Equity')}
                        </tbody>
                        <tfoot>
                             <tr className="font-semibold bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-600">
                                <td className="py-2 px-4">Total Equity</td>
                                <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalEquity)}</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                     <table className="w-full text-sm mt-4">
                        <tfoot>
                             <tr className="font-bold text-base bg-gray-100 dark:bg-gray-800 border-t-2 dark:border-gray-600">
                                <td className="py-3 px-4">Total Liabilities & Equity</td>
                                <td className="py-3 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalLiabilitiesAndEquity)}</td>
                            </tr>
                        </tfoot>
                    </table>

                </div>
            </div>
        </div>
    );
};

export default BalanceSheet;
