import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import Button from '../ui/Button';
import { PurchaseBill, PurchaseBillItem, Vendor, InventoryItem } from '../../types';
import { Plus, Trash2, Save, X, AlertCircle, Package, Building } from 'lucide-react';
import Card from '../ui/Card';
import { useFormKeyboardNavigation } from '../../hooks/useFormKeyboardNavigation';
import SearchableSelect from '../ui/SearchableSelect';

interface BillCreatePageProps {
    bills: PurchaseBill[];
    onSaveBill: (bill: PurchaseBill) => void;
    inventoryItems: InventoryItem[];
    vendors: Vendor[];
}

const BillCreatePage: React.FC<BillCreatePageProps> = ({ 
    bills, 
    onSaveBill, 
    inventoryItems, 
    vendors 
}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    
    const [bill, setBill] = useState<Partial<PurchaseBill>>({
        billNumber: `BILL-${String(bills.length + 1).padStart(6, '0')}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Unpaid',
        vendorId: '',
        vendorName: '',
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
        notes: 'Please review the bill details.',
        shippingCharges: 0,
        adjustment: 0
    });

    const itemTableRef = useRef<HTMLTableSectionElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const inputClasses = "w-full px-3 py-2 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors";

    // Auto-fill vendor details
    const handleVendorChange = (vendorId: string) => {
        const vendor = vendors.find(v => v.id === vendorId);
        setBill(prev => ({
            ...prev,
            vendorId,
            vendorName: vendor?.displayName || ''
        }));
    };

    // Auto-fill item details
    const handleItemChange = (index: number, field: keyof PurchaseBillItem, value: string | number) => {
        const newItems = [...(bill.items || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // Auto-fill details when inventory item is selected
        if (field === 'inventoryItemId') {
            const item = inventoryItems.find(inv => inv.id === value);
            if (item) {
                newItems[index] = {
                    ...newItems[index],
                    description: item.purchaseDescription || item.name,
                    price: item.costPrice || 0,
                    quantity: 1,
                    discount: 0,
                    tax: 0
                };
            }
        }
        
        // Calculate total
        const quantity = newItems[index].quantity || 0;
        const price = newItems[index].price || 0;
        const discount = newItems[index].discount || 0;
        const tax = newItems[index].tax || 0;
        const subtotalAmount = (quantity * price) - (quantity * price * discount / 100);
        const taxAmount = subtotalAmount * tax / 100;
        newItems[index].total = subtotalAmount + taxAmount;
        
        setBill(prev => ({ ...prev, items: newItems }));
    };

    const addItemRow = () => {
        const newItem: PurchaseBillItem = {
            id: Date.now().toString(),
            inventoryItemId: '',
            description: '',
            quantity: 1,
            price: 0,
            discount: 0,
            tax: 0,
            total: 0
        };
        setBill(prev => ({
            ...prev,
            items: [...(prev.items || []), newItem]
        }));
    };

    const removeItemRow = (index: number) => {
        if ((bill.items?.length || 0) > 1) {
            const newItems = (bill.items || []).filter((_, i) => i !== index);
            setBill(prev => ({ ...prev, items: newItems }));
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
    const { subtotal, totalDiscount, totalTax, total } = useMemo(() => {
        const subtotal = (bill.items || []).reduce((sum, item) => {
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            const discount = item.discount || 0;
            return sum + (quantity * price) - (quantity * price * discount / 100);
        }, 0);
        
        const totalDiscount = (bill.items || []).reduce((sum, item) => {
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            const discount = item.discount || 0;
            return sum + (quantity * price * discount / 100);
        }, 0);
        
        const totalTax = (bill.items || []).reduce((sum, item) => {
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            const discount = item.discount || 0;
            const tax = item.tax || 0;
            const subtotalAmount = (quantity * price) - (quantity * price * discount / 100);
            return sum + (subtotalAmount * tax / 100);
        }, 0);
        
        const total = subtotal + totalTax + (bill.shippingCharges || 0) + (bill.adjustment || 0);
        return { subtotal, totalDiscount, totalTax, total };
    }, [bill.items, bill.shippingCharges, bill.adjustment]);

    const handleSave = () => {
        if (!bill.vendorId) {
            showToast.error('Please select a vendor');
            return;
        }
        if (!bill.items?.some(item => item.inventoryItemId)) {
            showToast.error('Please add at least one item');
            return;
        }
        
        const billToSave: PurchaseBill = {
            id: isEditing ? id! : Date.now().toString(),
            billNumber: bill.billNumber!,
            date: bill.date!,
            dueDate: bill.dueDate!,
            status: bill.status!,
            vendorId: bill.vendorId!,
            vendorName: bill.vendorName!,
            items: bill.items!,
            subtotal,
            totalTax,
            total,
            notes: bill.notes || '',
            shippingCharges: bill.shippingCharges || 0,
            adjustment: bill.adjustment || 0
        };
        
        onSaveBill(billToSave);
        showToast.success('Bill saved successfully');
        navigate('/purchases/bills');
    };

    useFormKeyboardNavigation(formRef);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {isEditing ? 'Edit Bill' : 'Create New Bill'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {isEditing ? 'Update bill details' : 'Add a new purchase bill'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={X} onClick={() => navigate('/purchases/bills')}>
                        Cancel
                    </Button>
                    <Button variant="primary" icon={Save} onClick={handleSave}>
                        Save Bill
                    </Button>
                </div>
            </div>

            <form ref={formRef} className="space-y-6" onKeyDown={handleFormKeyDown}>
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className={labelClasses}>Bill Number</label>
                            <input
                                type="text"
                                value={bill.billNumber}
                                onChange={(e) => setBill(prev => ({ ...prev, billNumber: e.target.value }))}
                                className={inputClasses}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Date*</label>
                            <input
                                type="date"
                                value={bill.date}
                                onChange={(e) => setBill(prev => ({ ...prev, date: e.target.value }))}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Due Date*</label>
                            <input
                                type="date"
                                value={bill.dueDate}
                                onChange={(e) => setBill(prev => ({ ...prev, dueDate: e.target.value }))}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Status</label>
                            <select
                                value={bill.status}
                                onChange={(e) => setBill(prev => ({ ...prev, status: e.target.value as PurchaseBill['status'] }))}
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
                            <label className={labelClasses}>Vendor*</label>
                            <SearchableSelect
                                value={bill.vendorId || ''}
                                onChange={handleVendorChange}
                                onKeyDown={handleFormKeyDown}
                                options={vendors.map(v => ({ value: v.id, label: v.displayName }))}
                                placeholder="Select a vendor..."
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Vendor Name</label>
                            <input
                                type="text"
                                value={bill.vendorName}
                                readOnly
                                className={`${inputClasses} bg-gray-50 dark:bg-gray-800`}
                                placeholder="Auto-filled from vendor selection"
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Bill Items
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
                                        Cost
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 w-24">
                                        Discount
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 w-24">
                                        Tax
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 w-32">
                                        Amount
                                    </th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody ref={itemTableRef}>
                                {(bill.items || []).map((item, index) => (
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
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={item.tax || ''}
                                                onChange={e => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
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
                                                disabled={(bill.items || []).length <= 1}
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
                            <label className={labelClasses}>Vendor Notes</label>
                            <textarea
                                rows={3}
                                value={bill.notes}
                                onChange={e => setBill(prev => ({ ...prev, notes: e.target.value }))}
                                className={inputClasses}
                                placeholder="Add any notes for the vendor..."
                            />
                        </div>
                    </Card>

                    <Card className="p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Bill Summary
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
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Total Tax</span>
                                <span className="font-medium">PKR {totalTax.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <label className={labelClasses}>Shipping Charges</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={bill.shippingCharges || ''}
                                    onChange={e => setBill(prev => ({ ...prev, shippingCharges: parseFloat(e.target.value) || 0 }))}
                                    className={`${inputClasses} w-32 text-right`}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <label className={labelClasses}>Adjustment</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={bill.adjustment || ''}
                                    onChange={e => setBill(prev => ({ ...prev, adjustment: parseFloat(e.target.value) || 0 }))}
                                    className={`${inputClasses} w-32 text-right`}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="border-t dark:border-gray-700 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total</span>
                                    <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
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

export default BillCreatePage;
