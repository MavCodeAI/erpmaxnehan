import React from 'react';
import Button from '../../ui/Button';
import { Edit } from 'lucide-react';

const series = [
    { module: 'Credit Note', prefix: 'CN-', start: '00002', preview: 'CN-00002' },
    { module: 'Journal', prefix: '', start: '21', preview: '21' },
    { module: 'Customer Payment', prefix: '', start: '48', preview: '48' },
    { module: 'Vendor Payment', prefix: '', start: '25', preview: '25' },
    { module: 'Purchase Order', prefix: 'PO-', start: '00002', preview: 'PO-00002' },
    { module: 'Sales Order', prefix: 'SO-', start: '00001', preview: 'SO-00001' },
    { module: 'Invoice', prefix: 'INV-', start: '000063', preview: 'INV-000063' },
    { module: 'Quote', prefix: 'QT-', start: '000001', preview: 'QT-000001' },
    { module: 'Sales Receipt', prefix: 'SR-', start: '00002', preview: 'SR-00002' },
    { module: 'Sales Return', prefix: 'RMA-', start: '00001', preview: 'RMA-00001' },
];

const TransactionNumbersPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Default Series</h2>
                <Button variant="primary" icon={Edit}>Edit</Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prefix</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {series.map(s => (
                            <tr key={s.module}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{s.module}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{s.prefix}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{s.start}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{s.preview}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionNumbersPage;
