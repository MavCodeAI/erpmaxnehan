import React, { useState } from 'react';
import { Invoice, PurchaseBill, DrilldownState } from '../../types';
import Table, { Column } from '../ui/Table';

interface SalesAndPurchasesReportProps {
    invoices: Invoice[];
    bills: PurchaseBill[];
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

const SalesAndPurchasesReport: React.FC<SalesAndPurchasesReportProps> = ({ invoices, bills, startDate, endDate, onDrilldown }) => {
    const [activeTab, setActiveTab] = useState<'sales' | 'purchases'>('sales');

    const filterByDate = (date: string) => date >= startDate && date <= endDate;

    const salesColumns: Column<Invoice>[] = [
        { header: 'Invoice #', accessor: (item: Invoice) => (
            <button onClick={() => onDrilldown({type: 'source', sourceType: 'invoice', sourceId: item.id})} className="hover:text-primary-600 hover:underline">
                {item.invoiceNumber}
            </button>
        )},
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Date', accessor: 'date' },
        { header: 'Amount', accessor: (item) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.total) },
        { header: 'Status', accessor: 'status' },
    ];
    
    const purchaseColumns: Column<PurchaseBill>[] = [
         { header: 'Bill #', accessor: (item: PurchaseBill) => (
            <button onClick={() => onDrilldown({type: 'source', sourceType: 'bill', sourceId: item.id})} className="hover:text-primary-600 hover:underline">
                {item.billNumber}
            </button>
        )},
        { header: 'Vendor', accessor: 'vendorName' },
        { header: 'Date', accessor: 'date' },
        { header: 'Amount', accessor: (item) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.total) },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div>
            <div className="flex border-b dark:border-gray-700 mb-4">
                <button
                    onClick={() => setActiveTab('sales')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'sales' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
                >
                    Sales
                </button>
                 <button
                    onClick={() => setActiveTab('purchases')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'purchases' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
                >
                    Purchases
                </button>
            </div>
            
            {activeTab === 'sales' && <Table columns={salesColumns} data={invoices.filter(inv => filterByDate(inv.date))} />}
            {activeTab === 'purchases' && <Table columns={purchaseColumns} data={bills.filter(bill => filterByDate(bill.date))} />}
        </div>
    );
};

export default SalesAndPurchasesReport;