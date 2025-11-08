import React from 'react';
import Card from '../ui/Card';
// Fix: Import the Column type from Table.tsx to allow for explicit typing.
import Table, { Column } from '../ui/Table';
import { Transaction } from '../../types';
import { MOCK_TRANSACTIONS } from '../../constants';
import Button from '../ui/Button';

const StatusBadge: React.FC<{ status: 'Completed' | 'Pending' | 'Cancelled' }> = ({ status }) => {
    const colorClasses = {
        Completed: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
        Cancelled: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
    };
    return <span className={`px-2 py-1 font-semibold leading-tight text-sm rounded-full ${colorClasses[status]}`}>{status}</span>;
}

const RecentTransactions: React.FC = () => {
    
  // Fix: Add explicit type Column<Transaction>[] to the columns array.
  const columns: Column<Transaction>[] = [
    { header: 'Description', accessor: (item: Transaction) => (
      <div>
        <p className="font-semibold">{item.description}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{item.type}</p>
      </div>
    )},
    { header: 'Amount', accessor: (item: Transaction) => (
        <span className={`font-semibold ${item.type === 'Expense' || item.type === 'Purchase' ? 'text-red-500' : 'text-green-500'}`}>
            {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.amount)}
        </span>
    )},
    { header: 'Status', accessor: (item: Transaction) => <StatusBadge status={item.status} />},
    { header: 'Date', accessor: 'date' },
  ];

  return (
    <Card className="col-span-1 lg:col-span-3">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Recent Transactions</h3>
            <Button size="sm">View All</Button>
        </div>
      <Table<Transaction> columns={columns} data={MOCK_TRANSACTIONS} />
    </Card>
  );
};

export default RecentTransactions;