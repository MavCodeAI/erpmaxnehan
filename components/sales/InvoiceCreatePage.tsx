import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import Button from '../ui/Button';
import { Invoice, InvoiceItem, Customer, InventoryItem } from '../../types';
import { Plus, Trash2, Save, Send, X, Download } from 'lucide-react';
import Card from '../ui/Card';
import { useFormKeyboardNavigation } from '../../hooks/useFormKeyboardNavigation';
import SearchableSelect from '../ui/SearchableSelect';

interface InvoiceCreatePageProps {
    invoices: Invoice[];
    onSaveInvoice: (invoice: Invoice) => void;
    inventoryItems: InventoryItem[];
    customers: Customer[];
}

const InvoiceCreatePage: React.FC<InvoiceCreatePageProps> = ({ invoices, onSaveInvoice, inventoryItems, customers }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [invoice, setInvoice] = useState<Partial<Invoice>>({});
    const formRef = useRef<HTMLFormElement>(null);
    const itemTableRef = useRef<HTMLTableSectionElement>(null);
    const { handleKeyDown: handleFormKeyDown } = useFormKeyboardNavigation(formRef);

    useEffect(() => {
        if (isEditMode) {
            const existingInvoice = invoices.find(inv => inv.id === id);
            if (existingInvoice) {
                setInvoice(existingInvoice);
            }
        } else {
            const lastInvoiceNumber = invoices[0]?.invoiceNumber || 'INV-000000';
            const parts = lastInvoiceNumber.split('-');
            const newNum = (parseInt(parts[parts.length - 1], 10) + 1).toString().padStart(6, '0');
            const newInvoiceNumber = `INV-${newNum}`;

            setInvoice({
                invoiceNumber: newInvoiceNumber,
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date().toISOString().split('T')[0],
                items: [{ id: '1', description: '', quantity: 1, price: 0, discount: 0, tax: 0, total: 0 }],
                shippingCharges: 0,
                adjustment: 0,
                status: 'Draft',
            });
        }
    }, [id, isEditMode, invoices]);

    useEffect(() => {
        if ((invoice.items?.length || 0) > 1) {
            const lastRow = itemTableRef.current?.lastElementChild;
            const firstInput = lastRow?.querySelector('input, select');
            if (firstInput) {
                (firstInput as HTMLElement).focus();
            }
        }
    }, [invoice.items?.length]);

    const handleCustomerChange = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        setInvoice(prev => ({ ...prev, customerId, customerName: customer?.displayName || '' }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvoice(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...(invoice.items || [])];
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
        const discount = currentItem.discount || 0;
        const tax = 0; // Tax not shown in screenshot form
        currentItem.total = qty * price * (1 - discount/100) * (1 + tax/100);

        newItems[index] = currentItem;
        setInvoice(prev => ({ ...prev, items: newItems }));
    };

    const addItemRow = () => {
        const newItems = [...(invoice.items || [])];
        newItems.push({ id: new Date().getTime().toString(), description: '', quantity: 1, price: 0, discount: 0, tax: 0, total: 0 });
        setInvoice(prev => ({ ...prev, items: newItems }));
    };

    const removeItemRow = (index: number) => {
        if (invoice.items && invoice.items.length > 1) {
            const newItems = invoice.items.filter((_, i) => i !== index);
            setInvoice(prev => ({ ...prev, items: newItems }));
        }
    };

    const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            const target = e.target as HTMLElement;
            const isLastField = target.closest('td')?.nextElementSibling?.querySelector('button[title="Remove Item"]') !== null;
            const isLastRow = index === (invoice.items?.length || 0) - 1;

            if (isLastField && isLastRow) {
                 e.preventDefault();
                 const currentItem = (invoice.items || [])[index];
                 if (currentItem.description || currentItem.price > 0 || currentItem.quantity > 0) {
                    addItemRow();
                 }
            } else {
                handleFormKeyDown(e);
            }
        }
    };
    
    const subTotal = useMemo(() => invoice.items?.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0) || 0, [invoice.items]);
    const totalDiscount = useMemo(() => invoice.items?.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0) * ((item.discount || 0) / 100), 0) || 0, [invoice.items]);

    const total = useMemo(() => {
        const itemsTotal = subTotal - totalDiscount;
        return itemsTotal + (invoice.shippingCharges || 0) + (invoice.adjustment || 0);
    }, [subTotal, totalDiscount, invoice.shippingCharges, invoice.adjustment]);


    const handleSave = (status: Invoice['status']) => {
        if (!invoice.customerId || !invoice.items || invoice.items.length === 0) {
            showToast.error("Please select a customer and add at least one item.");
            return;
        }
        
        const invoiceToSave: Invoice = {
            id: isEditMode && id ? id : new Date().getTime().toString(),
            invoiceNumber: invoice.invoiceNumber!,
            customerId: invoice.customerId!,
            customerName: invoice.customerName!,
            date: invoice.date!,
            dueDate: invoice.dueDate!,
            items: invoice.items.map(item => ({...item, total: item.total || 0})),
            shippingCharges: invoice.shippingCharges || 0,
            adjustment: invoice.adjustment || 0,
            total: total,
            status: status,
        };

        onSaveInvoice(invoiceToSave);
        navigate('/sales/invoices');
    };

    if (!invoice || Object.keys(invoice).length === 0) {
        return <div>Loading...</div>;
    }

    const inputClasses = "w-full px-3 py-2 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    
    return (
      <>
        <div className="flex justify-between items-center my-6">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                {isEditMode ? `Edit Invoice #${invoice.invoiceNumber}` : 'New Invoice'}
            </h2>
             <div className="flex space-x-2">
                <Button variant="secondary" icon={X} onClick={() => navigate('/sales/invoices')}>Cancel</Button>
                <Button variant="secondary" icon={Download}>Download</Button>
                <Button variant="secondary" icon={Save} onClick={() => handleSave('Draft')}>Save as Draft</Button>
                <Button variant="primary" icon={Send} onClick={() => handleSave('Unpaid')}>Save and Send</Button>
            </div>
        </div>
        <form ref={formRef}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div>
                        <label htmlFor="customerId" className={labelClasses}>Customer Name*</label>
                        <SearchableSelect
                            value={invoice.customerId || ''}
                            onChange={handleCustomerChange}
                            onKeyDown={handleFormKeyDown}
                            options={customers.map(c => ({ value: c.id, label: c.displayName }))}
                            placeholder="Select or add a customer"
                        />
                    </div>
                    <div/>
                    <div/>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="invoiceNumber" className={labelClasses}>Invoice#</label>
                            <input id="invoiceNumber" name="invoiceNumber" type="text" value={invoice.invoiceNumber || ''} onChange={handleInputChange} className={inputClasses} />
                        </div>
                         <div>
                            <label htmlFor="orderNumber" className={labelClasses}>Order Number</label>
                            <input id="orderNumber" name="orderNumber" type="text" value={invoice.orderNumber || ''} onChange={handleInputChange} className={inputClasses} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div>
                        <label htmlFor="date" className={labelClasses}>Invoice Date</label>
                        <input id="date" name="date" type="date" value={invoice.date || ''} onChange={handleInputChange} onKeyDown={handleFormKeyDown} className={inputClasses} />
                    </div>
                     <div>
                        <label htmlFor="terms" className={labelClasses}>Terms</label>
                        <select id="terms" name="terms" className={inputClasses}>
                            <option>Due on Receipt</option>
                            <option>Net 15</option>
                            <option>Net 30</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dueDate" className={labelClasses}>Due Date</label>
                        <input id="dueDate" name="dueDate" type="date" value={invoice.dueDate || ''} onChange={handleInputChange} onKeyDown={handleFormKeyDown} className={inputClasses} />
                    </div>
                </div>
                
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr className="text-left text-gray-600 dark:text-gray-400">
                                <th className="font-semibold p-2 w-[25%]">Item Details</th>
                                <th className="font-semibold p-2 text-right w-24">Quantity</th>
                                <th className="font-semibold p-2 text-right w-32">Rate</th>
                                <th className="font-semibold p-2 text-right w-24">Discount</th>
                                <th className="font-semibold p-2 text-right w-32">Amount</th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody ref={itemTableRef}>
                            {(invoice.items || []).map((item, index) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        <input type="text" value={item.description || ''} onChange={e => handleItemChange(index, 'description', e.target.value)} onKeyDown={e => handleItemKeyDown(e, index)} placeholder="Type or click to select an item" className={inputClasses}/>
                                    </td>
                                    <td className="p-2"><input type="number" value={item.quantity || ''} onChange={e => handleItemChange(index, 'quantity', e.target.value)} onKeyDown={e => handleItemKeyDown(e, index)} className={`${inputClasses} text-right`}/></td>
                                    <td className="p-2"><input type="number" value={item.price || ''} onChange={e => handleItemChange(index, 'price', e.target.value)} onKeyDown={e => handleItemKeyDown(e, index)} className={`${inputClasses} text-right`} /></td>
                                    <td className="p-2"><input type="number" value={item.discount || ''} onChange={e => handleItemChange(index, 'discount', e.target.value)} onKeyDown={e => handleItemKeyDown(e, index)} placeholder="%" className={`${inputClasses} text-right`} /></td>
                                    <td className="p-2 text-right font-medium">PKR {item.total.toFixed(2)}</td>
                                    <td className="p-2 text-center"><Button type="button" size="sm" variant="secondary" icon={Trash2} title="Remove Item" onClick={() => removeItemRow(index)} disabled={(invoice.items || []).length <= 1} tabIndex={-1}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Button type="button" size="sm" variant="secondary" icon={Plus} onClick={addItemRow} className="mt-4">Add New Row</Button>

                <div className="flex justify-between mt-8">
                    <div>
                        <label htmlFor="notes" className={labelClasses}>Customer Notes</label>
                        <textarea id="notes" name="notes" rows={3} className={`${inputClasses} w-96`} onKeyDown={handleFormKeyDown} defaultValue="Thanks for your business."></textarea>
                    </div>
                    <div className="w-96 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Sub Total</span><span>{subTotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Discount</span><span>{totalDiscount.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="shippingCharges">Shipping Charges</label>
                            <input id="shippingCharges" name="shippingCharges" type="number" value={invoice.shippingCharges || ''} onChange={e => handleInputChange({ target: { name: 'shippingCharges', value: e.target.value }} as any)} onKeyDown={handleFormKeyDown} className={`${inputClasses} w-24 text-right`} />
                        </div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="adjustment">Adjustment</label>
                            <input id="adjustment" name="adjustment" type="number" value={invoice.adjustment || ''} onChange={e => handleInputChange({ target: { name: 'adjustment', value: e.target.value }} as any)} onKeyDown={handleFormKeyDown} className={`${inputClasses} w-24 text-right`} />
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

export default InvoiceCreatePage;