import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import Button from '../ui/Button';
import { InventoryAdjustment, InventoryAdjustmentItem, InventoryItem, Account } from '../../types';
import { Save, X, PlusCircle, Trash2, Upload, ChevronsDown } from 'lucide-react';
import SearchableSelect from '../ui/SearchableSelect';

interface InventoryAdjustmentCreatePageProps {
  inventoryItems: InventoryItem[];
  accounts: Account[];
  inventoryAdjustments: InventoryAdjustment[];
  onSave: (adjustment: InventoryAdjustment) => void;
}

const adjustmentReasons = [
  'Stocktake discrepancy',
  'Damaged goods',
  'Theft or loss',
  'Stock write-off',
  'Internal use',
  'Promotion or marketing',
  'Other',
];

const InventoryAdjustmentCreatePage: React.FC<InventoryAdjustmentCreatePageProps> = ({ inventoryItems, accounts, inventoryAdjustments, onSave }) => {
    const navigate = useNavigate();
    
    const initialAdjustment: Partial<InventoryAdjustment> = useMemo(() => {
        const lastRefNum = inventoryAdjustments[0]?.referenceNumber || 'ADJ-00000';
        const newNum = (parseInt(lastRefNum.split('-')[1]) + 1).toString().padStart(5, '0');
        
        return {
            mode: 'Quantity Adjustment',
            referenceNumber: `ADJ-${newNum}`,
            date: new Date().toISOString().split('T')[0],
            accountId: accounts.find(a => a.name === 'Cost of Goods Sold')?.id || '',
            reason: '',
            description: '',
            items: [{ id: '1', quantityAvailable: 0, newQuantityOnHand: 0, quantityAdjusted: 0, description: '' }],
            status: 'Draft',
        }
    }, [accounts, inventoryAdjustments]);
    
    const [adjustment, setAdjustment] = useState<Partial<InventoryAdjustment>>(initialAdjustment);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAdjustment(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof InventoryAdjustmentItem, value: string | number) => {
        const newItems = [...(adjustment.items || [])];
        const currentItem = { ...newItems[index] };

        if (field === 'inventoryItemId') {
            const selectedItem = inventoryItems.find(inv => inv.id === value);
            currentItem.inventoryItemId = selectedItem?.id;
            currentItem.description = selectedItem?.name || '';
            // Fixed: Use correct field name for available quantity
            currentItem.quantityAvailable = selectedItem?.openingStock || 0;
            currentItem.newQuantityOnHand = currentItem.quantityAvailable + (currentItem.quantityAdjusted || 0);
        } else {
            const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
            (currentItem as any)[field] = field === 'description' ? value : numericValue;

            if (field === 'quantityAdjusted') {
                currentItem.newQuantityOnHand = currentItem.quantityAvailable + numericValue;
            }
        }
        
        newItems[index] = currentItem;
        setAdjustment(prev => ({ ...prev, items: newItems as InventoryAdjustmentItem[] }));
    };

    const addItemRow = () => {
        const newItems = [...(adjustment.items || [])];
        newItems.push({ id: new Date().getTime().toString(), quantityAvailable: 0, newQuantityOnHand: 0, quantityAdjusted: 0, description: '' });
        setAdjustment(prev => ({ ...prev, items: newItems as InventoryAdjustmentItem[] }));
    };

    const removeItemRow = (index: number) => {
        if (adjustment.items && adjustment.items.length > 1) {
            const newItems = adjustment.items.filter((_, i) => i !== index);
            setAdjustment(prev => ({ ...prev, items: newItems }));
        }
    };
    
    const handleSave = (status: 'Draft' | 'Adjusted') => {
        const finalAdjustment = {
            ...initialAdjustment,
            ...adjustment,
            id: new Date().getTime().toString(),
            status,
            accountName: accounts.find(a => a.id === adjustment.accountId)?.name || '',
            items: adjustment.items?.filter(i => i.inventoryItemId) || [],
        } as InventoryAdjustment;

        if (finalAdjustment.items.length === 0) {
            showToast.error('Please add at least one item to the adjustment.');
            return;
        }

        onSave(finalAdjustment);
        navigate('/inventory/items');
    }

    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const inputClasses = "w-full px-3 py-2 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500";
    const itemTableInputClasses = "w-full text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm px-1 py-0.5";

    return (
        <>
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">New Adjustment</h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
                <div>
                    <label className={labelClasses}>Mode of adjustment</label>
                    <div className="flex items-center space-x-4 mt-1">
                        <label className="flex items-center text-sm"><input type="radio" name="mode" value="Quantity Adjustment" checked={adjustment.mode === 'Quantity Adjustment'} onChange={handleInputChange} className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" /> Quantity Adjustment</label>
                        <label className="flex items-center text-sm"><input type="radio" name="mode" value="Value Adjustment" checked={adjustment.mode === 'Value Adjustment'} onChange={handleInputChange} className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" /> Value Adjustment</label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="referenceNumber" className={labelClasses}>Reference Number</label>
                        <input id="referenceNumber" name="referenceNumber" type="text" value={adjustment.referenceNumber} onChange={handleInputChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="date" className={labelClasses}>Date*</label>
                        <input id="date" name="date" type="date" value={adjustment.date} onChange={handleInputChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="accountId" className={labelClasses}>Account*</label>
                        <select id="accountId" name="accountId" value={adjustment.accountId} onChange={handleInputChange} className={inputClasses}>
                            {accounts.filter(a => a.type === 'Expense').map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="reason" className={labelClasses}>Reason*</label>
                        <select id="reason" name="reason" value={adjustment.reason} onChange={handleInputChange} className={inputClasses}>
                            <option value="">Select a reason</option>
                            {adjustmentReasons.map(reason => <option key={reason}>{reason}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className={labelClasses}>Description</label>
                        <textarea id="description" name="description" value={adjustment.description} onChange={handleInputChange} rows={3} maxLength={500} placeholder="Max. 500 characters" className={inputClasses}></textarea>
                    </div>
                </div>

                <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2">Item Table</h3>
                    <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="p-3 font-semibold text-left w-2/5">ITEM DETAILS</th>
                                    <th className="p-3 font-semibold text-right">QTY AVAILABLE</th>
                                    <th className="p-3 font-semibold text-right">NEW QTY ON HAND</th>
                                    <th className="p-3 font-semibold text-right">QTY ADJUSTED</th>
                                    <th className="w-10 p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(adjustment.items || []).map((item, index) => (
                                    <tr key={item.id} className="border-t dark:border-gray-700">
                                        <td className="p-2">
                                            <SearchableSelect
                                                value={item.inventoryItemId || ''}
                                                onChange={(val) => handleItemChange(index, 'inventoryItemId', val)}
                                                options={inventoryItems.map(i => ({ value: i.id, label: `${i.name} (${i.sku})` }))}
                                                placeholder="Type or click to select an item."
                                            />
                                        </td>
                                        <td className="p-2 text-right">{item.quantityAvailable.toFixed(2)}</td>
                                        <td className="p-2 text-right">{item.newQuantityOnHand.toFixed(2)}</td>
                                        <td className="p-2">
                                            <input type="text" value={item.quantityAdjusted} onChange={(e) => handleItemChange(index, 'quantityAdjusted', e.target.value)} placeholder="Eg. +10, -10" className={`${itemTableInputClasses} text-right`} />
                                        </td>
                                        <td className="p-2 text-center">
                                            <Button type="button" size="sm" variant="secondary" icon={Trash2} onClick={() => removeItemRow(index)} disabled={(adjustment.items || []).length <= 1} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                        <Button variant="secondary" icon={PlusCircle} onClick={addItemRow}>Add New Row</Button>
                        <Button variant="secondary" icon={ChevronsDown}>Add Items in Bulk</Button>
                    </div>
                </div>
                
                <div>
                    <label className={labelClasses}>Attach File(s) to inventory adjustment</label>
                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                    <span>Upload File</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">You can upload a maximum of 5 files, 10MB each</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-start space-x-3 mt-6 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-b-lg -mb-6 -mx-6">
                <Button variant="primary" onClick={() => handleSave('Draft')}>Save as Draft</Button>
                <Button variant="primary" onClick={() => handleSave('Adjusted')}>Convert to Adjusted</Button>
                <Button variant="secondary" onClick={() => navigate('/inventory/items')}>Cancel</Button>
            </div>
        </>
    );
};

export default InventoryAdjustmentCreatePage;
