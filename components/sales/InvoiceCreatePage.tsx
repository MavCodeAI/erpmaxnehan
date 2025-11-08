import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import Button from '../ui/Button';
import { Invoice, InvoiceItem, Customer, InventoryItem } from '../../types';
import { Plus, Trash2, Save, Send, X, Download, AlertCircle, Package, User } from 'lucide-react';
import Card from '../ui/Card';
import { useFormKeyboardNavigation } from '../../hooks/useFormKeyboardNavigation';
import SearchableSelect from '../ui/SearchableSelect';

interface InvoiceCreatePageProps {
    invoices: Invoice[];
    onSaveInvoice: (invoice: Invoice) => void;
    inventoryItems: InventoryItem[];
    customers: Customer[];
}

const InvoiceCreatePage: React.FC<InvoiceCreatePageProps> = ({ 
    invoices, 
    onSaveInvoice, 
    inventoryItems, 
    customers 
}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    
    const [invoice, setInvoice] = useState<Partial<Invoice>>({
        invoiceNumber: `INV-${String(invoices.length + 1).padStart(6, '0')}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Draft',
        customerId: '',
        customerName: '',
        items: [{
            id: '1',
            inventoryItemId: '',
            description: '',
            quantity: 1,
            price: 0,
            discount: 0,
            tax: 0,
            total: 0
        }],
        subtotal: 0,
        totalTax: 0,
        total: 0,
        notes: 'Thanks for your business.',
        shippingCharges: 0,
        adjustment: 0
    });

    const itemTableRef = useRef<HTMLTableSectionElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const inputClasses = "w-full px-3 py-2 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors";

    // Auto-fill customer details
    const handleCustomerChange = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        setInvoice(prev => ({
            ...prev,
            customerId,
            customerName: customer?.displayName || ''
        }));
    };

    // Auto-fill item details
    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...(invoice.items || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // Auto-fill details when inventory item is selected
        if (field === 'inventoryItemId') {
            const item = inventoryItems.find(inv => inv.id === value);
            if (item) {
                newItems[index] = {
                    ...newItems[index],
                    description: item.salesDescription || item.name,
                    price: item.sellingPrice || 0,
                    quantity: 1,
                    discount: 0
                };
            }
        }
        
        // Calculate total
        const quantity = newItems[index].quantity || 0;
        const price = newItems[index].price || 0;
        const discount = newItems[index].discount || 0;
        newItems[index].total = (quantity * price) - (quantity * price * discount / 100);
        
        setInvoice(prev => ({ ...prev, items: newItems }));
    };

    const addItemRow = () => {
        const newItem: InvoiceItem = {
            id: Date.now().toString(),
            inventoryItemId: '',
            description: '',
            quantity: 1,
            price: 0,
            discount: 0,
            tax: 0,
            total: 0
        };
        setInvoice(prev => ({
            ...prev,
            items: [...(prev.items || []), newItem]
        }));
    };

    const removeItemRow = (index: number) => {
        if ((invoice.items?.length || 0) > 1) {
            const newItems = (invoice.items || []).filter((_, i) => i !== index);
            setInvoice(prev => ({ ...prev, items: newItems }));
        }
    };

    const handleFormKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSave();
        }
    };

    const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Move to quantity field
            const quantityInput = document.querySelector(`input[data-item-quantity="${index}"]`) as HTMLInputElement;
            if (quantityInput) quantityInput.focus();
        }
    };

    // Calculate totals
    const { subtotal, totalDiscount, total } = useMemo(() => {
        const subtotal = (invoice.items || []).reduce((sum, item) => sum + (item.total || 0), 0);
        const totalDiscount = (invoice.items || []).reduce((sum, item) => {
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            const discount = item.discount || 0;
            return sum + (quantity * price * discount / 100);
        }, 0);
        const total = subtotal + (invoice.shippingCharges || 0) + (invoice.adjustment || 0);
        return { subtotal, totalDiscount, total };
    }, [invoice.items, invoice.shippingCharges, invoice.adjustment]);

    const handleSave = () => {
        if (!invoice.customerId) {
            showToast.error('Please select a customer');
            return;
        }
        if (!invoice.items?.some(item => item.inventoryItemId)) {
            showToast.error('Please add at least one item');
            return;
        }
        
        const invoiceToSave: Invoice = {
            id: isEditing ? id! : Date.now().toString(),
            invoiceNumber: invoice.invoiceNumber!,
            date: invoice.date!,
            dueDate: invoice.dueDate!,
            status: invoice.status!,
            customerId: invoice.customerId!,
            customerName: invoice.customerName!,
            items: invoice.items!,
            subtotal,
            totalTax: 0,
            total,
            notes: invoice.notes || '',
            shippingCharges: invoice.shippingCharges || 0,
            adjustment: invoice.adjustment || 0
        };
        
        onSaveInvoice(invoiceToSave);
        showToast.success('Invoice saved successfully');
        navigate('/sales/invoices');
    };

    useFormKeyboardNavigation(formRef);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {isEditing ? 'Edit Invoice' : 'Create New Invoice'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {isEditing ? 'Update invoice details' : 'Add a new sales invoice'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={X} onClick={() => navigate('/sales/invoices')}>
                        Cancel
                    </Button>
                    <Button variant="primary" icon={Save} onClick={handleSave}>
                        Save Invoice
                    </Button>
                </div>
            </div>

            <form ref={formRef} className="space-y-6" onKeyDown={handleFormKeyDown}>
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className={labelClasses}>Invoice Number</label>
                            <input
                                type="text"
                                value={invoice.invoiceNumber}
                                onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                                className={inputClasses}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Date*</label>
                            <input
                                type="date"
                                value={invoice.date}
                                onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Due Date*</label>
                            <input
                                type="date"
                                value={invoice.dueDate}
                                onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Status</label>
                            <select
                                value={invoice.status}
                                onChange={(e) => setInvoice(prev => ({ ...prev, status: e.target.value as Invoice['status'] }))}
                                className={inputClasses}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Unpaid">Unpaid</option>
                                <option value="Paid">Paid</option>
                                <option value="Partially Paid">Partially Paid</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className={labelClasses}>Customer*</label>
                            <SearchableSelect
                                value={invoice.customerId || ''}
                                onChange={handleCustomerChange}
                                onKeyDown={handleFormKeyDown}
                                options={customers.map(c => ({ value: c.id, label: c.displayName }))}
                                placeholder="Select a customer..."
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Customer Name</label>
                            <input
                                type="text"
                                value={invoice.customerName}
                                readOnly
                                className={`${inputClasses} bg-gray-50 dark:bg-gray-800`}
                                placeholder="Auto-filled from customer selection"
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Invoice Items
                        </h3>
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            icon={Plus}
                            onClick={() => navigate('/inventory/items/new')}
                            className="text-xs"
                        >
                            Add New Item
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Item Details
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 w-24">
                                        Quantity
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 w-32">
                                        Rate
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 w-24">
                                        Discount
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 w-32">
                                        Amount
                                    </th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody ref={itemTableRef}>
                                {(invoice.items || []).map((item, index) => (
                                    <tr key={item.id} className="border-b dark:border-gray-700">
                                        <td className="py-3 px-4">
                                            <SearchableSelect
                                                value={item.inventoryItemId || ''}
                                                onChange={(value) => handleItemChange(index, 'inventoryItemId', value)}
                                                onKeyDown={(e) => handleItemKeyDown(e, index)}
                                                options={inventoryItems.map(inv => ({ 
                                                    value: inv.id, 
                                                    label: `${inv.name} - ${inv.sku} (Stock: ${inv.openingStock || 0})` 
                                                }))}
                                                placeholder="Select an item..."
                                            />
                                            {item.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {item.description}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={item.quantity || ''}
                                                onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                className={`${inputClasses} text-right w-20`}
                                                data-item-quantity={index}
                                                placeholder="1"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.price || ''}
                                                onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                                className={`${inputClasses} text-right w-24`}
                                                placeholder="0.00"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={item.discount || ''}
                                                onChange={e => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                                                className={`${inputClasses} text-right w-20`}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-lg">
                                            PKR {item.total.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="danger"
                                                icon={Trash2}
                                                onClick={() => removeItemRow(index)}
                                                disabled={(invoice.items || []).length <= 1}
                                                title="Remove Item"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        icon={Plus}
                        onClick={addItemRow}
                        className="mt-4"
                    >
                        Add New Row
                    </Button>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Additional Information
                        </h3>
                        <div>
                            <label className={labelClasses}>Customer Notes</label>
                            <textarea
                                rows={3}
                                value={invoice.notes}
                                onChange={e => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                                className={inputClasses}
                                placeholder="Add any notes for the customer..."
                            />
                        </div>
                    </Card>

                    <Card className="p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Invoice Summary
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Sub Total</span>
                                <span className="font-medium">PKR {subtotal.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Total Discount</span>
                                <span className="font-medium">PKR {totalDiscount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <label className={labelClasses}>Shipping Charges</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={invoice.shippingCharges || ''}
                                    onChange={e => setInvoice(prev => ({ ...prev, shippingCharges: parseFloat(e.target.value) || 0 }))}
                                    className={`${inputClasses} w-32 text-right`}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <label className={labelClasses}>Adjustment</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={invoice.adjustment || ''}
                                    onChange={e => setInvoice(prev => ({ ...prev, adjustment: parseFloat(e.target.value) || 0 }))}
                                    className={`${inputClasses} w-32 text-right`}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="border-t dark:border-gray-700 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total</span>
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        PKR {total.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default InvoiceCreatePage;
