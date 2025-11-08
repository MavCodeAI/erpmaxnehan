import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PurchaseBill, InventoryItem, Vendor } from '../types';
import BillsListPage from '../components/purchases/BillsListPage';
import BillCreatePage from '../components/purchases/BillCreatePage';

interface PurchasesProps {
    bills: PurchaseBill[];
    onSaveBill: (bill: PurchaseBill) => void;
    onDeleteBill: (billId: string) => void;
    inventoryItems: InventoryItem[];
    vendors: Vendor[];
}

const Purchases: React.FC<PurchasesProps> = (props) => {
    return (
        <Routes>
            <Route index element={<BillsListPage {...props} />} />
            <Route path="new" element={<BillCreatePage {...props} />} />
            <Route path=":id" element={<BillCreatePage {...props} />} />
        </Routes>
    );
};

export default Purchases;
