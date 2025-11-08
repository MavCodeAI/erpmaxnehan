import React, { useMemo } from 'react';
import { AllTransactions, SourceDocumentType, Invoice, PurchaseBill, JournalVoucher, CustomerPayment, VendorPayment, SalesReturn, PurchaseReturn, CashPaymentVoucher, CashReceiptVoucher, BankPaymentVoucher, BankReceiptVoucher } from '../../types';

interface SourceDocumentViewerProps extends AllTransactions {
    sourceType: SourceDocumentType;
    sourceId: string;
}

const SourceDocumentViewer: React.FC<SourceDocumentViewerProps> = (props) => {
    const { sourceType, sourceId } = props;

    const document = useMemo(() => {
        switch(sourceType) {
            case 'invoice': return props.invoices.find(d => d.id === sourceId);
            case 'bill': return props.bills.find(d => d.id === sourceId);
            case 'customer_payment': return props.customerPayments.find(d => d.id === sourceId);
            case 'vendor_payment': return props.vendorPayments.find(d => d.id === sourceId);
            case 'sales_return': return props.salesReturns.find(d => d.id === sourceId);
            case 'purchase_return': return props.purchaseReturns.find(d => d.id === sourceId);
            case 'journal_voucher': return props.journalVouchers.find(d => d.id === sourceId);
            case 'cash_payment': return props.cashPayments.find(d => d.id === sourceId);
            case 'cash_receipt': return props.cashReceipts.find(d => d.id === sourceId);
            case 'bank_payment': return props.bankPayments.find(d => d.id === sourceId);
            case 'bank_receipt': return props.bankReceipts.find(d => d.id === sourceId);
            default: return null;
        }
    }, [sourceType, sourceId, props]);
    
    const renderHeader = (title: string, number: string, date: string, details: {label: string, value: string}[]) => (
        <div className="flex justify-between items-start mb-8 pb-4 border-b dark:border-gray-700">
            <div>
                <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400 uppercase">{title}</h2>
                <p><strong>#</strong> {number}</p>
                <p><strong>Date:</strong> {date}</p>
            </div>
            <div className="text-right">
                {details.map(d => <div key={d.label}><strong>{d.label}:</strong><p className="text-gray-600 dark:text-gray-300">{d.value}</p></div>)}
            </div>
        </div>
    );

    const renderItemsTable = (items: any[], columns: {header: string, key: string, align?: 'right'}[], total: number) => (
        <>
            <table className="w-full text-sm mb-6">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        {columns.map(c => <th key={c.key} className={`p-3 font-semibold text-${c.align || 'left'}`}>{c.header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.id || index} className="border-b dark:border-gray-600">
                             {columns.map(c => <td key={c.key} className={`p-3 text-${c.align || 'left'}`}>
                                {c.key.toLowerCase().includes('amount') || c.key.toLowerCase().includes('total') || c.key.toLowerCase().includes('price') || c.key.toLowerCase().includes('debit') || c.key.toLowerCase().includes('credit')
                                ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item[c.key])
                                : item[c.key]
                                }
                            </td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end">
                <div className="w-full max-w-xs">
                    <div className="flex justify-between font-bold text-lg bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <span>Total:</span>
                        <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total)}</span>
                    </div>
                </div>
            </div>
        </>
    );

    const renderInvoice = (doc: Invoice) => (
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
            {renderHeader('Invoice', doc.invoiceNumber, doc.date, [{label: 'Bill To', value: doc.customerName}, {label: 'Due Date', value: doc.dueDate}])}
            {renderItemsTable(doc.items, 
                [ {header: 'Description', key: 'description'}, {header: 'Quantity', key: 'quantity', align: 'right'}, {header: 'Price', key: 'price', align: 'right'}, {header: 'Total', key: 'total', align: 'right'}],
                doc.total)}
        </div>
    );
    
    const renderBill = (doc: PurchaseBill) => (
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
            {renderHeader('Purchase Bill', doc.billNumber, doc.date, [{label: 'From Vendor', value: doc.vendorName}, {label: 'Due Date', value: doc.dueDate}])}
            {renderItemsTable(doc.items, 
                [ {header: 'Description', key: 'description'}, {header: 'Quantity', key: 'quantity', align: 'right'}, {header: 'Price', key: 'price', align: 'right'}, {header: 'Total', key: 'total', align: 'right'}],
                doc.total)}
        </div>
    );
    
    const renderJournalVoucher = (doc: JournalVoucher) => (
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
            {renderHeader('Journal Voucher', doc.voucherNumber, doc.date, [{label: 'Narration', value: doc.narration}])}
             {renderItemsTable(doc.entries, 
                [ {header: 'Account', key: 'accountName'}, {header: 'Debit', key: 'debit', align: 'right'}, {header: 'Credit', key: 'credit', align: 'right'} ],
                doc.totalDebit)}
        </div>
    );
    
    const renderCashOrBankVoucher = (doc: CashPaymentVoucher | CashReceiptVoucher | BankPaymentVoucher | BankReceiptVoucher, title: string) => (
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
             {renderHeader(title, doc.voucherNumber, doc.date, 'bankAccountName' in doc ? [{label: 'Bank', value: doc.bankAccountName}] : [])}
             {renderItemsTable(doc.entries, 
                [ {header: 'Account', key: 'accountName'}, {header: 'Narration', key: 'narration'}, {header: 'Amount', key: 'amount', align: 'right'} ],
                doc.totalAmount)}
        </div>
    );

    const renderPayment = (doc: CustomerPayment | VendorPayment, title: string, partyType: 'Customer' | 'Vendor') => (
         <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
            {renderHeader(title, doc.paymentNumber, doc.date, [
                {label: partyType, value: 'customerName' in doc ? doc.customerName : doc.vendorName},
                {label: 'Payment Method', value: doc.paymentMethod}
            ])}
            <h3 className="font-semibold mb-2">Applied Documents</h3>
            {/* Fix: Safely determine the document ID key based on payment type to avoid type errors and potential runtime errors. */}
            {renderItemsTable('appliedInvoices' in doc ? doc.appliedInvoices : doc.appliedBills, 
                [ {header: 'Document ID', key: 'appliedInvoices' in doc ? 'invoiceId' : 'billId'}, {header: 'Amount Applied', key: 'amount', align: 'right'}],
                doc.amount)}
        </div>
    );

    if (!document) return <div className="text-center p-8">Document not found or not supported.</div>;
    
    switch (sourceType) {
        case 'invoice': return renderInvoice(document as Invoice);
        case 'bill': return renderBill(document as PurchaseBill);
        case 'journal_voucher': return renderJournalVoucher(document as JournalVoucher);
        case 'cash_payment': return renderCashOrBankVoucher(document as CashPaymentVoucher, 'Cash Payment');
        case 'cash_receipt': return renderCashOrBankVoucher(document as CashReceiptVoucher, 'Cash Receipt');
        case 'bank_payment': return renderCashOrBankVoucher(document as BankPaymentVoucher, 'Bank Payment');
        case 'bank_receipt': return renderCashOrBankVoucher(document as BankReceiptVoucher, 'Bank Receipt');
        case 'customer_payment': return renderPayment(document as CustomerPayment, 'Customer Payment', 'Customer');
        case 'vendor_payment': return renderPayment(document as VendorPayment, 'Vendor Payment', 'Vendor');
        // Add renderers for returns etc.
        default: return <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded">{JSON.stringify(document, null, 2)}</pre>;
    }
};

export default SourceDocumentViewer;