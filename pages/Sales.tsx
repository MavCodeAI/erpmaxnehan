import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InvoicesListPage from '../components/sales/InvoicesListPage';
import InvoiceCreatePage from '../components/sales/InvoiceCreatePage';
import { Invoice, InventoryItem, Customer } from '../types';

interface SalesProps {
    invoices: Invoice[];
    onSaveInvoice: (invoice: Invoice) => void;
    onDeleteInvoice: (invoiceId: string) => void;
    inventoryItems: InventoryItem[];
    customers: Customer[];
}

const Sales: React.FC<SalesProps> = (props) => {
    return (
        <Routes>
            <Route index element={<InvoicesListPage {...props} />} />
            <Route path="new" element={<InvoiceCreatePage {...props} />} />
            <Route path=":id" element={<InvoiceCreatePage {...props} />} />
        </Routes>
    );
};

export default Sales;
