
import React, { useMemo } from 'react';
import { Invoice } from '../../types';
import Table, { Column } from '../ui/Table';

interface SalesByCustomerProps {
    invoices: Invoice[];
    startDate: string;
    endDate: string;
}

interface CustomerSalesSummary {
    id: string;
    customerName: string;
    invoiceCount: number;
    totalSales: number;
}

const SalesByCustomer: React.FC<SalesByCustomerProps> = ({ invoices, startDate, endDate }) => {
    
    const customerSales = useMemo(() => {
        const salesMap = new Map<string, CustomerSalesSummary>();

        invoices
            .filter(inv => inv.date >= startDate && inv.date <= endDate)
            .forEach(inv => {
                const summary = salesMap.get(inv.customerId) || {
                    id: inv.customerId,
                    customerName: inv.customerName,
                    invoiceCount: 0,
                    totalSales: 0,
                };
                summary.invoiceCount += 1;
                summary.totalSales += inv.total;
                salesMap.set(inv.customerId, summary);
            });

        return Array.from(salesMap.values()).sort((a,b) => b.totalSales - a.totalSales);
    }, [invoices, startDate, endDate]);

    const columns: Column<CustomerSalesSummary>[] = [
        { header: 'Customer Name', accessor: 'customerName' },
        { header: 'Number of Invoices', accessor: 'invoiceCount' },
        { header: 'Total Sales', accessor: (item) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.totalSales) },
    ];
    
    const totalSales = useMemo(() => customerSales.reduce((sum, item) => sum + item.totalSales, 0), [customerSales]);

    return (
         <div>
            <h3 className="text-xl font-semibold mb-2 text-center">Sales by Customer</h3>
            <p className="text-center text-sm text-gray-500 mb-6">For the period from {startDate} to {endDate}</p>
            <Table columns={columns} data={customerSales} />
             <div className="flex justify-end mt-4">
                <div className="w-full max-w-xs p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total Sales:</span>
                        <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalSales)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesByCustomer;
