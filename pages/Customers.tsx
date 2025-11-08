import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerListPage from '../components/customers/CustomerListPage';
import CustomerCreatePage from '../components/customers/CustomerCreatePage';
import { Customer, Invoice, CustomerPayment } from '../types';

interface CustomersProps {
    customers: Customer[];
    onSave: (customer: Customer) => void;
    onDelete: (customerId: string) => void;
    invoices: Invoice[];
    customerPayments: CustomerPayment[];
}

const Customers: React.FC<CustomersProps> = (props) => {
    return (
        <Routes>
            <Route index element={<CustomerListPage {...props} />} />
            <Route path="new" element={<CustomerCreatePage {...props} />} />
            <Route path=":id" element={<CustomerCreatePage {...props} />} />
        </Routes>
    );
};

export default Customers;