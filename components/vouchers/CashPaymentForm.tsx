import React, { useState, useMemo, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import { CashPaymentVoucher, Account, VoucherEntry, AllTransactions } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { getAccountBalance } from '../../utils/calculations';

interface CashPaymentFormProps {
  voucher: CashPaymentVoucher | null;
  onSave: (voucher: CashPaymentVoucher) => void;
  onCancel: () => void;
  lastVoucherNumber: string;
  accounts: Account[];
  allTransactions: AllTransactions;
}

type EntryRow = Omit<VoucherEntry, 'accountName'> & {
    currentBalance: number;
    closingBalance: number;
};

const CashPaymentForm: React.FC<CashPaymentFormProps> = ({ voucher, onSave, onCancel, lastVoucherNumber, accounts, allTransactions }) => {
    
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    const disabledInputClasses = `${inputClasses} bg-gray-200 dark:bg-gray-800 cursor-not-allowed`;
    const balanceDisplayClasses = "text-right mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-400 sm:text-sm";
    const entriesContainerRef = useRef<HTMLTableSectionElement>(null);

    const isEditMode = !!voucher;

    const generateNextVoucherNumber = () => {
        if (isEditMode) return '';
        const parts = lastVoucherNumber.split('-');
        const lastNum = parseInt(parts[parts.length-1], 10);
        const newNum = (lastNum + 1).toString().padStart(3, '0');
        return `CP-2023-${newNum}`;
    };
    
    const [voucherNumber, setVoucherNumber] = useState(generateNextVoucherNumber());
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [entries, setEntries] = useState<EntryRow[]>([
        { accountId: '', narration: '', amount: 0, currentBalance: 0, closingBalance: 0 },
    ]);
    
    useEffect(() => {
         if (voucher) {
            setVoucherNumber(voucher.voucherNumber);
            setDate(voucher.date);
            setEntries(voucher.entries.map(e => ({...e, currentBalance: 0, closingBalance: 0}))); // balance calculation is complex for edit, simplified for now
        } else {
            setVoucherNumber(generateNextVoucherNumber());
            setDate(new Date().toISOString().split('T')[0]);
            setEntries([{ accountId: '', narration: '', amount: 0, currentBalance: 0, closingBalance: 0 }]);
        }
    }, [voucher, lastVoucherNumber]);

    useEffect(() => {
        if (entries.length > 1 && entriesContainerRef.current) {
            const lastRow = entriesContainerRef.current.lastElementChild as HTMLElement;
            if (lastRow) {
                const firstInput = lastRow.querySelector('select, input') as HTMLElement;
                if (firstInput) {
                    firstInput.focus();
                }
            }
        }
    }, [entries.length]);

    const cashInHandAccount = useMemo(() => accounts.find(acc => acc.code === '1-01-001-001'), [accounts]);

    const postableAccounts = useMemo(() => 
        accounts.filter(acc => acc.isPostingAccount && acc.status === 'Active' && acc.id !== cashInHandAccount?.id)
        .sort((a,b) => a.code.localeCompare(b.code)), 
    [accounts, cashInHandAccount]);

    const handleEntryChange = (index: number, field: keyof EntryRow, value: string | number) => {
        const newEntries = [...entries];
        const currentEntry = newEntries[index];

        if (field === 'accountId') {
            const accountId = value as string;
            currentEntry.accountId = accountId;
            if (accountId) {
                const balance = getAccountBalance(accountId, accounts, allTransactions, date);
                currentEntry.currentBalance = balance;
                currentEntry.closingBalance = balance + currentEntry.amount; // Payment DEBITS the account
            } else {
                currentEntry.currentBalance = 0;
                currentEntry.closingBalance = 0;
            }
        } else if (field === 'amount') {
            const amount = typeof value === 'string' ? parseFloat(value) || 0 : value;
            currentEntry.amount = amount;
            currentEntry.closingBalance = currentEntry.currentBalance + amount; // Payment DEBITS the account
        } else {
            (currentEntry as any)[field] = value;
        }
        
        setEntries(newEntries);
    };

    const addEntryRow = () => {
        setEntries([...entries, { accountId: '', narration: '', amount: 0, currentBalance: 0, closingBalance: 0 }]);
    };
    
    const handleEntryKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' && index === entries.length - 1) {
            const currentEntry = entries[index];
            if (currentEntry.accountId && currentEntry.amount > 0) {
                e.preventDefault();
                addEntryRow();
            }
        }
    };

    const removeEntryRow = (index: number) => {
        if (entries.length > 1) {
            const newEntries = entries.filter((_, i) => i !== index);
            setEntries(newEntries);
        }
    };
    
    const totalAmount = useMemo(() => entries.reduce((sum, entry) => sum + entry.amount, 0), [entries]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validEntries = entries.filter(e => e.accountId && e.amount > 0);
        if (validEntries.length === 0) return;

        const newVoucher: CashPaymentVoucher = {
            id: voucher?.id || new Date().getTime().toString(),
            voucherNumber,
            date,
            totalAmount,
            entries: validEntries.map(e => ({
                  accountId: e.accountId,
                  narration: e.narration,
                  amount: e.amount,
                  accountName: accounts.find(acc => acc.id === e.accountId)?.name || 'Unknown',
            })),
        };
        onSave(newVoucher);
    };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="p-6 border-b dark:border-gray-700">
             <h3 className="text-2xl font-semibold">{isEditMode ? `Edit Cash Payment #${voucher?.voucherNumber}` : 'New Cash Payment'}</h3>
        </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className={labelClasses}>Payment From</label>
                    <input type="text" value={cashInHandAccount ? `${cashInHandAccount.code} - ${cashInHandAccount.name}` : 'Cash Account Not Found'} readOnly className={disabledInputClasses}/>
                </div>
                <div>
                    <label htmlFor="date" className={labelClasses}>Date</label>
                    <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputClasses}/>
                </div>
                <div>
                    <label className={labelClasses}>Voucher #</label>
                    <input type="text" value={voucherNumber} readOnly className={disabledInputClasses}/>
                </div>
            </div>

            <div className="w-full overflow-x-auto mt-6">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3 font-semibold text-left w-[25%]">Account Paid To</th>
                            <th className="p-3 font-semibold text-left">Narration</th>
                            <th className="p-3 font-semibold text-right">Current Balance</th>
                            <th className="p-3 font-semibold text-right">Amount</th>
                            <th className="p-3 font-semibold text-right">Closing Balance</th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody ref={entriesContainerRef}>
                        {entries.map((entry, index) => (
                            <tr key={index} className="border-b dark:border-gray-600">
                                <td className="p-2">
                                    <select value={entry.accountId} onChange={e => handleEntryChange(index, 'accountId', e.target.value)} className={inputClasses}>
                                        <option value="">Select Account</option>
                                        {postableAccounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2"><input type="text" value={entry.narration} onChange={e => handleEntryChange(index, 'narration', e.target.value)} className={inputClasses} /></td>
                                <td className="p-2"><div className={balanceDisplayClasses}>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(entry.currentBalance)}</div></td>
                                <td className="p-2"><input type="number" step="0.01" value={entry.amount || ''} onChange={e => handleEntryChange(index, 'amount', e.target.value)} className={`${inputClasses} text-right`} onKeyDown={(e) => handleEntryKeyDown(e, index)} /></td>
                                <td className="p-2"><div className={balanceDisplayClasses}>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(entry.closingBalance)}</div></td>
                                <td className="p-2 text-center">
                                    <Button type="button" size="sm" variant="danger" icon={Trash2} onClick={() => removeEntryRow(index)} disabled={entries.length <= 1} title="Remove Row" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Button type="button" size="sm" variant="secondary" icon={Plus} onClick={addEntryRow}>Add Row</Button>

            <div className="flex justify-end pt-4">
                 <div className="w-full max-w-sm space-y-2">
                     <div className="flex justify-between font-bold text-xl">
                        <span>Total Amount:</span>
                        <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalAmount)}</span>
                    </div>
                 </div>
            </div>
        </div>

        <div className="flex justify-end p-6 space-x-4 border-t dark:border-gray-700 mt-6">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={totalAmount === 0}>Save Payment</Button>
        </div>
      </form>
    </div>
  );
};

export default CashPaymentForm;
