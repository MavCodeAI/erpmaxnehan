
import React, { useMemo } from 'react';
import { Invoice, InventoryItem } from '../../types';
import Table, { Column } from '../ui/Table';

interface SalesByItemProps {
    invoices: Invoice[];
    inventoryItems: InventoryItem[];
    startDate: string;
    endDate: string;
}

interface ItemSalesSummary {
    id: string;
    itemName: string;
    sku: string;
    quantitySold: number;
    totalValue: number;
}

const SalesByItem: React.FC<SalesByItemProps> = ({ invoices, inventoryItems, startDate, endDate }) => {
    
    const itemSales = useMemo(() => {
        const salesMap = new Map<string, ItemSalesSummary>();

        invoices
            .filter(inv => inv.date >= startDate && inv.date <= endDate)
            .flatMap(inv => inv.items)
            .forEach(item => {
                if(item.inventoryItemId) {
                    const summary = salesMap.get(item.inventoryItemId) || {
                        id: item.inventoryItemId,
                        itemName: inventoryItems.find(i => i.id === item.inventoryItemId)?.name || 'Unknown Item',
                        sku: inventoryItems.find(i => i.id === item.inventoryItemId)?.sku || 'N/A',
                        quantitySold: 0,
                        totalValue: 0,
                    };
                    summary.quantitySold += item.quantity;
                    summary.totalValue += item.total;
                    salesMap.set(item.inventoryItemId, summary);
                }
            });

        return Array.from(salesMap.values()).sort((a,b) => b.totalValue - a.totalValue);
    }, [invoices, inventoryItems, startDate, endDate]);

    const columns: Column<ItemSalesSummary>[] = [
        { header: 'Item Name', accessor: 'itemName' },
        { header: 'SKU', accessor: 'sku' },
        { header: 'Quantity Sold', accessor: 'quantitySold' },
        { header: 'Total Value', accessor: (item) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.totalValue) },
    ];
    
     const totalValue = useMemo(() => itemSales.reduce((sum, item) => sum + item.totalValue, 0), [itemSales]);

    return (
         <div>
            <h3 className="text-xl font-semibold mb-2 text-center">Sales by Item</h3>
            <p className="text-center text-sm text-gray-500 mb-6">For the period from {startDate} to {endDate}</p>
            <Table columns={columns} data={itemSales} />
            <div className="flex justify-end mt-4">
                <div className="w-full max-w-xs p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total Value:</span>
                        <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalValue)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesByItem;
