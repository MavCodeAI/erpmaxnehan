import React, { useMemo } from 'react';
import { Account, AllTransactions, DrilldownState, SourceDocumentType } from '../../types';

interface LedgerReportProps extends AllTransactions {
    accountId: string;
    accounts: Account[];
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

type LedgerEntry = {
    date: string;
    narration: string;
    ref: string;
    debit: number;
    credit: number;
    docType: SourceDocumentType;
    docId: string;
}

const LedgerReport: React.FC<LedgerReportProps> = (props) => {
    const { accountId, accounts, startDate, endDate, onDrilldown } = props;

    const account = accounts.find(a => a.id === accountId);

    const { entries, openingBalance } = useMemo(() => {
        if (!account) return { entries: [], openingBalance: 0 };

        const isDebitNature = ['Asset', 'Expense'].includes(account.type);
        const ob = account.openingBalance; // Simplified opening balance
        const ledgerEntries: LedgerEntry[] = [];

        // This is a simplified ledger generation logic
        props.journalVouchers.forEach(jv => {
            if (jv.date >= startDate && jv.date <= endDate) {
                jv.entries.forEach(e => {
                    if (e.accountId === account.id) {
                        ledgerEntries.push({ date: jv.date, narration: jv.narration, ref: jv.voucherNumber, debit: e.debit, credit: e.credit, docType: 'journal_voucher', docId: jv.id });
                    }
                });
            }
        });

        const arAccount = accounts.find(a => a.code === '1-01-002-001');
        const salesAccount = accounts.find(a => a.code === '4-01-001');
        if (account.id === arAccount?.id || account.id === salesAccount?.id) {
            props.invoices.forEach(inv => {
                if (inv.date >= startDate && inv.date <= endDate) {
                    if (account.id === arAccount?.id) ledgerEntries.push({ date: inv.date, narration: `Sale to ${inv.customerName}`, ref: inv.invoiceNumber, debit: inv.total, credit: 0, docType: 'invoice', docId: inv.id });
                    if (account.id === salesAccount?.id) ledgerEntries.push({ date: inv.date, narration: `Sale to ${inv.customerName}`, ref: inv.invoiceNumber, debit: 0, credit: inv.total, docType: 'invoice', docId: inv.id });
                }
            });
             props.customerPayments.forEach(p => {
                if (p.date >= startDate && p.date <= endDate && account.id === arAccount?.id) {
                     ledgerEntries.push({ date: p.date, narration: `Payment from ${p.customerName}`, ref: p.paymentNumber, debit: 0, credit: p.amount, docType: 'customer_payment', docId: p.id });
                }
            });
        }
        
        // Add more transaction types (Bills, Payments, etc.) here...

        ledgerEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return { entries: ledgerEntries, openingBalance: ob };

    }, [account, accounts, startDate, endDate, props]);

    if (!account) {
        return <p>Account not found.</p>;
    }

    let runningBalance = openingBalance;

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2 text-center">Ledger Report: {account.name}</h3>
            <p className="text-center text-sm text-gray-500 mb-6">For the period from {startDate} to {endDate}</p>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Narration</th>
                            <th className="py-3 px-4">Ref #</th>
                            <th className="py-3 px-4 text-right">Debit</th>
                            <th className="py-3 px-4 text-right">Credit</th>
                            <th className="py-3 px-4 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                            <td colSpan={5} className="py-2 px-4 font-semibold">Opening Balance</td>
                            <td className="py-2 px-4 text-right font-semibold">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(openingBalance)}</td>
                        </tr>
                        {entries.map((entry, index) => {
                            const isDebitNature = ['Asset', 'Expense'].includes(account.type);
                            const balanceChange = isDebitNature ? entry.debit - entry.credit : entry.credit - entry.debit;
                            runningBalance += balanceChange;
                            return (
                                <tr key={index}>
                                    <td className="py-2 px-4">{entry.date}</td>
                                    <td className="py-2 px-4">{entry.narration}</td>
                                    <td className="py-2 px-4">
                                         <button onClick={() => onDrilldown({type: 'source', sourceType: entry.docType, sourceId: entry.docId})} className="hover:text-primary-600 hover:underline">
                                            {entry.ref}
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 text-right">{entry.debit > 0 ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(entry.debit) : '-'}</td>
                                    <td className="py-2 px-4 text-right">{entry.credit > 0 ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(entry.credit) : '-'}</td>
                                    <td className="py-2 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(runningBalance)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold bg-gray-50 dark:bg-gray-700/50 border-t-2 dark:border-gray-600">
                            <td colSpan={5} className="py-3 px-4">Closing Balance</td>
                            <td className="py-3 px-4 text-right">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(runningBalance)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default LedgerReport;