import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';
import { Customer, Invoice, CustomerPayment } from '../../types';
import { Plus, Search, ChevronLeft, ChevronRight, Edit, Trash2, Users } from 'lucide-react';
import Modal from '../ui/Modal';

interface CustomerListPageProps {
    customers: Customer[];
    invoices: Invoice[];
    customerPayments: CustomerPayment[];
    onDelete: (customerId: string) => void;
}

const CustomerListPage: React.FC<CustomerListPageProps> = ({ customers, invoices, customerPayments, onDelete }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const customerReceivables = useMemo(() => {
        const receivablesMap = new Map<string, number>();
        customers.forEach(c => {
            receivablesMap.set(c.id, c.openingBalance);
        });
        invoices.forEach(invoice => {
            const current = receivablesMap.get(invoice.customerId) || 0;
            receivablesMap.set(invoice.customerId, current + invoice.total);
        });
        customerPayments.forEach(payment => {
            const current = receivablesMap.get(payment.customerId) || 0;
            receivablesMap.set(payment.customerId, current - payment.amount);
        });
        return receivablesMap;
    }, [customers, invoices, customerPayments]);

    const filteredCustomers = useMemo(() =>
        customers.filter(customer =>
            customer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.workPhone.toLowerCase().includes(searchTerm.toLowerCase())
        ), [customers, searchTerm]);

    const paginatedCustomers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredCustomers.slice(start, end);
    }, [filteredCustomers, currentPage, itemsPerPage]);

    const handleSelectCustomer = (customerId: string) => {
        const newSelection = new Set(selectedCustomers);
        if (newSelection.has(customerId)) {
            newSelection.delete(customerId);
        } else {
            newSelection.add(customerId);
        }
        setSelectedCustomers(newSelection);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allCustomerIds = new Set(paginatedCustomers.map(c => c.id));
            setSelectedCustomers(allCustomerIds);
        } else {
            setSelectedCustomers(new Set());
        }
    };

    const confirmDelete = () => {
        if (customerToDelete) {
            onDelete(customerToDelete.id);
            setCustomerToDelete(null);
        }
    };
    
    const isAllSelected = selectedCustomers.size > 0 && paginatedCustomers.every(c => selectedCustomers.has(c.id));

    return (
        <>
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">All Customers</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Customers"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <Button variant="primary" icon={Plus} onClick={() => navigate('/sales/customers/new')}>New</Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="col-span-4 flex items-center">
                        <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-4" />
                        NAME
                    </div>
                    <div className="col-span-2">COMPANY NAME</div>
                    <div className="col-span-2">EMAIL</div>
                    <div className="col-span-2">WORK PHONE</div>
                    <div className="col-span-2 text-right">RECEIVABLES (PKR)</div>
                </div>

                <div>
                    {paginatedCustomers.length === 0 ? (
                        <div className="px-6 py-12">
                            <EmptyState
                                icon={Users}
                                title="No customers found"
                                description={searchTerm ? `No customers match "${searchTerm}". Try adjusting your search.` : "You haven't added any customers yet. Add your first customer to get started."}
                                actionLabel={!searchTerm ? "Add Customer" : undefined}
                                onAction={!searchTerm ? () => navigate('/sales/customers/new') : undefined}
                            />
                        </div>
                    ) : paginatedCustomers.map(customer => {
                        const receivable = customerReceivables.get(customer.id) || 0;
                        return (
                            <div key={customer.id} className="grid grid-cols-12 px-4 py-3 items-center border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 group text-sm">
                                <div className="col-span-4 flex items-center">
                                    <input type="checkbox" checked={selectedCustomers.has(customer.id)} onChange={() => handleSelectCustomer(customer.id)} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-4" />
                                    <span className="text-primary-600 dark:text-primary-400 font-medium cursor-pointer" onClick={() => navigate(`/sales/customers/${customer.id}`)}>{customer.displayName}</span>
                                </div>
                                <div className="col-span-2 text-gray-600 dark:text-gray-400">{customer.companyName || '-'}</div>
                                <div className="col-span-2 text-gray-600 dark:text-gray-400 truncate">{customer.email}</div>
                                <div className="col-span-2 text-gray-600 dark:text-gray-400">{customer.workPhone}</div>
                                <div className="col-span-2 text-right flex items-center justify-end">
                                    <span className="font-mono text-gray-700 dark:text-gray-300">{receivable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 flex space-x-1">
                                         <Button size="sm" variant="secondary" icon={Edit} title="Edit" onClick={() => navigate(`/sales/customers/${customer.id}`)} />
                                         <Button size="sm" variant="danger" icon={Trash2} title="Delete" onClick={() => setCustomerToDelete(customer)} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                <div>Total Count: {filteredCustomers.length}</div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span>Rows per page:</span>
                        <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-1">
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <span>{`${Math.min((currentPage - 1) * itemsPerPage + 1, filteredCustomers.length)} - ${Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of ${filteredCustomers.length}`}</span>
                    <div className="flex space-x-1">
                        <Button size="sm" variant="secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
                        <Button size="sm" variant="secondary" onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredCustomers.length / itemsPerPage) || 1, p + 1))} disabled={currentPage * itemsPerPage >= filteredCustomers.length}><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </div>
            </div>

            {filteredCustomers.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredCustomers.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredCustomers.length}
                    onItemsPerPageChange={(newSize) => {
                        setItemsPerPage(newSize);
                        setCurrentPage(1);
                    }}
                />
            )}
            
            {customerToDelete && (
                <Modal 
                    isOpen={!!customerToDelete}
                    onClose={() => setCustomerToDelete(null)}
                    title="Confirm Deletion"
                    size="md"
                >
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete customer <strong>{customerToDelete.displayName}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end pt-8 space-x-4">
                        <Button type="button" variant="secondary" size="lg" onClick={() => setCustomerToDelete(null)}>Cancel</Button>
                        <Button type="button" variant="danger" size="lg" onClick={confirmDelete}>Delete Customer</Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default CustomerListPage;
