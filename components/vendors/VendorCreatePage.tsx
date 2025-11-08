import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import Button from '../ui/Button';
import { Vendor, Address, ContactPerson } from '../../types';
import { Save, X, PlusCircle, Trash2 } from 'lucide-react';
import Card from '../ui/Card';

interface VendorCreatePageProps {
    vendors: Vendor[];
    onSave: (vendor: Vendor) => void;
}

const VendorCreatePage: React.FC<VendorCreatePageProps> = ({ vendors, onSave }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    
    const initialVendorState: Partial<Vendor> = {
        salutation: 'Mr.',
        firstName: '', lastName: '', companyName: '', displayName: '',
        email: '', workPhone: '', mobilePhone: '',
        currency: 'PKR', paymentTerms: 'Due on Receipt',
        status: 'Active', openingBalance: 0,
        billingAddress: { street: '', city: '', state: '', zipCode: '', country: 'Pakistan' },
        shippingAddress: { street: '', city: '', state: '', zipCode: '', country: 'Pakistan' },
        contactPersons: [],
    };
    
    const [vendor, setVendor] = useState<Partial<Vendor>>(initialVendorState);
    const [activeTab, setActiveTab] = useState('other-details');

    useEffect(() => {
        if (isEditMode) {
            const existingVendor = vendors.find(v => v.id === id);
            if (existingVendor) {
                setVendor(existingVendor);
            }
        } else {
            setVendor(initialVendorState);
        }
    }, [id, isEditMode, vendors]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setVendor(prev => {
            const updatedVendor = { ...prev, [name]: value };
            
            if (['companyName', 'firstName', 'lastName'].includes(name)) {
                updatedVendor.displayName = updatedVendor.companyName || `${updatedVendor.firstName || ''} ${updatedVendor.lastName || ''}`.trim();
            }
            return updatedVendor;
        });
    };
    
    const handleAddressChange = (type: 'billingAddress' | 'shippingAddress', e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVendor(prev => ({ ...prev, [type]: { ...(prev[type] as Address), [name]: value } }));
    };

    const handleCopyBillingAddress = () => {
        setVendor(prev => ({ ...prev, shippingAddress: { ...(prev.billingAddress as Address) } }));
    };

    const handleContactPersonChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedContacts = [...(vendor.contactPersons || [])];
        updatedContacts[index] = { ...updatedContacts[index], [name]: value };
        setVendor(prev => ({ ...prev, contactPersons: updatedContacts }));
    };

    const addContactPerson = () => {
        const newContact: ContactPerson = { id: new Date().getTime().toString(), salutation: 'Mr.', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' };
        setVendor(prev => ({ ...prev, contactPersons: [...(prev.contactPersons || []), newContact] }));
    };

    const removeContactPerson = (index: number) => {
        setVendor(prev => ({ ...prev, contactPersons: (prev.contactPersons || []).filter((_, i) => i !== index) }));
    };

    const handleSave = () => {
        if (!vendor.displayName) {
            showToast.error('Display Name is required.');
            return;
        }
        onSave({ ...initialVendorState, ...vendor, id: isEditMode && id ? id : new Date().getTime().toString() } as Vendor);
        navigate('/purchases/vendors');
    };
    
    const inputClasses = "w-full px-3 py-2 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    {isEditMode ? `Edit ${vendor.displayName}` : 'New Vendor'}
                </h2>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={X} onClick={() => navigate('/purchases/vendors')}>Cancel</Button>
                    <Button variant="primary" icon={Save} onClick={handleSave}>Save</Button>
                </div>
            </div>
            <Card className="p-8">
                 <div className="max-w-4xl mx-auto">
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Vendor Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <select name="salutation" value={vendor.salutation} onChange={handleChange} className={inputClasses}><option>Mr.</option><option>Mrs.</option><option>Ms.</option></select>
                            <input name="firstName" value={vendor.firstName || ''} onChange={handleChange} placeholder="First Name" className={inputClasses} />
                            <input name="lastName" value={vendor.lastName || ''} onChange={handleChange} placeholder="Last Name" className={inputClasses} />
                        </div>
                        <div><label className={labelClasses}>Company Name</label><input name="companyName" value={vendor.companyName || ''} onChange={handleChange} className={inputClasses} /></div>
                        <div><label className={`${labelClasses} font-bold`}>Display Name*</label><input name="displayName" value={vendor.displayName || ''} onChange={handleChange} required className={inputClasses} /></div>
                        <div><label className={labelClasses}>Email Address</label><input name="email" type="email" value={vendor.email || ''} onChange={handleChange} className={inputClasses} /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input name="workPhone" value={vendor.workPhone || ''} onChange={handleChange} placeholder="Work Phone" className={inputClasses} />
                            <input name="mobilePhone" value={vendor.mobilePhone || ''} onChange={handleChange} placeholder="Mobile" className={inputClasses} />
                        </div>
                    </div>

                    <div className="mt-8 border-b dark:border-gray-700"><nav className="-mb-px flex space-x-8"><button onClick={() => setActiveTab('other-details')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'other-details' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Other Details</button><button onClick={() => setActiveTab('address')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'address' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Address</button><button onClick={() => setActiveTab('contacts')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contacts' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Contact Persons</button><button onClick={() => setActiveTab('remarks')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'remarks' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Remarks</button></nav></div>
                    
                    <div className="mt-6">
                        {activeTab === 'other-details' && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in"><div><label className={labelClasses}>Currency</label><select name="currency" value={vendor.currency} onChange={handleChange} className={inputClasses}><option>PKR</option><option>USD</option></select></div><div><label className={labelClasses}>Payment Terms</label><select name="paymentTerms" value={vendor.paymentTerms} onChange={handleChange} className={inputClasses}><option>Due on Receipt</option><option>Net 15</option><option>Net 30</option></select></div><div><label className={labelClasses}>Tax Rate</label><select name="taxRateId" className={inputClasses}><option>Select a Tax</option></select></div><div><label className={labelClasses}>Company ID</label><input name="companyId" value={vendor.companyId || ''} onChange={handleChange} className={inputClasses} /></div><div className="md:col-span-2"><label className={labelClasses}>Website</label><input name="website" value={vendor.website || ''} onChange={handleChange} className={inputClasses} /></div></div>}
                        {activeTab === 'address' && <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in"><div><h3 className="text-lg font-semibold mb-4">Billing Address</h3><div className="space-y-4"><div><label className={labelClasses}>Street</label><textarea name="street" value={vendor.billingAddress?.street || ''} onChange={(e) => handleAddressChange('billingAddress', e)} rows={2} className={inputClasses}></textarea></div><div className="grid grid-cols-2 gap-4"><div><label className={labelClasses}>City</label><input name="city" value={vendor.billingAddress?.city || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div><div><label className={labelClasses}>State</label><input name="state" value={vendor.billingAddress?.state || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div></div><div className="grid grid-cols-2 gap-4"><div><label className={labelClasses}>Zip Code</label><input name="zipCode" value={vendor.billingAddress?.zipCode || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div><div><label className={labelClasses}>Country</label><input name="country" value={vendor.billingAddress?.country || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div></div><div className="grid grid-cols-2 gap-4"><div><label className={labelClasses}>Fax</label><input name="fax" value={vendor.billingAddress?.fax || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div><div><label className={labelClasses}>Phone</label><input name="phone" value={vendor.billingAddress?.phone || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div></div></div></div><div><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Shipping Address</h3><Button type="button" size="sm" onClick={handleCopyBillingAddress}>Copy Billing Address</Button></div><div className="space-y-4"><div><label className={labelClasses}>Street</label><textarea name="street" value={vendor.shippingAddress?.street || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} rows={2} className={inputClasses}></textarea></div><div className="grid grid-cols-2 gap-4"><div><label className={labelClasses}>City</label><input name="city" value={vendor.shippingAddress?.city || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div><div><label className={labelClasses}>State</label><input name="state" value={vendor.shippingAddress?.state || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div></div><div className="grid grid-cols-2 gap-4"><div><label className={labelClasses}>Zip Code</label><input name="zipCode" value={vendor.shippingAddress?.zipCode || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div><div><label className={labelClasses}>Country</label><input name="country" value={vendor.shippingAddress?.country || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div></div><div className="grid grid-cols-2 gap-4"><div><label className={labelClasses}>Fax</label><input name="fax" value={vendor.shippingAddress?.fax || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div><div><label className={labelClasses}>Phone</label><input name="phone" value={vendor.shippingAddress?.phone || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div></div></div></div></div>}
                        {activeTab === 'contacts' && <div className="space-y-6 animate-fade-in">{(vendor.contactPersons || []).map((cp, index) => <div key={cp.id} className="p-4 border rounded-md dark:border-gray-700 relative"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className={labelClasses}>Salutation</label><select name="salutation" value={cp.salutation} onChange={e => handleContactPersonChange(index, e)} className={inputClasses}><option>Mr.</option><option>Mrs.</option><option>Ms.</option></select></div><div><label className={labelClasses}>First Name</label><input name="firstName" value={cp.firstName} onChange={e => handleContactPersonChange(index, e)} className={inputClasses}/></div><div><label className={labelClasses}>Last Name</label><input name="lastName" value={cp.lastName} onChange={e => handleContactPersonChange(index, e)} className={inputClasses}/></div><div><label className={labelClasses}>Email</label><input name="email" value={cp.email} onChange={e => handleContactPersonChange(index, e)} className={inputClasses}/></div><div><label className={labelClasses}>Work Phone</label><input name="workPhone" value={cp.workPhone} onChange={e => handleContactPersonChange(index, e)} className={inputClasses}/></div><div><label className={labelClasses}>Mobile</label><input name="mobile" value={cp.mobile} onChange={e => handleContactPersonChange(index, e)} className={inputClasses}/></div><div><label className={labelClasses}>Designation</label><input name="designation" value={cp.designation || ''} onChange={e => handleContactPersonChange(index, e)} className={inputClasses}/></div><div><label className={labelClasses}>Department</label><input name="department" value={cp.department || ''} onChange={e => handleContactPersonChange(index, e)} className={inputClasses}/></div></div><Button type="button" variant="danger" size="sm" icon={Trash2} onClick={() => removeContactPerson(index)} className="absolute top-2 right-2"/></div>)}<Button type="button" icon={PlusCircle} onClick={addContactPerson}>Add Contact Person</Button></div>}
                        {activeTab === 'remarks' && <div className="animate-fade-in"><div><label className={labelClasses}>Remarks (For Internal Use)</label><textarea name="remarks" value={vendor.remarks || ''} onChange={handleChange} rows={5} className={inputClasses}></textarea></div></div>}
                    </div>

                    <div className="mt-8 pt-5 border-t dark:border-gray-700 flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => navigate('/purchases/vendors')}>Cancel</Button>
                        <Button variant="primary" icon={Save} onClick={handleSave}>Save Vendor</Button>
                    </div>
                 </div>
            </Card>
        </>
    );
};

export default VendorCreatePage;
