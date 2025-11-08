import React from 'react';
import Button from '../../ui/Button';

const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700";

const ProfilePage: React.FC = () => {
  return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-4 border-b dark:border-gray-700">Organization Profile</h2>
        <form className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="org-name" className={labelClasses}>Organization Name*</label>
                    <input type="text" id="org-name" defaultValue="ERPMAX" className={inputClasses} />
                </div>
                 <div>
                    <label htmlFor="industry" className={labelClasses}>Industry*</label>
                    <select id="industry" className={inputClasses}>
                        <option>Art and Design</option>
                        <option>Retail</option>
                        <option>Manufacturing</option>
                        <option>Technology</option>
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="org-location" className={labelClasses}>Organization Location*</label>
                    <input type="text" id="org-location" defaultValue="Pakistan" className={inputClasses} />
                </div>
                <div>
                    <label className={labelClasses}>Organization Address</label>
                    <div className="space-y-2">
                        <input type="text" placeholder="Street 1" className={inputClasses} />
                        <input type="text" placeholder="Street 2" className={inputClasses} />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Punjab" className={inputClasses} />
                            <input type="text" placeholder="Phone" className={inputClasses} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="base-currency" className={labelClasses}>Base Currency</label>
                    <select id="base-currency" className={inputClasses} disabled>
                        <option>PKR - Pakistani Rupee</option>
                    </select>
                     <p className="mt-1 text-xs text-gray-500">You can't change the base currency as there are transactions recorded in your organization.</p>
                </div>
                <div>
                    <label htmlFor="fiscal-year" className={labelClasses}>Fiscal Year</label>
                    <div className="flex items-center space-x-2">
                         <select className={inputClasses}><option>January - December</option></select>
                         <input type="date" defaultValue="2024-01-01" className={inputClasses} />
                    </div>
                </div>
            </div>
             <div className="flex justify-end pt-5 border-t dark:border-gray-700">
                <Button type="button" variant="secondary">Cancel</Button>
                <Button type="submit" variant="primary" className="ml-3">Save</Button>
            </div>
        </form>
    </div>
  );
};

export default ProfilePage;
