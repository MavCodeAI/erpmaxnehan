import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { InventoryItem, Vendor, Account } from '../../types';
import { Save, X, PlusCircle, Trash2, Upload, HelpCircle, ArrowDown } from 'lucide-react';
import Card from '../ui/Card';

interface ItemGroupCreatePageProps {
  onSaveItems: (items: InventoryItem[]) => void;
  inventoryItems: InventoryItem[];
  vendors: Vendor[];
  accounts: Account[];
}

interface Attribute {
  id: string;
  name: string;
  options: string;
}

const ItemGroupCreatePage: React.FC<ItemGroupCreatePageProps> = ({ onSaveItems, inventoryItems, vendors, accounts }) => {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [itemType, setItemType] = useState<'Goods' | 'Service'>('Goods');
    const [isReturnable, setIsReturnable] = useState(false);
    const [unit, setUnit] = useState('');
    const [attributes, setAttributes] = useState<Attribute[]>([{ id: '1', name: '', options: '' }]);
    const [variants, setVariants] = useState<Partial<InventoryItem>[]>([]);

    const handleAddAttribute = () => {
        setAttributes(prev => [...prev, { id: new Date().getTime().toString(), name: '', options: '' }]);
    };

    const handleAttributeChange = (id: string, field: 'name' | 'options', value: string) => {
        setAttributes(prev => prev.map(attr => attr.id === id ? { ...attr, [field]: value } : attr));
    };

    const handleRemoveAttribute = (id: string) => {
        if (attributes.length > 1) {
            setAttributes(prev => prev.filter(attr => attr.id !== id));
        }
    };
    
    useMemo(() => {
        const activeAttributes = attributes.filter(a => a.name && a.options);
        if (activeAttributes.length === 0) {
            setVariants([]);
            return;
        }

        const optionsArrays = activeAttributes.map(a => a.options.split(',').map(opt => opt.trim()).filter(Boolean));
        
        let combinations = optionsArrays.reduce((acc, currentOptions) => {
            if (acc.length === 0) return currentOptions.map(o => [o]);
            return acc.flatMap(combo => currentOptions.map(opt => [...combo, opt]));
        }, [] as string[][]);

        const newVariants = combinations.map((combo, i) => {
            const name = `${groupName} - ${combo.join(' - ')}`;
            const existingVariant = variants.find(v => v.name === name);

            return {
                id: existingVariant?.id || `${new Date().getTime()}-${i}`,
                name: name,
                sku: existingVariant?.sku || '',
                costPrice: existingVariant?.costPrice || 0,
                sellingPrice: existingVariant?.sellingPrice || 0,
                trackInventory: true,
                ...existingVariant
            };
        });
        setVariants(newVariants);

    }, [attributes, groupName]);
    
    const handleVariantChange = (id: string, field: keyof InventoryItem, value: string | number | boolean) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleCopyToAll = (field: keyof InventoryItem) => {
        const firstValue = variants[0]?.[field];
        if (firstValue !== undefined) {
            setVariants(prev => prev.map(v => ({ ...v, [field]: firstValue })));
        }
    };

    const handleSave = () => {
        const itemsToSave: InventoryItem[] = variants.map(v => ({
            id: v.id!,
            itemType,
            name: v.name!,
            sku: v.sku!,
            unit,
            isReturnable,
            trackSales: true,
            sellingPrice: v.sellingPrice,
            salesAccountId: accounts.find(a => a.name === 'Sales')?.id,
            trackPurchases: true,
            costPrice: v.costPrice,
            purchaseAccountId: accounts.find(a => a.name === 'Cost of Goods Sold')?.id,
            trackInventory: v.trackInventory ?? true,
            inventoryAccountId: accounts.find(a => a.accountType === 'Inventory')?.id,
            openingStock: v.openingStock,
            reorderPoint: v.reorderPoint,
            itemGroupId: attributes.map(a => a.id).join('-'), // A simple group ID
            itemGroupName: groupName,
        }));

        onSaveItems(itemsToSave);
        navigate('/inventory/items');
    }

    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    const inputClasses = "w-full px-3 py-2 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500";
    const itemTableInputClasses = "w-full text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-sm px-1 py-0.5";

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">New Item Group</h2>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={X} onClick={() => navigate('/inventory/items')}>Cancel</Button>
                    <Button variant="primary" icon={Save} onClick={handleSave}>Save</Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                             <div>
                                <label className={labelClasses}>Type</label>
                                <div className="flex items-center space-x-4 mt-1">
                                    <label className="flex items-center text-sm"><input type="radio" name="itemType" value="Goods" checked={itemType === 'Goods'} onChange={(e) => setItemType(e.target.value as any)} className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" /> Goods</label>
                                    <label className="flex items-center text-sm"><input type="radio" name="itemType" value="Service" checked={itemType === 'Service'} onChange={(e) => setItemType(e.target.value as any)} className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" /> Service</label>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="groupName" className={`${labelClasses}`}>Item Group Name*</label>
                                <input id="groupName" value={groupName} onChange={(e) => setGroupName(e.target.value)} className={inputClasses} />
                            </div>
                             <div>
                                <label htmlFor="description" className={labelClasses}>Description</label>
                                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputClasses}></textarea>
                            </div>
                        </div>
                         <div className="flex flex-col items-center justify-center">
                            <div className="w-full h-48 border-2 border-dashed dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <Upload className="w-8 h-8 mb-2" />
                                <span className="text-sm text-center">Drag image(s) here or <span className="text-primary-500">browse images</span></span>
                                <p className="text-xs text-gray-500 mt-1 px-2 text-center">You can add up to 15 images, each not exceeding 5 MB in size and 7000 X 7000 pixels resolution.</p>
                                <input type="file" className="sr-only" multiple />
                            </div>
                        </div>
                    </div>
                     <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="flex items-center mt-6">
                            <input type="checkbox" id="isReturnable" checked={isReturnable} onChange={e => setIsReturnable(e.target.checked)} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                            <label htmlFor="isReturnable" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Returnable Item</label>
                        </div>
                        <div>
                            <label htmlFor="unit" className={`${labelClasses}`}>Unit*</label>
                            <input id="unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="Select or type to add" className={inputClasses}/>
                        </div>
                        <div>
                            <label className={labelClasses}>Manufacturer</label>
                            <input placeholder="Select or Add Manufacturer" className={inputClasses}/>
                        </div>
                        <div>
                            <label className={labelClasses}>Brand</label>
                            <input placeholder="Select or Add Brand" className={inputClasses}/>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold mb-4">Multiple Items?*</h3>
                    <div className="p-4 border rounded-md dark:border-gray-700">
                        <label className="flex items-center text-sm">
                            <input type="radio" checked readOnly className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mr-2" />
                            Create Attributes and Options
                        </label>
                        <div className="mt-4 space-y-3">
                            {attributes.map((attr, index) => (
                                <div key={attr.id} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className={labelClasses}>Attribute*</label>
                                        <input value={attr.name} onChange={e => handleAttributeChange(attr.id, 'name', e.target.value)} placeholder="eg: color" className={inputClasses} />
                                    </div>
                                    <div className="flex-1">
                                        <label className={labelClasses}>Options*</label>
                                        <input value={attr.options} onChange={e => handleAttributeChange(attr.id, 'options', e.target.value)} placeholder="Type comma separated values" className={inputClasses} />
                                    </div>
                                    <Button type="button" variant="danger" icon={Trash2} onClick={() => handleRemoveAttribute(attr.id)} className="mt-6" disabled={attributes.length <= 1} />
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="secondary" icon={PlusCircle} onClick={handleAddAttribute} className="mt-4">Add more attributes</Button>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-6 mb-4">
                        <span className={labelClasses}>Select your Item Type:</span>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center text-sm"><input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 rounded" /> Sellable</label>
                            <label className="flex items-center text-sm"><input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 rounded" /> Purchasable</label>
                            <label className="flex items-center text-sm"><input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 rounded" /> Track Inventory</label>
                        </div>
                    </div>
                    <div className="overflow-x-auto border dark:border-gray-700 rounded-lg">
                        <table className="w-full text-sm">
                             <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="p-2 font-semibold text-left">ITEM NAME*</th>
                                    <th className="p-2 font-semibold text-left">SKU*</th>
                                    <th className="p-2 font-semibold text-left">COST PRICE (PKR)* <button onClick={() => handleCopyToAll('costPrice')} className="text-primary-500 text-xs">(COPY TO ALL <ArrowDown className="w-3 h-3 inline"/>)</button></th>
                                    <th className="p-2 font-semibold text-left">SELLING PRICE (PKR)* <button onClick={() => handleCopyToAll('sellingPrice')} className="text-primary-500 text-xs">(COPY TO ALL <ArrowDown className="w-3 h-3 inline"/>)</button></th>
                                    <th className="p-2 font-semibold text-left">REORDER POINT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.length > 0 ? variants.map(variant => (
                                    <tr key={variant.id} className="border-t dark:border-gray-700">
                                        <td className="p-1"><input value={variant.name} onChange={e => handleVariantChange(variant.id!, 'name', e.target.value)} className={itemTableInputClasses} /></td>
                                        <td className="p-1"><input value={variant.sku} onChange={e => handleVariantChange(variant.id!, 'sku', e.target.value)} className={itemTableInputClasses} /></td>
                                        <td className="p-1"><input type="number" value={variant.costPrice || ''} onChange={e => handleVariantChange(variant.id!, 'costPrice', e.target.value)} className={itemTableInputClasses} /></td>
                                        <td className="p-1"><input type="number" value={variant.sellingPrice || ''} onChange={e => handleVariantChange(variant.id!, 'sellingPrice', e.target.value)} className={itemTableInputClasses} /></td>
                                        <td className="p-1"><input type="number" value={variant.reorderPoint || ''} onChange={e => handleVariantChange(variant.id!, 'reorderPoint', e.target.value)} className={itemTableInputClasses} /></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8 text-gray-500">Please enter attributes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
                 <div className="flex justify-start space-x-2 pt-4 border-t dark:border-gray-700">
                    <Button variant="primary" icon={Save} onClick={handleSave}>Save</Button>
                    <Button variant="secondary" onClick={() => navigate('/inventory/items')}>Cancel</Button>
                </div>
            </div>
        </>
    );
};

export default ItemGroupCreatePage;
