import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table, { Column } from '../components/ui/Table';
import AddCustomerPaymentModal from '../components/payments/AddCustomerPaymentModal';
import AddVendorPaymentModal from '../components/payments/AddVendorPaymentModal';
import { Customer, Vendor, Invoice, PurchaseBill, CustomerPayment, VendorPayment } from '../types';
import { PlusCircle } from 'lucide-react';

interface PaymentsProps {
    customers: Customer[];
    vendors: Vendor[];
    invoices: Invoice[];
    bills: PurchaseBill[];
    customerPayments: CustomerPayment[];
    vendorPayments: VendorPayment[];
    onSaveCustomerPayment: (payment: CustomerPayment) => void;
    onSaveVendorPayment: (payment: VendorPayment) => void;
}

type PaymentTab = 'customer' | 'vendor';

const Payments: React.FC<PaymentsProps> = (props) => {
    const [activeTab, setActiveTab] = useState<PaymentTab>('customer');
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [isVendorModalOpen, setVendorModalOpen] = useState(false);

    const customerPaymentColumns: Column<CustomerPayment>[] = [
        { header: 'Payment #', accessor: 'paymentNumber' },
        { header: 'Date', accessor: 'date' },
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Amount', accessor: (item) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.amount) },
        { header: 'Payment Method', accessor: 'paymentMethod' },
    ];
    
    const vendorPaymentColumns: Column<VendorPayment>[] = [
        { header: 'Payment #', accessor: 'paymentNumber' },
        { header: 'Date', accessor: 'date' },
        { header: 'Vendor', accessor: 'vendorName' },
        { header: 'Amount', accessor: (item) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.amount) },
        { header: 'Payment Method', accessor: 'paymentMethod' },
    ];

    const renderContent = () => {
        if (activeTab === 'customer') {
            return (
                <>
                    <div className="flex justify-end mb-4">
                        <Button icon={PlusCircle} onClick={() => setCustomerModalOpen(true)}>
                            New Customer Payment
                        </Button>
                    </div>
                    <Table<CustomerPayment> columns={customerPaymentColumns} data={props.customerPayments} />
                </>
            );
        }
        if (activeTab === 'vendor') {
            return (
                <>
                    <div className="flex justify-end mb-4">
                         <Button icon={PlusCircle} onClick={() => setVendorModalOpen(true)}>
                            New Vendor Payment
                        </Button>
                    </div>
                    <Table<VendorPayment> columns={vendorPaymentColumns} data={props.vendorPayments} />
                </>
            );
        }
    };

    return (
        <>
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Payments
            </h2>

            <Card>
                <div className="flex border-b dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('customer')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'customer' ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        Customer Payments (Receipts)
                    </button>
                    <button
                        onClick={() => setActiveTab('vendor')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'vendor' ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        Vendor Payments
                    </button>
                </div>
                <div className="mt-6">
                    {renderContent()}
                </div>
            </Card>

            <AddCustomerPaymentModal 
                isOpen={isCustomerModalOpen}
                onClose={() => setCustomerModalOpen(false)}
                onSave={props.onSaveCustomerPayment}
                customers={props.customers}
                invoices={props.invoices}
                customerPayments={props.customerPayments}
                lastPaymentNumber={props.customerPayments[0]?.paymentNumber || 'RCPT-000'}
            />

            <AddVendorPaymentModal
                isOpen={isVendorModalOpen}
                onClose={() => setVendorModalOpen(false)}
                onSave={props.onSaveVendorPayment}
                vendors={props.vendors}
                bills={props.bills}
                vendorPayments={props.vendorPayments}
                lastPaymentNumber={props.vendorPayments[0]?.paymentNumber || 'PAY-000'}
            />
        </>
    );
};

export default Payments;