import React, { useState, useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { SalesReturn, SalesReturnItem, Customer, InventoryItem } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface AddSalesReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salesReturn: SalesReturn) => void;
  lastReturnNumber: string;
  inventoryItems: InventoryItem[];
  customers: Customer[];
}

const AddSalesReturnModal: React.FC<AddSalesReturnModalProps> = ({ isOpen, onClose, onSave, lastReturnNumber, inventoryItems, customers }) => {
    
    const labelClasses = "block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2";
    const inputClasses = "w-full px-4 py-3 text-lg bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500";
    const disabledInputClasses = `${inputClasses} bg-gray-200 dark:bg-gray-800 cursor-not-allowed`;

    const generateNextReturnNumber = () => {
        const parts = lastReturnNumber.split('-');
        const lastNum = parseInt(parts[parts.length-1], 10);
        const newNum = (lastNum + 1).toString().padStart(3, '0');
        return `CN-2023-${newNum}`;
    };
    
    const [returnNumber] = useState(generateNextReturnNumber());
    const [customerId, setCustomerId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<Partial<SalesReturnItem>[]>([
        { inventoryItemId: '', description: '', quantity: 1, price: 0 },
    ]);

    const handleItemChange = (index: number, field: keyof SalesReturnItem, value: string | number) => {
        const newItems = [...items];
        const currentItem = { ...newItems[index] };

        if (field === 'inventoryItemId') {
            const selectedItem = inventoryItems.find(inv => inv.id === value);
            if (selectedItem) {
                currentItem.inventoryItemId = selectedItem.id;
                currentItem.description = selectedItem.name;
                currentItem.price = selectedItem.price;
            } else {
                currentItem.inventoryItemId = '';
                currentItem.description = '';
                currentItem.price = 0;
            }
        } else {
             const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
            (currentItem as any)[field] = field === 'description' ? value : numericValue;
        }
        
        newItems[index] = currentItem;
        setItems(newItems);
    };

    const addItemRow = () => {
        setItems([...items, { inventoryItemId: '', description: '', quantity: 1, price: 0 }]);
    };

    const removeItemRow = (index: number) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };
    
    const total = useMemo(() => items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0), [items]);

    const resetForm = () => {
        setCustomerId('');
        setDate(new Date().toISOString().split('T')[0]);
        setItems([{ inventoryItemId: '', description: '', quantity: 1, price: 0 }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerId || total === 0) return;

        const customer = customers.find(c => c.id === customerId);

        const newReturn: SalesReturn = {
            id: new Date().getTime().toString(),
            returnNumber,
            customerId,
            customerName: customer?.displayName || 'Unknown',
            date,
            total,
            status: 'Completed',
            items: items.map((item, index) => ({
                id: `${new Date().getTime()}-${index}`,
                inventoryItemId: item.inventoryItemId || undefined,
                description: item.description || '',
                quantity: item.quantity || 0,
                price: item.price || 0,
                total: (item.quantity || 0) * (item.price || 0)
            }))
        };
        onSave(newReturn);
        resetForm();
        onClose();
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Sales Return (Credit Note)">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className={labelClasses}>Return #</label>
                    <input type="text" value={returnNumber} readOnly className={disabledInputClasses}/>
                </div>
                 <div>
                    <label htmlFor="customer" className={labelClasses}>Customer</label>
                    <select id="customer" value={customerId} onChange={e => setCustomerId(e.target.value)} required className={inputClasses}>
                        <option value="">Select Customer</option>
                        {customers.map((c: Customer) => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className={labelClasses}>Return Date</label>
                    <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputClasses}/>
                </div>
            </div>
            
            <div className="w-full overflow-x-auto">
                <table className="w-full text-lg">
                    <thead className="border-b-2 dark:border-gray-600">
                        <tr className="text-left text-gray-600 dark:text-gray-400">
                            <th className="font-semibold pb-3 pl-1 w-[20%]">Product</th>
                            <th className="font-semibold pb-3">Description</th>
                            <th className="font-semibold pb-3 text-right w-24">Qty</th>
                            <th className="font-semibold pb-3 text-right w-32">Price</th>
                            <th className="font-semibold pb-3 text-right w-32">Total</th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="border-b dark:border-gray-700">
                                <td className="py-3 pr-2">
                                     <select
                                        value={item.inventoryItemId || ''}
                                        onChange={e => handleItemChange(index, 'inventoryItemId', e.target.value)}
                                        className={inputClasses}
                                    >
                                        <option value="">-- Custom Item --</option>
                                        {inventoryItems.map(invItem => (
                                            <option key={invItem.id} value={invItem.id}>
                                                {invItem.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-3 pr-2">
                                    <input type="text" value={item.description || ''} onChange={e => handleItemChange(index, 'description', e.target.value)} className={inputClasses}/>
                                </td>
                                <td className="py-3 pr-2">
                                    <input type="number" step="1" min="1" value={item.quantity || ''} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className={`${inputClasses} text-right`}/>
                                </td>
                                <td className="py-3 pr-2">
                                    <input type="number" step="0.01" value={item.price || ''} onChange={e => handleItemChange(index, 'price', e.target.value)} className={`${inputClasses} text-right`} readOnly={!!item.inventoryItemId}/>
                                </td>
                                <td className="py-3 pr-2 text-right">
                                    {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((item.quantity || 0) * (item.price || 0))}
                                </td>
                                <td className="py-3 text-center">
                                    <Button type="button" size="sm" variant="danger" icon={Trash2} onClick={() => removeItemRow(index)} disabled={items.length <= 1} title="Remove Item" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Button type="button" size="md" variant="secondary" icon={Plus} onClick={addItemRow}>Add Item</Button>

            <div className="flex justify-end pt-6 border-t dark:border-gray-700">
                 <div className="w-80 space-y-1 text-lg font-medium">
                     <div className="flex justify-between text-xl">
                        <span>Total:</span>
                        <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total)}</span>
                    </div>
                 </div>
            </div>
        </div>

        <div className="flex justify-end pt-8 space-x-4">
          <Button type="button" variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="lg" disabled={!customerId || total === 0}>Save Return</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSalesReturnModal;