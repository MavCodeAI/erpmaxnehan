import React from 'react';
import { Search, MoreVertical, Eye, Printer, Trash2, FileDown } from 'lucide-react';
import { showToast } from '../../utils/toast';
import Dropdown from './Dropdown';
import Button from './Button';

interface TransactionListProps<T> {
  items: T[];
  selectedItemId: string | null;
  onSelectItem: (item: T) => void;
  onDeleteItem: (itemId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder: string;
  renderItem: (item: T) => {
    id: string;
    primary: string;
    secondary: string;
    amount: number;
    status?: React.ReactNode;
  };
}

const TransactionList = <T extends { id: string }>({
  items,
  selectedItemId,
  onSelectItem,
  onDeleteItem,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  renderItem,
}: TransactionListProps<T>) => {
  return (
    <div className="flex flex-col h-full">
        <div className="p-4 border-b dark:border-gray-700">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
             {/* Add date filters here if needed */}
        </div>
        <ul className="divide-y dark:divide-gray-700 overflow-y-auto">
            {items.map((item) => {
                const rendered = renderItem(item);
                const isSelected = selectedItemId === rendered.id;
                return (
                    <li
                        key={rendered.id}
                        onClick={() => onSelectItem(item)}
                        className={`p-4 cursor-pointer group flex justify-between items-start ${isSelected ? 'bg-primary-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                    >
                        <div className="flex-grow min-w-0">
                            <div className="flex justify-between">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{rendered.primary}</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rendered.amount)}</p>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>{rendered.secondary}</span>
                                {rendered.status && <span>{rendered.status}</span>}
                            </div>
                        </div>
                         <div className="ml-2 flex-shrink-0">
                            <Dropdown
                                button={<Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4" /></Button>}
                                items={[
                                    { label: 'View / Edit', icon: Eye, onClick: () => onSelectItem(item) },
                                    { label: 'Print', icon: Printer, onClick: () => showToast.info(`Printing ${rendered.primary}...`) },
                                    { label: 'Download PDF', icon: FileDown, onClick: () => showToast.info(`Downloading PDF for ${rendered.primary}...`) },
                                    { label: 'Delete', icon: Trash2, onClick: () => onDeleteItem(item.id) },
                                ]}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    </div>
  );
};

export default TransactionList;
