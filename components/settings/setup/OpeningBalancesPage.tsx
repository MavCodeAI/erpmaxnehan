import React, { useState, useMemo } from 'react';
import { Account } from '../../../types';
// FIX: Import ChevronRight to be used in the component.
import { CheckCircle, Circle, ArrowRight, Edit, Trash2, ChevronRight } from 'lucide-react';
import Button from '../../ui/Button';

interface OpeningBalancesPageProps {
    accounts: Account[];
    onSave: (updatedAccounts: Account[]) => void;
}

type Step = 'checklist' | 'entry' | 'view';

const OpeningBalancesPage: React.FC<OpeningBalancesPageProps> = ({ accounts, onSave }) => {
    const [step, setStep] = useState<Step>('checklist');
    const [migrationDate, setMigrationDate] = useState(new Date().toISOString().split('T')[0]);
    const [balances, setBalances] = useState<Record<string, { debit: number; credit: number }>>({});

    const postingAccounts = useMemo(() => {
        const accs = accounts.filter(a => a.isPostingAccount && !a.isSystemAccount);
        const grouped: Record<Account['type'], Account[]> = { Asset: [], Liability: [], Equity: [], Revenue: [], Expense: [] };
        accs.forEach(acc => {
            if (grouped[acc.type]) {
                grouped[acc.type].push(acc);
            }
        });
        return grouped;
    }, [accounts]);

    const handleBalanceChange = (accountId: string, type: 'debit' | 'credit', value: string) => {
        const numValue = parseFloat(value) || 0;
        setBalances(prev => ({
            ...prev,
            [accountId]: {
                debit: type === 'debit' ? numValue : 0,
                credit: type === 'credit' ? numValue : 0,
            }
        }));
    };
    
    const { totalDebit, totalCredit } = useMemo(() => {
        // FIX: Add explicit type to the accumulator to fix type inference issues.
        return Object.values(balances).reduce(
            // FIX: Explicitly type `val` to resolve TS inference error.
            (acc: { totalDebit: number; totalCredit: number }, val: { debit: number; credit: number }) => ({
                totalDebit: acc.totalDebit + (val.debit || 0),
                totalCredit: acc.totalCredit + (val.credit || 0),
            }),
            { totalDebit: 0, totalCredit: 0 }
        );
    }, [balances]);

    const adjustment = totalDebit - totalCredit;

    const handleConfirm = () => {
        const updatedAccounts = accounts.map(acc => {
            if (balances[acc.id]) {
                const { debit, credit } = balances[acc.id];
                const isDebitNature = ['Asset', 'Expense'].includes(acc.type);
                const change = isDebitNature ? debit - credit : credit - debit;
                return { ...acc, openingBalance: change };
            }
            return acc;
        });
        onSave(updatedAccounts);
        setStep('view');
    };

    const renderChecklist = () => (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Opening Balances</h2>
                <p className="text-gray-500 mt-2">Checklist before you enter your opening balances in ERPMAX</p>
            </div>
            <ul className="space-y-4">
                <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Generate the Trial Balance report in your previous accounting software on the date you're migrating to ERPMAX.</span></li>
                <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Add all your bank and credit card accounts in the Banking module of ERPMAX. Once added, you can enter their balances.</span></li>
                <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Import all your items along with their opening stocks.</span></li>
                <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Import all your contacts along with their opening balances.</span></li>
            </ul>
             <div className="mt-8 pt-6 border-t dark:border-gray-700 flex justify-center">
                 <Button icon={ArrowRight} onClick={() => setStep('entry')}>Continue</Button>
            </div>
        </div>
    );
    
    const renderEntryForm = () => {
         const AccountGroup: React.FC<{ title: Account['type'], icon: React.ReactNode }> = ({ title, icon }) => (
            <div className="border dark:border-gray-700 rounded-lg">
                <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        {icon}
                        <h4 className="font-semibold text-lg">{title}</h4>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                        <div className="font-semibold col-span-1">ACCOUNT</div>
                        <div className="font-semibold text-right">DEBIT (PKR)</div>
                        <div className="font-semibold text-right">CREDIT (PKR)</div>
                        {postingAccounts[title].map(acc => (
                            <React.Fragment key={acc.id}>
                                <div className="col-span-1 py-1">{acc.name}</div>
                                <div className="py-1"><input type="number" value={balances[acc.id]?.debit || ''} onChange={e => handleBalanceChange(acc.id, 'debit', e.target.value)} className="w-full text-right bg-gray-100 dark:bg-gray-700 p-1 rounded" /></div>
                                <div className="py-1"><input type="number" value={balances[acc.id]?.credit || ''} onChange={e => handleBalanceChange(acc.id, 'credit', e.target.value)} className="w-full text-right bg-gray-100 dark:bg-gray-700 p-1 rounded" /></div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );

        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Opening Balances</h2>
                <div className="flex items-center gap-4 mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <label htmlFor="migrationDate" className="font-semibold">Migration Date*</label>
                    <input type="date" id="migrationDate" value={migrationDate} onChange={e => setMigrationDate(e.target.value)} className="p-2 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                
                <div className="space-y-4">
                    <AccountGroup title="Asset" icon={<Circle className="w-5 h-5 text-blue-500" />} />
                    <AccountGroup title="Expense" icon={<Circle className="w-5 h-5 text-red-500" />} />
                    <AccountGroup title="Liability" icon={<Circle className="w-5 h-5 text-orange-500" />} />
                    <AccountGroup title="Equity" icon={<Circle className="w-5 h-5 text-purple-500" />} />
                    <AccountGroup title="Revenue" icon={<Circle className="w-5 h-5 text-green-500" />} />
                </div>

                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-3xl mx-auto">
                    <div className="grid grid-cols-2 gap-4 text-right text-sm">
                        <div className="font-semibold">Total</div>
                        <div></div>
                         <div></div><div className="font-semibold">{totalDebit.toFixed(2)}</div>
                         <div>Opening Balance Adjustments</div><div>{adjustment.toFixed(2)}</div>
                         <div></div><div></div>
                         <div className="font-semibold border-t dark:border-gray-600 pt-2">TOTAL AMOUNT</div>
                         <div className="font-semibold border-t dark:border-gray-600 pt-2">{(totalDebit).toFixed(2)}</div>
                    </div>
                     <div className="grid grid-cols-2 gap-4 text-right text-sm mt-4">
                        <div className="font-semibold">Total</div>
                        <div></div>
                         <div></div><div className="font-semibold">{totalCredit.toFixed(2)}</div>
                         <div></div><div>0.00</div>
                         <div></div><div></div>
                         <div className="font-semibold border-t dark:border-gray-600 pt-2">TOTAL AMOUNT</div>
                         <div className="font-semibold border-t dark:border-gray-600 pt-2">{(totalCredit).toFixed(2)}</div>
                    </div>
                </div>
                 <div className="mt-8 flex justify-center gap-4">
                    <Button variant="secondary" onClick={() => setStep('checklist')}>Cancel</Button>
                    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
                </div>
            </div>
        )
    };
    
    const renderView = () => (
         <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Opening Balances</h2>
                    <p className="text-sm text-gray-500">Migration Date: {migrationDate}</p>
                </div>
                <div>
                    <Button variant="secondary" icon={Edit} onClick={() => setStep('entry')}>Edit</Button>
                    <Button variant="danger" icon={Trash2} className="ml-2">Delete</Button>
                </div>
            </div>
            
            <div className="space-y-6">
                {Object.keys(postingAccounts).map(key => {
                    const groupKey = key as Account['type'];
                    const accsInGroup = postingAccounts[groupKey].filter(acc => acc.openingBalance !== 0);
                    if (accsInGroup.length === 0) return null;
                    
                    return (
                        <div key={key}>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Circle className="w-5 h-5"/> {key}</h3>
                            <div className="pl-8">
                                <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-500 border-b pb-2">
                                    <div className="col-span-1">ACCOUNTS</div>
                                    <div className="text-right">DEBIT (PKR)</div>
                                    <div className="text-right">CREDIT (PKR)</div>
                                </div>
                                {accsInGroup.map(acc => {
                                    const isDebitNature = ['Asset', 'Expense'].includes(acc.type);
                                    const debit = isDebitNature && acc.openingBalance > 0 ? acc.openingBalance : 0;
                                    const credit = !isDebitNature && acc.openingBalance > 0 ? acc.openingBalance : 0;
                                    return (
                                        <div key={acc.id} className="grid grid-cols-3 gap-4 py-2 border-b dark:border-gray-700">
                                            <div className="col-span-1">{acc.name}</div>
                                            <div className="text-right font-mono">{debit > 0 ? debit.toFixed(2) : '-'}</div>
                                            <div className="text-right font-mono">{credit > 0 ? credit.toFixed(2) : '-'}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );

    switch(step) {
        case 'checklist': return renderChecklist();
        case 'entry': return renderEntryForm();
        case 'view': return renderView();
        default: return null;
    }
};

export default OpeningBalancesPage;