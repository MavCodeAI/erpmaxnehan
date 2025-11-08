import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import Button from '../ui/Button';
import { PurchaseBill, PurchaseBillItem, Vendor, InventoryItem } from '../../types';
import { Plus, Trash2, Save, X } from 'lucide-react';
import Card from '../ui/Card';
import { useFormKeyboardNavigation } from '../../hooks/useFormKeyboardNavigation';
import SearchableSelect from '../ui/SearchableSelect';

interface BillCreatePageProps {
    bills: PurchaseBill[];
    onSaveBill: (bill: PurchaseBill) => void;
    inventoryItems: InventoryItem[];
    vendors: Vendor[];
}

const BillCreatePage: React.FC<BillCreatePageProps> = ({ bills, onSaveBill, inventoryItems, vendors }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [bill, setBill] = useState<Partial<PurchaseBill>>({});
    const formRef = useRef<HTMLFormElement>(null);
    const itemTableRef = useRef<HTMLTableSectionElement>(null);
    const { handleKeyDown: handleFormKeyDown } = useFormKeyboardNavigation(formRef);

    useEffect(() => {
        if (isEditMode) {
            const existingBill = bills.find(b => b.id === id);
            if (existingBill) {
                setBill(existingBill);
            }
        } else {
            const lastBillNumber = bills[0]?.billNumber || 'BILL-000000';
            const parts = lastBillNumber.split('-');
            const newNum = (parseInt(parts[parts.length - 1], 10) + 1).toString().padStart(6, '0');
            const newBillNumber = `BILL-${newNum}`;

            setBill({
                billNumber: newBillNumber,
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                items: [{ id: '1', description: '', quantity: 1, price: 0, total: 0 }],
                shippingCharges: 0,
                adjustment: 0,
                status: 'Draft',
            });
        }
    }, [id, isEditMode, bills]);

    useEffect(() => {
        if ((bill.items?.length || 0) > 1) {
            const lastRow = itemTableRef.current?.lastElementChild;
            const firstInput = lastRow?.querySelector('input, select');
            if (firstInput) {
                (firstInput as HTMLElement).focus();
            }
        }
    }, [bill.items?.length]);

    const handleVendorChange = (vendorId: string) => {
        const vendor = vendors.find(v => v.id === vendorId);
        // FIX: Use 'displayName' as 'name' does not exist on the Vendor type.
        setBill(prev => ({ ...prev, vendorId, vendorName: vendor?.displayName || '' }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBill(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof PurchaseBillItem, value: string | number) => {
        const newItems = [...(bill.items || [])];
        const currentItem = { ...newItems[index] };

        if (field === 'inventoryItemId') {
            const selectedItem = inventoryItems.find(inv => inv.id === value);
            currentItem.inventoryItemId = selectedItem?.id;
            currentItem.description = selectedItem?.name || '';
            currentItem.price = selectedItem?.price || 0;
        } else {
            const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
            (currentItem as any)[field] = field === 'description' ? value : numericValue;
        }
        
        const qty = currentItem.quantity || 0;
        const price = currentItem.price || 0;
        currentItem.total = qty * price;

        newItems[index] = currentItem;
        setBill(prev => ({ ...prev, items: newItems }));
    };

    const addItemRow = () => {
        const newItems = [...(bill.items || [])];
        newItems.push({ id: new Date().getTime().toString(), description: '', quantity: 1, price: 0, total: 0 });
        setBill(prev => ({ ...prev, items: newItems }));
    };

    const removeItemRow = (index: number) => {
        if (bill.items && bill.items.length > 1) {
            const newItems = bill.items.filter((_, i) => i !== index);
            setBill(prev => ({ ...prev, items: newItems }));
        }
    };

    const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            const target = e.target as HTMLElement;
            const isLastField = target.closest('td')?.nextElementSibling?.querySelector('button[title="Remove Item"]') !== null;
            const isLastRow = index === (bill.items?.length || 0) - 1;

            if (isLastField && isLastRow) {
                 e.preventDefault();
                 const currentItem = (bill.items || [])[index];
                 if (currentItem.description || currentItem.price > 0 || currentItem.quantity > 0) {
                    addItemRow();
                 }
            } else {
                handleFormKeyDown(e);
            }
        }
    };

    const subTotal = useMemo(() => bill.items?.reduce((sum, item) => sum + item.total, 0) || 0, [bill.items]);
    const total = useMemo(() => {
        return subTotal + (bill.shippingCharges || 0) + (bill.adjustment || 0);
    }, [subTotal, bill.shippingCharges, bill.adjustment]);

    const handleSave = (status: PurchaseBill['status']) => {
        if (!bill.vendorId || !bill.items || bill.items.length === 0) {
            showToast.error("Please select a vendor and add at least one item.");
            return;
        }
        
        const billToSave: PurchaseBill = {
            id: isEditMode && id ? id : new Date().getTime().toString(),
            billNumber: bill.billNumber!,
            vendorId: bill.vendorId!,
            vendorName: bill.vendorName!,
            date: bill.date!,
            dueDate: bill.dueDate!,
            items: bill.items.map(item => ({...item, total: item.total || 0})),
            shippingCharges: bill.shippingCharges || 0,
            adjustment: bill.adjustment || 0,
            total: total,
            status: status,
        };

        onSaveBill(billToSave);
        navigate('/purchases/bills');
    };

    if (!bill || Object.keys(bill).length === 0) {
        return <div>Loading...</div>;
    }
    
    const inputClasses = "w-full px-3 py-2 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
      <>
        <div className="flex justify-between items-center my-6">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                {isEditMode ? `Edit Bill #${bill.billNumber}` : 'New Bill'}
            </h2>
             <div className="flex space-x-2">
                <Button variant="secondary" icon={X} onClick={() => navigate('/purchases/bills')}>Cancel</Button>
                <Button variant="primary" icon={Save} onClick={() => handleSave('Unpaid')}>Save Bill</Button>
            </div>
        </div>
        <form ref={formRef}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div>
                        <label htmlFor="vendorId" className={labelClasses}>Vendor*</label>
                        <SearchableSelect
                            value={bill.vendorId || ''}
                            onChange={handleVendorChange}
                            onKeyDown={handleFormKeyDown}
                            // FIX: Use 'displayName' as 'name' does not exist on the Vendor type.
                            options={vendors.map(v => ({ value: v.id, label: v.displayName }))}
                            placeholder="Select a vendor"
                        />
                    </div>
                    <div className="md:col-start-4">
                         <div>
                            <label htmlFor="billNumber" className={labelClasses}>Bill #</label>
                            <input id="billNumber" name="billNumber" type="text" value={bill.billNumber || ''} onChange={handleInputChange} onKeyDown={handleFormKeyDown} className={inputClasses} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div>
                        <label htmlFor="date" className={labelClasses}>Bill Date</label>
                        <input id="date" name="date" type="date" value={bill.date || ''} onChange={handleInputChange} onKeyDown={handleFormKeyDown} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className={labelClasses}>Due Date</label>
                        <input id="dueDate" name="dueDate" type="date" value={bill.dueDate || ''} onChange={handleInputChange} onKeyDown={handleFormKeyDown} className={inputClasses} />
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr className="text-left text-gray-600 dark:text-gray-400">
                                <th className="font-semibold p-2 w-[25%]">Item Details</th>
                                <th className="font-semibold p-2 text-right w-24">Quantity</th>
                                <th className="font-semibold p-2 text-right w-32">Rate</th>
                                <th className="font-semibold p-2 text-right w-32">Amount</th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody ref={itemTableRef}>
                            {(bill.items || []).map((item, index) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        <input type="text" value={item.description || ''} onChange={e => handleItemChange(index, 'description', e.target.value)} onKeyDown={e => handleItemKeyDown(e, index)} placeholder="Type or click to select an item" className={inputClasses}/>
                                    </td>
                                    <td className="p-2"><input type="number" value={item.quantity || ''} onChange={e => handleItemChange(index, 'quantity', e.target.value)} onKeyDown={e => handleItemKeyDown(e, index)} className={`${inputClasses} text-right`}/></td>
                                    <td className="p-2"><input type="number" value={item.price || ''} onChange={e => handleItemChange(index, 'price', e.target.value)} onKeyDown={e => handleItemKeyDown(e, index)} className={`${inputClasses} text-right`} /></td>
                                    <td className="p-2 text-right font-medium">PKR {item.total.toFixed(2)}</td>
                                    <td className="p-2 text-center"><Button type="button" size="sm" variant="secondary" icon={Trash2} title="Remove Item" onClick={() => removeItemRow(index)} disabled={(bill.items || []).length <= 1} tabIndex={-1}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Button type="button" size="sm" variant="secondary" icon={Plus} onClick={addItemRow} className="mt-4">Add New Row</Button>

                <div className="flex justify-between mt-8">
                     <div>
                        <label htmlFor="notes" className={labelClasses}>Notes</label>
                        <textarea id="notes" name="notes" rows={3} className={`${inputClasses} w-96`} onKeyDown={handleFormKeyDown}></textarea>
                    </div>
                    <div className="w-96 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Sub Total</span><span>{subTotal.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="shippingCharges">Shipping Charges</label>
                            <input id="shippingCharges" name="shippingCharges" type="number" value={bill.shippingCharges || ''} onChange={e => handleInputChange({ target: { name: 'shippingCharges', value: e.target.value }} as any)} onKeyDown={handleFormKeyDown} className={`${inputClasses} w-24 text-right`} />
                        </div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="adjustment">Adjustment</label>
                            <input id="adjustment" name="adjustment" type="number" value={bill.adjustment || ''} onChange={e => handleInputChange({ target: { name: 'adjustment', value: e.target.value }} as any)} onKeyDown={handleFormKeyDown} className={`${inputClasses} w-24 text-right`} />
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 dark:border-gray-600">
                            <span>Total ( PKR )</span>
                            <span>{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                 <div className="mt-8 pt-5 border-t dark:border-gray-700">
                     <label htmlFor="termsAndConditions" className={labelClasses}>Terms & Conditions</label>
                     <textarea id="termsAndConditions" name="termsAndConditions" rows={3} className={`${inputClasses} w-full`} onKeyDown={handleFormKeyDown}></textarea>
                </div>
            </div>
        </form>
      </>
    );
};

export default BillCreatePage;