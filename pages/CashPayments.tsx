import React, { useState } from 'react';
import { CashPaymentVoucher, Account, AllTransactions } from '../types';
import TransactionPageLayout from '../components/layout/TransactionPageLayout';
import TransactionList from '../components/ui/TransactionList';
import CashPaymentForm from '../components/vouchers/CashPaymentForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

interface CashPaymentsProps {
    vouchers: CashPaymentVoucher[];
    onSave: (voucher: CashPaymentVoucher) => void;
    onDelete: (voucherId: string) => void;
    accounts: Account[];
    allTransactions: AllTransactions;
}

const CashPayments: React.FC<CashPaymentsProps> = ({ vouchers, onSave, onDelete, accounts, allTransactions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVoucher, setSelectedVoucher] = useState<CashPaymentVoucher | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState<CashPaymentVoucher | null>(null);

    const filteredVouchers = vouchers.filter(voucher =>
        voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const handleSelectItem = (voucher: CashPaymentVoucher) => {
        setIsCreating(false);
        setSelectedVoucher(voucher);
    };

    const handleAddNew = () => {
        setSelectedVoucher(null);
        setIsCreating(true);
    };

    const handleCancel = () => {
        setSelectedVoucher(null);
        setIsCreating(false);
    };

    const handleSave = (voucher: CashPaymentVoucher) => {
        onSave(voucher);
        handleCancel();
    };

    const handleDelete = (voucherId: string) => {
        const voucher = vouchers.find(v => v.id === voucherId);
        if (voucher) {
            setVoucherToDelete(voucher);
        }
    };

    const confirmDelete = () => {
        if (voucherToDelete) {
            onDelete(voucherToDelete.id);
            setVoucherToDelete(null);
             if (selectedVoucher && selectedVoucher.id === voucherToDelete.id) {
                handleCancel();
            }
        }
    };

    return (
        <>
            <TransactionPageLayout
                title="Cash Payments"
                isFormOpen={isCreating || !!selectedVoucher}
                onAddNew={handleAddNew}
                list={
                    <TransactionList<CashPaymentVoucher>
                        items={filteredVouchers}
                        selectedItemId={selectedVoucher?.id || null}
                        onSelectItem={handleSelectItem}
                        onDeleteItem={handleDelete}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        searchPlaceholder="Search Vouchers..."
                        renderItem={(voucher) => ({
                            id: voucher.id,
                            primary: voucher.voucherNumber,
                            secondary: `${voucher.entries.map(e => e.accountName).join(', ')} - ${voucher.date}`,
                            amount: voucher.totalAmount,
                        })}
                    />
                }
                form={
                    (isCreating || selectedVoucher) && (
                        <CashPaymentForm
                            voucher={selectedVoucher}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            lastVoucherNumber={vouchers[0]?.voucherNumber || 'CP-2023-000'}
                            accounts={accounts}
                            allTransactions={allTransactions}
                        />
                    )
                }
            />
            {voucherToDelete && (
                 <Modal 
                    isOpen={!!voucherToDelete}
                    onClose={() => setVoucherToDelete(null)}
                    title="Confirm Deletion"
                    size="md"
                >
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete voucher <strong>{voucherToDelete.voucherNumber}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end pt-8 space-x-4">
                        <Button type="button" variant="secondary" size="lg" onClick={() => setVoucherToDelete(null)}>Cancel</Button>
                        <Button type="button" variant="danger" size="lg" onClick={confirmDelete}>Delete Voucher</Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default CashPayments;