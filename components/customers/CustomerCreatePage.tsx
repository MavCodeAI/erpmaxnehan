import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import Button from '../ui/Button';
import { Customer, Address } from '../../types';
import { Save, X } from 'lucide-react';
import Card from '../ui/Card';

interface CustomerCreatePageProps {
    customers: Customer[];
    onSave: (customer: Customer) => void;
}

const CustomerCreatePage: React.FC<CustomerCreatePageProps> = ({ customers, onSave }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    
    const initialCustomerState: Partial<Customer> = {
        customerType: 'Business',
        salutation: 'Mr.',
        firstName: '',
        lastName: '',
        companyName: '',
        displayName: '',
        email: '',
        workPhone: '',
        mobilePhone: '',
        currency: 'PKR',
        openingBalance: 0,
        paymentTerms: 'Due on Receipt',
        taxId: '',
        notes: '',
        status: 'Active',
        billingAddress: { street: '', city: '', state: '', zipCode: '', country: 'Pakistan' },
        shippingAddress: { street: '', city: '', state: '', zipCode: '', country: 'Pakistan' },
    };
    
    const [customer, setCustomer] = useState<Partial<Customer>>(initialCustomerState);
    const [activeTab, setActiveTab] = useState('other-details');

    useEffect(() => {
        if (isEditMode) {
            const existingCustomer = customers.find(c => c.id === id);
            if (existingCustomer) {
                setCustomer(existingCustomer);
            }
        } else {
            setCustomer(initialCustomerState);
        }
    }, [id, isEditMode, customers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        let newValue: string | number | boolean = value;
        if (type === 'checkbox') {
             newValue = (e.target as HTMLInputElement).checked;
        }

        setCustomer(prev => {
            const updatedCustomer = { ...prev, [name]: newValue };
            
            if (name === 'customerType' || name === 'companyName' || name === 'firstName' || name === 'lastName') {
                if (updatedCustomer.customerType === 'Business' && updatedCustomer.companyName) {
                    updatedCustomer.displayName = updatedCustomer.companyName;
                } else if (updatedCustomer.customerType === 'Individual' && (updatedCustomer.firstName || updatedCustomer.lastName)) {
                    updatedCustomer.displayName = `${updatedCustomer.salutation || ''} ${updatedCustomer.firstName || ''} ${updatedCustomer.lastName || ''}`.trim().replace(/\s+/g, ' ');
                }
            }
            return updatedCustomer;
        });
    };
    
    const handleAddressChange = (type: 'billingAddress' | 'shippingAddress', e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({
            ...prev,
            [type]: {
                ...(prev[type] as Address),
                [name]: value
            }
        }));
    };

    const handleCopyAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setCustomer(prev => ({
                ...prev,
                shippingAddress: { ...(prev.billingAddress as Address) }
            }));
        }
    };

    const handleSave = () => {
        if (!customer.displayName) {
            showToast.error('Display Name is required.');
            return;
        }
        onSave({
            ...customer,
            id: isEditMode && id ? id : new Date().getTime().toString(),
        } as Customer);
        navigate('/sales/customers');
    };
    
    const inputClasses = "w-full px-3 py-2 text-sm bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    {isEditMode ? `Edit ${customer.displayName}` : 'New Customer'}
                </h2>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={X} onClick={() => navigate('/sales/customers')}>Cancel</Button>
                    <Button variant="primary" icon={Save} onClick={handleSave}>Save</Button>
                </div>
            </div>
            <Card className="p-8">
                 <div className="space-y-6">
                    <div>
                        <label className={labelClasses}>Customer Type</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center"><input type="radio" name="customerType" value="Business" checked={customer.customerType === 'Business'} onChange={handleChange} className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" /> Business</label>
                            <label className="flex items-center"><input type="radio" name="customerType" value="Individual" checked={customer.customerType === 'Individual'} onChange={handleChange} className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" /> Individual</label>
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Primary Contact</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <select name="salutation" value={customer.salutation} onChange={handleChange} className={inputClasses}>
                                <option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Miss</option><option>Dr.</option>
                            </select>
                            <input name="firstName" value={customer.firstName || ''} onChange={handleChange} placeholder="First Name" className={inputClasses} />
                            <input name="lastName" value={customer.lastName || ''} onChange={handleChange} placeholder="Last Name" className={inputClasses} />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="companyName" className={labelClasses}>Company Name</label>
                        <input id="companyName" name="companyName" value={customer.companyName || ''} onChange={handleChange} className={inputClasses} />
                    </div>
                     <div>
                        <label htmlFor="displayName" className={`${labelClasses} font-bold`}>Display Name*</label>
                        <input id="displayName" name="displayName" value={customer.displayName || ''} onChange={handleChange} required className={inputClasses} />
                        <p className="text-xs text-gray-500 mt-1">This name will be shown on transactions.</p>
                    </div>
                     <div>
                        <label htmlFor="email" className={labelClasses}>Email Address</label>
                        <input id="email" name="email" type="email" value={customer.email || ''} onChange={handleChange} className={inputClasses} />
                    </div>
                     <div>
                        <label className={labelClasses}>Phone</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <input name="workPhone" value={customer.workPhone || ''} onChange={handleChange} placeholder="Work Phone" className={inputClasses} />
                             <input name="mobilePhone" value={customer.mobilePhone || ''} onChange={handleChange} placeholder="Mobile" className={inputClasses} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-b dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('other-details')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'other-details' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Other Details</button>
                        <button onClick={() => setActiveTab('address')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'address' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Address</button>
                        <button onClick={() => setActiveTab('notes')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notes' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Notes</button>
                    </nav>
                </div>
                
                <div className="mt-6">
                    {activeTab === 'other-details' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 animate-fade-in">
                             <div>
                                <label htmlFor="currency" className={labelClasses}>Currency</label>
                                <select id="currency" name="currency" value={customer.currency} onChange={handleChange} className={inputClasses}>
                                    <option>PKR - Pakistani Rupee</option><option>USD - United States Dollar</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="paymentTerms" className={labelClasses}>Payment Terms</label>
                                <select id="paymentTerms" name="paymentTerms" value={customer.paymentTerms} onChange={handleChange} className={inputClasses}>
                                    <option>Due on Receipt</option><option>Net 15</option><option>Net 30</option><option>Net 60</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="taxId" className={labelClasses}>Tax Number / NTN</label>
                                <input id="taxId" name="taxId" type="text" value={customer.taxId || ''} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor="openingBalance" className={labelClasses}>Opening Balance</label>
                                <input id="openingBalance" name="openingBalance" type="number" value={customer.openingBalance} onChange={handleChange} className={inputClasses} />
                            </div>
                             <div>
                                <label htmlFor="status" className={labelClasses}>Status</label>
                                <select id="status" name="status" value={customer.status} onChange={handleChange} className={inputClasses}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    )}
                    {activeTab === 'address' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Billing Address</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClasses}>Street</label>
                                        <textarea name="street" value={customer.billingAddress?.street || ''} onChange={(e) => handleAddressChange('billingAddress', e)} rows={2} className={inputClasses}></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className={labelClasses}>City</label><input name="city" value={customer.billingAddress?.city || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div>
                                        <div><label className={labelClasses}>State</label><input name="state" value={customer.billingAddress?.state || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className={labelClasses}>Zip Code</label><input name="zipCode" value={customer.billingAddress?.zipCode || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div>
                                        <div><label className={labelClasses}>Country</label><input name="country" value={customer.billingAddress?.country || ''} onChange={(e) => handleAddressChange('billingAddress', e)} className={inputClasses} /></div>
                                    </div>
                                </div>
                            </div>
                             <div>
                                 <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Shipping Address</h3>
                                    <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <input type="checkbox" onChange={handleCopyAddress} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"/>
                                        Same as Billing
                                    </label>
                                </div>
                                <div className="space-y-4">
                                     <div>
                                        <label className={labelClasses}>Street</label>
                                        <textarea name="street" value={customer.shippingAddress?.street || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} rows={2} className={inputClasses}></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className={labelClasses}>City</label><input name="city" value={customer.shippingAddress?.city || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div>
                                        <div><label className={labelClasses}>State</label><input name="state" value={customer.shippingAddress?.state || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className={labelClasses}>Zip Code</label><input name="zipCode" value={customer.shippingAddress?.zipCode || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div>
                                        <div><label className={labelClasses}>Country</label><input name="country" value={customer.shippingAddress?.country || ''} onChange={(e) => handleAddressChange('shippingAddress', e)} className={inputClasses} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'notes' && (
                        <div className="animate-fade-in">
                            <label htmlFor="notes" className={labelClasses}>Notes</label>
                            <textarea id="notes" name="notes" value={customer.notes || ''} onChange={handleChange} rows={6} className={inputClasses} placeholder="Add any internal notes for this customer."></textarea>
                        </div>
                    )}
                </div>

                 <div className="mt-8 pt-5 border-t dark:border-gray-700 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={() => navigate('/sales/customers')}>Cancel</Button>
                    <Button variant="primary" icon={Save} onClick={handleSave}>Save Customer</Button>
                </div>
            </Card>
        </>
    );
};

export default CustomerCreatePage;
