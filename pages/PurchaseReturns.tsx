import React, { useState } from 'react';
import Table, { Column } from '../components/ui/Table';
import Button from '../components/ui/Button';
import { PurchaseReturn, InventoryItem, Vendor } from '../types';
import { PlusCircle, FileDown, Search, Edit, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import AddPurchaseReturnModal from '../components/purchases/AddPurchaseReturnModal';

interface PurchaseReturnsProps {
    purchaseReturns: PurchaseReturn[];
    onSave: (purchaseReturn: PurchaseReturn) => void;
    inventoryItems: InventoryItem[];
    vendors: Vendor[];
}

const StatusBadge: React.FC<{ status: 'Draft' | 'Completed' }> = ({ status }) => {
    const colorClasses = {
        Completed: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
        Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    };
    return <span className={`px-2 py-1 font-semibold leading-tight text-sm rounded-full ${colorClasses[status]}`}>{status}</span>;
}

const PurchaseReturns: React.FC<PurchaseReturnsProps> = ({ purchaseReturns, onSave, inventoryItems, vendors }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredReturns = purchaseReturns.filter(pr =>
        pr.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pr.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: Column<PurchaseReturn>[] = [
        { header: 'Return #', accessor: 'returnNumber' },
        { header: 'Vendor', accessor: 'vendorName' },
        { header: 'Date', accessor: 'date' },
        { header: 'Amount', accessor: (item: PurchaseReturn) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.total) },
        { header: 'Status', accessor: (item: PurchaseReturn) => <StatusBadge status={item.status} /> },
        { header: 'Actions', accessor: () => (
            <div className="flex space-x-2">
                <Button size="sm" variant="secondary" icon={Edit} title="Edit" />
                <Button size="sm" variant="danger" icon={Trash2} title="Delete" />
            </div>
        )},
    ];

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Purchase Returns (Debit Notes)</h2>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={FileDown}>Export</Button>
                    <Button variant="primary" icon={PlusCircle} onClick={() => setIsModalOpen(true)}>New Purchase Return</Button>
                </div>
            </div>
            
            <Card>
                <div className="flex items-center justify-between mb-4">
                     <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 flex items-center pl-2">
                          <Search className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-gray-300 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-primary-300 focus:outline-none focus:shadow-outline-purple form-input"
                          type="text"
                          placeholder="Search by Return # or Vendor"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <Table<PurchaseReturn> columns={columns} data={filteredReturns} />
            </Card>
            
            <AddPurchaseReturnModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSave}
                lastReturnNumber={purchaseReturns[0]?.returnNumber || 'DN-2023-000'}
                inventoryItems={inventoryItems}
                vendors={vendors}
            />
        </>
    );
};

export default PurchaseReturns;