import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Table, { Column } from '../components/ui/Table';
import Button from '../components/ui/Button';
import { InventoryItem, Vendor, Account } from '../types';
import { PlusCircle, FileDown, Search, Edit, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
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
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Inventory Items</h2>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={FileDown}>Export</Button>
                    <Button variant="primary" icon={PlusCircle} onClick={() => navigate('/inventory/items/new')}>New Item</Button>
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
                          placeholder="Search by Name or SKU"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <Table<InventoryItem> columns={columns} data={filteredItems} />
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