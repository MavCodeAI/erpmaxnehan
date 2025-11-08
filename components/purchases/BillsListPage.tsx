import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import { PurchaseBill } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';
import { PlusCircle, FileDown, Search, Edit, Trash2, ChevronDown, Printer, Receipt } from 'lucide-react';
import Dropdown from '../ui/Dropdown';

interface BillsListPageProps {
  bills: PurchaseBill[];
  onDeleteBill: (billId: string) => void;
}

const StatusBadge: React.FC<{ status: PurchaseBill['status'], dueDate: string }> = ({ status, dueDate }) => {
    const colorClasses = {
        Paid: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
        Unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
        Overdue: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100',
        'Partially Paid': 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100',
        Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    };
    
    let text: string = status;
    let displayStatus = status;
    if (status === 'Unpaid' && new Date(dueDate) < new Date()) {
        displayStatus = 'Overdue';
    }
    if (displayStatus === 'Overdue') {
        const today = new Date();
        const due = new Date(dueDate);
        today.setHours(0,0,0,0);
        due.setHours(0,0,0,0);
        const diffTime = today.getTime() - due.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
            text = `OVERDUE BY ${diffDays} DAYS`;
        }
    }

    return <span className={`px-2 py-1 font-semibold leading-tight text-xs rounded-full whitespace-nowrap ${colorClasses[displayStatus]}`}>{text}</span>;
}

const SummaryCard: React.FC<{ title: string, amount: number, currency?: string }> = ({ title, amount, currency = "PKR" }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{new Intl.NumberFormat('en-PK', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount)}</p>
    </div>
);


const BillsListPage: React.FC<BillsListPageProps> = ({ bills, onDeleteBill }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [billToDelete, setBillToDelete] = useState<PurchaseBill | null>(null);

    const summaryData = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const allBills = bills.filter(b => b.status !== 'Draft');
        const drafts = bills.filter(b => b.status === 'Draft');

        const dueToday = allBills.filter(b => {
            const dueDate = new Date(b.dueDate);
            dueDate.setHours(0,0,0,0);
            return dueDate.getTime() === today.getTime() && (b.status === 'Unpaid' || b.status === 'Partially Paid');
        });

        const overdue = allBills.filter(b => new Date(b.dueDate) < today && (b.status === 'Unpaid' || b.status === 'Partially Paid'));

        return {
            total: allBills.reduce((sum, b) => sum + b.total, 0),
            drafts: drafts.reduce((sum, b) => sum + b.total, 0),
            dueToday: dueToday.reduce((sum, b) => sum + b.total, 0),
            overdue: overdue.reduce((sum, b) => sum + b.total, 0),
        };
    }, [bills]);

    const filteredBills = useMemo(() => {
        return bills.filter(bill =>
            bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [bills, searchTerm]);

    const paginatedBills = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBills.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBills, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

    const confirmDelete = () => {
        if (billToDelete) {
            onDeleteBill(billToDelete.id);
            setBillToDelete(null);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">All Bills</h2>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={FileDown}>Export</Button>
                    <Button variant="primary" icon={PlusCircle} onClick={() => navigate('/purchases/bills/new')}>New Bill</Button>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard title="All Bills" amount={summaryData.total} />
                <SummaryCard title="Drafts" amount={summaryData.drafts} />
                <SummaryCard title="Due Today" amount={summaryData.dueToday} />
                <SummaryCard title="Overdue" amount={summaryData.overdue} />
            </div>

            <Card className="p-0">
                 <div className="p-4">
                     <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 flex items-center pl-3">
                          <Search className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-600 bg-white border border-gray-300 rounded-md dark:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          type="text"
                          placeholder="Search by Bill#, Vendor, or Order#"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Due</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                           {paginatedBills.length === 0 && filteredBills.length === 0 ? (
                               <tr>
                                   <td colSpan={8} className="px-6 py-12">
                                       <EmptyState
                                           icon={Receipt}
                                           title="No bills found"
                                           description={searchTerm ? `No bills match "${searchTerm}". Try adjusting your search.` : "You haven't created any bills yet. Create your first bill to get started."}
                                           actionLabel={!searchTerm ? "Create Bill" : undefined}
                                           onAction={!searchTerm ? () => navigate('/purchases/bills/new') : undefined}
                                       />
                                   </td>
                               </tr>
                           ) : paginatedBills.length === 0 ? (
                               <tr>
                                   <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                       No results on this page
                                   </td>
                               </tr>
                           ) : paginatedBills.map(bill => (
                               <tr key={bill.id}>
                                   <td className="px-6 py-4 whitespace-nowrap">{bill.date}</td>
                                   <td className="px-6 py-4 whitespace-nowrap font-medium text-primary-600 dark:text-primary-400">{bill.billNumber}</td>
                                   <td className="px-6 py-4 whitespace-nowrap">{bill.vendorName}</td>
                                   <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={bill.status} dueDate={bill.dueDate}/></td>
                                   <td className="px-6 py-4 whitespace-nowrap">{bill.dueDate}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right font-mono">PKR {bill.total.toFixed(2)}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right font-mono">PKR {bill.total.toFixed(2)}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Dropdown
                                            button={<Button size="sm" variant="secondary">Actions <ChevronDown className="w-4 h-4 ml-1"/></Button>}
                                            items={[
                                                { label: 'Edit', icon: Edit, onClick: () => navigate(`/purchases/bills/${bill.id}`) },
                                                { label: 'Print', icon: Printer, onClick: () => showToast.info(`Printing ${bill.billNumber}...`) },
                                                { label: 'Download PDF', icon: FileDown, onClick: () => showToast.info(`Downloading PDF for ${bill.billNumber}...`) },
                                                { label: 'Delete', icon: Trash2, onClick: () => setBillToDelete(bill) },
                                            ]}
                                        />
                                   </td>
                               </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
                {filteredBills.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredBills.length}
                        onItemsPerPageChange={(newSize) => {
                            setItemsPerPage(newSize);
                            setCurrentPage(1);
                        }}
                    />
                )}
            </Card>

            {billToDelete && (
                <Modal 
                    isOpen={!!billToDelete}
                    onClose={() => setBillToDelete(null)}
                    title="Confirm Deletion"
                    size="md"
                >
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete bill <strong>{billToDelete.billNumber}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end pt-8 space-x-4">
                        <Button type="button" variant="secondary" size="lg" onClick={() => setBillToDelete(null)}>Cancel</Button>
                        <Button type="button" variant="danger" size="lg" onClick={confirmDelete}>Delete Bill</Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default BillsListPage;