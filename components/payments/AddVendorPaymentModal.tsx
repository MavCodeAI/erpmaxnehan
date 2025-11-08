import React, { useState, useMemo, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Vendor, PurchaseBill, VendorPayment } from '../../types';

interface AddVendorPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: VendorPayment) => void;
  vendors: Vendor[];
  bills: PurchaseBill[];
  vendorPayments: VendorPayment[];
  lastPaymentNumber: string;
}

const AddVendorPaymentModal: React.FC<AddVendorPaymentModalProps> = ({ isOpen, onClose, onSave, vendors, bills, vendorPayments, lastPaymentNumber }) => {
    
    const labelClasses = "block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2";
    const inputClasses = "w-full px-4 py-3 text-lg bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500";
    const disabledInputClasses = `${inputClasses} bg-gray-200 dark:bg-gray-800 cursor-not-allowed`;

    const generateNextPaymentNumber = () => {
        const parts = lastPaymentNumber.split('-');
        const lastNum = parseInt(parts[parts.length-1], 10);
        const newNum = (lastNum + 1).toString().padStart(3, '0');
        return `PAY-${newNum}`;
    };

    const [paymentNumber] = useState(generateNextPaymentNumber());
    const [vendorId, setVendorId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Credit Card'>('Bank Transfer');
    const [appliedAmounts, setAppliedAmounts] = useState<Record<string, number>>({});

    const outstandingBills = useMemo(() => {
        if (!vendorId) return [];
        return bills.filter(bill => bill.vendorId === vendorId && (bill.status === 'Unpaid' || bill.status === 'Partially Paid' || bill.status === 'Overdue'));
    }, [vendorId, bills]);

    const getBillBalance = (bill: PurchaseBill): number => {
        const paymentsMade = vendorPayments
            .flatMap(p => p.appliedBills)
            .filter(a => a.billId === bill.id)
            .reduce((sum, a) => sum + a.amount, 0);
        return bill.total - paymentsMade;
    };
    
    useEffect(() => {
        setAppliedAmounts({});
    }, [vendorId]);

    // Fix: Explicitly type the accumulator 'sum' as a number to prevent type inference issues.
    const totalApplied = useMemo(() => Object.values(appliedAmounts).reduce((sum: number, val) => sum + (Number(val) || 0), 0), [appliedAmounts]);
    const unappliedAmount = amount - totalApplied;

    const handleApplyChange = (billId: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        const bill = outstandingBills.find(b => b.id === billId);
        if (!bill) return;
        
        const balance = getBillBalance(bill);
        const newAppliedAmount = Math.min(numValue, balance);
        
        setAppliedAmounts(prev => ({
            ...prev,
            [billId]: newAppliedAmount,
        }));
    };

    const resetForm = () => {
        setVendorId('');
        setDate(new Date().toISOString().split('T')[0]);
        setAmount(0);
        setPaymentMethod('Bank Transfer');
        setAppliedAmounts({});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorId || amount <= 0 || unappliedAmount < 0) return;

        const vendor = vendors.find(v => v.id === vendorId);
        if (!vendor) return;

        const newPayment: VendorPayment = {
            id: new Date().getTime().toString(),
            paymentNumber,
            date,
            vendorId,
            // FIX: Use 'displayName' as 'name' does not exist on the Vendor type.
            vendorName: vendor.displayName,
            amount,
            paymentMethod,
            // FIX: Ensure amount is treated as a number.
            appliedBills: Object.entries(appliedAmounts)
                .filter(([, amountValue]) => (Number(amountValue) || 0) > 0)
                .map(([billId, amountValue]) => ({ billId, amount: Number(amountValue) || 0 })),
        };
        onSave(newPayment);
        resetForm();
        onClose();
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Vendor Payment">
      <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Vendor</label>
                    <select value={vendorId} onChange={e => setVendorId(e.target.value)} required className={inputClasses}>
                        <option value="">Select Vendor</option>
                        {/* FIX: Use 'displayName' as 'name' does not exist on the Vendor type. */}
                        {vendors.map((v) => <option key={v.id} value={v.id}>{v.displayName}</option>)}
                    </select>
                </div>
                 <div>
                    <label className={labelClasses}>Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputClasses}/>
                </div>
                 <div>
                    <label className={labelClasses}>Amount Paid</label>
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
            
            {vendorId && (
                <div>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-4">Apply to Bills</h4>
                    {outstandingBills.length > 0 ? (
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                        {outstandingBills.map(bill => (
                            <div key={bill.id} className="grid grid-cols-3 gap-4 items-center text-lg">
                                <span>{bill.billNumber} ({bill.date})</span>
                                <span className="text-right">
                                    Balance: {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(getBillBalance(bill))}
                                </span>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    max={Math.min(getBillBalance(bill), amount - totalApplied + (appliedAmounts[bill.id] || 0))}
                                    min="0"
                                    value={appliedAmounts[bill.id] || ''}
                                    onChange={(e) => handleApplyChange(bill.id, e.target.value)}
                                    className={`${inputClasses} text-right`}
                                    placeholder="0.00"
                                />
                            </div>
                        ))}
                        </div>
                    ) : <p className="text-lg text-gray-500">No outstanding bills for this vendor.</p>}
                     <div className="flex justify-end pt-4 mt-4 border-t dark:border-gray-700 text-lg font-medium">
                        <div className="w-96 space-y-2">
                            <div className="flex justify-between"><span>Amount Paid:</span><span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}</span></div>
                            <div className="flex justify-between"><span>Amount Applied:</span><span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalApplied)}</span></div>
                            <div className={`flex justify-between font-bold text-xl ${unappliedAmount < 0 ? 'text-red-500' : ''}`}><span>Unapplied:</span><span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(unappliedAmount)}</span></div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex justify-end pt-8 space-x-4 border-t dark:border-gray-700 mt-6">
              <Button type="button" variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" size="lg" disabled={!vendorId || amount <= 0 || unappliedAmount < 0}>Save Payment</Button>
            </div>
      </form>
    </Modal>
  );
};

export default AddVendorPaymentModal;