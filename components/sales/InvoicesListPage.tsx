import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import { Invoice } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';
import { PlusCircle, FileDown, Search, Edit, Trash2, ChevronDown, Printer, FileText, Eye, Send, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface InvoicesListPageProps {
  invoices: Invoice[];
  onDeleteInvoice: (invoiceId: string) => void;
}

const StatusBadge: React.FC<{ status: Invoice['status'], dueDate: string }> = ({ status, dueDate }) => {
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

const SummaryCard: React.FC<{ title: string, amount: number, count?: number, icon: React.ElementType, color: string }> = ({ title, amount, count, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border-l-4" style={{ borderLeftColor: color }}>
        <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 sm:mt-2 truncate">
                    {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount)}
                </p>
                {count !== undefined && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{count} invoice{count !== 1 ? 's' : ''}</p>
                )}
            </div>
            <div className="p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2" style={{ backgroundColor: `${color}20` }}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
            </div>
        </div>
    </div>
);

const InvoicesListPage: React.FC<InvoicesListPageProps> = ({ invoices, onDeleteInvoice }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

     const summaryData = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);

        const allInvoices = invoices.filter(i => i.status !== 'Draft');
        const drafts = invoices.filter(i => i.status === 'Draft');
        
        const dueToday = allInvoices.filter(i => {
            const dueDate = new Date(i.dueDate);
            dueDate.setHours(0,0,0,0);
            return dueDate.getTime() === today.getTime() && (i.status === 'Unpaid' || i.status === 'Partially Paid');
        });

        const overdue = allInvoices.filter(i => new Date(i.dueDate) < today && (i.status === 'Unpaid' || i.status === 'Partially Paid'));

        return {
            total: allInvoices.reduce((sum, i) => sum + i.total, 0),
            totalCount: allInvoices.length,
            drafts: drafts.reduce((sum, i) => sum + i.total, 0),
            draftsCount: drafts.length,
            dueToday: dueToday.reduce((sum, i) => sum + i.total, 0),
            dueTodayCount: dueToday.length,
            overdue: overdue.reduce((sum, i) => sum + i.total, 0),
            overdueCount: overdue.length,
        };
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        // Fixed: Add null safety to prevent toLowerCase errors
        const safeSearchTerm = (searchTerm || '').toString().toLowerCase().trim();
        
        return invoices.filter(invoice => {
            const invoiceNumber = (invoice.invoiceNumber || '').toString().toLowerCase();
            const customerName = (invoice.customerName || '').toString().toLowerCase();
            
            return invoiceNumber.includes(safeSearchTerm) || customerName.includes(safeSearchTerm);
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [invoices, searchTerm]);

    const paginatedInvoices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredInvoices, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

    const confirmDelete = () => {
        if (invoiceToDelete) {
            onDeleteInvoice(invoiceToDelete.id);
            setInvoiceToDelete(null);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Invoices</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your sales invoices and track payments</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="secondary" icon={FileDown}>Export</Button>
                    <Button variant="primary" icon={PlusCircle} onClick={() => navigate('/sales/invoices/new')}>New Invoice</Button>
                </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard title="All Invoices" amount={summaryData.total} count={summaryData.totalCount} icon={FileText} color="#3b82f6" />
                <SummaryCard title="Drafts" amount={summaryData.drafts} count={summaryData.draftsCount} icon={Edit} color="#6b7280" />
                <SummaryCard title="Due Today" amount={summaryData.dueToday} count={summaryData.dueTodayCount} icon={Calendar} color="#f59e0b" />
                <SummaryCard title="Overdue" amount={summaryData.overdue} count={summaryData.overdueCount} icon={AlertCircle} color="#ef4444" />
            </div>

            <Card className="p-0">
                <div className="p-4">
                     <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 flex items-center pl-3">
                          <Search className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-600 bg-white border border-gray-300 rounded-md dark:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          type="text"
                          placeholder="Search by Invoice#, Customer, or Order#"
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Due</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                           {paginatedInvoices.length === 0 && filteredInvoices.length === 0 ? (
                               <tr>
                                   <td colSpan={8} className="px-6 py-12">
                                       <EmptyState
                                           icon={FileText}
                                           title="No invoices found"
                                           description={searchTerm ? `No invoices match "${searchTerm}". Try adjusting your search.` : "You haven't created any invoices yet. Create your first invoice to get started."}
                                           actionLabel={!searchTerm ? "Create Invoice" : undefined}
                                           onAction={!searchTerm ? () => navigate('/sales/invoices/new') : undefined}
                                       />
                                   </td>
                               </tr>
                           ) : paginatedInvoices.length === 0 ? (
                               <tr>
                                   <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                       No results on this page
                                   </td>
                               </tr>
                           ) : paginatedInvoices.map(invoice => (
                               <tr key={invoice.id}>
                                   <td className="px-6 py-4 whitespace-nowrap">{invoice.date}</td>
                                   <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600 dark:text-blue-400">{invoice.invoiceNumber}</td>
                                   <td className="px-6 py-4 whitespace-nowrap">{invoice.customerName}</td>
                                   <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={invoice.status} dueDate={invoice.dueDate} /></td>
                                   <td className="px-6 py-4 whitespace-nowrap">{invoice.dueDate}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right font-mono">PKR {invoice.total.toFixed(2)}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right font-mono">PKR {invoice.total.toFixed(2)}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button size="sm" variant="secondary" icon={Eye} onClick={() => navigate(`/sales/invoices/${invoice.id}`)} title="View" />
                                            <Button size="sm" variant="secondary" icon={Edit} onClick={() => navigate(`/sales/invoices/${invoice.id}`)} title="Edit" />
                                            <Button size="sm" variant="danger" icon={Trash2} onClick={() => setInvoiceToDelete(invoice)} title="Delete" />
                                        </div>
                                   </td>
                               </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
                {filteredInvoices.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredInvoices.length}
                        onItemsPerPageChange={(newSize) => {
                            setItemsPerPage(newSize);
                            setCurrentPage(1);
                        }}
                    />
                )}
            </Card>

            {invoiceToDelete && (
                <Modal 
                    isOpen={!!invoiceToDelete}
                    onClose={() => setInvoiceToDelete(null)}
                    title="Confirm Deletion"
                    size="md"
                >
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete invoice <strong>{invoiceToDelete.invoiceNumber}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end pt-8 space-x-4">
                        <Button type="button" variant="secondary" size="lg" onClick={() => setInvoiceToDelete(null)}>Cancel</Button>
                        <Button type="button" variant="danger" size="lg" onClick={confirmDelete}>Delete Invoice</Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default InvoicesListPage;