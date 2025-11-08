import React from 'react';
import Button from '../../ui/Button';
import { Plus } from 'lucide-react';

const roles = [
    { name: 'Admin', description: 'Unrestricted access to all modules.' },
    { name: 'Staff', description: 'Access to all modules except reports, settings and accountant.' },
    { name: 'Staff (Assigned Customers Only)', description: 'Access to all modules, transactions and data of assigned customers and all vendors except banking, reports, settings and accountant.' },
    { name: 'TimesheetStaff', description: 'TimesheetStaff Role' },
];

const RolesPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Roles</h2>
                <Button variant="primary" icon={Plus}>New Role</Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-3 px-6 py-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="col-span-1">ROLE NAME</div>
                    <div className="col-span-2">DESCRIPTION</div>
                </div>

                <div>
                    {roles.map(role => (
                        <div key={role.name} className="grid grid-cols-3 px-6 py-4 items-center border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 text-sm">
                            <div className="col-span-1">
                                <span className="text-primary-600 dark:text-primary-400 font-medium cursor-pointer">{role.name}</span>
                            </div>
                            <div className="col-span-2 text-gray-600 dark:text-gray-400">{role.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RolesPage;
