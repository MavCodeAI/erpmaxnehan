import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';

interface TransactionPageLayoutProps {
  title: string;
  list: React.ReactNode;
  form: React.ReactNode;
  isFormOpen: boolean;
  onAddNew: () => void;
}

const TransactionPageLayout: React.FC<TransactionPageLayoutProps> = ({ title, list, form, isFormOpen, onAddNew }) => {
  return (
    <div className="flex h-[calc(100vh-120px)] -mt-8 -mx-6">
      {/* Left Panel: List View */}
      <div className="w-1/3 border-r dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button icon={Plus} onClick={onAddNew} size="sm">New</Button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {list}
        </div>
      </div>

      {/* Right Panel: Form View */}
      <div className={`w-2/3 flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300 ${isFormOpen ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <div className="p-8">
            {isFormOpen ? form : (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <p className="text-lg">Select an item from the list to view or edit.</p>
                        <p>Or, click 'New' to create a new entry.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TransactionPageLayout;
