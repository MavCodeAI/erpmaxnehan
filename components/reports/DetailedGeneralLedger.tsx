
import React, { useState } from 'react';
import { Account, AllTransactions, DrilldownState } from '../../types';
import LedgerReport from './LedgerReport';

interface DetailedGeneralLedgerProps extends AllTransactions {
    accounts: Account[];
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

const DetailedGeneralLedger: React.FC<DetailedGeneralLedgerProps> = (props) => {
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');

    const postableAccounts = props.accounts.filter(a => a.isPostingAccount).sort((a,b) => a.code.localeCompare(b.code));

    return (
        <div>
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <label htmlFor="account-select" className="text-sm font-medium">Select Account:</label>
                <select 
                    id="account-select"
                    value={selectedAccountId}
                    onChange={e => setSelectedAccountId(e.target.value)}
                    className="bg-white dark:bg-gray-700 px-3 py-2 rounded-md shadow-sm w-full max-w-sm"
                >
                    <option value="" disabled>-- Choose an account to view --</option>
                    {postableAccounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                            {acc.code} - {acc.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedAccountId ? (
                <LedgerReport {...props} accountId={selectedAccountId} />
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <p>Please select an account to view its detailed ledger.</p>
                </div>
            )}
        </div>
    );
};

export default DetailedGeneralLedger;
