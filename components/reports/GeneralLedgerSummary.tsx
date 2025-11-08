
import React, { useMemo } from 'react';
import { AllTransactions, DrilldownState, Account } from '../../types';
import Table, { Column } from '../ui/Table';

interface GeneralLedgerSummaryProps extends AllTransactions {
    accounts: Account[];
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

interface LedgerSummaryRow {
    id: string;
    code: string;
    name: string;
    totalDebit: number;
    totalCredit: number;
    netChange: number;
}

const GeneralLedgerSummary: React.FC<GeneralLedgerSummaryProps> = ({ accounts, startDate, endDate, onDrilldown, ...transactions }) => {
    
    const ledgerSummaryData = useMemo(() => {
        const summaryMap = new Map<string, LedgerSummaryRow>();

        accounts.forEach(acc => {
            summaryMap.set(acc.id, { id: acc.id, code: acc.code, name: acc.name, totalDebit: 0, totalCredit: 0, netChange: 0 });
        });
        
        transactions.journalVouchers.forEach(jv => {
            if(jv.date >= startDate && jv.date <= endDate) {
                jv.entries.forEach(entry => {
                    const summary = summaryMap.get(entry.accountId);
                    if(summary) {
                        summary.totalDebit += entry.debit;
                        summary.totalCredit += entry.credit;
                    }
                });
            }
        });

        // Add logic for all other transaction types (invoices, bills, etc.) here...

        Array.from(summaryMap.values()).forEach(summary => {
            const account = accounts.find(a => a.id === summary.id);
            if (account) {
                const isDebitNature = ['Asset', 'Expense'].includes(account.type);
                summary.netChange = isDebitNature ? summary.totalDebit - summary.totalCredit : summary.totalCredit - summary.totalDebit;
            }
        });

        return Array.from(summaryMap.values()).filter(s => s.totalDebit > 0 || s.totalCredit > 0).sort((a,b) => a.code.localeCompare(b.code));
    }, [accounts, startDate, endDate, transactions]);

    const columns: Column<LedgerSummaryRow>[] = [
        { header: 'Code', accessor: 'code' },
        { header: 'Account Name', accessor: (item) => (
            <button onClick={() => onDrilldown({type: 'ledger', accountId: item.id})} className="hover:underline text-left w-full">
                {item.name}
            </button>
        )},
        { header: 'Total Debit', accessor: (item) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.totalDebit) },
        { header: 'Total Credit', accessor: (item) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.totalCredit) },
        { header: 'Net Change', accessor: (item) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.netChange) },
    ];

    return (
         <div>
            <h3 className="text-xl font-semibold mb-2 text-center">General Ledger Summary</h3>
            <p className="text-center text-sm text-gray-500 mb-6">For the period from {startDate} to {endDate}</p>
            <Table columns={columns} data={ledgerSummaryData} />
        </div>
    );
};

export default GeneralLedgerSummary;
