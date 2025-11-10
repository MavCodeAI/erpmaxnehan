import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Table, { Column } from '../components/ui/Table';
import Button from '../components/ui/Button';
import { InventoryItem, Vendor, Account } from '../types';
import { PlusCircle, FileDown, Search, Edit, Trash2, Package } from 'lucide-react';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import ItemCreatePage from '../components/inventory/AddItemModal';

interface InventoryPageProps {
    items: InventoryItem[];
    onSaveItem: (item: InventoryItem) => void;
    vendors: Vendor[];
    accounts: Account[];
}

const ItemListPage: React.FC<Pick<InventoryPageProps, 'items'>> = ({ items }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: Column<InventoryItem>[] = [
        { header: 'Item Name', accessor: 'name' },
        { header: 'SKU', accessor: 'sku' },
        { header: 'Stock on Hand', accessor: (item) => item.trackInventory ? (item.openingStock || 0) : 'N/A' },
        { header: 'Purchase Price', accessor: (item) => item.costPrice ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(item.costPrice) : 'N/A' },
        { header: 'Selling Price', accessor: (item) => item.sellingPrice ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(item.sellingPrice) : 'N/A' },
        { header: 'Actions', accessor: (item) => (
            <div className="flex space-x-2">
                <Button size="sm" variant="secondary" icon={Edit} title="Edit" onClick={() => navigate(`/inventory/items/${item.id}`)} />
                <Button size="sm" variant="danger" icon={Trash2} title="Delete" />
            </div>
        )},
    ];

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-4 sm:my-6 space-y-3 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200">Inventory Items</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button variant="secondary" icon={FileDown} className="w-full sm:w-auto">Export</Button>
                    <Button variant="primary" icon={PlusCircle} onClick={() => navigate('/inventory/items/new')} className="w-full sm:w-auto">New Item</Button>
                </div>
            </div>
            
            <Card>
                <div className="flex items-center justify-between mb-4">
                     <div className="relative w-full sm:max-w-sm">
                        <div className="absolute inset-y-0 flex items-center pl-2">
                          <Search className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          className="w-full pl-8 pr-2 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border border-gray-300 rounded-md dark:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none form-input"
                          type="text"
                          placeholder="Search by Name or SKU"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                {filteredItems.length === 0 ? (
                    searchTerm ? (
                        <EmptyState
                            icon={Search}
                            title="No items found"
                            description={`No inventory items match "${searchTerm}"`}
                            actionLabel="Clear Search"
                            onAction={() => setSearchTerm('')}
                        />
                    ) : (
                        <EmptyState
                            icon={Package}
                            title="No inventory items yet"
                            description="Start by creating your first inventory item to track stock and manage sales."
                            actionLabel="Create Item"
                            onAction={() => navigate('/inventory/items/new')}
                        />
                    )
                ) : (
                    <Table<InventoryItem> columns={columns} data={filteredItems} />
                )}
            </Card>
        </>
    );
};


const Inventory: React.FC<InventoryPageProps> = (props) => {
    return (
        <Routes>
            <Route index element={<ItemListPage items={props.items} />} />
            <Route path="new" element={<ItemCreatePage {...props} />} />
            <Route path=":id" element={<ItemCreatePage {...props} />} />
        </Routes>
    );
};

export default Inventory;