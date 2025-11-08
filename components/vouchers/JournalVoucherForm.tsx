import React, { useState, useMemo, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import { JournalVoucher, Account } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface JournalVoucherFormProps {
  voucher: JournalVoucher | null;
  onSave: (voucher: JournalVoucher) => void;
  onCancel: () => void;
  lastVoucherNumber: string;
  accounts: Account[];
}

type EntryRow = {
    accountId: string;
    debit: number;
    credit: number;
};

const JournalVoucherForm: React.FC<JournalVoucherFormProps> = ({ voucher, onSave, onCancel, lastVoucherNumber, accounts }) => {
    
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    const disabledInputClasses = `${inputClasses} bg-gray-200 dark:bg-gray-800 cursor-not-allowed`;
    const entriesContainerRef = useRef<HTMLTableSectionElement>(null);

    const isEditMode = !!voucher;

    const generateNextVoucherNumber = () => {
        if (isEditMode) return '';
        const parts = lastVoucherNumber.split('-');
        const lastNum = parseInt(parts[parts.length-1], 10);
        const newNum = (lastNum + 1).toString().padStart(3, '0');
        return `JV-2023-${newNum}`;
    };
    
    const [voucherNumber, setVoucherNumber] = useState(generateNextVoucherNumber());
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [narration, setNarration] = useState('');
    const [entries, setEntries] = useState<EntryRow[]>([
        { accountId: '', debit: 0, credit: 0 },
        { accountId: '', debit: 0, credit: 0 },
    ]);
    const [status, setStatus] = useState<'Draft' | 'Posted'>('Draft');

    useEffect(() => {
        if (voucher) {
            setVoucherNumber(voucher.voucherNumber);
            setDate(voucher.date);
            setNarration(voucher.narration);
            setEntries(voucher.entries.map(({ accountId, debit, credit }) => ({ accountId, debit, credit })));
            setStatus(voucher.status);
        } else {
            setVoucherNumber(generateNextVoucherNumber());
            setDate(new Date().toISOString().split('T')[0]);
            setNarration('');
            setEntries([
                { accountId: '', debit: 0, credit: 0 },
                { accountId: '', debit: 0, credit: 0 },
            ]);
            setStatus('Draft');
        }
    }, [voucher, lastVoucherNumber]);


    useEffect(() => {
        if (entries.length > 2 && entriesContainerRef.current) {
            const lastRow = entriesContainerRef.current.lastElementChild as HTMLElement;
            if (lastRow) {
                const firstInput = lastRow.querySelector('select, input') as HTMLElement;
                if (firstInput) {
                    firstInput.focus();
                }
            }
        }
    }, [entries.length]);

    const postableAccounts = useMemo(() => accounts.filter(acc => acc.isPostingAccount && acc.status === 'Active').sort((a,b) => a.code.localeCompare(b.code)), [accounts]);

    const handleEntryChange = (index: number, field: keyof EntryRow, value: string | number) => {
        const newEntries = [...entries];
        const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
        
        if (field === 'debit' && numericValue > 0) {
            newEntries[index].credit = 0;
        } else if (field === 'credit' && numericValue > 0) {
            newEntries[index].debit = 0;
        }
        
        (newEntries[index] as any)[field] = field === 'accountId' ? value : numericValue;
        setEntries(newEntries);
    };

    const addEntryRow = () => {
        setEntries([...entries, { accountId: '', debit: 0, credit: 0 }]);
    };
    
    const handleEntryKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' && index === entries.length - 1) {
            const currentEntry = entries[index];
            if (currentEntry.accountId && (currentEntry.debit > 0 || currentEntry.credit > 0)) {
                e.preventDefault();
                addEntryRow();
            }
        }
    };

    const removeEntryRow = (index: number) => {
        if (entries.length > 2) {
            const newEntries = entries.filter((_, i) => i !== index);
            setEntries(newEntries);
        }
    };
    
    const totalDebit = useMemo(() => entries.reduce((sum, entry) => sum + entry.debit, 0), [entries]);
    const totalCredit = useMemo(() => entries.reduce((sum, entry) => sum + entry.credit, 0), [entries]);
    const difference = totalDebit - totalCredit;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (difference !== 0 || totalDebit === 0) return;

        const newVoucher: JournalVoucher = {
            id: isEditMode && voucher ? voucher.id : new Date().getTime().toString(),
            voucherNumber,
            date,
            narration,
            totalDebit,
            totalCredit,
            status: status,
            entries: entries
              .filter(e => e.accountId && (e.debit > 0 || e.credit > 0))
              .map(e => ({
                  ...e,
                  accountName: accounts.find(acc => acc.id === e.accountId)?.name || 'Unknown',
              })),
        };
        onSave(newVoucher);
    };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="p-6 border-b dark:border-gray-700">
             <h3 className="text-2xl font-semibold">{isEditMode ? `Edit Journal Voucher #${voucher?.voucherNumber}` : 'New Journal Voucher'}</h3>
        </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Voucher #</label>
                    <input type="text" value={voucherNumber} readOnly className={disabledInputClasses}/>
                </div>
                 <div>
                    <label htmlFor="date" className={labelClasses}>Date</label>
                    <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputClasses}/>
                </div>
            </div>
            <div>
                 <label htmlFor="narration" className={labelClasses}>Narration</label>
                 <textarea id="narration" value={narration} onChange={e => setNarration(e.target.value)} required rows={2} className={inputClasses}></textarea>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3 font-semibold text-left w-2/5">Account</th>
                            <th className="p-3 font-semibold text-right">Debit</th>
                            <th className="p-3 font-semibold text-right">Credit</th>
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
                                <td className="p-2">
                                    <input type="number" step="0.01" value={entry.debit || ''} onChange={e => handleEntryChange(index, 'debit', e.target.value)} className={`${inputClasses} text-right`}/>
                                </td>
                                <td className="p-2">
                                    <input type="number" step="0.01" value={entry.credit || ''} onChange={e => handleEntryChange(index, 'credit', e.target.value)} className={`${inputClasses} text-right`} onKeyDown={(e) => handleEntryKeyDown(e, index)} />
                                </td>
                                <td className="p-2 text-center">
                                    <Button type="button" size="sm" variant="danger" icon={Trash2} onClick={() => removeEntryRow(index)} disabled={entries.length <= 2} title="Remove Row" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Button type="button" size="sm" variant="secondary" icon={Plus} onClick={addEntryRow}>Add Row</Button>

            <div className="flex justify-end pt-4">
                <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between font-semibold">
                        <span>Total Debit:</span>
                        <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalDebit)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Total Credit:</span>
                        <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalCredit)}</span>
                    </div>
                    <div className={`flex justify-between font-bold text-lg ${difference !== 0 ? 'text-red-500' : 'text-green-500'}`}>
                        <span>Difference:</span>
                        <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(difference)}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end p-6 space-x-4 border-t dark:border-gray-700 mt-6">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={difference !== 0 || totalDebit === 0}>{isEditMode ? 'Update Voucher' : 'Save Draft'}</Button>
        </div>
      </form>
    </div>
  );
};

export default JournalVoucherForm;
