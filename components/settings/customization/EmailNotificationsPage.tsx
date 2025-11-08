import React, { useState } from 'react';
import Button from '../../ui/Button';

const templates = {
    sales: ['Customer Statement', 'Quote Notification', 'Invoice Notification'],
    purchases: ['Vendor Statement', 'Self Billed Invoice Notification'],
    'customer-payments': ['Payment Thank-you', 'Payment Initiated', 'Payment Refund'],
};

const EmailNotificationsPage: React.FC = () => {
    const [activeTemplate, setActiveTemplate] = useState('Invoice Notification');
    
    return (
        <div className="flex gap-8">
            <aside className="w-1/4">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Templates</h3>
                 <nav className="space-y-4 text-sm">
                     <div>
                        <h4 className="font-semibold uppercase text-gray-500 text-xs tracking-wider mb-2">Sales</h4>
                        <ul className="space-y-1">
                            {templates.sales.map(t => <li key={t}><button onClick={() => setActiveTemplate(t)} className={`w-full text-left p-2 rounded-md ${activeTemplate === t ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{t}</button></li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold uppercase text-gray-500 text-xs tracking-wider mb-2">Purchases</h4>
                        <ul className="space-y-1">
                             {templates.purchases.map(t => <li key={t}><button onClick={() => setActiveTemplate(t)} className={`w-full text-left p-2 rounded-md ${activeTemplate === t ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{t}</button></li>)}
                        </ul>
                    </div>
                 </nav>
            </aside>
            <main className="flex-1">
                 <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{activeTemplate}</h2>
                        <p className="text-sm text-gray-500">Sent when a customer is invoiced.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject and Content</label>
                        <div className="p-4 border rounded-md dark:border-gray-600">
                            <p className="text-sm"><strong>Subject:</strong> Invoice - %InvoiceNumber% from %CompanyName%</p>
                            <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block">Show Mail Content</a>
                        </div>
                    </div>
                    <Button variant="primary">Edit Signature</Button>
                </div>
            </main>
        </div>
    );
};

export default EmailNotificationsPage;
