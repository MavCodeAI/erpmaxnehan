import React, { useState, useMemo } from 'react';
import { InventoryItem, DrilldownState, SourceDocumentType, PurchaseBill, SalesReturn, Invoice, PurchaseReturn } from '../../types';

interface InventoryLedgerProps {
    inventoryItems: InventoryItem[];
    bills: PurchaseBill[];
    salesReturns: SalesReturn[];
    invoices: Invoice[];
    purchaseReturns: PurchaseReturn[];
    startDate: string;
    endDate: string;
    onDrilldown: (nextView: DrilldownState) => void;
}

const InventoryLedger: React.FC<InventoryLedgerProps> = ({ inventoryItems, bills, salesReturns, invoices, purchaseReturns, startDate, endDate, onDrilldown }) => {
    const [selectedItemId, setSelectedItemId] = useState<string>('');

    const transactions = useMemo(() => {
        if (!selectedItemId) return [];
        
        const allTransactions: { date: string; type: string; ref: string; qtyIn: number; qtyOut: number; docType: SourceDocumentType; docId: string }[] = [];
        
        bills.forEach((bill: any) => {
            bill.items.forEach((item: any) => {
                if (item.inventoryItemId === selectedItemId) {
                    allTransactions.push({ date: bill.date, type: 'Purchase', ref: bill.billNumber, qtyIn: item.quantity, qtyOut: 0, docType: 'bill', docId: bill.id });
                }
            });
        });
        
        salesReturns.forEach((sr: any) => {
             sr.items.forEach((item: any) => {
                if (item.inventoryItemId === selectedItemId) {
                    allTransactions.push({ date: sr.date, type: 'Sales Return', ref: sr.returnNumber, qtyIn: item.quantity, qtyOut: 0, docType: 'sales_return', docId: sr.id });
                }
            });
        });

        invoices.forEach((inv: any) => {
            inv.items.forEach((item: any) => {
                if (item.inventoryItemId === selectedItemId) {
                    allTransactions.push({ date: inv.date, type: 'Sale', ref: inv.invoiceNumber, qtyIn: 0, qtyOut: item.quantity, docType: 'invoice', docId: inv.id });
                }
            });
        });
        
        purchaseReturns.forEach((pr: any) => {
             pr.items.forEach((item: any) => {
                if (item.inventoryItemId === selectedItemId) {
                    allTransactions.push({ date: pr.date, type: 'Purchase Return', ref: pr.returnNumber, qtyIn: 0, qtyOut: item.quantity, docType: 'purchase_return', docId: pr.id });
                }
            });
        });

        return allTransactions
          .filter(t => t.date >= startDate && t.date <= endDate)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    }, [selectedItemId, startDate, endDate, bills, salesReturns, invoices, purchaseReturns]);

    const selectedItem = inventoryItems.find((i: InventoryItem) => i.id === selectedItemId);
    let runningBalance = selectedItem ? selectedItem.quantity - transactions.reduce((sum, tx) => sum + tx.qtyIn - tx.qtyOut, 0) : 0; // Simplified opening balance

    return (
        <div>
            <div className="flex items-center space-x-4 mb-4">
                <label htmlFor="inventoryItem" className="font-semibold">Select Item:</label>
                <select id="inventoryItem" value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)} className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md">
                    <option value="">-- Choose an item --</option>
                    {inventoryItems.map((item: InventoryItem) => (
                        <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
                    ))}
                </select>
            </div>
            
            {selectedItemId && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Reference</th>
                                <th className="py-3 px-4 text-right">Qty In</th>
                                <th className="py-3 px-4 text-right">Qty Out</th>
                                <th className="py-3 px-4 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                             <tr>
                                <td colSpan={5} className="py-2 px-4 font-semibold">Opening Balance</td>
                                <td className="py-2 px-4 text-right font-semibold">{runningBalance}</td>
                            </tr>
                            {transactions.map((tx, index) => {
                                runningBalance += tx.qtyIn - tx.qtyOut;
                                return (
                                    <tr key={index}>
                                        <td className="py-2 px-4">{tx.date}</td>
                                        <td className="py-2 px-4">{tx.type}</td>
                                        <td className="py-2 px-4">
                                            <button onClick={() => onDrilldown({type: 'source', sourceType: tx.docType, sourceId: tx.docId})} className="hover:text-primary-600 hover:underline">
                                                {tx.ref}
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 text-right text-green-600">{tx.qtyIn > 0 ? tx.qtyIn : ''}</td>
                                        <td className="py-2 px-4 text-right text-red-600">{tx.qtyOut > 0 ? tx.qtyOut : ''}</td>
                                        <td className="py-2 px-4 text-right">{runningBalance}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                         <tfoot>
                            <tr className="font-bold bg-gray-50 dark:bg-gray-700/50 border-t-2 dark:border-gray-600">
                                <td colSpan={5} className="py-3 px-4">Closing Balance</td>
                                <td className="py-3 px-4 text-right">{runningBalance}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InventoryLedger;