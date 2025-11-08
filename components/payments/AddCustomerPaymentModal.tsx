import React, { useState, useMemo, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Customer, Invoice, CustomerPayment } from '../../types';

interface AddCustomerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: CustomerPayment) => void;
  customers: Customer[];
  invoices: Invoice[];
  customerPayments: CustomerPayment[];
  lastPaymentNumber: string;
}

const AddCustomerPaymentModal: React.FC<AddCustomerPaymentModalProps> = ({ isOpen, onClose, onSave, customers, invoices, customerPayments, lastPaymentNumber }) => {
    
    const labelClasses = "block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2";
    const inputClasses = "w-full px-4 py-3 text-lg bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500";
    const disabledInputClasses = `${inputClasses} bg-gray-200 dark:bg-gray-800 cursor-not-allowed`;

    const generateNextPaymentNumber = () => {
        const parts = lastPaymentNumber.split('-');
        const lastNum = parseInt(parts[parts.length-1], 10);
        const newNum = (lastNum + 1).toString().padStart(3, '0');
        return `RCPT-${newNum}`;
    };

    const [paymentNumber] = useState(generateNextPaymentNumber());
    const [customerId, setCustomerId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Credit Card'>('Bank Transfer');
    const [appliedAmounts, setAppliedAmounts] = useState<Record<string, number>>({});

    const outstandingInvoices = useMemo(() => {
        if (!customerId) return [];
        return invoices.filter(inv => inv.customerId === customerId && (inv.status === 'Unpaid' || inv.status === 'Partially Paid' || inv.status === 'Overdue'));
    }, [customerId, invoices]);

    const getInvoiceBalance = (invoice: Invoice): number => {
        const paymentsMade = customerPayments
            .flatMap(p => p.appliedInvoices)
            .filter(a => a.invoiceId === invoice.id)
            .reduce((sum, a) => sum + a.amount, 0);
        return invoice.total - paymentsMade;
    };
    
    useEffect(() => {
        setAppliedAmounts({});
    }, [customerId]);

    // Fix: Explicitly type the accumulator 'sum' as a number to prevent type inference issues.
    const totalApplied = useMemo(() => Object.values(appliedAmounts).reduce((sum: number, val) => sum + (Number(val) || 0), 0), [appliedAmounts]);
    const unappliedAmount = amount - totalApplied;

    const handleApplyChange = (invoiceId: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        const invoice = outstandingInvoices.find(inv => inv.id === invoiceId);
        if (!invoice) return;
        
        const balance = getInvoiceBalance(invoice);
        const newAppliedAmount = Math.min(numValue, balance);
        
        setAppliedAmounts(prev => ({
            ...prev,
            [invoiceId]: newAppliedAmount,
        }));
    };

    const resetForm = () => {
        setCustomerId('');
        setDate(new Date().toISOString().split('T')[0]);
        setAmount(0);
        setPaymentMethod('Bank Transfer');
        setAppliedAmounts({});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerId || amount <= 0 || unappliedAmount < 0) return;

        const customer = customers.find(c => c.id === customerId);
        if (!customer) return;

        const newPayment: CustomerPayment = {
            id: new Date().getTime().toString(),
            paymentNumber,
            date,
            customerId,
            customerName: customer.displayName,
            amount,
            paymentMethod,
            // FIX: Ensure amount is treated as a number.
            appliedInvoices: Object.entries(appliedAmounts)
                .filter(([, amountValue]) => (Number(amountValue) || 0) > 0)
                .map(([invoiceId, amountValue]) => ({ invoiceId, amount: Number(amountValue) || 0 })),
        };
        onSave(newPayment);
        resetForm();
        onClose();
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Customer Payment">
      <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Customer</label>
                    <select value={customerId} onChange={e => setCustomerId(e.target.value)} required className={inputClasses}>
                        <option value="">Select Customer</option>
                        {customers.map((c) => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClasses}>Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputClasses}/>
                </div>
                <div>
                    <label className={labelClasses}>Amount Received</label>
                    <input type="number" step="0.01" value={amount || ''} onChange={e => setAmount(parseFloat(e.target.value))} required className={inputClasses}/>
                </div>
                <div>
                    <label className={labelClasses}>Payment Method</label>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} required className={inputClasses}>
                        <option>Bank Transfer</option>
                        <option>Cash</option>
                        <option>Credit Card</option>
                    </select>
                </div>
                <div>
                    <label className={labelClasses}>Payment #</label>
                    <input type="text" value={paymentNumber} readOnly className={disabledInputClasses}/>
                </div>
            </div>
            
            {customerId && (
                <div>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-4">Apply to Invoices</h4>
                    {outstandingInvoices.length > 0 ? (
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                        {outstandingInvoices.map(invoice => (
                            <div key={invoice.id} className="grid grid-cols-3 gap-4 items-center text-lg">
                                <span>{invoice.invoiceNumber} ({invoice.date})</span>
                                <span className="text-right">
                                    Balance: {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(getInvoiceBalance(invoice))}
                                </span>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    max={Math.min(getInvoiceBalance(invoice), amount - totalApplied + (appliedAmounts[invoice.id] || 0))}
                                    min="0"
                                    value={appliedAmounts[invoice.id] || ''}
                                    onChange={(e) => handleApplyChange(invoice.id, e.target.value)}
                                    className={`${inputClasses} text-right`}
                                    placeholder="0.00"
                                />
                            </div>
                        ))}
                        </div>
                    ) : <p className="text-lg text-gray-500">No outstanding invoices for this customer.</p>}
                     <div className="flex justify-end pt-4 mt-4 border-t dark:border-gray-700 text-lg font-medium">
                        <div className="w-96 space-y-2">
                            <div className="flex justify-between"><span>Amount Received:</span><span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}</span></div>
                            <div className="flex justify-between"><span>Amount Applied:</span><span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalApplied)}</span></div>
                            <div className={`flex justify-between font-bold text-xl ${unappliedAmount < 0 ? 'text-red-500' : ''}`}><span>Unapplied:</span><span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(unappliedAmount)}</span></div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex justify-end pt-8 space-x-4 border-t dark:border-gray-700 mt-6">
              <Button type="button" variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" size="lg" disabled={!customerId || amount <= 0 || unappliedAmount < 0}>Save Payment</Button>
            </div>
      </form>
    </Modal>
  );
};

export default AddCustomerPaymentModal;