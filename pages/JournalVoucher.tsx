import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { JournalVoucher, Account } from '../types';
import TransactionPageLayout from '../components/layout/TransactionPageLayout';
import TransactionList from '../components/ui/TransactionList';
import JournalVoucherForm from '../components/vouchers/JournalVoucherForm';
import Modal from '../components/ui/Modal';
import { showToast } from '../utils/toast';

interface JournalVoucherPageProps {
    journalVouchers: JournalVoucher[];
    onSave: (voucher: JournalVoucher) => void;
    onDelete: (voucherId: string) => void;
    accounts: Account[];
}

const StatusBadge: React.FC<{ status: 'Posted' | 'Draft' }> = ({ status }) => {
    const colorClasses = {
        Posted: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
        Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    };
    return <span className={`px-2 py-1 font-semibold leading-tight text-xs rounded-full ${colorClasses[status]}`}>{status}</span>;
}

const JournalVoucherPage: React.FC<JournalVoucherPageProps> = ({ journalVouchers, onSave, onDelete, accounts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVoucher, setSelectedVoucher] = useState<JournalVoucher | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState<JournalVoucher | null>(null);

    const filteredVouchers = journalVouchers.filter(voucher =>
        voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.narration.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleSelectItem = (voucher: JournalVoucher) => {
        if (voucher.status === 'Posted') {
            showToast.warning("Posted vouchers cannot be edited.");
            return;
        }
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

    const handleSave = (voucher: JournalVoucher) => {
        onSave(voucher);
        handleCancel();
    };

    const handleDelete = (voucherId: string) => {
        const voucher = journalVouchers.find(v => v.id === voucherId);
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
                title="Journal Vouchers"
                isFormOpen={isCreating || !!selectedVoucher}
                onAddNew={handleAddNew}
                list={
                    <TransactionList<JournalVoucher>
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
                            secondary: `${voucher.narration.substring(0, 30)}... - ${voucher.date}`,
                            amount: voucher.totalDebit,
                            status: <StatusBadge status={voucher.status} />
                        })}
                    />
                }
                form={
                    (isCreating || selectedVoucher) && (
                        <JournalVoucherForm
                            voucher={selectedVoucher}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            lastVoucherNumber={journalVouchers[0]?.voucherNumber || 'JV-2023-000'}
                            accounts={accounts}
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

export default JournalVoucherPage;