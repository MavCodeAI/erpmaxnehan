import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { InventoryItem, Vendor, Account } from '../../types';
import { Save, X, Upload, ChevronDown, ChevronUp, AlertCircle, ScanBarcode } from 'lucide-react';

interface ItemCreatePageProps {
  items: InventoryItem[];
  onSaveItem: (item: InventoryItem) => void;
  vendors: Vendor[];
  accounts: Account[];
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
    >
        <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);


const ItemCreatePage: React.FC<ItemCreatePageProps> = ({ items, onSaveItem, vendors, accounts }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const initialItemState: InventoryItem = {
        id: '',
        itemType: 'Goods',
        name: '',
        sku: '',
        unit: '',
        trackSales: true,
        sellingPrice: 0,
        salesAccountId: accounts.find(a => a.name === 'Sales')?.id || '',
        salesDescription: '',
        trackPurchases: true,
        costPrice: 0,
        purchaseAccountId: accounts.find(a => a.name === 'Cost of Goods Sold')?.id || '',
        purchaseDescription: '',
        trackInventory: true,
        inventoryAccountId: accounts.find(a => a.name === 'Inventory Asset')?.id || '',
        openingStock: 0,
        openingStockRate: 0,
        inventoryValuationMethod: 'FIFO',
    };

    const [item, setItem] = useState<Partial<InventoryItem>>(initialItemState);
    const [showMoreFields, setShowMoreFields] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode) {
            const existingItem = items.find(i => i.id === id);
            if (existingItem) {
                setItem(existingItem);
            }
        } else {
            setItem(initialItemState);
        }
    }, [id, isEditMode, items]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!item.name) newErrors.name = "Item name is required.";
        if (!item.sku) newErrors.sku = "SKU is required.";
        if (!item.unit) newErrors.unit = "Unit is required.";
        if (item.trackSales && (item.sellingPrice === undefined || item.sellingPrice < 0)) newErrors.sellingPrice = "Selling price must be 0 or more.";
        if (item.trackPurchases && (item.costPrice === undefined || item.costPrice < 0)) newErrors.costPrice = "Cost price must be 0 or more.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setItem(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleToggle = (field: keyof InventoryItem, value: boolean) => {
        setItem(prev => ({...prev, [field]: value}));
    };

    const handleSave = () => {
        if (!validate()) {
            // Find the first error and scroll to it
            const firstErrorKey = Object.keys(errors)[0];
            const errorElement = document.getElementsByName(firstErrorKey)[0];
            if(errorElement) errorElement.focus();
            return;
        }
        
        const itemToSave = {
            ...initialItemState,
            ...item,
            id: isEditMode && id ? id : new Date().getTime().toString(),
        }
        
        onSaveItem(itemToSave as InventoryItem);
        navigate('/inventory/items');
    };

    const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
        <div className="relative group flex items-center">
            <AlertCircle className="w-4 h-4 text-gray-400 ml-1 cursor-help" />
            <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                {text}
            </div>
        </div>
    );
    
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center";
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    const sectionTitleClasses = "text-lg font-semibold text-primary-700 dark:text-primary-300 mb-4";
    const sectionClasses = "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm";

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    {isEditMode ? 'Edit Item' : 'New Item'}
                </h2>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={X} onClick={() => navigate('/inventory/items')}>Cancel</Button>
                    <Button variant="primary" icon={Save} onClick={handleSave}>Save</Button>
                </div>
            </div>
            
            <form className="space-y-6">
                 <div className={sectionClasses}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className={labelClasses}>Item Type</label>
                                <div className="flex items-center space-x-4 mt-2">
                                    <label className="flex items-center"><input type="radio" name="itemType" value="Goods" checked={item.itemType === 'Goods'} onChange={handleChange} className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" /> Goods</label>
                                    <label className="flex items-center"><input type="radio" name="itemType" value="Service" checked={item.itemType === 'Service'} onChange={handleChange} className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" /> Service</label>
                                </div>
                            </div>
                             <div>
                                <label htmlFor="name" className={labelClasses}>Item Name*</label>
                                <input id="name" name="name" type="text" value={item.name || ''} onChange={handleChange} className={`${inputClasses} ${errors.name ? 'border-red-500' : ''}`} />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="sku" className={labelClasses}>SKU* <InfoTooltip text="Stock Keeping Unit - a unique code for this item." /></label>
                                    <div className="relative">
                                      <input id="sku" name="sku" type="text" value={item.sku || ''} onChange={handleChange} className={`${inputClasses} ${errors.sku ? 'border-red-500' : ''}`} />
                                      <button type="button" className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-primary-600"><ScanBarcode className="w-5 h-5"/></button>
                                    </div>
                                    {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
                                </div>
                                <div>
                                    <label htmlFor="unit" className={labelClasses}>Unit*</label>
                                    <input id="unit" name="unit" type="text" placeholder="e.g., pcs, kg, box" value={item.unit || ''} onChange={handleChange} className={`${inputClasses} ${errors.unit ? 'border-red-500' : ''}`} />
                                    {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="isReturnable" name="isReturnable" checked={item.isReturnable || false} onChange={handleChange} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                                <label htmlFor="isReturnable" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Returnable Item</label>
                                <InfoTooltip text="Check this if the item can be returned by customers or returned to vendors." />
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-40 h-40 border-2 border-dashed dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <Upload className="w-8 h-8 mb-2" />
                                <span className="text-sm text-center">+ Add Image</span>
                                <input type="file" className="sr-only" />
                            </div>
                        </div>
                    </div>
                 </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${sectionClasses} space-y-4`}>
                        <div className="flex justify-between items-center">
                            <h3 className={sectionTitleClasses}>Sales Information</h3>
                            <ToggleSwitch checked={item.trackSales || false} onChange={(v) => handleToggle('trackSales', v)} />
                        </div>
                        {item.trackSales && <>
                            <div>
                                <label htmlFor="sellingPrice" className={labelClasses}>Selling Price (PKR)*</label>
                                <input id="sellingPrice" name="sellingPrice" type="number" value={item.sellingPrice || ''} onChange={handleChange} className={`${inputClasses} ${errors.sellingPrice ? 'border-red-500' : ''}`} />
                                {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>}
                            </div>
                             <div>
                                <label htmlFor="salesAccountId" className={labelClasses}>Account*</label>
                                <select id="salesAccountId" name="salesAccountId" value={item.salesAccountId || ''} onChange={handleChange} className={inputClasses}>
                                    {accounts.filter(a=>a.type === 'Revenue').map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="salesDescription" className={labelClasses}>Description</label>
                                <textarea id="salesDescription" name="salesDescription" value={item.salesDescription || ''} onChange={handleChange} rows={2} className={inputClasses}></textarea>
                            </div>
                        </>}
                    </div>
                     <div className={`${sectionClasses} space-y-4`}>
                        <div className="flex justify-between items-center">
                             <h3 className={sectionTitleClasses}>Purchase Information</h3>
                             <ToggleSwitch checked={item.trackPurchases || false} onChange={(v) => handleToggle('trackPurchases', v)} />
                        </div>
                        {item.trackPurchases && <>
                            <div>
                                <label htmlFor="costPrice" className={labelClasses}>Cost Price (PKR)*</label>
                                <input id="costPrice" name="costPrice" type="number" value={item.costPrice || ''} onChange={handleChange} className={`${inputClasses} ${errors.costPrice ? 'border-red-500' : ''}`} />
                                {errors.costPrice && <p className="text-red-500 text-xs mt-1">{errors.costPrice}</p>}
                            </div>
                             <div>
                                <label htmlFor="purchaseAccountId" className={labelClasses}>Account*</label>
                                <select id="purchaseAccountId" name="purchaseAccountId" value={item.purchaseAccountId || ''} onChange={handleChange} className={inputClasses}>
                                    {accounts.filter(a=>a.type === 'Expense').map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="preferredVendorId" className={labelClasses}>Preferred Vendor</label>
                                <select id="preferredVendorId" name="preferredVendorId" value={item.preferredVendorId || ''} onChange={handleChange} className={inputClasses}>
                                    <option value="">Select a Vendor</option>
                                    {/* FIX: Use 'displayName' as 'name' does not exist on the Vendor type. */}
                                    {vendors.map(v => <option key={v.id} value={v.id}>{v.displayName}</option>)}
                                </select>
                            </div>
                        </>}
                    </div>
                </div>
                
                 {item.itemType === 'Goods' && <div className={sectionClasses}>
                    <div className="flex justify-between items-center">
                         <h3 className={sectionTitleClasses}>Inventory Tracking</h3>
                         <ToggleSwitch checked={item.trackInventory || false} onChange={(v) => handleToggle('trackInventory', v)} />
                    </div>
                    {item.trackInventory && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                            <label htmlFor="inventoryAccountId" className={labelClasses}>Inventory Account</label>
                            <select id="inventoryAccountId" name="inventoryAccountId" value={item.inventoryAccountId || ''} onChange={handleChange} className={inputClasses}>
                                {accounts.filter(a=>a.accountType === 'Inventory').map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="inventoryValuationMethod" className={labelClasses}>Inventory Valuation Method*</label>
                            <select id="inventoryValuationMethod" name="inventoryValuationMethod" value={item.inventoryValuationMethod || 'FIFO'} onChange={handleChange} className={inputClasses}>
                                <option value="FIFO">FIFO (First-In, First-Out)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="openingStock" className={labelClasses}>Opening Stock <InfoTooltip text="Quantity of the item you have on hand right now."/></label>
                            <input id="openingStock" name="openingStock" type="number" value={item.openingStock || ''} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="openingStockRate" className={labelClasses}>Opening Stock Rate per Unit*</label>
                            <input id="openingStockRate" name="openingStockRate" type="number" value={item.openingStockRate || ''} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="reorderPoint" className={labelClasses}>Reorder Point <InfoTooltip text="Get notified when stock level goes below this point."/></label>
                            <input id="reorderPoint" name="reorderPoint" type="number" value={item.reorderPoint || ''} onChange={handleChange} className={inputClasses} />
                        </div>
                    </div>}
                </div>}

                <div>
                    <button type="button" onClick={() => setShowMoreFields(!showMoreFields)} className="w-full flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">More Fields</span>
                        {showMoreFields ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                    </button>
                    {showMoreFields && <div className={`${sectionClasses} mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in`}>
                        <div>
                            <label className={labelClasses}>Dimensions (Length x Width x Height)</label>
                            <div className="flex items-center space-x-2">
                                <input type="number" name="length" value={item.length || ''} onChange={handleChange} className={inputClasses} />
                                <input type="number" name="width" value={item.width || ''} onChange={handleChange} className={inputClasses} />
                                <input type="number" name="height" value={item.height || ''} onChange={handleChange} className={inputClasses} />
                                <select name="dimensionUnit" value={item.dimensionUnit || 'cm'} onChange={handleChange} className={inputClasses}><option>cm</option><option>in</option></select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Weight</label>
                             <div className="flex items-center space-x-2">
                                <input type="number" name="weight" value={item.weight || ''} onChange={handleChange} className={inputClasses} />
                                <select name="weightUnit" value={item.weightUnit || 'kg'} onChange={handleChange} className={inputClasses}><option>kg</option><option>g</option><option>lb</option></select>
                            </div>
                        </div>
                         <div><label className={labelClasses}>Manufacturer</label><input type="text" name="manufacturer" value={item.manufacturer || ''} onChange={handleChange} className={inputClasses} /></div>
                         <div><label className={labelClasses}>Brand</label><input type="text" name="brand" value={item.brand || ''} onChange={handleChange} className={inputClasses} /></div>
                         <div><label className={labelClasses}>UPC</label><input type="text" name="upc" value={item.upc || ''} onChange={handleChange} className={inputClasses} /></div>
                         <div><label className={labelClasses}>MPN</label><input type="text" name="mpn" value={item.mpn || ''} onChange={handleChange} className={inputClasses} /></div>
                         <div><label className={labelClasses}>EAN</label><input type="text" name="ean" value={item.ean || ''} onChange={handleChange} className={inputClasses} /></div>
                         <div><label className={labelClasses}>ISBN</label><input type="text" name="isbn" value={item.isbn || ''} onChange={handleChange} className={inputClasses} /></div>
                    </div>}
                </div>

                <div className="flex justify-end pt-5 space-x-3 border-t dark:border-gray-700 mt-6">
                    <Button variant="secondary" onClick={() => navigate('/inventory/items')}>Cancel</Button>
                    <Button variant="primary" icon={Save} onClick={handleSave}>Save Item</Button>
                </div>
            </form>
        </>
    );
};

export default ItemCreatePage;